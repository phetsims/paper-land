// Hopping Frog
// Keywords: microbit, button
// Description: When triggered, buttonPressed boolean triggers an image change to animate a hopping frog (pair with BLE Button program).

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const buttonPressed = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'buttonPressed', buttonPressed );
    

      // Create a background rectangle and add it to the view.
      const blueBackgroundBackgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height, {
        fill: '#AFEEEE'
      } );
      
      // If there are no dependencies for the background, add it to the view immediately. Otherwise, we will add it
      // once all dependencies are available.
      if ( [  ].length === 0 ) {
        sharedData.scene.addChild( blueBackgroundBackgroundRectangle );
        blueBackgroundBackgroundRectangle.moveToBack();
      }
      
      // Assign to the scratchpad so that we can remove it later.
      scratchpad.blueBackgroundBackgroundRectangle = blueBackgroundBackgroundRectangle;
  
      const blueBackgroundBackgroundColorDependencies = [  ];

      // Get a new background color whenever a dependency changes. The control function should return a color string.
      const blueBackgroundBackgroundFunction = (  ) => {
      
        // bring in the references so they are available in the control function
        
      
        
      }
      
      // Update the background rectangle whenever the dependencies change.
      scratchpad.blueBackgroundBackgroundMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
    
        const backgroundColorString = blueBackgroundBackgroundFunction(  );
        
        // wait to add the background until all dependencies are available (only add this once)
        if ( scratchpad.blueBackgroundBackgroundRectangle.parents.length === 0 ) {
          sharedData.scene.addChild( blueBackgroundBackgroundRectangle );
          blueBackgroundBackgroundRectangle.moveToBack();
        }
        
        // the function may not be implemented
        if ( backgroundColorString ) {
          blueBackgroundBackgroundRectangle.fill = backgroundColorString;
        }
        
        blueBackgroundBackgroundRectangle.setRect( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    

      // Create an image and add it to the view.
      let hoppingImageImageElement = document.createElement( 'img' );
      hoppingImageImageElement.src = 'media/images/hopping-frog.gif';
      const hoppingImageImage = new phet.scenery.Image( hoppingImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const hoppingImageImageLoadProperty = new phet.axon.Property( 0 );
      hoppingImageImageElement.addEventListener( 'load', () => { hoppingImageImageLoadProperty.value = hoppingImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( hoppingImageImage );
      scratchpad.hoppingImageImage = hoppingImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.hoppingImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'buttonPressed' ], async ( buttonPressed ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        hoppingImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        hoppingImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        hoppingImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        hoppingImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        hoppingImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        hoppingImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        hoppingImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        hoppingImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        hoppingImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        hoppingImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const hoppingImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( hoppingImageImage.localBounds.width || 1 ) / ( hoppingImageImage.localBounds.height || 1 );

        const scaleX = hoppingImageImageViewBounds.width / ( hoppingImageImage.localBounds.width || 1 );
        const scaleY = hoppingImageImageViewBounds.height / ( hoppingImageImage.localBounds.height || 1 );

        if ( stretch ) {
          hoppingImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          hoppingImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        hoppingImageImage.center = hoppingImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( hoppingImageImage.image ) {
              const startIndex = hoppingImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = hoppingImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const hoppingImageImageImageElement = document.createElement( 'img' );
              hoppingImageImageImageElement.src = newImageName;
              hoppingImageImage.image = hoppingImageImageImageElement;

              // Wait for the image to load before resolving              
              hoppingImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        // hopping when button is pressed
setVisible( buttonPressed );

setCenterX( 0.5 );
setCenterY( 0.5 );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, hoppingImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    

      // Create an image and add it to the view.
      let idleImageImageElement = document.createElement( 'img' );
      idleImageImageElement.src = 'media/images/idle-frog.gif';
      const idleImageImage = new phet.scenery.Image( idleImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const idleImageImageLoadProperty = new phet.axon.Property( 0 );
      idleImageImageElement.addEventListener( 'load', () => { idleImageImageLoadProperty.value = idleImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( idleImageImage );
      scratchpad.idleImageImage = idleImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.idleImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'buttonPressed' ], async ( buttonPressed ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        idleImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        idleImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        idleImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        idleImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        idleImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        idleImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        idleImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        idleImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        idleImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        idleImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const idleImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( idleImageImage.localBounds.width || 1 ) / ( idleImageImage.localBounds.height || 1 );

        const scaleX = idleImageImageViewBounds.width / ( idleImageImage.localBounds.width || 1 );
        const scaleY = idleImageImageViewBounds.height / ( idleImageImage.localBounds.height || 1 );

        if ( stretch ) {
          idleImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          idleImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        idleImageImage.center = idleImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( idleImageImage.image ) {
              const startIndex = idleImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = idleImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const idleImageImageImageElement = document.createElement( 'img' );
              idleImageImageImageElement.src = newImageName;
              idleImageImage.image = idleImageImageImageElement;

              // Wait for the image to load before resolving              
              idleImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        // idle when not pressed - boolean is false
setVisible( !buttonPressed );

setCenterX( 0.5 );
setCenterY( 0.5 );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, idleImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'buttonPressed' );
    

      // Remove the background rectangle from the view.
      sharedData.scene.removeChild( scratchpad.blueBackgroundBackgroundRectangle );
      delete scratchpad.blueBackgroundBackgroundRectangle;
      
      // Remove the multilink if there were any dependencies
      if ( scratchpad.blueBackgroundBackgroundMultilinkId ) {
        phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.blueBackgroundBackgroundMultilinkId, {
          otherReferences: [  ]
        } );
        delete scratchpad.blueBackgroundBackgroundMultilinkId;
      }
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.hoppingImageImage );
      delete scratchpad.hoppingImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'buttonPressed' ], scratchpad.hoppingImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.hoppingImageImageMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.idleImageImage );
      delete scratchpad.idleImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'buttonPressed' ], scratchpad.idleImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.idleImageImageMultilinkId;
    
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
  ctx.fillText('Hopping Frog', canvas.width / 2, canvas.height / 2 + 20);
})();
