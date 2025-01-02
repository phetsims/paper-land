// P1 TORNADO
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isActiveCardP1Tornado = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isActiveCardP1Tornado', isActiveCardP1Tornado );
    

      const p1TornadoImgPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'p1TornadoImgPosition', p1TornadoImgPosition );
    

      const p1TornadoBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'p1TornadoBounds', p1TornadoBounds );
    

      // The array item can be created when all entry data and the array itself are available in the model.
      scratchpad.p1TornadoArrayItemsItemObserverId = phet.paperLand.addMultiModelObserver(
        [ 'isActiveCardP1Tornado', 'p1TornadoImgPosition', 'p1CardArray' ],
        ( isActiveCardP1Tornado, p1TornadoImgPosition, p1CardArray ) => {
        
          // Create the entry from the item schema.
          const p1TornadoArrayItemsItemObject = { 
_latest_active: phet.paperLand.getModelComponent('isActiveCardP1Tornado').value,
get active() { return this._latest_active; },
set active(newValue) { phet.paperLand.getModelComponent('isActiveCardP1Tornado').value = newValue; },
_latest_position: phet.paperLand.getModelComponent('p1TornadoImgPosition').value,
get position() { return this._latest_position; },
set position(newValue) { phet.paperLand.getModelComponent('p1TornadoImgPosition').value = newValue; }
 };
        
          // Now that all dependencies are detected, this is where we may add the item for the first time.
          // If the model has a 'added' item reference, set this item to it.
          if ( phet.paperLand.getModelComponent( 'p1CardArrayAddedItem' ) ) {
            phet.paperLand.getModelComponent( 'p1CardArrayAddedItem' ).value = p1TornadoArrayItemsItemObject;
          }
        
          // A callback that will replace the item in the array.
          scratchpad.replaceItem = () => {
          
            // A shallow copy of the array so that we can set it back to the Property and trigger listeners.
            const p1CardArrayArray = phet.paperLand.getModelComponent( 'p1CardArray' ).value.slice();
            
            const index = p1CardArrayArray.indexOf( scratchpad.item );
            if ( index > -1 ) {
              p1CardArrayArray.splice( index, 1 );
            }
            
            // Update the ItemObject values every time a component changes
            p1TornadoArrayItemsItemObject._latest_active = phet.paperLand.getModelComponent('isActiveCardP1Tornado').value;
p1TornadoArrayItemsItemObject._latest_position = phet.paperLand.getModelComponent('p1TornadoImgPosition').value;

            
            scratchpad.item = p1TornadoArrayItemsItemObject;
            
            // Add the item to the array, inserting it into the same index as the previous item
            // to be less disruptive to the array data.
            p1CardArrayArray.splice( index, 0, scratchpad.item );
                        
            // Set the array back to the Property.
            phet.paperLand.getModelComponent( 'p1CardArray' ).value = p1CardArrayArray;
          };
        
          // For each linkable dependency, whenever the value changes we will recreate the item
          // and add it back to the array to trigger an array change so that the user can
          // easily register changes to the array in one place.
          [ 'isActiveCardP1Tornado', 'p1TornadoImgPosition', 'p1CardArray' ].forEach( dependencyName => {
          
            // Updating the array when the array itself is changed would be infinately reentrant.
            if ( dependencyName !== 'p1CardArray' ) {
              const dependency = phet.paperLand.getModelComponent( dependencyName );
              dependency.link( scratchpad.replaceItem );
            }
          } );
        },
        () => {
        
          // Remove the item from the array as soon as any dependencies are removed (if it is still in the array)
          const p1CardArrayArray = phet.paperLand.getModelComponent( 'p1CardArray' );
          if ( p1CardArrayArray ) {
            const arrayValue = p1CardArrayArray.value;
            
            const index = arrayValue.indexOf( scratchpad.item );
            if ( index > -1 ) {
              arrayValue.splice( index, 1 );
              
              // Set the Property to a new array so that listeners are triggered.
              phet.paperLand.getModelComponent( 'p1CardArray' ).value = arrayValue.slice();
              
              // Update the reference to the item that was just removed from the array, if the model has such a
              // component (it may have been removed by the user).
              if ( phet.paperLand.getModelComponent( 'p1CardArrayRemovedItem' ) ) {
                phet.paperLand.getModelComponent( 'p1CardArrayRemovedItem' ).value = scratchpad.item;
              }
            }
          }
          
          // detach listeners that will replace the item
          [ 'isActiveCardP1Tornado', 'p1TornadoImgPosition', 'p1CardArray' ].forEach( dependencyName => {
            const dependency = phet.paperLand.getModelComponent( dependencyName );
            if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
              dependency.unlink( scratchpad.replaceItem );
            }
          } );
        }
      ); 
    

      // Create an image and add it to the view.
      let p1TornadoImageImageElement = document.createElement( 'img' );
      p1TornadoImageImageElement.src = 'media/images/uploads/tornado.gif';
      const p1TornadoImageImage = new phet.scenery.Image( p1TornadoImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const p1TornadoImageImageLoadProperty = new phet.axon.Property( 0 );
      p1TornadoImageImageElement.addEventListener( 'load', () => { p1TornadoImageImageLoadProperty.value = p1TornadoImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( p1TornadoImageImage );
      scratchpad.p1TornadoImageImage = p1TornadoImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.p1TornadoImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'p1TornadoImgPosition', 'p1TornadoBounds' ], async ( p1TornadoImgPosition, p1TornadoBounds ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        p1TornadoImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        p1TornadoImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        p1TornadoImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        p1TornadoImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        p1TornadoImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        p1TornadoImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        p1TornadoImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        p1TornadoImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        p1TornadoImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        p1TornadoImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const p1TornadoImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( p1TornadoImageImage.localBounds.width || 1 ) / ( p1TornadoImageImage.localBounds.height || 1 );

        const scaleX = p1TornadoImageImageViewBounds.width / ( p1TornadoImageImage.localBounds.width || 1 );
        const scaleY = p1TornadoImageImageViewBounds.height / ( p1TornadoImageImage.localBounds.height || 1 );

        if ( stretch ) {
          p1TornadoImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          p1TornadoImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        p1TornadoImageImage.center = p1TornadoImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( p1TornadoImageImage.image ) {
              const startIndex = p1TornadoImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = p1TornadoImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const p1TornadoImageImageImageElement = document.createElement( 'img' );
              p1TornadoImageImageImageElement.src = newImageName;
              p1TornadoImageImage.image = p1TornadoImageImageImageElement;

              // Wait for the image to load before resolving              
              p1TornadoImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        matchBounds( p1TornadoBounds, false );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, p1TornadoImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isActiveCardP1Tornado' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1TornadoImgPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1TornadoBounds' );
    

      // If the item is in the array still, remove it.
      const p1CardArrayArray = phet.paperLand.getModelComponent( 'p1CardArray' );
      if ( p1CardArrayArray ) {
        const index = p1CardArrayArray.value.indexOf( scratchpad.item );
        if ( index > -1 ) {
          p1CardArrayArray.value.splice( index, 1 );
          
          // Set the Property to a new array so that listeners are triggered.
          phet.paperLand.getModelComponent( 'p1CardArray' ).value = p1CardArrayArray.value.slice();
          
          // Update the reference to the item that was just removed from the array, if the model has such a
          // component (it may have been removed by the user).
          if ( phet.paperLand.getModelComponent( 'p1CardArrayRemovedItem' ) ) {
            phet.paperLand.getModelComponent( 'p1CardArrayRemovedItem' ).value = scratchpad.item;
          }
        }
      }
      
      // detach listeners that will replace the item, if they are still on the dependencies
      [ 'isActiveCardP1Tornado', 'p1TornadoImgPosition', 'p1CardArray' ].forEach( dependencyName => {
        const dependency = phet.paperLand.getModelComponent( dependencyName );
        if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
          dependency.unlink( scratchpad.replaceItem );
        }
      } );
      
      // Detach the multiModelObserver listener.
      phet.paperLand.removeMultiModelObserver( [ 'isActiveCardP1Tornado', 'p1TornadoImgPosition', 'p1CardArray' ], scratchpad.p1TornadoArrayItemsItemObserverId );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.p1TornadoImageImage );
      delete scratchpad.p1TornadoImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'p1TornadoImgPosition', 'p1TornadoBounds' ], scratchpad.p1TornadoImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.p1TornadoImageImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty40 = phet.paperLand.getModelComponent( 'p1TornadoImgPosition' );
    if ( modelProperty40 ) {
      modelProperty40.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty41 = phet.paperLand.getModelComponent( 'p1TornadoBounds' );
    if ( modelProperty41 ) {
      modelProperty41.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('P1 TORNADO', canvas.width / 2, canvas.height / 2 + 20);
})();
