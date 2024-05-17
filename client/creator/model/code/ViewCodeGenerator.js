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
           viewType === 'SpeechViewComponent' ? `${componentName}Speech` :
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
      
      const moveToBack = () => {
        ${componentNameString}.moveToBack();
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
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          ${componentName}_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( ${componentName}_x1, ${componentName}_y1, ${componentName}_x2, ${componentName}_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          ${componentName}_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( ${componentName}_x1, ${componentName}_y1, ${componentName}_x2, ${componentName}_y2 );
        };

        const setX2 = ( newX2 ) => {
          ${componentName}_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( ${componentName}_x1, ${componentName}_y1, ${componentName}_x2, ${componentName}_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          ${componentName}_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          ${componentNameString}.shape = phet.kite.Shape.lineSegment( ${componentName}_x1, ${componentName}_y1, ${componentName}_x2, ${componentName}_y2 );
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
        
          // RichText has no setter for size, so we need to create a new font. Use
          // state from the old font to maintain the family.
          const currentFont = ${componentNameString}.font;
          const newFont = new phet.scenery.Font( { size: size, family: currentFont.family } );
          ${componentNameString}.font = newFont;
        };

        const setTextColor = ( color ) => {
          ${componentNameString}.fill = color;
        };

        const setFontFamily = ( family ) => {
        
          // RichText has no setter for fontFamily, so we need to create a new font. Use
          // state from the old font to maintain the size.
          const currentFont = ${componentNameString}.font;
          const newFont = new phet.scenery.Font( { size: currentFont.size, family: family } );
          ${componentNameString}.font = newFont;
        };
      ` );
    }
    else if ( viewType === 'ImageViewComponent' ) {
      codeStrings.push( `
      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( ${componentNameString}.image ) {
              const startIndex = ${componentNameString}.image.src.indexOf( 'media/images/' );
              currentImageName = ${componentNameString}.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const ${componentNameString}ImageElement = document.createElement( 'img' );
              ${componentNameString}ImageElement.src = newImageName;
              ${componentNameString}.image = ${componentNameString}ImageElement;

              // Wait for the image to load before resolving              
              ${componentNameString}ImageElement.addEventListener( 'load', () => {
                resolve();
              } );
            }
            else {
              
              // No change, so resolve immediately
              resolve();
            }
          } );
        };
      ` );
    }
    else if ( viewType === 'SpeechViewComponent' ) {

      // From the ViewComponentTemplates, we will have access to an Utterance
      // with this name.
      const utteranceComponentName = `${componentName}SpeechUtterance`;

      codeStrings.push( `
      
        // Stop all speech and clear the queue
        const interruptSpeech = () => {
          phet.scenery.voicingUtteranceQueue.cancel();;
        };
        
        // Mute/unmute the utterance queue
        const setMuted = ( v ) => {
          phet.scenery.voicingUtteranceQueue.setMuted( v );
        };
        
        // Sets the priority of this utterance in the queue
        const setPriority = ( v ) => {
          scratchpad.${utteranceComponentName}.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.${utteranceComponentName}.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      ` );
    }

    return codeStrings.join( '\n' );
  }
}