// Movable Cupcake
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const cupcakePosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'cupcakePosition', cupcakePosition );
    

      const cupcakeRotation = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 6.28 )
      });
      phet.paperLand.addModelComponent( 'cupcakeRotation', cupcakeRotation );
    

      const cupcakeScale = new phet.axon.NumberProperty( 1, {
        range: new phet.dot.Range( 0.1, 2 )
      });
      phet.paperLand.addModelComponent( 'cupcakeScale', cupcakeScale );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const cupcakeBounds = new phet.axon.Property( null );
      scratchpad.cupcakeBoundsDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'leftTopBounds', 'centerTopBounds', 'rightTopBounds', 'leftCenterBounds', 'centerBounds', 'rightCenterBounds', 'leftBottomBounds', 'centerBottomBounds', 'rightBottomBounds', 'cupcakePosition' ], ( leftTopBounds, centerTopBounds, rightTopBounds, leftCenterBounds, centerBounds, rightCenterBounds, leftBottomBounds, centerBottomBounds, rightBottomBounds, cupcakePosition ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          if ( leftTopBounds.containsPoint( cupcakePosition ) ) {
    return leftTopBounds;
}
else if ( centerTopBounds.containsPoint( cupcakePosition ) ) {
    return centerTopBounds;
}
else if ( rightTopBounds.containsPoint( cupcakePosition ) ) {
    return rightTopBounds;
}
else if ( leftCenterBounds.containsPoint( cupcakePosition ) ) {
    return leftCenterBounds;
}
else if ( centerBounds.containsPoint( cupcakePosition ) ) {
    return centerBounds;
}
else if ( rightCenterBounds.containsPoint( cupcakePosition ) ) {
    return rightCenterBounds;
}
else if ( leftBottomBounds.containsPoint( cupcakePosition ) ) {
    return leftBottomBounds;
}
else if ( centerBottomBounds.containsPoint( cupcakePosition ) ) {
    return centerBottomBounds;
}
else if ( rightBottomBounds.containsPoint( cupcakePosition ) ) {
    return rightBottomBounds;
}

        };
        cupcakeBounds.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'cupcakeBounds', cupcakeBounds );
    

      // Create an image and add it to the view.
      let cupcakeImageImageElement = document.createElement( 'img' );
      cupcakeImageImageElement.src = 'media/images/frosted.png';
      const cupcakeImageImage = new phet.scenery.Image( cupcakeImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const cupcakeImageImageLoadProperty = new phet.axon.Property( 0 );
      cupcakeImageImageElement.addEventListener( 'load', () => { cupcakeImageImageLoadProperty.value = cupcakeImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( cupcakeImageImage );
      scratchpad.cupcakeImageImage = cupcakeImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.cupcakeImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'cupcakePosition', 'cupcakeRotation', 'cupcakeScale' ], async ( cupcakePosition, cupcakeRotation, cupcakeScale ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        cupcakeImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        cupcakeImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        cupcakeImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        cupcakeImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        cupcakeImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        cupcakeImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        cupcakeImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        cupcakeImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        cupcakeImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        cupcakeImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const cupcakeImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( cupcakeImageImage.localBounds.width || 1 ) / ( cupcakeImageImage.localBounds.height || 1 );

        const scaleX = cupcakeImageImageViewBounds.width / ( cupcakeImageImage.localBounds.width || 1 );
        const scaleY = cupcakeImageImageViewBounds.height / ( cupcakeImageImage.localBounds.height || 1 );

        if ( stretch ) {
          cupcakeImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          cupcakeImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        cupcakeImageImage.center = cupcakeImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( cupcakeImageImage.image ) {
              const startIndex = cupcakeImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = cupcakeImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const cupcakeImageImageImageElement = document.createElement( 'img' );
              cupcakeImageImageImageElement.src = newImageName;
              cupcakeImageImage.image = cupcakeImageImageImageElement;

              // Wait for the image to load before resolving              
              cupcakeImageImageImageElement.addEventListener( 'load', () => {
                resolve();
              } );
            }
            else {
              
              // No change, so resolve immediately
              resolve();
            }
          } );
        };
      
        
        // bring in the reference components so they are available in the control function
        
      
        // Sets the image scale to from the model component for scale
setScale( cupcakeScale );

// Sets the rotation from the model component
setRotation( cupcakeRotation );

// Sets the image center to match the model component for image position
setCenterX( cupcakePosition.x );
setCenterY( cupcakePosition.y );

      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, cupcakeImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'cupcakePosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'cupcakeRotation' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'cupcakeScale' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'leftTopBounds', 'centerTopBounds', 'rightTopBounds', 'leftCenterBounds', 'centerBounds', 'rightCenterBounds', 'leftBottomBounds', 'centerBottomBounds', 'rightBottomBounds', 'cupcakePosition' ], scratchpad.cupcakeBoundsDerivedPropertyObserverId );
      delete scratchpad.cupcakeBoundsDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'cupcakeBounds' );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.cupcakeImageImage );
      delete scratchpad.cupcakeImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'cupcakePosition', 'cupcakeRotation', 'cupcakeScale' ], scratchpad.cupcakeImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.cupcakeImageImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty81 = phet.paperLand.getModelComponent( 'cupcakePosition' );
    if ( modelProperty81 ) {
      modelProperty81.value = phet.paperLand.utils.getProgramCenter( points );
    }
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
  ctx.fillText('Movable Cupcake', canvas.width / 2, canvas.height / 2 + 20);
})();
