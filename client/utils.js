import Matrix from 'node-matrices';

export function norm( vector ) {
  if ( vector.x !== undefined ) {
    return norm( [ vector.x, vector.y ] );
  }
  return Math.sqrt( vector.reduce( ( sum, value ) => sum + value * value, 0 ) );
}

export function add( v1, v2 ) {
  if ( v1.x !== undefined ) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }
  return v1.map( ( value, index ) => value + v2[ index ] );
}

/**
 * Returns a new {x,y} pair rotated around the provided x,y
 * @param v - vector to rotate
 * @param x - rotate about this x
 * @param y - rotate about this y
 * @param angle - angle of rotation
 * @returns {{x: number, y: number}}
 */
export function rotateAboutXY( v, x, y, angle ) {
  const dx = v.x - x;
  const dy = v.y - y;
  const cos = Math.cos( angle );
  const sin = Math.sin( angle );
  const newX = x + dx * cos - dy * sin;
  const newY = y + dx * sin + dy * cos;
  return { x: newX, y: newY };
}

export function diff( v1, v2 ) {
  if ( v1.x !== undefined ) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  }
  return v1.map( ( value, index ) => value - v2[ index ] );
}

export function mult( v1, v2 ) {
  if ( v1.x !== undefined ) {
    return { x: v1.x * v2.x, y: v1.y * v2.y };
  }
  return v1.map( ( value, index ) => value * v2[ index ] );
}

export function div( v1, v2 ) {
  if ( v1.x !== undefined ) {
    return { x: v1.x / v2.x, y: v1.y / v2.y };
  }
  return v1.map( ( value, index ) => value / v2[ index ] );
}

export function blendPoints( v1, v2, amount ) {
  return { x: v1.x + ( v2.x - v1.x ) * amount, y: v1.y + ( v2.y - v1.y ) * amount };
}

export function averagePoints( v1, v2 ) {
  return blendPoints( v1, v2, 0.5 );
}

export function cross( v1, v2 ) {
  if ( v1.x === undefined || v2.x === undefined ) {
    throw new Error( 'Must be points' );
  }
  return v1.x * v2.y - v1.y * v2.x;
}

export function clamp( value, min, max ) {
  return Math.max( min, Math.min( max, value ) );
}

export function isMac() {
  return navigator.platform.toUpperCase().indexOf( 'MAC' ) >= 0;
}

// For "Save" buttons, which include hotkey info that depend on platform.
export function getSaveString() {
  return `Save (${isMac() ? 'cmd' : 'ctrl'}+s)`;
}

export function moveAlongVector( amount, vector ) {
  const size = norm( vector );
  return { x: amount * vector.x / size, y: amount * vector.y / size };
}

export function shrinkPoints( amount, points ) {
  return [ 0, 1, 2, 3 ].map( index => {
    const point = points[ index ];
    const nextPoint = points[ ( index + 1 ) % 4 ];
    const prevPoint = points[ ( index - 1 + 4 ) % 4 ];
    return add(
      add( point, moveAlongVector( amount, diff( nextPoint, point ) ) ),
      moveAlongVector( amount, diff( prevPoint, point ) )
    );
  } );
}

// Per http://graphics.cs.cmu.edu/courses/15-463/2008_fall/Papers/proj.pdf
export function forwardProjectionMatrixForPoints( points ) {
  const deltaX1 = points[ 1 ].x - points[ 2 ].x;
  const deltaX2 = points[ 3 ].x - points[ 2 ].x;
  const sumX = points[ 0 ].x - points[ 1 ].x + points[ 2 ].x - points[ 3 ].x;
  const deltaY1 = points[ 1 ].y - points[ 2 ].y;
  const deltaY2 = points[ 3 ].y - points[ 2 ].y;
  const sumY = points[ 0 ].y - points[ 1 ].y + points[ 2 ].y - points[ 3 ].y;
  const denominator = new Matrix( [ deltaX1, deltaX2 ], [ deltaY1, deltaY2 ] ).determinant();
  const g = new Matrix( [ sumX, deltaX2 ], [ sumY, deltaY2 ] ).determinant() / denominator;
  const h = new Matrix( [ deltaX1, sumX ], [ deltaY1, sumY ] ).determinant() / denominator;
  const a = points[ 1 ].x - points[ 0 ].x + g * points[ 1 ].x;
  const b = points[ 3 ].x - points[ 0 ].x + h * points[ 3 ].x;
  const c = points[ 0 ].x;
  const d = points[ 1 ].y - points[ 0 ].y + g * points[ 1 ].y;
  const e = points[ 3 ].y - points[ 0 ].y + h * points[ 3 ].y;
  const f = points[ 0 ].y;
  return new Matrix( [ a, b, c ], [ d, e, f ], [ g, h, 1 ] );
}

