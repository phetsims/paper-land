// Plant C
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const plantCWatering = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'plantCWatering', plantCWatering );
    

      const plantCPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'plantCPosition', plantCPosition );
    

      const plantCGrowthPhase = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'plantCGrowthPhase', plantCGrowthPhase );
    

      const plantCWater = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'plantCWater', plantCWater );
    

      const plantCWateringSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/accordionBoxOpen.mp3' );
      const plantCWateringSoundSoundClip = new phet.tambo.SoundClip( plantCWateringSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( plantCWateringSoundSoundClip );
      scratchpad.plantCWateringSoundWrappedAudioBuffer = plantCWateringSoundWrappedAudioBuffer;
      
      let plantCWateringSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let plantCWateringSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.plantCWateringSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.plantCWateringSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantCWatering' ], ( plantCWatering ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              plantCWateringSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              plantCWateringSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !plantCWateringSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - plantCWateringSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !plantCWateringSoundSoundClip.isPlaying ) {
                  plantCWateringSoundSoundClip.play();
                }
                plantCWateringSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( plantCWateringSoundStopSoundTimeout ){
                  window.clearTimeout( plantCWateringSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  plantCWateringSoundStopSoundTimeout = window.setTimeout( () => {
                    plantCWateringSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( plantCWateringSoundStopSoundTimeout ){
                window.clearTimeout( plantCWateringSoundStopSoundTimeout );
              }
              plantCWateringSoundSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( plantCWatering ) {
    play();
}
          }, {
            lazy: false,
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.plantCWateringSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.plantCWateringSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.plantCWateringSoundSoundClip = plantCWateringSoundSoundClip;
    

      const plantCGrowthPhaseSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/trillOne.wav' );
      const plantCGrowthPhaseSoundSoundClip = new phet.tambo.SoundClip( plantCGrowthPhaseSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( plantCGrowthPhaseSoundSoundClip );
      scratchpad.plantCGrowthPhaseSoundWrappedAudioBuffer = plantCGrowthPhaseSoundWrappedAudioBuffer;
      
      let plantCGrowthPhaseSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let plantCGrowthPhaseSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.plantCGrowthPhaseSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.plantCGrowthPhaseSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantCGrowthPhase' ], ( plantCGrowthPhase ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              plantCGrowthPhaseSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              plantCGrowthPhaseSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !plantCGrowthPhaseSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - plantCGrowthPhaseSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !plantCGrowthPhaseSoundSoundClip.isPlaying ) {
                  plantCGrowthPhaseSoundSoundClip.play();
                }
                plantCGrowthPhaseSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( plantCGrowthPhaseSoundStopSoundTimeout ){
                  window.clearTimeout( plantCGrowthPhaseSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  plantCGrowthPhaseSoundStopSoundTimeout = window.setTimeout( () => {
                    plantCGrowthPhaseSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( plantCGrowthPhaseSoundStopSoundTimeout ){
                window.clearTimeout( plantCGrowthPhaseSoundStopSoundTimeout );
              }
              plantCGrowthPhaseSoundSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( plantCGrowthPhase > 0 && plantCGrowthPhase < 6 ) {
    play();
}
          }, {
            lazy: false,
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.plantCGrowthPhaseSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.plantCGrowthPhaseSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.plantCGrowthPhaseSoundSoundClip = plantCGrowthPhaseSoundSoundClip;
    

      // Create an image and add it to the view.
      let plantCImageImageElement = document.createElement( 'img' );
      plantCImageImageElement.src = 'media/images/baked.png';
      const plantCImageImage = new phet.scenery.Image( plantCImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const plantCImageImageLoadProperty = new phet.axon.Property( 0 );
      plantCImageImageElement.addEventListener( 'load', () => { plantCImageImageLoadProperty.value = plantCImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( plantCImageImage );
      scratchpad.plantCImageImage = plantCImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.plantCImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantCPosition', 'plantCGrowthPhase' ], async ( plantCPosition, plantCGrowthPhase ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        plantCImageImage.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        plantCImageImage.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        plantCImageImage.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        plantCImageImage.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        plantCImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        plantCImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        plantCImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        plantCImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        plantCImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        plantCImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const plantCImageImageViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( plantCImageImage.localBounds.width || 1 ) / ( plantCImageImage.localBounds.height || 1 );

        const scaleX = plantCImageImageViewBounds.width / ( plantCImageImage.localBounds.width || 1 );
        const scaleY = plantCImageImageViewBounds.height / ( plantCImageImage.localBounds.height || 1 );

        if ( stretch ) {
          plantCImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          plantCImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        plantCImageImage.center = plantCImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( plantCImageImage.image ) {
              const startIndex = plantCImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = plantCImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const plantCImageImageImageElement = document.createElement( 'img' );
              plantCImageImageImageElement.src = newImageName;
              plantCImageImage.image = plantCImageImageImageElement;

              // Wait for the image to load before resolving              
              plantCImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        setCenterX( plantCPosition.x );
setCenterY( plantCPosition.y );

if ( plantCGrowthPhase === 0 ) {
    await setImage( 'zz-plant1.png' );
}
else if ( plantCGrowthPhase === 1 ) {
    await setImage( 'zz-plant2.png' );
}
else if ( plantCGrowthPhase === 2 ) {
    await setImage( 'zz-plant3.png' );
}
else if ( plantCGrowthPhase === 3 ) {
    await setImage( 'zz-plant4.png' );
}
else if ( plantCGrowthPhase === 4 ) {
    await setImage( 'zz-plant5.png' );
}
else if ( plantCGrowthPhase === 5 ) {
    await setImage( 'zz-plant6.png' );
}
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, plantCImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    

      scratchpad.plantCWaterControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'plantCWatering' ], ( plantCWatering ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'plantCWater' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const plantCWater = phet.paperLand.getModelComponent( 'plantCWater' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setPlantCWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantCWater' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if ( plantCWatering ) {
    setPlantCWater( 10 );
}   
        }
      } );
    

      const plantCGrowthPhaseControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'plantCGrowthPhase', 'plantCWater' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const plantCGrowthPhase = phet.paperLand.getModelComponent( 'plantCGrowthPhase' ).value;
const plantCWater = phet.paperLand.getModelComponent( 'plantCWater' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPlantCGrowthPhase = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantCGrowthPhase' );
        modelComponent.value = newValue;  
      }
      
const setPlantCWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantCWater' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
            if ( plantCWater > 0 ) {
    if(!window.lastUpdateForC) {
        window.lastUpdateForC = elapsedTime;
    }
    
    let timeSinceLastUpdate = elapsedTime - window.lastUpdateForC;
    
    if (timeSinceLastUpdate >= 3) {
        setPlantCGrowthPhase(Math.min( plantCGrowthPhase + 1, 5 ) );
        window.lastUpdateForC = elapsedTime;
    }
  }
 
        }
      };
      scratchpad.plantCGrowthPhaseControllerAnimationListener = plantCGrowthPhaseControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( plantCGrowthPhaseControllerAnimationListener );
      
    

      const plantCWaterAnimationControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'plantCWater' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const plantCWater = phet.paperLand.getModelComponent( 'plantCWater' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPlantCWater = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'plantCWater' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          const rate = 1; // Controls how fast the water level decreases
const amount = rate * dt; // Calculates the amount to decrease the water level by based on the time step

setPlantCWater(plantCWater - amount); // Decreases the water level by the calculated amount 
        }
      };
      scratchpad.plantCWaterAnimationControllerAnimationListener = plantCWaterAnimationControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( plantCWaterAnimationControllerAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantCWatering' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantCPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantCGrowthPhase' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'plantCWater' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.plantCWateringSoundSoundClip );
      delete scratchpad.plantCWateringSoundSoundClip;
      
      scratchpad.plantCWateringSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.plantCWateringSoundWrappedAudioBufferListener );
      delete scratchpad.plantCWateringSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'plantCWatering' ], scratchpad.plantCWateringSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.plantCWateringSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.plantCGrowthPhaseSoundSoundClip );
      delete scratchpad.plantCGrowthPhaseSoundSoundClip;
      
      scratchpad.plantCGrowthPhaseSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.plantCGrowthPhaseSoundWrappedAudioBufferListener );
      delete scratchpad.plantCGrowthPhaseSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'plantCGrowthPhase' ], scratchpad.plantCGrowthPhaseSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.plantCGrowthPhaseSoundSoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.plantCImageImage );
      delete scratchpad.plantCImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'plantCPosition', 'plantCGrowthPhase' ], scratchpad.plantCImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.plantCImageImageMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'plantCWatering' ], scratchpad.plantCWaterControllerMultilinkId );
      delete scratchpad.plantCWaterControllerMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.plantCGrowthPhaseControllerAnimationListener );
      delete scratchpad.plantCGrowthPhaseControllerAnimationListener;
    

      phet.axon.stepTimer.removeListener( scratchpad.plantCWaterAnimationControllerAnimationListener );
      delete scratchpad.plantCWaterAnimationControllerAnimationListener;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty227 = phet.paperLand.getModelComponent( 'plantCPosition' );
    if ( modelProperty227 ) {
      modelProperty227.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty234 = phet.paperLand.getModelComponent( 'plantCWatering' );
    if ( modelProperty234 ) {
      modelProperty234.value = otherPaperNumber === 6;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty237 = phet.paperLand.getModelComponent( 'plantCWatering' );
    if ( modelProperty237 ) {
      modelProperty237.value = otherPaperNumber === 6 ? false : modelProperty237.value;
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
  ctx.fillText('Plant C', canvas.width / 2, canvas.height / 2 + 20);
})();
