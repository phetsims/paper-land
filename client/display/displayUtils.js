/**
 * Utility functions that are added to the paperLand.utils namespace.
 */

import paperLand from './paperLand.js';

const displayUtils = {

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
    const rotationRadians = displayUtils.getProgramRotation( points );
    return rotationRadians / ( 2 * Math.PI );
  },

  /**
   * Returns an enumeration value from the current rotation of the program. The enumeration values are evenly
   * distributed between 0 and 1 (the range of normalized rotation).
   */
  getEnumerationValueFromProgramRotation( points, enumerationValues ) {
    const normalizedRotation = displayUtils.getNormalizedProgramRotation( points );
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
   * Returns the normalized vertical position of the a marker on its paper, filtering out
   * markers that are not the provided color. Returns null if there are no markers of the specified
   * color.
   * @param markers
   * @param colorName
   * @returns {number|null}
   */
  getNormalizedVerticalMarkerPositionOnPaper( markers, colorName ) {
    const marker = colorName === 'all' ? markers[ 0 ] : markers.find( marker => marker.colorName === colorName );

    // The positionOnPaper is relative to the paper origin (top left)
    return marker ? ( 1 - marker.positionOnPaper.y ) : null;
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
   * Converts a normalized point in paper coordinates to the same position in display coordinates.
   * @param {dot.Vector2} paperPoint
   * @param {number} displayWidth
   * @param {number} displayHeight
   * @return {*|Vector2}
   */
  paperToDisplayCoordinates( paperPoint, displayWidth, displayHeight ) {
    return new phet.dot.Vector2( paperPoint.x * displayWidth, paperPoint.y * displayHeight );
  },

  /**
   * Converts the X coordinate of a point in paper coordinates (normalized) to the same position in display coordinates.
   */
  paperToDisplayX( paperX, displayWidth ) {
    return paperX * displayWidth;
  },

  /**
   * Converts the Y coordinate of a point in paper coordinates (normalized) to the same position in display coordinates.
   */
  paperToDisplayY( paperY, displayHeight ) {
    return paperY * displayHeight;
  },

  /**
   * Returns the center of a paper in display coordinates. Useful for controlling the position of a
   * component from paper center.
   * @param {{x: number, y: number}[]}points
   * @param {dot.Dimension2} displaySize
   * @return {dot.Vector2}
   */
  getDisplayPositionFromPoints( points, displaySize ) {
    const width = displaySize.width;
    const height = displaySize.height;

    return displayUtils.paperToDisplayCoordinates( displayUtils.getProgramCenter( points ), width, height );
  },

  paperToDisplayBounds( paperBounds, displayWidth, displayHeight ) {
    return new phet.dot.Bounds2(
      paperBounds.minX * displayWidth,
      paperBounds.minY * displayHeight,
      paperBounds.maxX * displayWidth,
      paperBounds.maxY * displayHeight
    );
  },

  /**
   * Given the orientation of points, return a new array where the points are sorted such that
   * the left/top most point is first and the left/bottom most point is last, so that we have
   * a valid Bounds2 instance no matter the point positions or paper rotation.
   */
  getAbsolutePaperBounds( points ) {
    const xValues = points.map( point => point.x );
    const yValues = points.map( point => point.y );

    const sortedXValues = xValues.sort( ( a, b ) => a - b );
    const sortedYValues = yValues.sort( ( a, b ) => a - b );

    return new phet.dot.Bounds2(
      sortedXValues[ 0 ],
      sortedYValues[ 0 ],
      sortedXValues[ sortedXValues.length - 1 ],
      sortedYValues[ sortedYValues.length - 1 ]
    );
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
paperLand.utils = displayUtils;

export default displayUtils;