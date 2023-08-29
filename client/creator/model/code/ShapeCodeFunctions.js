/**
 * A set of utility functions that generate code to draw a shape with kite.
 */

const ShapeCodeGenerator = {

  /**
   * Create code that will generate a Shape with kite.
   * @param {string} nameString - the name of the component
   * @param shapeOptions
   * @returns {string}
   */
  createShapeCodeFromOptions( nameString, shapeOptions ) {
    const shapeType = shapeOptions.shapeType;

    let shapeCode;
    const declarationString = `const ${nameString}Shape =`;

    if ( shapeType === 'rectangle' ) {
      shapeCode = `${declarationString} phet.kite.Shape.rectangle( 0, 0, ${shapeOptions.rectWidth}, ${shapeOptions.rectHeight} )`;
    }
    else if ( shapeType === 'circle' ) {
      shapeCode = `${declarationString} phet.kite.Shape.circle( ${shapeOptions.circleRadius} )`;
    }
    else if ( shapeType === 'ellipse' ) {
      shapeCode = `${declarationString} phet.kite.Shape.ellipse( ${shapeOptions.ellipseRadiusX}, ${shapeOptions.ellipseRadiusY} )`;
    }
    else if ( shapeType === 'line' ) {
      shapeCode = `
        let x1 = ${shapeOptions.lineStartX};
        let y1 = ${shapeOptions.lineStartY};
        let x2 = ${shapeOptions.lineEndX};
        let y2 = ${shapeOptions.lineEndY};
        ${declarationString} phet.kite.Shape.lineSegment( x1, y1, x2, y2 )
      `;
    }
    else if ( shapeType === 'triangle' ) {
      shapeCode = `
        ${declarationString} phet.kite.Shape.polygon( [
          new phet.dot.Vector2( ${shapeOptions.triangleBaseWidth} / 2, 0 ),
          new phet.dot.Vector2( 0, ${shapeOptions.triangleHeight} ),
          new phet.dot.Vector2( -${shapeOptions.triangleBaseWidth} / 2, 0 )
        ] );
      `;
    }
    else if ( shapeType === 'polygon' ) {
      const points = shapeOptions.polygonPoints.map( point => `new phet.dot.Vector2( ${point[ 0 ]}, ${point[ 1 ]} )` ).join( ', ' );
      shapeCode = `${declarationString} phet.kite.Shape.polygon( [${points}] )`;
    }
    else {
      throw new Error( 'Could not generate code for provided shape type.' );
    }

    return shapeCode;
  }
};

export default ShapeCodeGenerator;