export function projectPoint( point, projectionMatrix ) {
  const pointMatrix = projectionMatrix.multiply( new Matrix( [ point.x ], [ point.y ], [ 1 ] ) );
  return {
    x: pointMatrix.get( 0, 0 ) / pointMatrix.get( 2, 0 ),
    y: pointMatrix.get( 1, 0 ) / pointMatrix.get( 2, 0 )
  };
}

export function getApiUrl( spaceName, suffix = '' ) {
  return new URL( `api/spaces/${spaceName}${suffix}`, window.location.origin ).toString();
}

const commentRegex = /\s*\/\/\s*(.+)/;

export function codeToName( code ) {
  const firstLine = code.split( '\n' )[ 0 ];
  const match = firstLine.match( commentRegex );
  if ( match ) {
    return match[ 1 ].trim();
  }
  else {
    return '???';
  }
}

/**
 * Get a list of the keywords from a paper program.  Keywords are on the 2nd line and should be labeled like this:
 * Get a list of the keywords from a paper program.  Keywords are on the 2nd line and should be labeled like this:
 *   // Keywords: cool, fun, scary
 * If there are no keywords in the file, an empty array is returned.
 * @param {string} program
 * @returns {string[]}
 */
function getKeywordsFromProgram( program ) {
  const programLines = program.split( '\n' );
  const firstLine = programLines[ 0 ];
  const secondLine = programLines[ 1 ];
  const keywords = [];

  const commentRegEx = /\s*\/\/\s*(.+)/;
  const wordRegEx = /\b[a-zA-Z]+\b/g;

  // Test the first line and see if it is a comment and contains words.  If so, extract those words.
  const titleMatchResults = firstLine.match( commentRegEx );
  if ( titleMatchResults && titleMatchResults[ 1 ] ) {
    const titleWords = titleMatchResults[ 1 ].match( wordRegEx );
    titleWords && keywords.push( ...titleWords );
  }

  // Test the second line to see if it is a comment and is formatted correctly to indicate that it contains keywords and
  // add them to our list if so.
  const keywordMatchResults = secondLine.match( commentRegEx );
  if ( keywordMatchResults && keywordMatchResults[ 1 ] && keywordMatchResults[ 1 ].includes( 'Keywords' ) ) {
    let explicitlySpecifiedKeywords = keywordMatchResults[ 1 ].match( wordRegEx );

    // Filter out the word "keywords" in case it was used on this line.
    explicitlySpecifiedKeywords = explicitlySpecifiedKeywords.filter( word => !word.toLowerCase().includes( 'keyword' ) );

    // Add these to our keyword list.
    keywords.push( ...explicitlySpecifiedKeywords );
  }

  return keywords;
}

/**
 *
 * @param {string} programCode - contents of a paper program, which is generally a JS file
 * @param {string} filterString - a string representing a list of words to test against the keywords for this sim
 * @returns {boolean} - true if there is a match OR if there are no words provided on which to filter
 */
export function programMatchesFilterString( programCode, filterString ) {

  // Get the keywords that are contained in the program so that they can be used for filtering.
  const keywords = getKeywordsFromProgram( programCode ).map( keyword => keyword.toLowerCase() );

  // Extract the individual words from the filter string.
  const filterWordsFromUser = filterString.match( /\b[a-zA-Z]+\b/g ) || [];

  // Determine whether the filter words match the keywords.  All of the filter words must be matched for this to be
  // considered an overall match.
  let numberOfMatchedFilterWords = 0;
  filterWordsFromUser.forEach( ( filterWord, index ) => {
    const lowerCaseFilterWord = filterWord.toLowerCase();
    const isLastFilterWord = index === filterWordsFromUser.length - 1;
    if ( !isLastFilterWord && keywords.includes( lowerCaseFilterWord ) ) {
      numberOfMatchedFilterWords++;
    }
    else if ( isLastFilterWord ) {

      // The last filter word entered by the user only has to match partially, since this may allow them to see what
      // they are looking for before the entire word is entered.  This leads to smoother behavior of the UI elements.
      if ( keywords.reduce( ( previouslyMatched, keyword ) => previouslyMatched || keyword.includes( lowerCaseFilterWord ), false ) ) {
        numberOfMatchedFilterWords++;
      }
    }
  } );

  return numberOfMatchedFilterWords === filterWordsFromUser.length;
}

