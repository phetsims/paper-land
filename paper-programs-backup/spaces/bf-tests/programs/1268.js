// Sound 4
// Keywords: speech, description, sound, marker
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const markerIsOn_Copy3 = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'markerIsOn_Copy3', markerIsOn_Copy3 );
    

      const soundPlaybackRate_Copy3 = new phet.axon.NumberProperty( 1, {
        range: new phet.dot.Range( 1, 3 )
      });
      phet.paperLand.addModelComponent( 'soundPlaybackRate_Copy3', soundPlaybackRate_Copy3 );
    

      const soundOutputLevel_Copy3 = new phet.axon.NumberProperty( 0.7, {
        range: new phet.dot.Range( 0, 1 )
      });
      phet.paperLand.addModelComponent( 'soundOutputLevel_Copy3', soundOutputLevel_Copy3 );
    

      const paperBounds_Copy3 = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'paperBounds_Copy3', paperBounds_Copy3 );
    

      // The array item can be created when all entry data and the array itself are available in the model.
      scratchpad.sound1Parameters_Copy3ItemObserverId = phet.paperLand.addMultiModelObserver(
        [ 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3', 'reportValuesArray' ],
        ( soundPlaybackRate_Copy3, soundOutputLevel_Copy3, reportValuesArray ) => {
        
          // Create the entry from the item schema.
          const sound1Parameters_Copy3ItemObject = { 
_latest_rate1: phet.paperLand.getModelComponent('soundPlaybackRate_Copy3').value,
get rate1() { return this._latest_rate1; },
set rate1(newValue) { phet.paperLand.getModelComponent('soundPlaybackRate_Copy3').value = newValue; },
_latest_level1: phet.paperLand.getModelComponent('soundOutputLevel_Copy3').value,
get level1() { return this._latest_level1; },
set level1(newValue) { phet.paperLand.getModelComponent('soundOutputLevel_Copy3').value = newValue; }
 };
        
          // Now that all dependencies are detected, this is where we may add the item for the first time.
          // If the model has a 'added' item reference, set this item to it.
          if ( phet.paperLand.getModelComponent( 'reportValuesArrayAddedItem' ) ) {
            phet.paperLand.getModelComponent( 'reportValuesArrayAddedItem' ).value = sound1Parameters_Copy3ItemObject;
          }
        
          // A callback that will replace the item in the array.
          scratchpad.replaceItem = () => {
          
            // A shallow copy of the array so that we can set it back to the Property and trigger listeners.
            const reportValuesArrayArray = phet.paperLand.getModelComponent( 'reportValuesArray' ).value.slice();
            
            const index = reportValuesArrayArray.indexOf( scratchpad.item );
            if ( index > -1 ) {
              reportValuesArrayArray.splice( index, 1 );
            }
            
            // Update the ItemObject values every time a component changes
            sound1Parameters_Copy3ItemObject._latest_rate1 = phet.paperLand.getModelComponent('soundPlaybackRate_Copy3').value;
sound1Parameters_Copy3ItemObject._latest_level1 = phet.paperLand.getModelComponent('soundOutputLevel_Copy3').value;

            
            scratchpad.item = sound1Parameters_Copy3ItemObject;
            
            // Add the item to the array, inserting it into the same index as the previous item
            // to be less disruptive to the array data.
            reportValuesArrayArray.splice( index, 0, scratchpad.item );
                        
            // Set the array back to the Property.
            phet.paperLand.getModelComponent( 'reportValuesArray' ).value = reportValuesArrayArray;
          };
        
          // For each linkable dependency, whenever the value changes we will recreate the item
          // and add it back to the array to trigger an array change so that the user can
          // easily register changes to the array in one place.
          [ 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3', 'reportValuesArray' ].forEach( dependencyName => {
          
            // Updating the array when the array itself is changed would be infinately reentrant.
            if ( dependencyName !== 'reportValuesArray' ) {
              const dependency = phet.paperLand.getModelComponent( dependencyName );
              dependency.link( scratchpad.replaceItem );
            }
          } );
        },
        () => {
        
          // Remove the item from the array as soon as any dependencies are removed (if it is still in the array)
          const reportValuesArrayArray = phet.paperLand.getModelComponent( 'reportValuesArray' );
          if ( reportValuesArrayArray ) {
            const arrayValue = reportValuesArrayArray.value;
            
            const index = arrayValue.indexOf( scratchpad.item );
            if ( index > -1 ) {
              arrayValue.splice( index, 1 );
              
              // Set the Property to a new array so that listeners are triggered.
              phet.paperLand.getModelComponent( 'reportValuesArray' ).value = arrayValue.slice();
              
              // Update the reference to the item that was just removed from the array, if the model has such a
              // component (it may have been removed by the user).
              if ( phet.paperLand.getModelComponent( 'reportValuesArrayRemovedItem' ) ) {
                phet.paperLand.getModelComponent( 'reportValuesArrayRemovedItem' ).value = scratchpad.item;
              }
            }
          }
          
          // detach listeners that will replace the item
          [ 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3', 'reportValuesArray' ].forEach( dependencyName => {
            const dependency = phet.paperLand.getModelComponent( dependencyName );
            if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
              dependency.unlink( scratchpad.replaceItem );
            }
          } );
        }
      ); 
    

      const markerIsOnSound_Copy3WrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/thunder.mp3' );
      const markerIsOnSound_Copy3SoundClip = new phet.tambo.SoundClip( markerIsOnSound_Copy3WrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( markerIsOnSound_Copy3SoundClip );
      scratchpad.markerIsOnSound_Copy3WrappedAudioBuffer = markerIsOnSound_Copy3WrappedAudioBuffer;
      
      let markerIsOnSound_Copy3StopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let markerIsOnSound_Copy3LastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.markerIsOnSound_Copy3WrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.markerIsOnSound_Copy3SoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'markerIsOn_Copy3', 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3' ], ( markerIsOn_Copy3, soundPlaybackRate_Copy3, soundOutputLevel_Copy3 ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              markerIsOnSound_Copy3SoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              markerIsOnSound_Copy3SoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !markerIsOnSound_Copy3SoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - markerIsOnSound_Copy3LastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !markerIsOnSound_Copy3SoundClip.isPlaying ) {
                  markerIsOnSound_Copy3SoundClip.play();
                }
                markerIsOnSound_Copy3LastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( markerIsOnSound_Copy3StopSoundTimeout ){
                  window.clearTimeout( markerIsOnSound_Copy3StopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  markerIsOnSound_Copy3StopSoundTimeout = window.setTimeout( () => {
                    markerIsOnSound_Copy3SoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( markerIsOnSound_Copy3StopSoundTimeout ){
                window.clearTimeout( markerIsOnSound_Copy3StopSoundTimeout );
              }
              markerIsOnSound_Copy3SoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            phet.paperLand.console.log(`${soundPlaybackRate_Copy3}`);
phet.paperLand.console.log(`${soundOutputLevel_Copy3}`);


if (markerIsOn_Copy3) {
    setPlaybackRate(soundPlaybackRate_Copy3);
    setOutputLevel(soundOutputLevel_Copy3);
    play();
} else {
    setPlaybackRate(1);
    setOutputLevel(0);
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.markerIsOnSound_Copy3WrappedAudioBuffer.audioBufferProperty.link( scratchpad.markerIsOnSound_Copy3WrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.markerIsOnSound_Copy3SoundClip = markerIsOnSound_Copy3SoundClip;
    

      // Create an image and add it to the view.
      let paperImage_Copy3ImageElement = document.createElement( 'img' );
      paperImage_Copy3ImageElement.src = 'media/images/paper-sound.png';
      const paperImage_Copy3Image = new phet.scenery.Image( paperImage_Copy3ImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const paperImage_Copy3ImageLoadProperty = new phet.axon.Property( 0 );
      paperImage_Copy3ImageElement.addEventListener( 'load', () => { paperImage_Copy3ImageLoadProperty.value = paperImage_Copy3ImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( paperImage_Copy3Image );
      scratchpad.paperImage_Copy3Image = paperImage_Copy3Image;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.paperImage_Copy3ImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'paperBounds_Copy3' ], async ( paperBounds_Copy3 ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        paperImage_Copy3Image.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        paperImage_Copy3Image.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        paperImage_Copy3Image.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        paperImage_Copy3Image.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        paperImage_Copy3Image.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        paperImage_Copy3Image.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        paperImage_Copy3Image.visible = visible;
      };
      
      const moveToFront = () => {
        paperImage_Copy3Image.moveToFront();
      };
      
      const moveToBack = () => {
        paperImage_Copy3Image.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        paperImage_Copy3Image.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const paperImage_Copy3ImageViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( paperImage_Copy3Image.localBounds.width || 1 ) / ( paperImage_Copy3Image.localBounds.height || 1 );

        const scaleX = paperImage_Copy3ImageViewBounds.width / ( paperImage_Copy3Image.localBounds.width || 1 );
        const scaleY = paperImage_Copy3ImageViewBounds.height / ( paperImage_Copy3Image.localBounds.height || 1 );

        if ( stretch ) {
          paperImage_Copy3Image.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          paperImage_Copy3Image.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        paperImage_Copy3Image.center = paperImage_Copy3ImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( paperImage_Copy3Image.image ) {
              const startIndex = paperImage_Copy3Image.image.src.indexOf( 'media/images/' );
              currentImageName = paperImage_Copy3Image.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const paperImage_Copy3ImageImageElement = document.createElement( 'img' );
              paperImage_Copy3ImageImageElement.src = newImageName;
              paperImage_Copy3Image.image = paperImage_Copy3ImageImageElement;

              // Wait for the image to load before resolving              
              paperImage_Copy3ImageImageElement.addEventListener( 'load', () => {
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
        
      
        matchBounds( paperBounds_Copy3, false );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, paperImage_Copy3ImageLoadProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'markerIsOn_Copy3' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'soundPlaybackRate_Copy3' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'soundOutputLevel_Copy3' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'paperBounds_Copy3' );
    

      // If the item is in the array still, remove it.
      const reportValuesArrayArray = phet.paperLand.getModelComponent( 'reportValuesArray' );
      if ( reportValuesArrayArray ) {
        const index = reportValuesArrayArray.value.indexOf( scratchpad.item );
        if ( index > -1 ) {
          reportValuesArrayArray.value.splice( index, 1 );
          
          // Set the Property to a new array so that listeners are triggered.
          phet.paperLand.getModelComponent( 'reportValuesArray' ).value = reportValuesArrayArray.value.slice();
          
          // Update the reference to the item that was just removed from the array, if the model has such a
          // component (it may have been removed by the user).
          if ( phet.paperLand.getModelComponent( 'reportValuesArrayRemovedItem' ) ) {
            phet.paperLand.getModelComponent( 'reportValuesArrayRemovedItem' ).value = scratchpad.item;
          }
        }
      }
      
      // detach listeners that will replace the item, if they are still on the dependencies
      [ 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3', 'reportValuesArray' ].forEach( dependencyName => {
        const dependency = phet.paperLand.getModelComponent( dependencyName );
        if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
          dependency.unlink( scratchpad.replaceItem );
        }
      } );
      
      // Detach the multiModelObserver listener.
      phet.paperLand.removeMultiModelObserver( [ 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3', 'reportValuesArray' ], scratchpad.sound1Parameters_Copy3ItemObserverId );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.markerIsOnSound_Copy3SoundClip );
      delete scratchpad.markerIsOnSound_Copy3SoundClip;
      
      scratchpad.markerIsOnSound_Copy3WrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.markerIsOnSound_Copy3WrappedAudioBufferListener );
      delete scratchpad.markerIsOnSound_Copy3WrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'markerIsOn_Copy3', 'soundPlaybackRate_Copy3', 'soundOutputLevel_Copy3' ], scratchpad.markerIsOnSound_Copy3SoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.markerIsOnSound_Copy3SoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.paperImage_Copy3Image );
      delete scratchpad.paperImage_Copy3Image;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'paperBounds_Copy3' ], scratchpad.paperImage_Copy3ImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.paperImage_Copy3ImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty349 = phet.paperLand.getModelComponent( 'paperBounds_Copy3' );
    if ( modelProperty349 ) {
      modelProperty349.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
    }

    const modelProperty352 = phet.paperLand.getModelComponent( 'soundPlaybackRate_Copy3' );
    if ( modelProperty352 ) {
      modelProperty352.value = modelProperty352.range.min + phet.paperLand.utils.getNormalizedProgramRotation( points ) * ( modelProperty352.range.max - modelProperty352.range.min );
    }

    const modelProperty353 = phet.paperLand.getModelComponent( 'soundOutputLevel_Copy3' );
    if ( modelProperty353 ) {
      modelProperty353.value = modelProperty353.range.min + ( 1 - phet.paperLand.utils.getProgramCenter( points ).y ) * ( modelProperty353.range.max - modelProperty353.range.min );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty354 = phet.paperLand.getModelComponent( 'markerIsOn_Copy3' );
    if ( modelProperty354 ) {
      modelProperty354.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty359 = phet.paperLand.getModelComponent( 'markerIsOn_Copy3' );
    if ( modelProperty359 ) {
      modelProperty359.value = markers.length > 0;
    }
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
        top: 0.1,
        right: 0.1,
        bottom: 0.1,
        left: 0.1
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
  ctx.fillText('Sound 4', canvas.width / 2, canvas.height / 2 + 20);
})();
