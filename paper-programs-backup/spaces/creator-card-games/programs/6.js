// P2 ICE STORM
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isActiveCardP2Ice = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isActiveCardP2Ice', isActiveCardP2Ice );
    

      const p2IceImgPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'p2IceImgPosition', p2IceImgPosition );
    

      const p2IceBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'p2IceBounds', p2IceBounds );
    

      // The array item can be created when all entry data and the array itself are available in the model.
      scratchpad.p2IceArrayItemsItemObserverId = phet.paperLand.addMultiModelObserver(
        [ 'isActiveCardP2Ice', 'p2IceImgPosition', 'p2CardArray' ],
        ( isActiveCardP2Ice, p2IceImgPosition, p2CardArray ) => {
        
          // Create the entry from the item schema.
          const p2IceArrayItemsItemObject = { 
_latest_active: phet.paperLand.getModelComponent('isActiveCardP2Ice').value,
get active() { return this._latest_active; },
set active(newValue) { phet.paperLand.getModelComponent('isActiveCardP2Ice').value = newValue; },
_latest_position: phet.paperLand.getModelComponent('p2IceImgPosition').value,
get position() { return this._latest_position; },
set position(newValue) { phet.paperLand.getModelComponent('p2IceImgPosition').value = newValue; }
 };
        
          // Now that all dependencies are detected, this is where we may add the item for the first time.
          // If the model has a 'added' item reference, set this item to it.
          if ( phet.paperLand.getModelComponent( 'p2CardArrayAddedItem' ) ) {
            phet.paperLand.getModelComponent( 'p2CardArrayAddedItem' ).value = p2IceArrayItemsItemObject;
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
            p2IceArrayItemsItemObject._latest_active = phet.paperLand.getModelComponent('isActiveCardP2Ice').value;
p2IceArrayItemsItemObject._latest_position = phet.paperLand.getModelComponent('p2IceImgPosition').value;

            
            scratchpad.item = p2IceArrayItemsItemObject;
            
            // Add the item to the array, inserting it into the same index as the previous item
            // to be less disruptive to the array data.
            p2CardArrayArray.splice( index, 0, scratchpad.item );
                        
            // Set the array back to the Property.
            phet.paperLand.getModelComponent( 'p2CardArray' ).value = p2CardArrayArray;
          };
        
          // For each linkable dependency, whenever the value changes we will recreate the item
          // and add it back to the array to trigger an array change so that the user can
          // easily register changes to the array in one place.
          [ 'isActiveCardP2Ice', 'p2IceImgPosition', 'p2CardArray' ].forEach( dependencyName => {
          
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
          [ 'isActiveCardP2Ice', 'p2IceImgPosition', 'p2CardArray' ].forEach( dependencyName => {
            const dependency = phet.paperLand.getModelComponent( dependencyName );
            if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
              dependency.unlink( scratchpad.replaceItem );
            }
          } );
        }
      ); 
    

      // Create an image and add it to the view.
      let p2IceStormImageImageElement = document.createElement( 'img' );
      p2IceStormImageImageElement.src = 'media/images/uploads/ice-storm.gif';
      const p2IceStormImageImage = new phet.scenery.Image( p2IceStormImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const p2IceStormImageImageLoadProperty = new phet.axon.Property( 0 );
      p2IceStormImageImageElement.addEventListener( 'load', () => { p2IceStormImageImageLoadProperty.value = p2IceStormImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( p2IceStormImageImage );
      scratchpad.p2IceStormImageImage = p2IceStormImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.p2IceStormImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'p2IceImgPosition', 'p2IceBounds' ], async ( p2IceImgPosition, p2IceBounds ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        p2IceStormImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        p2IceStormImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        p2IceStormImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        p2IceStormImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        p2IceStormImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        p2IceStormImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        p2IceStormImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        p2IceStormImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        p2IceStormImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        p2IceStormImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const p2IceStormImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( p2IceStormImageImage.localBounds.width || 1 ) / ( p2IceStormImageImage.localBounds.height || 1 );

        const scaleX = p2IceStormImageImageViewBounds.width / ( p2IceStormImageImage.localBounds.width || 1 );
        const scaleY = p2IceStormImageImageViewBounds.height / ( p2IceStormImageImage.localBounds.height || 1 );

        if ( stretch ) {
          p2IceStormImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          p2IceStormImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        p2IceStormImageImage.center = p2IceStormImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( p2IceStormImageImage.image ) {
              const startIndex = p2IceStormImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = p2IceStormImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const p2IceStormImageImageImageElement = document.createElement( 'img' );
              p2IceStormImageImageImageElement.src = newImageName;
              p2IceStormImageImage.image = p2IceStormImageImageImageElement;

              // Wait for the image to load before resolving              
              p2IceStormImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        matchBounds( p2IceBounds, false );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, p2IceStormImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isActiveCardP2Ice' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2IceImgPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2IceBounds' );
    

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
      [ 'isActiveCardP2Ice', 'p2IceImgPosition', 'p2CardArray' ].forEach( dependencyName => {
        const dependency = phet.paperLand.getModelComponent( dependencyName );
        if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
          dependency.unlink( scratchpad.replaceItem );
        }
      } );
      
      // Detach the multiModelObserver listener.
      phet.paperLand.removeMultiModelObserver( [ 'isActiveCardP2Ice', 'p2IceImgPosition', 'p2CardArray' ], scratchpad.p2IceArrayItemsItemObserverId );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.p2IceStormImageImage );
      delete scratchpad.p2IceStormImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'p2IceImgPosition', 'p2IceBounds' ], scratchpad.p2IceStormImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.p2IceStormImageImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty44 = phet.paperLand.getModelComponent( 'p2IceImgPosition' );
    if ( modelProperty44 ) {
      modelProperty44.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty45 = phet.paperLand.getModelComponent( 'p2IceBounds' );
    if ( modelProperty45 ) {
      modelProperty45.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('P2 ICE STORM', canvas.width / 2, canvas.height / 2 + 20);
})();
