/**
 * A set of utility functions that generate code to draw a shape with kite.
 */
import ViewCodeGenerator from './ViewCodeGenerator.js';

const ShapeCodeGenerator = {

  /**
   * Create code that will generate a Shape with kite.
   * @param {string} nameString - the name of the component
   * @param shapeOptions
   * @param viewOptions
   * @returns {string}
   */
  createShapeCodeFromOptions( nameString, shapeOptions, viewOptions ) {
    const shapeType = shapeOptions.shapeType;
    const inModelCoordinates = viewOptions.viewUnits === 'model';

    let shapeCode;
    const declarationString = `const ${nameString}Shape =`;

    if ( shapeType === 'rectangle' ) {
      const widthString = ViewCodeGenerator.valueStringInViewUnits( shapeOptions.rectWidth, inModelCoordinates, 'x' );
      const heightString = ViewCodeGenerator.valueStringInViewUnits( shapeOptions.rectHeight, inModelCoordinates, 'y' );
      shapeCode = `${declarationString} phet.kite.Shape.rectangle( 0, 0, ${widthString}, ${heightString} )`;
    }
    else if ( shapeType === 'circle' ) {
      const radiusString = ViewCodeGenerator.valueStringInViewUnits( shapeOptions.circleRadius, inModelCoordinates, 'x' );
      shapeCode = `${declarationString} phet.kite.Shape.circle( ${radiusString} )`;
    }
    else if ( shapeType === 'ellipse' ) {
      const ellipseRadiusXString = ViewCodeGenerator.valueStringInViewUnits( shapeOptions.ellipseRadiusX, inModelCoordinates, 'x' );
      const ellipseRadiusYString = ViewCodeGenerator.valueStringInViewUnits( shapeOptions.ellipseRadiusY, inModelCoordinates, 'y' );
      shapeCode = `${declarationString} phet.kite.Shape.ellipse( ${ellipseRadiusXString}, ${ellipseRadiusYString} )`;
    }
    else if ( shapeType === 'line' ) {
      shapeCode = `
        let x1 = ${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.lineStartX, inModelCoordinates, 'x' )};
        let y1 = ${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.lineStartY, inModelCoordinates, 'y' )};
        let x2 = ${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.lineEndX, inModelCoordinates, 'x' )};
        let y2 = ${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.lineEndY, inModelCoordinates, 'y' )};
        ${declarationString} phet.kite.Shape.lineSegment( x1, y1, x2, y2 )
      `;
    }
    else if ( shapeType === 'triangle' ) {
      shapeCode = `
        ${declarationString} phet.kite.Shape.polygon( [
          new phet.dot.Vector2( ${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.triangleBaseWidth, inModelCoordinates, 'x' )} / 2, 0 ),
          new phet.dot.Vector2( 0, ${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.triangleHeight, inModelCoordinates, 'y' )} ),
          new phet.dot.Vector2( -${ViewCodeGenerator.valueStringInViewUnits( shapeOptions.triangleBaseWidth, inModelCoordinates, 'x' )} / 2, 0 )
        ] );
      `;
    }
    else if ( shapeType === 'polygon' ) {
      const points = shapeOptions.polygonPoints.map( point => `new phet.dot.Vector2( ${ViewCodeGenerator.valueStringInViewUnits( point[ 0 ], inModelCoordinates, 'x' )}, ${ViewCodeGenerator.valueStringInViewUnits( point[ 1 ], inModelCoordinates, 'y' )} )` ).join( ', ' );
      shapeCode = `${declarationString} phet.kite.Shape.polygon( [${points}] )`;
    }
    else {
      throw new Error( 'Could not generate code for provided shape type.' );
    }

    return shapeCode;
  }
};

export default ShapeCodeGenerator;