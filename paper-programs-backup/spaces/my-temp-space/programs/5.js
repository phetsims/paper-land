// Sound D
// Keywords: speech, description, sound, marker
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const markerIsOnD = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'markerIsOnD', markerIsOnD );
    

      const simonDTrigger = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'simonDTrigger', simonDTrigger );
    

      const dPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'dPosition', dPosition );
    

      const dSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/c-tone.mp3' );
      const dSoundSoundClip = new phet.tambo.SoundClip( dSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( dSoundSoundClip );
      scratchpad.dSoundWrappedAudioBuffer = dSoundWrappedAudioBuffer;
      
      let dSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let dSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.dSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.dSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playersTurn', 'markerIsOnD' ], ( playersTurn, markerIsOnD ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              dSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              dSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !dSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - dSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !dSoundSoundClip.isPlaying ) {
                  dSoundSoundClip.play();
                }
                dSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( dSoundStopSoundTimeout ){
                  window.clearTimeout( dSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  dSoundStopSoundTimeout = window.setTimeout( () => {
                    dSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( dSoundStopSoundTimeout ){
                window.clearTimeout( dSoundStopSoundTimeout );
              }
              dSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( playersTurn && markerIsOnD ) {

    // It is the player's turn and they put a marker on this paper - play the tone.
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.dSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.dSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.dSoundSoundClip = dSoundSoundClip;
    

      const simonDSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/c-tone.mp3' );
      const simonDSoundSoundClip = new phet.tambo.SoundClip( simonDSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( simonDSoundSoundClip );
      scratchpad.simonDSoundWrappedAudioBuffer = simonDSoundWrappedAudioBuffer;
      
      let simonDSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let simonDSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.simonDSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.simonDSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'simonDTrigger' ], ( simonDTrigger ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              simonDSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              simonDSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !simonDSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - simonDSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !simonDSoundSoundClip.isPlaying ) {
                  simonDSoundSoundClip.play();
                }
                simonDSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( simonDSoundStopSoundTimeout ){
                  window.clearTimeout( simonDSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  simonDSoundStopSoundTimeout = window.setTimeout( () => {
                    simonDSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( simonDSoundStopSoundTimeout ){
                window.clearTimeout( simonDSoundStopSoundTimeout );
              }
              simonDSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( simonDTrigger ) {
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.simonDSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.simonDSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.simonDSoundSoundClip = simonDSoundSoundClip;
    

      // Create an image and add it to the view.
      let dImageImageElement = document.createElement( 'img' );
      dImageImageElement.src = 'media/images/uploads/plate.png';
      const dImageImage = new phet.scenery.Image( dImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const dImageImageLoadProperty = new phet.axon.Property( 0 );
      dImageImageElement.addEventListener( 'load', () => { dImageImageLoadProperty.value = dImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( dImageImage );
      scratchpad.dImageImage = dImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.dImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playersTurn', 'markerIsOnD', 'simonDTrigger', 'dPosition' ], async ( playersTurn, markerIsOnD, simonDTrigger, dPosition ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        dImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        dImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        dImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        dImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        dImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        dImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        dImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        dImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        dImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        dImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const dImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( dImageImage.localBounds.width || 1 ) / ( dImageImage.localBounds.height || 1 );

        const scaleX = dImageImageViewBounds.width / ( dImageImage.localBounds.width || 1 );
        const scaleY = dImageImageViewBounds.height / ( dImageImage.localBounds.height || 1 );

        if ( stretch ) {
          dImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          dImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        dImageImage.center = dImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( dImageImage.image ) {
              const startIndex = dImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = dImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const dImageImageImageElement = document.createElement( 'img' );
              dImageImageImageElement.src = newImageName;
              dImageImage.image = dImageImageImageElement;

              // Wait for the image to load before resolving              
              dImageImageImageElement.addEventListener( 'load', () => {
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
        
      
        if ( ( playersTurn && markerIsOnD ) || simonDTrigger ) {
    await setImage( 'uploads/garfield.png' );
}
else {
    await setImage( 'uploads/plate.png' );
}


setCenterX( dPosition.x );
setCenterY( dPosition.y );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, dImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    

      // Speak whenever the dependencies change.
      const dSpeechSpeechFunction = ( simonDTrigger ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        dSpeechSpeech.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        dSpeechSpeech.centerY = y;
      };
      
      const setLeft = ( left ) => {
        dSpeechSpeech.left = left;
      };
      
      const setTop = ( top ) => {
        dSpeechSpeech.top = top;
      };
      
      const setScale = ( scale ) => {
        dSpeechSpeech.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        dSpeechSpeech.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        dSpeechSpeech.visible = visible;
      };
      
      const moveToFront = () => {
        dSpeechSpeech.moveToFront();
      };
      
      const moveToBack = () => {
        dSpeechSpeech.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        dSpeechSpeech.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const dSpeechSpeechViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( dSpeechSpeech.localBounds.width || 1 ) / ( dSpeechSpeech.localBounds.height || 1 );

        const scaleX = dSpeechSpeechViewBounds.width / ( dSpeechSpeech.localBounds.width || 1 );
        const scaleY = dSpeechSpeechViewBounds.height / ( dSpeechSpeech.localBounds.height || 1 );

        if ( stretch ) {
          dSpeechSpeech.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          dSpeechSpeech.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        dSpeechSpeech.center = dSpeechSpeechViewBounds.center;
      };
      

      
        // Stop all speech and clear the queue
        const interruptSpeech = () => {
          phet.scenery.voicingUtteranceQueue.cancel();;
        };
        
        // Mute/unmute the utterance queue
        const setMuted = ( v ) => {
          phet.scenery.voicingUtteranceQueue.setMuted( v );
        };
        
        // Sets the priority of this utterance in the queue
        const setPriority = ( v ) => {
          scratchpad.dSpeechSpeechUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.dSpeechSpeechUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if ( simonDTrigger ) {
    return 'Down.'
}
      }
      
      // a reusable utterance for this speech component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.dSpeechSpeechUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.dSpeechSpeechMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'simonDTrigger' ], ( simonDTrigger ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const speechResult = dSpeechSpeechFunction( simonDTrigger );
        if ( speechResult && speechResult.toString ) {
          const speechString = speechResult.toString();
          if ( speechString && speechString.length > 0 ) {
            scratchpad.dSpeechSpeechUtterance.alert = speechString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.dSpeechSpeechUtterance ); 
          }
        }
      }, {
        lazy: false,
        otherReferences: [  ]
      } ); 
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'markerIsOnD' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'simonDTrigger' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'dPosition' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.dSoundSoundClip );
      delete scratchpad.dSoundSoundClip;
      
      scratchpad.dSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.dSoundWrappedAudioBufferListener );
      delete scratchpad.dSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'playersTurn', 'markerIsOnD' ], scratchpad.dSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.dSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.simonDSoundSoundClip );
      delete scratchpad.simonDSoundSoundClip;
      
      scratchpad.simonDSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.simonDSoundWrappedAudioBufferListener );
      delete scratchpad.simonDSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'simonDTrigger' ], scratchpad.simonDSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.simonDSoundSoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.dImageImage );
      delete scratchpad.dImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'playersTurn', 'markerIsOnD', 'simonDTrigger', 'dPosition' ], scratchpad.dImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.dImageImageMultilinkId;
    

      // Remove the Speech multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'simonDTrigger' ], scratchpad.dSpeechSpeechMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.dSpeechSpeechMultilinkId;
      
      // Remove the utterance
      delete scratchpad.dSpeechSpeechUtterance;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty901 = phet.paperLand.getModelComponent( 'dPosition' );
    if ( modelProperty901 ) {
      modelProperty901.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty904 = phet.paperLand.getModelComponent( 'markerIsOnD' );
    if ( modelProperty904 ) {
      modelProperty904.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty907 = phet.paperLand.getModelComponent( 'markerIsOnD' );
    if ( modelProperty907 ) {
      modelProperty907.value = markers.length > 0;
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
  ctx.fillText('Sound D', canvas.width / 2, canvas.height / 2 + 20);
})();
