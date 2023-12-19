import Matrix from 'node-matrices';

// A list of reserved keywords that cannot be used in component names.
const RESERVED_KEYWORDS = [
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
  'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
  'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
  'new', 'null', 'return', 'super', 'switch', 'this', 'throw',
  'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
  'let', 'static', 'await', 'enum', 'implements', 'package', 'protected',
  'interface', 'private', 'public', 'console'
];

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
 * Given a list of programs, sort them by title name.
 * @param programs
 * @return {*}
 */
export function sortProgramsByName( programs ) {
  return programs.sort( ( a, b ) => {
    const aName = codeToName( a.currentCode );
    const bName = codeToName( b.currentCode );
    return aName.localeCompare( bName );
  } );
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

  if ( firstLine && secondLine ) {

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
 * Returns true when the proposed project name is valid. Checks include uniqueness and usability in the database.
 * @param projectName - proposed name for the project
 * @param otherNames - current list of other names
 * @param alertError - alert to the user that something is wrong?
 * @return {boolean}
 */
export function isValidProjectName( projectName, otherNames, alertError = true ) {
  let isValid = true;
  let errorMessage = '';
  if ( isValid && projectName.length === 0 ) {
    isValid = false;
    errorMessage = 'Name too short.';
  }
  if ( isValid && projectName.match( /[^A-Za-z0-9\-_]+/ ) !== null ) {
    isValid = false;
    errorMessage = 'Invalid characters in name.';
    errorMessage += '\n\nNames can contain upper- and lower-case letters, numbers, dashes, and/or underscores.';
  }
  if ( isValid && otherNames.includes( projectName ) ) {
    isValid = false;
    errorMessage = `Value ${projectName} already exists.`;
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
  else if ( type === 'Bounds2Property' ) {
    usabilityDocumentation = `This is a Bounds2 object. Access min and max values with \`${name}.minX\`, \`${name}.minY\`, \`${name}.maxX\`, and \`${name}.maxY\`. Easily determine if a position is inside these bounds with \`${name}.containsPoint( yourPositionComponent )\``;
  }
  else if ( type === 'ObservableArray' ) {
    usabilityDocumentation = 'This is an array of Array Item components.';
  }
  else if ( type === 'NamedArrayItemReference' ) {
    usabilityDocumentation = 'This is a reference to an Array Item component in the array. It will be "null" until the array has an item.';
  }
  else {
    throw new Error( `Unhandled property type: ${type}` );
  }

  return `${namedProperty.nameProperty.value} - ${usabilityDocumentation}`;
}


/**
 * Create documentation for a component.
 * @param {Component} component
 * @return {string}
 */
export function createSetterFunctionString( component ) {
  const componentName = component.nameProperty.value;
  const type = component.propertyType;

  let argumentDocumentation = '';
  if ( type === 'Vector2Property' ) {
    argumentDocumentation = 'Pass in a new point with `new phet.dot.Vector2( x, y )`';
  }
  else if ( type === 'NumberProperty' ) {
    argumentDocumentation = 'Pass in a new number.';
  }
  else if ( type === 'BooleanProperty' ) {
    argumentDocumentation = 'Provide a new boolean value, true or false.';
  }
  else if ( type === 'StringProperty' ) {
    argumentDocumentation = 'Provide a new string.';
  }
  else if ( type === 'Bounds2Property' ) {
    argumentDocumentation = 'Pass in a new Bounds2 object with `new phet.dot.Bounds2( minX, minY, maxX, maxY )`';
  }

  if ( argumentDocumentation ) {
    const capitalizedComponentName = componentName.charAt( 0 ).toUpperCase() + componentName.slice( 1 );
    return `set${capitalizedComponentName}( value ) - ${argumentDocumentation}`;
  }
  else {

    // Gracefully handle the case where there is no documentation.
    return '';
  }
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

  // Check if the name starts with a letter, $, or _
  const isValidStart = /^[a-zA-Z_$]/.test( componentName );

  // Check if the rest of the name contains only valid characters
  const hasValidChars = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test( componentName );

  // Check if the name is a reserved word in JavaScript
  const isReserved = RESERVED_KEYWORDS.includes( componentName );

  // The name must be unique for all components in the model.
  const unique = ( activeEdit && activeEdit.component ) ?
                 ( creatorModel.isNameAvailable( componentName ) || componentName === activeEdit.component.nameProperty.value ) :
                 creatorModel.isNameAvailable( componentName );

  return hasLength && isValidStart && hasValidChars && !isReserved && unique;
}

/**
 * Returns true if the provided object has a value in each of the provided keys.
 */
export function keysDefined( object, keys ) {
  return keys.every( key => object.hasOwnProperty( key ) );
}

/**
 * Throws an error if the provided object does not have all the required keys.
 */
export function enforceKeys( object, keys, message ) {
  if ( !keysDefined( object, keys ) ) {
    throw new Error( message );
  }
}

/**
 * Converts a string to a number. If the string is not a valid number, returns NaN. If the string is empty, returns 0.
 * Forms work with strings so this is used when we need to convert the value back to a number.
 * @param value
 * @return {number}
 */
export function stringToNumber( value ) {
  return Number( value );
}

/**
 * Renames a variable in a code string, replacing all instances of the oldName with the newName. The regex
 * uses a non-variable character boundary so that it will not match a variable name that is a substring of
 * another variable name.
 * @param codeString - code to search through
 * @param newName - new name for the variable
 * @param oldName - existing name for the variable
 */
export function renameVariableInCode( codeString, newName, oldName ) {

  // the 'g' flag in the regex will replace all instances of the old name, and is supported on more platforms
  // than replaceAll.
  const regex = new RegExp( `\\b${oldName}\\b`, 'g' );
  return codeString.replace( regex, newName );
}

/**
 * Replace references to a variable AND setter functions with a new name. Good for when you want to
 * rename myComponent to newComponent and you need to update
 * myComponent -> newComponent and
 * setMyComponent -> setNewComponent
 *
 * for the entire code block.
 */
export function replaceReferencesInCode( codeString, newName, oldName ) {

  // replace standalone variables
  const withVariablesRenamed = renameVariableInCode( codeString, newName, oldName );

  // replace setter functions
  const newSetterName = 'set' + newName.charAt( 0 ).toUpperCase() + newName.slice( 1 );
  const oldSetterName = 'set' + oldName.charAt( 0 ).toUpperCase() + oldName.slice( 1 );
  return renameVariableInCode( withVariablesRenamed, newSetterName, oldSetterName );
}

/**
 * Prepares the provided function documentation list into a 'list' with newlines, which is better for the
 * AI input (and for humans).
 * @param functionList
 * @return {*}
 */
export function formatFunctionListForPrompt( functionList ) {
  return functionList.map( functionName => {
    return `* ${functionName}`;
  } ).join( '\n' );
}

//------------------------------------------------------
// query parameters
// TODO: This should ideally use QueryStringMachine
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