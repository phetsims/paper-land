// P1 FIREBALL
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isActiveCardP1Fire = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isActiveCardP1Fire', isActiveCardP1Fire );
    

      const p1FireImgPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'p1FireImgPosition', p1FireImgPosition );
    

      const p1FireballBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'p1FireballBounds', p1FireballBounds );
    

      // The array item can be created when all entry data and the array itself are available in the model.
      scratchpad.p1FireArrayItemsItemObserverId = phet.paperLand.addMultiModelObserver(
        [ 'isActiveCardP1Fire', 'p1FireImgPosition', 'p1CardArray' ],
        ( isActiveCardP1Fire, p1FireImgPosition, p1CardArray ) => {
        
          // Create the entry from the item schema.
          const p1FireArrayItemsItemObject = { 
_latest_active: phet.paperLand.getModelComponent('isActiveCardP1Fire').value,
get active() { return this._latest_active; },
set active(newValue) { phet.paperLand.getModelComponent('isActiveCardP1Fire').value = newValue; },
_latest_position: phet.paperLand.getModelComponent('p1FireImgPosition').value,
get position() { return this._latest_position; },
set position(newValue) { phet.paperLand.getModelComponent('p1FireImgPosition').value = newValue; }
 };
        
          // Now that all dependencies are detected, this is where we may add the item for the first time.
          // If the model has a 'added' item reference, set this item to it.
          if ( phet.paperLand.getModelComponent( 'p1CardArrayAddedItem' ) ) {
            phet.paperLand.getModelComponent( 'p1CardArrayAddedItem' ).value = p1FireArrayItemsItemObject;
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
            p1FireArrayItemsItemObject._latest_active = phet.paperLand.getModelComponent('isActiveCardP1Fire').value;
p1FireArrayItemsItemObject._latest_position = phet.paperLand.getModelComponent('p1FireImgPosition').value;

            
            scratchpad.item = p1FireArrayItemsItemObject;
            
            // Add the item to the array, inserting it into the same index as the previous item
            // to be less disruptive to the array data.
            p1CardArrayArray.splice( index, 0, scratchpad.item );
                        
            // Set the array back to the Property.
            phet.paperLand.getModelComponent( 'p1CardArray' ).value = p1CardArrayArray;
          };
        
          // For each linkable dependency, whenever the value changes we will recreate the item
          // and add it back to the array to trigger an array change so that the user can
          // easily register changes to the array in one place.
          [ 'isActiveCardP1Fire', 'p1FireImgPosition', 'p1CardArray' ].forEach( dependencyName => {
          
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
          [ 'isActiveCardP1Fire', 'p1FireImgPosition', 'p1CardArray' ].forEach( dependencyName => {
            const dependency = phet.paperLand.getModelComponent( dependencyName );
            if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
              dependency.unlink( scratchpad.replaceItem );
            }
          } );
        }
      ); 
    

      // Create an image and add it to the view.
      let p1FireBallImageImageElement = document.createElement( 'img' );
      p1FireBallImageImageElement.src = 'media/images/uploads/fireball.gif';
      const p1FireBallImageImage = new phet.scenery.Image( p1FireBallImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const p1FireBallImageImageLoadProperty = new phet.axon.Property( 0 );
      p1FireBallImageImageElement.addEventListener( 'load', () => { p1FireBallImageImageLoadProperty.value = p1FireBallImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( p1FireBallImageImage );
      scratchpad.p1FireBallImageImage = p1FireBallImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.p1FireBallImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'p1FireballBounds' ], async ( p1FireballBounds ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        p1FireBallImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        p1FireBallImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        p1FireBallImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        p1FireBallImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        p1FireBallImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        p1FireBallImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        p1FireBallImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        p1FireBallImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        p1FireBallImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        p1FireBallImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const p1FireBallImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( p1FireBallImageImage.localBounds.width || 1 ) / ( p1FireBallImageImage.localBounds.height || 1 );

        const scaleX = p1FireBallImageImageViewBounds.width / ( p1FireBallImageImage.localBounds.width || 1 );
        const scaleY = p1FireBallImageImageViewBounds.height / ( p1FireBallImageImage.localBounds.height || 1 );

        if ( stretch ) {
          p1FireBallImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          p1FireBallImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        p1FireBallImageImage.center = p1FireBallImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( p1FireBallImageImage.image ) {
              const startIndex = p1FireBallImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = p1FireBallImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const p1FireBallImageImageImageElement = document.createElement( 'img' );
              p1FireBallImageImageImageElement.src = newImageName;
              p1FireBallImageImage.image = p1FireBallImageImageImageElement;

              // Wait for the image to load before resolving              
              p1FireBallImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        matchBounds( p1FireballBounds, false );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, p1FireBallImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const p1FireballOutlineShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const p1FireballOutlinePath = new phet.scenery.Path( p1FireballOutlineShape, {
        fill: 'transparent',
        stroke: 'gold',
        lineWidth: 2,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( p1FireballOutlinePath );
      scratchpad.p1FireballOutlinePath = p1FireballOutlinePath;
      
      // Update the shape when a dependency changes.
      scratchpad.p1FireballOutlinePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'p1FireballBounds' ], ( p1FireballBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const p1FireballOutlineShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.p1FireballOutlinePath.setShape( p1FireballOutlineShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.p1FireballOutlinePath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        p1FireballOutlinePath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        p1FireballOutlinePath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        p1FireballOutlinePath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        p1FireballOutlinePath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        p1FireballOutlinePath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        p1FireballOutlinePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        p1FireballOutlinePath.visible = visible;
      };
      
      const moveToFront = () => {
        p1FireballOutlinePath.moveToFront();
      };
      
      const moveToBack = () => {
        p1FireballOutlinePath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        p1FireballOutlinePath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const p1FireballOutlinePathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( p1FireballOutlinePath.localBounds.width || 1 ) / ( p1FireballOutlinePath.localBounds.height || 1 );

        const scaleX = p1FireballOutlinePathViewBounds.width / ( p1FireballOutlinePath.localBounds.width || 1 );
        const scaleY = p1FireballOutlinePathViewBounds.height / ( p1FireballOutlinePath.localBounds.height || 1 );

        if ( stretch ) {
          p1FireballOutlinePath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          p1FireballOutlinePath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        p1FireballOutlinePath.center = p1FireballOutlinePathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          p1FireballOutlinePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          p1FireballOutlinePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          p1FireballOutlinePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          p1FireballOutlinePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          p1FireballOutlinePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          p1FireballOutlinePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          p1FireballOutlinePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          p1FireballOutlinePath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          p1FireballOutlinePath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          p1FireballOutlinePath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( p1FireballBounds );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isActiveCardP1Fire' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1FireImgPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1FireballBounds' );
    

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
      [ 'isActiveCardP1Fire', 'p1FireImgPosition', 'p1CardArray' ].forEach( dependencyName => {
        const dependency = phet.paperLand.getModelComponent( dependencyName );
        if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
          dependency.unlink( scratchpad.replaceItem );
        }
      } );
      
      // Detach the multiModelObserver listener.
      phet.paperLand.removeMultiModelObserver( [ 'isActiveCardP1Fire', 'p1FireImgPosition', 'p1CardArray' ], scratchpad.p1FireArrayItemsItemObserverId );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.p1FireBallImageImage );
      delete scratchpad.p1FireBallImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'p1FireballBounds' ], scratchpad.p1FireBallImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.p1FireBallImageImageMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.p1FireballOutlinePath );
      delete scratchpad.p1FireballOutlinePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'p1FireballBounds' ], scratchpad.p1FireballOutlinePathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.p1FireballOutlinePathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty36 = phet.paperLand.getModelComponent( 'p1FireImgPosition' );
    if ( modelProperty36 ) {
      modelProperty36.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty37 = phet.paperLand.getModelComponent( 'p1FireballBounds' );
    if ( modelProperty37 ) {
      modelProperty37.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('P1 FIREBALL', canvas.width / 2, canvas.height / 2 + 20);
})();
