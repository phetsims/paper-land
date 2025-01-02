// P2 TORNADO
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isActiveCardP2Tornado = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isActiveCardP2Tornado', isActiveCardP2Tornado );
    

      const p2TornadoImgPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'p2TornadoImgPosition', p2TornadoImgPosition );
    

      const p2TornadoBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'p2TornadoBounds', p2TornadoBounds );
    

      // The array item can be created when all entry data and the array itself are available in the model.
      scratchpad.p2TornadoArrayItemsItemObserverId = phet.paperLand.addMultiModelObserver(
        [ 'isActiveCardP2Tornado', 'p2TornadoImgPosition', 'p2CardArray' ],
        ( isActiveCardP2Tornado, p2TornadoImgPosition, p2CardArray ) => {
        
          // Create the entry from the item schema.
          const p2TornadoArrayItemsItemObject = { 
_latest_active: phet.paperLand.getModelComponent('isActiveCardP2Tornado').value,
get active() { return this._latest_active; },
set active(newValue) { phet.paperLand.getModelComponent('isActiveCardP2Tornado').value = newValue; },
_latest_position: phet.paperLand.getModelComponent('p2TornadoImgPosition').value,
get position() { return this._latest_position; },
set position(newValue) { phet.paperLand.getModelComponent('p2TornadoImgPosition').value = newValue; }
 };
        
          // Now that all dependencies are detected, this is where we may add the item for the first time.
          // If the model has a 'added' item reference, set this item to it.
          if ( phet.paperLand.getModelComponent( 'p2CardArrayAddedItem' ) ) {
            phet.paperLand.getModelComponent( 'p2CardArrayAddedItem' ).value = p2TornadoArrayItemsItemObject;
          }
        
          // A callback that will replace the item in the array.
          scratchpad.replaceItem = () => {
          
            // A shallow copy of the array so that we can set it back to the Property and trigger listeners.
            const p2CardArrayArray = phet.paperLand.getModelComponent( 'p2CardArray' ).value.slice();
            
            const index = p2CardArrayArray.indexOf( scratchpad.item );
            if ( index > -1 ) {
              p2CardArrayArray.splice( index, 1 );
            }
            
            // Update the ItemObject values every time a component changes
            p2TornadoArrayItemsItemObject._latest_active = phet.paperLand.getModelComponent('isActiveCardP2Tornado').value;
p2TornadoArrayItemsItemObject._latest_position = phet.paperLand.getModelComponent('p2TornadoImgPosition').value;

            
            scratchpad.item = p2TornadoArrayItemsItemObject;
            
            // Add the item to the array, inserting it into the same index as the previous item
            // to be less disruptive to the array data.
            p2CardArrayArray.splice( index, 0, scratchpad.item );
                        
            // Set the array back to the Property.
            phet.paperLand.getModelComponent( 'p2CardArray' ).value = p2CardArrayArray;
          };
        
          // For each linkable dependency, whenever the value changes we will recreate the item
          // and add it back to the array to trigger an array change so that the user can
          // easily register changes to the array in one place.
          [ 'isActiveCardP2Tornado', 'p2TornadoImgPosition', 'p2CardArray' ].forEach( dependencyName => {
          
            // Updating the array when the array itself is changed would be infinately reentrant.
            if ( dependencyName !== 'p2CardArray' ) {
              const dependency = phet.paperLand.getModelComponent( dependencyName );
              dependency.link( scratchpad.replaceItem );
            }
          } );
        },
        () => {
        
          // Remove the item from the array as soon as any dependencies are removed (if it is still in the array)
          const p2CardArrayArray = phet.paperLand.getModelComponent( 'p2CardArray' );
          if ( p2CardArrayArray ) {
            const arrayValue = p2CardArrayArray.value;
            
            const index = arrayValue.indexOf( scratchpad.item );
            if ( index > -1 ) {
              arrayValue.splice( index, 1 );
              
              // Set the Property to a new array so that listeners are triggered.
              phet.paperLand.getModelComponent( 'p2CardArray' ).value = arrayValue.slice();
              
              // Update the reference to the item that was just removed from the array, if the model has such a
              // component (it may have been removed by the user).
              if ( phet.paperLand.getModelComponent( 'p2CardArrayRemovedItem' ) ) {
                phet.paperLand.getModelComponent( 'p2CardArrayRemovedItem' ).value = scratchpad.item;
              }
            }
          }
          
          // detach listeners that will replace the item
          [ 'isActiveCardP2Tornado', 'p2TornadoImgPosition', 'p2CardArray' ].forEach( dependencyName => {
            const dependency = phet.paperLand.getModelComponent( dependencyName );
            if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
              dependency.unlink( scratchpad.replaceItem );
            }
          } );
        }
      ); 
    

      // Create an image and add it to the view.
      let p2TornadoImageImageElement = document.createElement( 'img' );
      p2TornadoImageImageElement.src = 'media/images/uploads/tornado.gif';
      const p2TornadoImageImage = new phet.scenery.Image( p2TornadoImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const p2TornadoImageImageLoadProperty = new phet.axon.Property( 0 );
      p2TornadoImageImageElement.addEventListener( 'load', () => { p2TornadoImageImageLoadProperty.value = p2TornadoImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( p2TornadoImageImage );
      scratchpad.p2TornadoImageImage = p2TornadoImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.p2TornadoImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'p2TornadoImgPosition', 'p2TornadoBounds' ], async ( p2TornadoImgPosition, p2TornadoBounds ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        p2TornadoImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        p2TornadoImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        p2TornadoImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        p2TornadoImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        p2TornadoImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        p2TornadoImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        p2TornadoImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        p2TornadoImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        p2TornadoImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        p2TornadoImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const p2TornadoImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( p2TornadoImageImage.localBounds.width || 1 ) / ( p2TornadoImageImage.localBounds.height || 1 );

        const scaleX = p2TornadoImageImageViewBounds.width / ( p2TornadoImageImage.localBounds.width || 1 );
        const scaleY = p2TornadoImageImageViewBounds.height / ( p2TornadoImageImage.localBounds.height || 1 );

        if ( stretch ) {
          p2TornadoImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          p2TornadoImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        p2TornadoImageImage.center = p2TornadoImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( p2TornadoImageImage.image ) {
              const startIndex = p2TornadoImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = p2TornadoImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const p2TornadoImageImageImageElement = document.createElement( 'img' );
              p2TornadoImageImageImageElement.src = newImageName;
              p2TornadoImageImage.image = p2TornadoImageImageImageElement;

              // Wait for the image to load before resolving              
              p2TornadoImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        matchBounds( p2TornadoBounds, false );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, p2TornadoImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isActiveCardP2Tornado' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2TornadoImgPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2TornadoBounds' );
    

      // If the item is in the array still, remove it.
      const p2CardArrayArray = phet.paperLand.getModelComponent( 'p2CardArray' );
      if ( p2CardArrayArray ) {
        const index = p2CardArrayArray.value.indexOf( scratchpad.item );
        if ( index > -1 ) {
          p2CardArrayArray.value.splice( index, 1 );
          
          // Set the Property to a new array so that listeners are triggered.
          phet.paperLand.getModelComponent( 'p2CardArray' ).value = p2CardArrayArray.value.slice();
          
          // Update the reference to the item that was just removed from the array, if the model has such a
          // component (it may have been removed by the user).
          if ( phet.paperLand.getModelComponent( 'p2CardArrayRemovedItem' ) ) {
            phet.paperLand.getModelComponent( 'p2CardArrayRemovedItem' ).value = scratchpad.item;
          }
        }
      }
      
      // detach listeners that will replace the item, if they are still on the dependencies
      [ 'isActiveCardP2Tornado', 'p2TornadoImgPosition', 'p2CardArray' ].forEach( dependencyName => {
        const dependency = phet.paperLand.getModelComponent( dependencyName );
        if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
          dependency.unlink( scratchpad.replaceItem );
        }
      } );
      
      // Detach the multiModelObserver listener.
      phet.paperLand.removeMultiModelObserver( [ 'isActiveCardP2Tornado', 'p2TornadoImgPosition', 'p2CardArray' ], scratchpad.p2TornadoArrayItemsItemObserverId );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.p2TornadoImageImage );
      delete scratchpad.p2TornadoImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'p2TornadoImgPosition', 'p2TornadoBounds' ], scratchpad.p2TornadoImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.p2TornadoImageImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty42 = phet.paperLand.getModelComponent( 'p2TornadoImgPosition' );
    if ( modelProperty42 ) {
      modelProperty42.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty43 = phet.paperLand.getModelComponent( 'p2TornadoBounds' );
    if ( modelProperty43 ) {
      modelProperty43.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('P2 TORNADO', canvas.width / 2, canvas.height / 2 + 20);
})();