/**
 * Converts color data (in the array form that is used often in this platform) to a color string that can be used
 * in css styling.
 * @param {number[]} colorData - containing r, g, b, a values
 * @returns {string}
 */
export function colorDataToCSS( colorData ) {
  return `rgba(${colorData[ 0 ]},${colorData[ 1 ]},${colorData[ 2 ]},${colorData[ 3 ]})`;
}

/**
 * Get program data from local storage for the provided programNumber.
 * @param {number} programNumber
 * @return {*|null} - object describing the paper, according to Paper API.
 */
export function getProgramDataFromNumber( programNumber ) {
  const allProgramsData = JSON.parse( localStorage.paperProgramsDataByProgramNumber );

  if ( allProgramsData && allProgramsData[ programNumber ] ) {
    return allProgramsData[ programNumber ];
  }
  else {
    return null;
  }
}

/**
 * Returns true when the proposed system name is valid. Checks include uniqueness and usability in the database.
 * @param systemName - proposed name for the system
 * @param otherNames - current list of other names
 * @param alertError - alert to the user that something is wrong?
 * @return {boolean}
 */
export function isValidSystemName( systemName, otherNames, alertError = true ) {
  let isValid = true;
  let errorMessage = '';
  if ( isValid && systemName.length === 0 ) {
    isValid = false;
    errorMessage = 'Name too short.';
  }
  if ( isValid && systemName.match( /[^A-Za-z0-9\-_]+/ ) !== null ) {
    isValid = false;
    errorMessage = 'Invalid characters in name.';
    errorMessage += '\n\nNames can contain upper- and lower-case letters, numbers, dashes, and/or underscores.';
  }
  if ( isValid && otherNames.includes( systemName ) ) {
    isValid = false;
    errorMessage = `Value ${systemName} already exists.`;
  }

  if ( errorMessage.length ) {
    if ( alertError ) {
      alert( errorMessage );
    }
  }

  return isValid;
}

/**
 * Returns a documentation string for the provided NamedProperty type. This is shown to the user when they are
 * writing code that will use a component.
 * @param namedProperty
 * @return {string}
 */
export function getComponentDocumentation( namedProperty ) {
  const type = namedProperty.propertyType;
  const name = namedProperty.nameProperty.value;

  let usabilityDocumentation = '';
  if ( type === 'Vector2Property' ) {
    usabilityDocumentation = `Access x and y values with \`${name}.x\` and \`${name}.y\``;
  }
  else if ( type === 'NumberProperty' ) {
    usabilityDocumentation = 'This is a number.';
  }
  else if ( type === 'BooleanProperty' ) {
    usabilityDocumentation = 'This is a boolean value `true` or `false`';
  }
  else if ( type === 'DerivedProperty' ) {
    usabilityDocumentation = 'This could be any type, depending on how you created your DerivedProperty.';
  }
  else if ( type === 'StringProperty' ) {
    const valuesList = namedProperty.values.join( ', ' );
    usabilityDocumentation = `Your enumeration of values. One of ${valuesList}.`;
  }
  else {
    throw new Error( `Unhandled property type: ${type}` );
  }

  return `${namedProperty.nameProperty.value} - ${usabilityDocumentation}`;
}

/**
 * Reusable function that returns true if the provided component name is valid.
 * @param {ActiveEdit|null} activeEdit - The state for the actively edited component, if any.
 * @param {CreatorModel} creatorModel - Reference to the CreatorModel to look at existing names.
 * @param {string} componentName - proposed name
 * @return {boolean}
 */
export function isNameValid( activeEdit, creatorModel, componentName ) {
  const hasLength = componentName.length > 0;

  // If editing a component, the name is valid if it is unused or if it matches the existing component name.
  // Otherwise, the name is valid if it is unused.
  const unique = ( activeEdit && activeEdit.component ) ? ( creatorModel.isNameAvailable( componentName ) || componentName === activeEdit.component.nameProperty.value ) :
                 creatorModel.isNameAvailable( componentName );

  return hasLength && unique;
}

//------------------------------------------------------
// query parameters
//------------------------------------------------------
export function inDevMode() {

  // window is not always available?
  if ( window && window.location && window.location.href ) {

    // Get the current URL
    const url = new URL( window.location.href );

    // Get the query parameters string
    const queryParamsString = url.search;

    return queryParamsString.includes( 'dev' );
  }

  return false;
}