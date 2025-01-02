// Plant B
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const plantBWatering = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'plantBWatering', plantBWatering );
    

      const plantBPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'plantBPosition', plantBPosition );
    

      const plantBGrowthPhase = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'plantBGrowthPhase', plantBGrowthPhase );
    

      const plantBWater = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'plantBWater', plantBWater );
    

      const plantBWateringSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/accordionBoxOpen.mp3' );
      const plantBWateringSoundSoundClip = new phet.tambo.SoundClip( plantBWateringSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( plantBWateringSoundSoundClip );
      scratchpad.plantBWateringSoundWrappedAudioBuffer = plantBWateringSoundWrappedAudioBuffer;
      
      let plantBWateringSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let plantBWateringSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.plantBWateringSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.plantBWateringSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantBWatering' ], ( plantBWatering ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              plantBWateringSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              plantBWateringSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !plantBWateringSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - plantBWateringSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !plantBWateringSoundSoundClip.isPlaying ) {
                  plantBWateringSoundSoundClip.play();
                }
                plantBWateringSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( plantBWateringSoundStopSoundTimeout ){
                  window.clearTimeout( plantBWateringSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  plantBWateringSoundStopSoundTimeout = window.setTimeout( () => {
                    plantBWateringSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( plantBWateringSoundStopSoundTimeout ){
                window.clearTimeout( plantBWateringSoundStopSoundTimeout );
              }
              plantBWateringSoundSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( plantBWatering ) {
    play();
}
          }, {
            lazy: false,
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.plantBWateringSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.plantBWateringSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.plantBWateringSoundSoundClip = plantBWateringSoundSoundClip;
    

      const plantBGrowthPhaseSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/trillOne.wav' );
      const plantBGrowthPhaseSoundSoundClip = new phet.tambo.SoundClip( plantBGrowthPhaseSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( plantBGrowthPhaseSoundSoundClip );
      scratchpad.plantBGrowthPhaseSoundWrappedAudioBuffer = plantBGrowthPhaseSoundWrappedAudioBuffer;
      
      let plantBGrowthPhaseSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let plantBGrowthPhaseSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.plantBGrowthPhaseSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.plantBGrowthPhaseSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantBGrowthPhase' ], ( plantBGrowthPhase ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              plantBGrowthPhaseSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              plantBGrowthPhaseSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !plantBGrowthPhaseSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - plantBGrowthPhaseSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !plantBGrowthPhaseSoundSoundClip.isPlaying ) {
                  plantBGrowthPhaseSoundSoundClip.play();
                }
                plantBGrowthPhaseSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( plantBGrowthPhaseSoundStopSoundTimeout ){
                  window.clearTimeout( plantBGrowthPhaseSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  plantBGrowthPhaseSoundStopSoundTimeout = window.setTimeout( () => {
                    plantBGrowthPhaseSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( plantBGrowthPhaseSoundStopSoundTimeout ){
                window.clearTimeout( plantBGrowthPhaseSoundStopSoundTimeout );
              }
              plantBGrowthPhaseSoundSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( plantBGrowthPhase > 0 && plantBGrowthPhase < 6 ) {
    play();
}
          }, {
            lazy: false,
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.plantBGrowthPhaseSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.plantBGrowthPhaseSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.plantBGrowthPhaseSoundSoundClip = plantBGrowthPhaseSoundSoundClip;
    

      // Create an image and add it to the view.
      let plantBImageImageElement = document.createElement( 'img' );
      plantBImageImageElement.src = 'media/images/baked.png';
      const plantBImageImage = new phet.scenery.Image( plantBImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const plantBImageImageLoadProperty = new phet.axon.Property( 0 );
      plantBImageImageElement.addEventListener( 'load', () => { plantBImageImageLoadProperty.value = plantBImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( plantBImageImage );
      scratchpad.plantBImageImage = plantBImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.plantBImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantBPosition', 'plantBGrowthPhase' ], async ( plantBPosition, plantBGrowthPhase ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        plantBImageImage.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        plantBImageImage.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        plantBImageImage.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        plantBImageImage.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        plantBImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        plantBImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        plantBImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        plantBImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        plantBImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        plantBImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const plantBImageImageViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( plantBImageImage.localBounds.width || 1 ) / ( plantBImageImage.localBounds.height || 1 );

        const scaleX = plantBImageImageViewBounds.width / ( plantBImageImage.localBounds.width || 1 );
        const scaleY = plantBImageImageViewBounds.height / ( plantBImageImage.localBounds.height || 1 );

        if ( stretch ) {
          plantBImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          plantBImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        plantBImageImage.center = plantBImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( plantBImageImage.image ) {
              const startIndex = plantBImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = plantBImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const plantBImageImageImageElement = document.createElement( 'img' );
              plantBImageImageImageElement.src = newImageName;
              plantBImageImage.image = plantBImageImageImageElement;

              // Wait for the image to load before resolving              
              plantBImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        setCenterX( plantBPosition.x );
setCenterY( plantBPosition.y );

if ( plantBGrowthPhase === 0 ) {
    await setImage( 'blue-orchid1.png' );
}
else if ( plantBGrowthPhase === 1 ) {
    await setImage( 'blue-orchid2.png' );
}
else if ( plantBGrowthPhase === 2 ) {
    await setImage( 'blue-orchid3.png' );
}
else if ( plantBGrowthPhase === 3 ) {
    await setImage( 'blue-orchid4.png' );
}
else if ( plantBGrowthPhase === 4 ) {
    await setImage( 'blue-orchid5.png' );
}
else if ( plantBGrowthPhase === 5 ) {
    await setImage( 'blue-orchid6.png' );
}
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, plantBImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    

      scratchpad.plantBWaterControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantBWatering' ], ( plantBWatering ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'plantBWater' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const plantBWater = phet.paperLand.getModelComponent( 'plantBWater' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setPlantBWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantBWater' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if ( plantBWatering ) {
    setPlantBWater( 10 );
}   
        }
      } );
    

      const plantBGrowthPhaseControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'plantBGrowthPhase', 'plantBWater' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const plantBGrowthPhase = phet.paperLand.getModelComponent( 'plantBGrowthPhase' ).value;
const plantBWater = phet.paperLand.getModelComponent( 'plantBWater' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPlantBGrowthPhase = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantBGrowthPhase' );
        modelComponent.value = newValue;  
      }
      
const setPlantBWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantBWater' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
            if ( plantBWater > 0 ) {
    if(!window.lastUpdateForB) {
        window.lastUpdateForB = elapsedTime;
    }
    
    let timeSinceLastUpdate = elapsedTime - window.lastUpdateForB;
    
    if (timeSinceLastUpdate >= 3) {
        setPlantBGrowthPhase(Math.min( plantBGrowthPhase + 1, 5 ) );
        window.lastUpdateForB = elapsedTime;
    }
  }
 
        }
      };
      scratchpad.plantBGrowthPhaseControllerAnimationListener = plantBGrowthPhaseControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( plantBGrowthPhaseControllerAnimationListener );
      
    

      const plantBWaterAnimationControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'plantBWater' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const plantBWater = phet.paperLand.getModelComponent( 'plantBWater' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPlantBWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantBWater' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          const rate = 1; // Controls how fast the water level decreases
const amount = rate * dt; // Calculates the amount to decrease the water level by based on the time step

setPlantBWater(plantBWater - amount); // Decreases the water level by the calculated amount 
        }
      };
      scratchpad.plantBWaterAnimationControllerAnimationListener = plantBWaterAnimationControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( plantBWaterAnimationControllerAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantBWatering' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantBPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantBGrowthPhase' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantBWater' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.plantBWateringSoundSoundClip );
      delete scratchpad.plantBWateringSoundSoundClip;
      
      scratchpad.plantBWateringSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.plantBWateringSoundWrappedAudioBufferListener );
      delete scratchpad.plantBWateringSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'plantBWatering' ], scratchpad.plantBWateringSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.plantBWateringSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.plantBGrowthPhaseSoundSoundClip );
      delete scratchpad.plantBGrowthPhaseSoundSoundClip;
      
      scratchpad.plantBGrowthPhaseSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.plantBGrowthPhaseSoundWrappedAudioBufferListener );
      delete scratchpad.plantBGrowthPhaseSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'plantBGrowthPhase' ], scratchpad.plantBGrowthPhaseSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.plantBGrowthPhaseSoundSoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.plantBImageImage );
      delete scratchpad.plantBImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'plantBPosition', 'plantBGrowthPhase' ], scratchpad.plantBImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.plantBImageImageMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'plantBWatering' ], scratchpad.plantBWaterControllerMultilinkId );
      delete scratchpad.plantBWaterControllerMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.plantBGrowthPhaseControllerAnimationListener );
      delete scratchpad.plantBGrowthPhaseControllerAnimationListener;
    

      phet.axon.stepTimer.removeListener( scratchpad.plantBWaterAnimationControllerAnimationListener );
      delete scratchpad.plantBWaterAnimationControllerAnimationListener;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty216 = phet.paperLand.getModelComponent( 'plantBPosition' );
    if ( modelProperty216 ) {
      modelProperty216.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty223 = phet.paperLand.getModelComponent( 'plantBWatering' );
    if ( modelProperty223 ) {
      modelProperty223.value = otherPaperNumber === 6;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty226 = phet.paperLand.getModelComponent( 'plantBWatering' );
    if ( modelProperty226 ) {
      modelProperty226.value = otherPaperNumber === 6 ? false : modelProperty226.value;
    }
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
  ctx.fillText('Plant B', canvas.width / 2, canvas.height / 2 + 20);
})();
