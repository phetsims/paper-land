const Utils = {

  /**
   * Gets a number from a string. A strategy used throughout creator to map a group of controls to a value object
   * is to assign an index to the input component (like a radio button) and then use that index to look up an item
   * in an array. Assumes that the id string looks something like
   *
   * 'my-unique-id-45'
   *
   * with the number at the end. In this case, the number 45 would be returned.
   *
   * @param idString
   * @returns {number}
   */
  getIndexFromIdString: idString => {
    const results = idString.match( /(\d+)(?!.*\d)/g );
    if ( results === null || results.length !== 1 ) {
      throw new Error( 'Something went wrong with the regex/index?' );
    }
    return parseInt( results[ 0 ], 10 );
  },

  /**
   * Returns a point in the global coordinate frame, corrected for the pan and zoom of the view.
   * @param globalPoint
   */
  getPanZoomCorrectedPoint( globalPoint ) {
    const matrix = phet.scenery.animatedPanZoomSingleton.listener.matrixProperty.value.inverted();
    return matrix.timesVector2( globalPoint );
  }
};

export default Utils;