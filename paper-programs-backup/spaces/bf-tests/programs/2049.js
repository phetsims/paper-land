// Rate and Output Text
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const reportValuesArrayAddedItem = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( 'reportValuesArrayAddedItem', reportValuesArrayAddedItem );
    

      const reportValuesArrayRemovedItem = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( 'reportValuesArrayRemovedItem', reportValuesArrayRemovedItem );
    

      const reportValuesArray = new phet.axon.Property( [] );
      phet.paperLand.addModelComponent( 'reportValuesArray', reportValuesArray );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const reportValuesArrayLength = new phet.axon.Property( null );
      scratchpad.reportValuesArrayLengthDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'reportValuesArray' ], ( reportValuesArray ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          return reportValuesArray.length;
        };
        reportValuesArrayLength.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'reportValuesArrayLength', reportValuesArrayLength );
    

      // Create the text and add it to the view - using RichText for nice markup support.
      const parametersTextText = new phet.scenery.RichText( '', { fill: 'white' } );
      
      sharedData.scene.addChild( parametersTextText );
      scratchpad.parametersTextText = parametersTextText;
      
      // Update the text when a dependency changes.
      scratchpad.parametersTextTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'reportValuesArrayLength' ], ( reportValuesArrayLength ) => {
      
        // the additional reference constants
        const reportValuesArray = phet.paperLand.getModelComponent('reportValuesArray').value;
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        parametersTextText.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        parametersTextText.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        parametersTextText.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        parametersTextText.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        parametersTextText.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        parametersTextText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        parametersTextText.visible = visible;
      };
      
      const moveToFront = () => {
        parametersTextText.moveToFront();
      };
      
      const moveToBack = () => {
        parametersTextText.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        parametersTextText.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const parametersTextTextViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( parametersTextText.localBounds.width || 1 ) / ( parametersTextText.localBounds.height || 1 );

        const scaleX = parametersTextTextViewBounds.width / ( parametersTextText.localBounds.width || 1 );
        const scaleY = parametersTextTextViewBounds.height / ( parametersTextText.localBounds.height || 1 );

        if ( stretch ) {
          parametersTextText.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          parametersTextText.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        parametersTextText.center = parametersTextTextViewBounds.center;
      };
      

        const setString = ( string ) => {
          parametersTextText.string = string;
        };
        
        const setFontSize = ( size ) => {
        
          // RichText has no setter for size, so we need to create a new font. Use
          // state from the old font to maintain the family.
          const currentFont = parametersTextText.font;
          const newFont = new phet.scenery.Font( { size: size, family: currentFont.family } );
          parametersTextText.font = newFont;
        };

        const setTextColor = ( color ) => {
          parametersTextText.fill = color;
        };

        const setFontFamily = ( family ) => {
        
          // RichText has no setter for fontFamily, so we need to create a new font. Use
          // state from the old font to maintain the size.
          const currentFont = parametersTextText.font;
          const newFont = new phet.scenery.Font( { size: currentFont.size, family: family } );
          parametersTextText.font = newFont;
        };
      

        // the function that the user wrote to update the text      
        setLeft(0);
setCenterY(0.1);
setFontSize(15);

phet.paperLand.console.log(`array length is ${reportValuesArrayLength}`);

let result;

if (reportValuesArrayLength === 0) {
    result = "The array is empty.";
} else if (reportValuesArrayLength === 1) {
    result = `${reportValuesArray.rate1}`;
} else if (reportValuesArrayLength === 2) {
    result = "The array has two elements.";
} else if (reportValuesArrayLength === 3) {
    result = "The array has three elements.";
} else if (reportValuesArrayLength === 4) {
    result = "The array has four elements.";
} else if (reportValuesArrayLength === 5) {
    result = "The array has five elements.";
} else if (reportValuesArrayLength === 6) {
    result = "The array has six elements.";
} else if (reportValuesArrayLength === 7) {
    result = "The array has seven elements.";
} else if (reportValuesArrayLength === 8) {
    result = "The array has eight elements.";
} else if (reportValuesArrayLength === 9) {
    result = "The array has nine elements.";
} else if (reportValuesArrayLength === 10) {
    result = "The array has ten elements.";
} else {
    result = "The array has more than ten elements.";
}

setString(result);
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [ 'reportValuesArray' ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
     // Remove the component from the model
      phet.paperLand.removeModelComponent( 'reportValuesArrayAddedItem' );
    

     // Remove the component from the model
      phet.paperLand.removeModelComponent( 'reportValuesArrayRemovedItem' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'reportValuesArray' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'reportValuesArray' ], scratchpad.reportValuesArrayLengthDerivedPropertyObserverId );
      delete scratchpad.reportValuesArrayLengthDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'reportValuesArrayLength' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.parametersTextText );
      delete scratchpad.parametersTextText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'reportValuesArrayLength' ], scratchpad.parametersTextTextMultilinkId, {
        otherReferences: [ 'reportValuesArray' ]
      });
      delete scratchpad.parametersTextTextMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };

  await paper.set( 'data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString(),
      },
      customWhiskerLengths: {
        top: 0.2,
        right: 0.2,
        bottom: 0.2,
        left: 0.2
      }
    }
  } );
  
  // PROJECTOR CODE //
  // Get a canvas object for this paper to draw something to the Projector.
  const canvas = await paper.get('canvas');

  // Draw the name of the program to the projector
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Rate and Output Text', canvas.width / 2, canvas.height / 2 + 20);
})();
