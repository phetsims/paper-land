// Plant A
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const plantAWatering = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'plantAWatering', plantAWatering );
    

      const plantAPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'plantAPosition', plantAPosition );
    

      const plantAGrowthPhase = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 5 )
      });
      phet.paperLand.addModelComponent( 'plantAGrowthPhase', plantAGrowthPhase );
    

      const plantAWater = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'plantAWater', plantAWater );
    

      const plantAWateringSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/accordionBoxOpen.mp3' );
      const plantAWateringSoundSoundClip = new phet.tambo.SoundClip( plantAWateringSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( plantAWateringSoundSoundClip );
      scratchpad.plantAWateringSoundWrappedAudioBuffer = plantAWateringSoundWrappedAudioBuffer;
      
      let plantAWateringSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let plantAWateringSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.plantAWateringSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.plantAWateringSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantAWatering' ], ( plantAWatering ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              plantAWateringSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              plantAWateringSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !plantAWateringSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - plantAWateringSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !plantAWateringSoundSoundClip.isPlaying ) {
                  plantAWateringSoundSoundClip.play();
                }
                plantAWateringSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( plantAWateringSoundStopSoundTimeout ){
                  window.clearTimeout( plantAWateringSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  plantAWateringSoundStopSoundTimeout = window.setTimeout( () => {
                    plantAWateringSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( plantAWateringSoundStopSoundTimeout ){
                window.clearTimeout( plantAWateringSoundStopSoundTimeout );
              }
              plantAWateringSoundSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( plantAWatering ) {
    play();
}
          }, {
            lazy: false,
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.plantAWateringSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.plantAWateringSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.plantAWateringSoundSoundClip = plantAWateringSoundSoundClip;
    

      const plantAGrowthPhaseSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/trillOne.wav' );
      const plantAGrowthPhaseSoundSoundClip = new phet.tambo.SoundClip( plantAGrowthPhaseSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( plantAGrowthPhaseSoundSoundClip );
      scratchpad.plantAGrowthPhaseSoundWrappedAudioBuffer = plantAGrowthPhaseSoundWrappedAudioBuffer;
      
      let plantAGrowthPhaseSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let plantAGrowthPhaseSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.plantAGrowthPhaseSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.plantAGrowthPhaseSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantAGrowthPhase' ], ( plantAGrowthPhase ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              plantAGrowthPhaseSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              plantAGrowthPhaseSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !plantAGrowthPhaseSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - plantAGrowthPhaseSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !plantAGrowthPhaseSoundSoundClip.isPlaying ) {
                  plantAGrowthPhaseSoundSoundClip.play();
                }
                plantAGrowthPhaseSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( plantAGrowthPhaseSoundStopSoundTimeout ){
                  window.clearTimeout( plantAGrowthPhaseSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  plantAGrowthPhaseSoundStopSoundTimeout = window.setTimeout( () => {
                    plantAGrowthPhaseSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( plantAGrowthPhaseSoundStopSoundTimeout ){
                window.clearTimeout( plantAGrowthPhaseSoundStopSoundTimeout );
              }
              plantAGrowthPhaseSoundSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( plantAGrowthPhase > 0 && plantAGrowthPhase < 6 ) {
    play();
}
          }, {
            lazy: false,
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.plantAGrowthPhaseSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.plantAGrowthPhaseSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.plantAGrowthPhaseSoundSoundClip = plantAGrowthPhaseSoundSoundClip;
    

      // Create an image and add it to the view.
      let plantAImageImageElement = document.createElement( 'img' );
      plantAImageImageElement.src = 'media/images/baked.png';
      const plantAImageImage = new phet.scenery.Image( plantAImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const plantAImageImageLoadProperty = new phet.axon.Property( 0 );
      plantAImageImageElement.addEventListener( 'load', () => { plantAImageImageLoadProperty.value = plantAImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( plantAImageImage );
      scratchpad.plantAImageImage = plantAImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.plantAImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantAPosition', 'plantAGrowthPhase' ], async ( plantAPosition, plantAGrowthPhase ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        plantAImageImage.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        plantAImageImage.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        plantAImageImage.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        plantAImageImage.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        plantAImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        plantAImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        plantAImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        plantAImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        plantAImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        plantAImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const plantAImageImageViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( plantAImageImage.localBounds.width || 1 ) / ( plantAImageImage.localBounds.height || 1 );

        const scaleX = plantAImageImageViewBounds.width / ( plantAImageImage.localBounds.width || 1 );
        const scaleY = plantAImageImageViewBounds.height / ( plantAImageImage.localBounds.height || 1 );

        if ( stretch ) {
          plantAImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          plantAImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        plantAImageImage.center = plantAImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( plantAImageImage.image ) {
              const startIndex = plantAImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = plantAImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const plantAImageImageImageElement = document.createElement( 'img' );
              plantAImageImageImageElement.src = newImageName;
              plantAImageImage.image = plantAImageImageImageElement;

              // Wait for the image to load before resolving              
              plantAImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        setCenterX( plantAPosition.x );
setCenterY( plantAPosition.y );

if ( plantAGrowthPhase === 0 ) {
    await setImage( 'peace-lily1.png' );
}
else if ( plantAGrowthPhase === 1 ) {
    await setImage( 'peace-lily2.png' );
}
else if ( plantAGrowthPhase === 2 ) {
    await setImage( 'peace-lily3.png' );
}
else if ( plantAGrowthPhase === 3 ) {
    await setImage( 'peace-lily4.png' );
}
else if ( plantAGrowthPhase === 4 ) {
    await setImage( 'peace-lily5.png' );
}
else if ( plantAGrowthPhase === 5 ) {
    await setImage( 'peace-lily6.png' );
}
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, plantAImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    

      scratchpad.plantAWaterControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantAWatering' ], ( plantAWatering ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'plantAWater' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const plantAWater = phet.paperLand.getModelComponent( 'plantAWater' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setPlantAWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantAWater' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if ( plantAWatering ) {
    setPlantAWater( 10 );
}   
        }
      } );
    

      const waterAnimationControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'plantAWater' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const plantAWater = phet.paperLand.getModelComponent( 'plantAWater' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPlantAWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantAWater' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          const rate = 1; // Controls how fast the water level decreases
const amount = rate * dt; // Calculates the amount to decrease the water level by based on the time step

setPlantAWater(plantAWater - amount); // Decreases the water level by the calculated amount 
        }
      };
      scratchpad.waterAnimationControllerAnimationListener = waterAnimationControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( waterAnimationControllerAnimationListener );
      
    

      const growthPhaseControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'plantAGrowthPhase', 'plantAWater' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const plantAGrowthPhase = phet.paperLand.getModelComponent( 'plantAGrowthPhase' ).value;
const plantAWater = phet.paperLand.getModelComponent( 'plantAWater' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPlantAGrowthPhase = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantAGrowthPhase' );
        modelComponent.value = newValue;  
      }
      
const setPlantAWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantAWater' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
            if ( plantAWater > 0 ) {
    if(!window.lastUpdateTimeForA) {
        window.lastUpdateTimeForA = elapsedTime;
    }
    
    let timeSinceLastUpdate = elapsedTime - window.lastUpdateTimeForA;
    
    if (timeSinceLastUpdate >= 3) {
        setPlantAGrowthPhase(Math.min( plantAGrowthPhase + 1, 5 ) );
        window.lastUpdateTimeForA = elapsedTime;
    }
  }
 
        }
      };
      scratchpad.growthPhaseControllerAnimationListener = growthPhaseControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( growthPhaseControllerAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantAWatering' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantAPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantAGrowthPhase' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantAWater' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.plantAWateringSoundSoundClip );
      delete scratchpad.plantAWateringSoundSoundClip;
      
      scratchpad.plantAWateringSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.plantAWateringSoundWrappedAudioBufferListener );
      delete scratchpad.plantAWateringSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'plantAWatering' ], scratchpad.plantAWateringSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.plantAWateringSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.plantAGrowthPhaseSoundSoundClip );
      delete scratchpad.plantAGrowthPhaseSoundSoundClip;
      
      scratchpad.plantAGrowthPhaseSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.plantAGrowthPhaseSoundWrappedAudioBufferListener );
      delete scratchpad.plantAGrowthPhaseSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'plantAGrowthPhase' ], scratchpad.plantAGrowthPhaseSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.plantAGrowthPhaseSoundSoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.plantAImageImage );
      delete scratchpad.plantAImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'plantAPosition', 'plantAGrowthPhase' ], scratchpad.plantAImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.plantAImageImageMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'plantAWatering' ], scratchpad.plantAWaterControllerMultilinkId );
      delete scratchpad.plantAWaterControllerMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.waterAnimationControllerAnimationListener );
      delete scratchpad.waterAnimationControllerAnimationListener;
    

      phet.axon.stepTimer.removeListener( scratchpad.growthPhaseControllerAnimationListener );
      delete scratchpad.growthPhaseControllerAnimationListener;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty204 = phet.paperLand.getModelComponent( 'plantAPosition' );
    if ( modelProperty204 ) {
      modelProperty204.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty211 = phet.paperLand.getModelComponent( 'plantAWatering' );
    if ( modelProperty211 ) {
      modelProperty211.value = otherPaperNumber === 6;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty214 = phet.paperLand.getModelComponent( 'plantAWatering' );
    if ( modelProperty214 ) {
      modelProperty214.value = otherPaperNumber === 6 ? false : modelProperty214.value;
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
  ctx.fillText('Plant A', canvas.width / 2, canvas.height / 2 + 20);
})();
