// Watering Can
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const waterCanPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'waterCanPosition', waterCanPosition );
    

      // Create an image and add it to the view.
      let waterCanImageImageElement = document.createElement( 'img' );
      waterCanImageImageElement.src = 'media/images/water-can.png';
      const waterCanImageImage = new phet.scenery.Image( waterCanImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const waterCanImageImageLoadProperty = new phet.axon.Property( 0 );
      waterCanImageImageElement.addEventListener( 'load', () => { waterCanImageImageLoadProperty.value = waterCanImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( waterCanImageImage );
      scratchpad.waterCanImageImage = waterCanImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.waterCanImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'waterCanPosition' ], async ( waterCanPosition ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        waterCanImageImage.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        waterCanImageImage.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        waterCanImageImage.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        waterCanImageImage.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        waterCanImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        waterCanImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        waterCanImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        waterCanImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        waterCanImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        waterCanImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const waterCanImageImageViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( waterCanImageImage.localBounds.width || 1 ) / ( waterCanImageImage.localBounds.height || 1 );

        const scaleX = waterCanImageImageViewBounds.width / ( waterCanImageImage.localBounds.width || 1 );
        const scaleY = waterCanImageImageViewBounds.height / ( waterCanImageImage.localBounds.height || 1 );

        if ( stretch ) {
          waterCanImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          waterCanImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        waterCanImageImage.center = waterCanImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( waterCanImageImage.image ) {
              const startIndex = waterCanImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = waterCanImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const waterCanImageImageImageElement = document.createElement( 'img' );
              waterCanImageImageImageElement.src = newImageName;
              waterCanImageImage.image = waterCanImageImageImageElement;

              // Wait for the image to load before resolving              
              waterCanImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        setCenterX( waterCanPosition.x );
setCenterY( waterCanPosition.y );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, waterCanImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'waterCanPosition' );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.waterCanImageImage );
      delete scratchpad.waterCanImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'waterCanPosition' ], scratchpad.waterCanImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.waterCanImageImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty215 = phet.paperLand.getModelComponent( 'waterCanPosition' );
    if ( modelProperty215 ) {
      modelProperty215.value = phet.paperLand.utils.getProgramCenter( points );
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
        top: 0.02,
        right: 0.02,
        bottom: 0.02,
        left: 0.02
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
  ctx.fillText('Watering Can', canvas.width / 2, canvas.height / 2 + 20);
})();
