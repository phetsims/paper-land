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
   * Returns the center of the program in paper coordinates.
   * @param points - points of the paper, provided by paper programming API.
   * @return dot.Vector2
   */
  getProgramCenter( points ) {
    const topLeft = points[ 0 ];
    const bottomRight = points[ 3 ];
    return new phet.dot.Vector2( ( topLeft.x + bottomRight.x ) / 2, ( topLeft.y + bottomRight.y ) / 2 );
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