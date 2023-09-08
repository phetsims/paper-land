import clientConstants from '../clientConstants.js';
import { add, averagePoints, diff, getProgramDataFromNumber, moveAlongVector, rotateAboutXY } from '../utils.js';

const PaperWhiskerManager = {

  /**
   * Create the whisker lines for a given paper. Line points are in the normalized coordinate frame, relative
   * to the width of the camera view.
   * @param paperPoints
   * @param paperNumber
   * @return {{start: Point, end: Point}[]}
   */
  getWhiskerLinesForPaper( paperPoints, paperNumber ) {
    const whiskerLengths = PaperWhiskerManager.getWhiskerLengthsForPaper( paperNumber );

    // This is the order of points in the paperPoints array - it is used to map set of paper points to side of
    // paper for whisker length.
    const directions = [ 'top', 'right', 'bottom', 'left' ];

    const whiskerLines = [];
    for ( let i = 0; i < 4; i++ ) {
      const nextPointIndex = ( i + 1 ) % 4;
      const start = averagePoints( paperPoints[ i ], paperPoints[ nextPointIndex ] );

      const whiskerLengthForDirection = whiskerLengths[ directions[ i ] ];

      const centerToPoint = diff( paperPoints[ nextPointIndex ], start );
      const vectorToEnd = rotateAboutXY( centerToPoint, 0, 0, -Math.PI / 2 );

      const end = add( start, moveAlongVector( whiskerLengthForDirection, vectorToEnd ) );

      whiskerLines.push( {
        start: start,
        end: end
      } );
    }

    return whiskerLines;
  },

  /**
   * Get whiskers for the provided paper, and save to a data structure for later retrieval.
   */
  updatePaperWhiskerMap( programs ) {
    programs.forEach( program => {

      // The Projector page updates paperProgramsDataByProgramNumber while Camera updates whisker data. Because
      // of this, the paper data might not be available to get the lines for whiskers yet. In that case, wait
      // until Projector has completed an update. See
      // https://github.com/phetsims/paper-land/issues/114
      if ( getProgramDataFromNumber( program.number ) !== null ) {
        const whiskerLines = PaperWhiskerManager.getWhiskerLinesForPaper( program.points, program.number );
        this.paperWhiskerMap.set( program.number, whiskerLines );
      }
      else {
        console.warn( 'Skipping update because Projector screen hasnt updated paperProgramsDataByProgramNumber yet' );
      }
    } );
  },

  /**
   * Get the whisker lengths for the provided paper number, one length per cardinal direction.
   * @param paperNumber
   * @return {{top: (number), left: (number), bottom: (number), right: (number)}}
   */
  getWhiskerLengthsForPaper( paperNumber ) {
    const programSpecificData = getProgramDataFromNumber( paperNumber );

    if ( !programSpecificData ) {
      throw new Error( 'No program data found for paper number: ' + paperNumber );
    }

    // Get and update whisker length data for this particular paper
    const whiskerLength = programSpecificData.paperPlaygroundData.whiskerLength || clientConstants.defaultWhiskerLength;

    // By default, assign that specified length to each direction.
    let whiskerLengthsForPaper = {
      top: whiskerLength,
      right: whiskerLength,
      bottom: whiskerLength,
      left: whiskerLength
    };

    // If the client has requested a unique whisker length for a side, use that.
    if ( programSpecificData.paperPlaygroundData.customWhiskerLengths ) {
      const whiskerLengths = programSpecificData.paperPlaygroundData.customWhiskerLengths;

      whiskerLengthsForPaper = {
        ...whiskerLengthsForPaper,

        // custom lengths will override the default values
        ...whiskerLengths
      };
    }

    return whiskerLengthsForPaper;
  },

  // convert the map into a string for saving into localStorage
  getPaperWhiskerMapString() {
    return JSON.stringify( [ ...this.paperWhiskerMap ] );
  },

  loadWhiskerDataFromLocalStorage() {
    const storedWhiskerData = JSON.parse( localStorage.paperProgramsWhiskers || [] );
    return new Map( storedWhiskerData );
  },

  // @public {Map<number, {start: Point, end: Point}[]}>
  paperWhiskerMap: new Map()
};

window.manager = PaperWhiskerManager;
export default PaperWhiskerManager;