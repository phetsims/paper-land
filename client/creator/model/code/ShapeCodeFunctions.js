/**
 * A set of utility functions that generate code to draw a shape with kite.
 */

const ShapeCodeGenerator = {

  /**
   * Create code that will generate a Shape with kite.
   * @param shapeOptions
   * @returns {string}
   */
  createShapeCodeFromOptions( shapeOptions ) {
    const shapeType = shapeOptions.shapeType;

    if ( shapeType === 'rectangle' ) {
      return `phet.kite.Shape.rectangle( 0, 0, ${shapeOptions.rectWidth}, ${shapeOptions.rectHeight} )`;
    }
    else if ( shapeType === 'circle' ) {
      return `phet.kite.Shape.circle( ${shapeOptions.circleRadius} )`;
    }
    else if ( shapeType === 'ellipse' ) {
      return `phet.kite.Shape.ellipse( ${shapeOptions.ellipseRadiusX}, ${shapeOptions.ellipseRadiusY} )`;
    }
    else if ( shapeType === 'line' ) {
      return `phet.kite.Shape.lineSegment( ${shapeOptions.lineStartX}, ${shapeOptions.lineStartY}, ${shapeOptions.lineEndX}, ${shapeOptions.lineEndY} )`;
    }
    else if ( shapeType === 'triangle' ) {
      return `
        phet.kite.Shape.polygon( [
          new phet.dot.Vector2( ${shapeOptions.triangleBaseWidth} / 2, 0 ),
          new phet.dot.Vector2( 0, ${shapeOptions.triangleHeight} ),
          new phet.dot.Vector2( -${shapeOptions.triangleBaseWidth} / 2, 0 )
        ] );
      `;
    }
    else if ( shapeType === 'polygon' ) {
      const points = shapeOptions.polygonPoints.map( point => `new phet.dot.Vector2( ${point[ 0 ]}, ${point[ 1 ]} )` ).join( ', ' );
      return `phet.kite.Shape.polygon( [${points}] )`;
    }
    else {
      throw new Error( 'Could not generate code for provided shape type.' );
    }
  }
};

export default ShapeCodeGenerator;