/**
 * Utility functions that are added to the paperLand.utils namespace.
 */

import paperLand from './paperLand.js';

const boardUtils = {

  /**
   * Returns the rotation of the program between 0 and 2*PI. A value of 0 means that the paper is axis aligned
   * with the camera view, the top of the page is perfectly flat.
   * @param points - points of the paper, provided by paper programming API. Vertices are top left to bottom left
   *                 in clockwise order.
   */
  getProgramRotation( points ) {
    const topLeft = points[ 0 ];
    const topRight = points[ 1 ];

    let rotationRadians = Math.atan2( topRight.y - topLeft.y, topRight.x - topLeft.x );

    // if the angle is less than zero, we have wrapped around Math.PI - the actual range should be 0 to 2PI.
    if ( rotationRadians < 0 ) {
      rotationRadians = rotationRadians + 2 * Math.PI;
    }

    return rotationRadians;
  },

  /**
   * Returns the paper rotation normalized from zero to one. Often rotation will control a value in paper-land and
   * the normalized rotation value will be easier to use when scaling a model value.
   */
  getNormalizedProgramRotation( points ) {
    const rotationRadians = boardUtils.getProgramRotation( points );
    return rotationRadians / ( 2 * Math.PI );
  },

  /**
   * Returns an enumeration value from the current rotation of the program. The enumeration values are evenly
   * distributed between 0 and 1 (the range of normalized rotation).
   */
  getEnumerationValueFromProgramRotation( points, enumerationValues ) {
    const normalizedRotation = boardUtils.getNormalizedProgramRotation( points );
    const index = Math.floor( normalizedRotation * enumerationValues.length );
    if ( index < 0 || index >= enumerationValues.length ) {
      throw new Error( `Index ${index} is out of bounds for enumeration values ${enumerationValues}` );
    }
    return enumerationValues[ index ];
  },

  /**
   * Returns an enumeration value from the number of markers in the program. The values cycle through as
   * markers are added to the program (and wrap).
   */
  getEnumerationValueFromProgramMarkers( programMarkers, enumerationValues ) {
    const index = programMarkers.length % enumerationValues.length;
    if ( index < 0 || index >= enumerationValues.length ) {
      throw new Error( `Index ${index} is out of bounds for enumeration values ${enumerationValues}` );
    }
    return enumerationValues[ index ];
  },

  /**
   * Returns the center of the program in paper coordinates.
   * @param points - points of the paper, provided by paper programming API.
   * @return dot.Vector2
   */
  getProgramCenter( points ) {
    const topLeft = points[ 0 ];
    const bottomRight = points[ 2 ];
    return new phet.dot.Vector2( ( topLeft.x + bottomRight.x ) / 2, ( topLeft.y + bottomRight.y ) / 2 );
  },

  /**
   * Converts a normalized point in paper coordinates to the same position in board coordinates.
   * @param {dot.Vector2} paperPoint
   * @param {number} boardWidth
   * @param {number} boardHeight
   * @return {*|Vector2}
   */
  paperToBoardCoordinates( paperPoint, boardWidth, boardHeight ) {
    return new phet.dot.Vector2( paperPoint.x * boardWidth, paperPoint.y * boardHeight );
  },

  /**
   * Returns the center of a paper in board coordinates. Useful for controlling the position of a
   * component from paper center.
   * @param {{x: number, y: number}[]}points
   * @param {dot.Dimension2} displaySize
   * @return {dot.Vector2}
   */
  getBoardPositionFromPoints( points, displaySize ) {
    const width = displaySize.width;
    const height = displaySize.height;

    return boardUtils.paperToBoardCoordinates( boardUtils.getProgramCenter( points ), width, height );
  },

  /**
   * Turns a point into a dot.Vector2 instance.
   * @param point
   * @return {dot.Vector2}
   */
  pointToVector2( point ) {
    return new phet.dot.Vector2( point.x, point.y );
  }
};

// add to namespace so it is available in programs
paperLand.utils = boardUtils;

export default boardUtils;