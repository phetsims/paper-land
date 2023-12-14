/**
 * A class that is responsible for generating code related to the view.
 */

export default class ViewCodeGenerator {

  /**
   * Get a consistent name for a component based on its type and the user defined name.
   */
  static getComponentNameString( viewType, componentName ) {

    return viewType === 'ShapeViewComponent' ? `${componentName}Path` :
           viewType === 'TextViewComponent' ? `${componentName}Text` :
           viewType === 'ImageViewComponent' ? `${componentName}Image` :
           viewType === 'SoundViewComponent' ? `${componentName}Sound` :
           viewType === 'DescriptionViewComponent' ? `${componentName}Description` :
           `${componentName}Background`;
  }

  /**
   * Returns the code to convert a value to the view coordinate frame. If the user is working view coordinates, the
   * value is used directly. Otherwise, the value is wrapped in a utility function to do the conversion.
   * @param value
   * @param inModelCoordinates
   * @param dimension
   * @return {*|string}
   */
  static valueStringInViewUnits( value, inModelCoordinates, dimension ) {
    if ( !inModelCoordinates ) {

      // values are specified in pixels and can be used directly
      return value;
    }
    else {

      // values were specified in model coordinates and need to be converted to pixels
      if ( dimension === 'x' ) {
        return `phet.paperLand.utils.paperToBoardX( ${value}, sharedData.displaySize.width )`;
      }
      else {
        return `phet.paperLand.utils.paperToBoardY( ${value}, sharedData.displaySize.height )`;
      }
    }
  }

  static getSetterFunctionsForViewType( viewType, componentName, viewOptions ) {
    const componentNameString = ViewCodeGenerator.getComponentNameString( viewType, componentName );
    const inModelCoordinates = viewOptions.viewUnits === 'model';
    const codeStrings = [];

    // The setters that are available for all Node types.
    codeStrings.push( `
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        ${componentNameString}.centerX = ${ViewCodeGenerator.valueStringInViewUnits( 'x', inModelCoordinates, 'x' )};
      };
      
      const setCenterY = ( y ) => {
        ${componentNameString}.centerY = ${ViewCodeGenerator.valueStringInViewUnits( 'y', inModelCoordinates, 'y' )};
      };
      
      const setLeft = ( left ) => {
        ${componentNameString}.left = ${ViewCodeGenerator.valueStringInViewUnits( 'left', inModelCoordinates, 'x' )};
      };
      
      const setTop = ( top ) => {
        ${componentNameString}.top = ${ViewCodeGenerator.valueStringInViewUnits( 'top', inModelCoordinates, 'y' )};
      };
      
      const setScale = ( scale ) => {
        ${componentNameString}.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        ${componentNameString}.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        ${componentNameString}.visible = visible;
      };
      
      const moveToFront = () => {
        ${componentNameString}.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        ${componentNameString}.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const ${componentNameString}ViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( ${componentNameString}.localBounds.width || 1 ) / ( ${componentNameString}.localBounds.height || 1 );

        const scaleX = ${componentNameString}ViewBounds.width / ( ${componentNameString}.localBounds.width || 1 );
        const scaleY = ${componentNameString}ViewBounds.height / ( ${componentNameString}.localBounds.height || 1 );

        if ( stretch ) {
          ${componentNameString}.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          ${componentNameString}.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        ${componentNameString}.center = ${componentNameString}ViewBounds.center;
      };
      `
    );

    if ( viewType === 'ShapeViewComponent' ) {
      codeStrings.push( `
        const setStroke = ( color ) => {
          ${componentNameString}.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          ${componentNameString}.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          ${componentNameString}.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          // x1 = newX1;
          // ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setX1 not implemented' );
        };
        
        const setY1 = ( newY1 ) => {
          // y1 = newY1;
          // ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setY1 not implemented' );
        };

        const setX2 = ( newX2 ) => {
          // x2 = newX2;
          // ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setX2 not implemented' );
        };
        
        const setY2 = ( newY2 ) => {
          // y2 = newY2;
          // ${componentNameString}.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setY2 not implemented' );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          ${componentNameString}.shape = phet.kite.Shape.circle( ${ViewCodeGenerator.valueStringInViewUnits( 'radius', inModelCoordinates, 'x' )} );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = ${inModelCoordinates ? 'unitBoundsToDisplayBounds( bounds )' : 'bounds'};
          ${componentNameString}.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = ${inModelCoordinates ? 'points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) )' : 'points'};
          ${componentNameString}.shape = phet.kite.Shape.polygon( transformedPoints );
        };`
      );
    }
    else if ( viewType === 'TextViewComponent' ) {
      codeStrings.push( `
        const setString = ( string ) => {
          ${componentNameString}.string = string;
        };
        
        const setFontSize = ( size ) => {
          ${componentNameString}.fontSize = size;
        };

        const setTextColor = ( color ) => {
          ${componentNameString}.fill = color;
        };

        const setFontFamily = ( family ) => {
          ${componentNameString}.fontFamily = family;
        };
      ` );
    }
    else if ( viewType === 'ImageViewComponent' ) {
      codeStrings.push( `
        const setImage = imageName => {
          let ${componentNameString}ImageElement = document.createElement( 'img' );
          ${componentNameString}ImageElement.src = 'media/images/' + imageName;
          ${componentNameString}.image = ${componentNameString}ImageElement;
        };
      ` );
    }

    return codeStrings.join( '\n' );
  }
}