// Multimodal Checkbox
// Keywords: 
// Description: A sample checkbox with sound and voiced responses/ descriptions.
// 
// Copy the template into your own project, edit the String Model Components to try out your own name, hint, and checkbox responses. The hint response is optional. To not hear it, just remove it from the View component called voiceResponsesForFocus.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isEnabled = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isEnabled', isEnabled );
    

      const isFocused = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isFocused', isFocused );
    

      const visualPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0.5, 0.5 )
      );
      phet.paperLand.addModelComponent( 'visualPosition', visualPosition );
    

      const fontSize = new phet.axon.NumberProperty( 24, {
        range: new phet.dot.Range( 0, 48 )
      });
      phet.paperLand.addModelComponent( 'fontSize', fontSize );
    

      const checkboxNameResponse = new phet.axon.StringProperty( 'Force Values' );
      phet.paperLand.addModelComponent( 'checkboxNameResponse', checkboxNameResponse );
    

      const checkedResponse = new phet.axon.StringProperty( 'Shown in newtons.' );
      phet.paperLand.addModelComponent( 'checkedResponse', checkedResponse );
    

      const uncheckedResponse = new phet.axon.StringProperty( 'Hidden.' );
      phet.paperLand.addModelComponent( 'uncheckedResponse', uncheckedResponse );
    

      const checkboxHintResponse = new phet.axon.StringProperty( 'Explore with or without newtons.' );
      phet.paperLand.addModelComponent( 'checkboxHintResponse', checkboxHintResponse );
    

      const playCheckboxCheckedWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/uploads/checkboxChecked.mp3' );
      const playCheckboxCheckedSoundClip = new phet.tambo.SoundClip( playCheckboxCheckedWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( playCheckboxCheckedSoundClip );
      scratchpad.playCheckboxCheckedWrappedAudioBuffer = playCheckboxCheckedWrappedAudioBuffer;
      
      let playCheckboxCheckedStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let playCheckboxCheckedLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.playCheckboxCheckedWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.playCheckboxCheckedSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isEnabled' ], ( isEnabled ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              playCheckboxCheckedSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              playCheckboxCheckedSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !playCheckboxCheckedSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - playCheckboxCheckedLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !playCheckboxCheckedSoundClip.isPlaying ) {
                  playCheckboxCheckedSoundClip.play();
                }
                playCheckboxCheckedLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( playCheckboxCheckedStopSoundTimeout ){
                  window.clearTimeout( playCheckboxCheckedStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  playCheckboxCheckedStopSoundTimeout = window.setTimeout( () => {
                    playCheckboxCheckedSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( playCheckboxCheckedStopSoundTimeout ){
                window.clearTimeout( playCheckboxCheckedStopSoundTimeout );
              }
              playCheckboxCheckedSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if (isEnabled) {
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.playCheckboxCheckedWrappedAudioBuffer.audioBufferProperty.link( scratchpad.playCheckboxCheckedWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.playCheckboxCheckedSoundClip = playCheckboxCheckedSoundClip;
    

      const playCheckboxUncheckedWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/uploads/checkboxUnchecked.mp3' );
      const playCheckboxUncheckedSoundClip = new phet.tambo.SoundClip( playCheckboxUncheckedWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( playCheckboxUncheckedSoundClip );
      scratchpad.playCheckboxUncheckedWrappedAudioBuffer = playCheckboxUncheckedWrappedAudioBuffer;
      
      let playCheckboxUncheckedStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let playCheckboxUncheckedLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.playCheckboxUncheckedWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.playCheckboxUncheckedSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isEnabled' ], ( isEnabled ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              playCheckboxUncheckedSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              playCheckboxUncheckedSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !playCheckboxUncheckedSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - playCheckboxUncheckedLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !playCheckboxUncheckedSoundClip.isPlaying ) {
                  playCheckboxUncheckedSoundClip.play();
                }
                playCheckboxUncheckedLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( playCheckboxUncheckedStopSoundTimeout ){
                  window.clearTimeout( playCheckboxUncheckedStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  playCheckboxUncheckedStopSoundTimeout = window.setTimeout( () => {
                    playCheckboxUncheckedSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( playCheckboxUncheckedStopSoundTimeout ){
                window.clearTimeout( playCheckboxUncheckedStopSoundTimeout );
              }
              playCheckboxUncheckedSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if (isEnabled === false){
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.playCheckboxUncheckedWrappedAudioBuffer.audioBufferProperty.link( scratchpad.playCheckboxUncheckedWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.playCheckboxUncheckedSoundClip = playCheckboxUncheckedSoundClip;
    

      // Speak the description whenever the dependencies change.
      const voiceResponsesForChangesDescriptionFunction = ( isEnabled, checkboxNameResponse, checkedResponse, uncheckedResponse ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        voiceResponsesForChangesDescription.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        voiceResponsesForChangesDescription.centerY = y;
      };
      
      const setLeft = ( left ) => {
        voiceResponsesForChangesDescription.left = left;
      };
      
      const setTop = ( top ) => {
        voiceResponsesForChangesDescription.top = top;
      };
      
      const setScale = ( scale ) => {
        voiceResponsesForChangesDescription.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        voiceResponsesForChangesDescription.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        voiceResponsesForChangesDescription.visible = visible;
      };
      
      const moveToFront = () => {
        voiceResponsesForChangesDescription.moveToFront();
      };
      
      const moveToBack = () => {
        voiceResponsesForChangesDescription.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        voiceResponsesForChangesDescription.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const voiceResponsesForChangesDescriptionViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( voiceResponsesForChangesDescription.localBounds.width || 1 ) / ( voiceResponsesForChangesDescription.localBounds.height || 1 );

        const scaleX = voiceResponsesForChangesDescriptionViewBounds.width / ( voiceResponsesForChangesDescription.localBounds.width || 1 );
        const scaleY = voiceResponsesForChangesDescriptionViewBounds.height / ( voiceResponsesForChangesDescription.localBounds.height || 1 );

        if ( stretch ) {
          voiceResponsesForChangesDescription.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          voiceResponsesForChangesDescription.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        voiceResponsesForChangesDescription.center = voiceResponsesForChangesDescriptionViewBounds.center;
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
          scratchpad.voiceResponsesForChangesDescriptionUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.voiceResponsesForChangesDescriptionUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if (isEnabled) {
  return checkboxNameResponse + checkedResponse ;
} 
else {
  return checkboxNameResponse + uncheckedResponse ;
}
      }
      
      // a reusable utterance for this description component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.voiceResponsesForChangesDescriptionUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.voiceResponsesForChangesDescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isEnabled', 'checkboxNameResponse', 'checkedResponse', 'uncheckedResponse' ], ( isEnabled, checkboxNameResponse, checkedResponse, uncheckedResponse ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const descriptionResult = voiceResponsesForChangesDescriptionFunction( isEnabled, checkboxNameResponse, checkedResponse, uncheckedResponse );
        if ( descriptionResult && descriptionResult.toString ) {
          const descriptionString = descriptionResult.toString();
          if ( descriptionString && descriptionString.length > 0 ) {
            scratchpad.voiceResponsesForChangesDescriptionUtterance.alert = descriptionString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.voiceResponsesForChangesDescriptionUtterance ); 
          }
        }
      }, {
        lazy: true,
        otherReferences: [  ]
      } ); 
    

      // Speak the description whenever the dependencies change.
      const voiceResponsesForFocusDescriptionFunction = ( isFocused, checkboxHintResponse ) => {
      
        // get the additional reference constants so they are available in the control function
        const checkboxNameResponse = phet.paperLand.getModelComponent('checkboxNameResponse').value;
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        voiceResponsesForFocusDescription.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        voiceResponsesForFocusDescription.centerY = y;
      };
      
      const setLeft = ( left ) => {
        voiceResponsesForFocusDescription.left = left;
      };
      
      const setTop = ( top ) => {
        voiceResponsesForFocusDescription.top = top;
      };
      
      const setScale = ( scale ) => {
        voiceResponsesForFocusDescription.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        voiceResponsesForFocusDescription.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        voiceResponsesForFocusDescription.visible = visible;
      };
      
      const moveToFront = () => {
        voiceResponsesForFocusDescription.moveToFront();
      };
      
      const moveToBack = () => {
        voiceResponsesForFocusDescription.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        voiceResponsesForFocusDescription.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const voiceResponsesForFocusDescriptionViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( voiceResponsesForFocusDescription.localBounds.width || 1 ) / ( voiceResponsesForFocusDescription.localBounds.height || 1 );

        const scaleX = voiceResponsesForFocusDescriptionViewBounds.width / ( voiceResponsesForFocusDescription.localBounds.width || 1 );
        const scaleY = voiceResponsesForFocusDescriptionViewBounds.height / ( voiceResponsesForFocusDescription.localBounds.height || 1 );

        if ( stretch ) {
          voiceResponsesForFocusDescription.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          voiceResponsesForFocusDescription.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        voiceResponsesForFocusDescription.center = voiceResponsesForFocusDescriptionViewBounds.center;
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
          scratchpad.voiceResponsesForFocusDescriptionUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.voiceResponsesForFocusDescriptionUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if (isFocused){
    return ( checkboxNameResponse + checkboxHintResponse ) ;
}
      }
      
      // a reusable utterance for this description component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.voiceResponsesForFocusDescriptionUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.voiceResponsesForFocusDescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isFocused', 'checkboxHintResponse' ], ( isFocused, checkboxHintResponse ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const descriptionResult = voiceResponsesForFocusDescriptionFunction( isFocused, checkboxHintResponse );
        if ( descriptionResult && descriptionResult.toString ) {
          const descriptionString = descriptionResult.toString();
          if ( descriptionString && descriptionString.length > 0 ) {
            scratchpad.voiceResponsesForFocusDescriptionUtterance.alert = descriptionString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.voiceResponsesForFocusDescriptionUtterance ); 
          }
        }
      }, {
        lazy: true,
        otherReferences: [ 'checkboxNameResponse' ]
      } ); 
    

      // Create a background rectangle and add it to the view.
      const setBackgroundWhiteBackgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height, {
        fill: 'white'
      } );
      
      // If there are no dependencies for the background, add it to the view immediately. Otherwise, we will add it
      // once all dependencies are available.
      if ( [  ].length === 0 ) {
        sharedData.scene.addChild( setBackgroundWhiteBackgroundRectangle );
        setBackgroundWhiteBackgroundRectangle.moveToBack();
      }
      
      // Assign to the scratchpad so that we can remove it later.
      scratchpad.setBackgroundWhiteBackgroundRectangle = setBackgroundWhiteBackgroundRectangle;
  
      const setBackgroundWhiteBackgroundColorDependencies = [  ];

      // Get a new background color whenever a dependency changes. The control function should return a color string.
      const setBackgroundWhiteBackgroundFunction = (  ) => {
      
        // bring in the references so they are available in the control function
        
      
        
      }
      
      // Update the background rectangle whenever the dependencies change.
      scratchpad.setBackgroundWhiteBackgroundMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
    
        const backgroundColorString = setBackgroundWhiteBackgroundFunction(  );
        
        // wait to add the background until all dependencies are available (only add this once)
        if ( scratchpad.setBackgroundWhiteBackgroundRectangle.parents.length === 0 ) {
          sharedData.scene.addChild( setBackgroundWhiteBackgroundRectangle );
          setBackgroundWhiteBackgroundRectangle.moveToBack();
        }
        
        // the function may not be implemented
        if ( backgroundColorString ) {
          setBackgroundWhiteBackgroundRectangle.fill = backgroundColorString;
        }
        
        setBackgroundWhiteBackgroundRectangle.setRect( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
// Create a checkbox and add it to the scene.
const fontSizeA = phet.paperLand.getModelComponent(`fontSize`);
const checkboxLabelA = phet.paperLand.getModelComponent(`checkboxNameResponse`);
const isEnabledA = phet.paperLand.getModelComponent(`isEnabled`);

const checkboxLabelText = new phet.scenery.Text(checkboxLabelA.value, {
    font: new phet.sceneryPhet.PhetFont( fontSizeA.value )
});

const checkbox = new phet.sun.Checkbox(isEnabledA, checkboxLabelText);
sharedData.scene.addChild(checkbox);
scratchpad.checkbox = checkbox;
checkbox.moveToFront();
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isEnabled' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isFocused' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'visualPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'fontSize' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'checkboxNameResponse' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'checkedResponse' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'uncheckedResponse' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'checkboxHintResponse' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.playCheckboxCheckedSoundClip );
      delete scratchpad.playCheckboxCheckedSoundClip;
      
      scratchpad.playCheckboxCheckedWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.playCheckboxCheckedWrappedAudioBufferListener );
      delete scratchpad.playCheckboxCheckedWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'isEnabled' ], scratchpad.playCheckboxCheckedSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.playCheckboxCheckedSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.playCheckboxUncheckedSoundClip );
      delete scratchpad.playCheckboxUncheckedSoundClip;
      
      scratchpad.playCheckboxUncheckedWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.playCheckboxUncheckedWrappedAudioBufferListener );
      delete scratchpad.playCheckboxUncheckedWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'isEnabled' ], scratchpad.playCheckboxUncheckedSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.playCheckboxUncheckedSoundMultilinkId;
    

      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'isEnabled', 'checkboxNameResponse', 'checkedResponse', 'uncheckedResponse' ], scratchpad.voiceResponsesForChangesDescriptionMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.voiceResponsesForChangesDescriptionMultilinkId;
      
      // Remove the utterance
      delete scratchpad.voiceResponsesForChangesDescriptionUtterance;
    

      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'isFocused', 'checkboxHintResponse' ], scratchpad.voiceResponsesForFocusDescriptionMultilinkId, {
        otherReferences: [ 'checkboxNameResponse' ]
       } );
      delete scratchpad.voiceResponsesForFocusDescriptionMultilinkId;
      
      // Remove the utterance
      delete scratchpad.voiceResponsesForFocusDescriptionUtterance;
    

      // Remove the background rectangle from the view.
      sharedData.scene.removeChild( scratchpad.setBackgroundWhiteBackgroundRectangle );
      delete scratchpad.setBackgroundWhiteBackgroundRectangle;
      
      // Remove the multilink if there were any dependencies
      if ( scratchpad.setBackgroundWhiteBackgroundMultilinkId ) {
        phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.setBackgroundWhiteBackgroundMultilinkId, {
          otherReferences: [  ]
        } );
        delete scratchpad.setBackgroundWhiteBackgroundMultilinkId;
      }
    
if (scratchpad.checkbox) {
    sharedData.scene.removeChild(scratchpad.checkbox);
    scratchpad.checkbox = null;
}
else {
    alert('Error: Checkbox node not found in scratchpad data.');
}
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty0 = phet.paperLand.getModelComponent( 'visualPosition' );
    if ( modelProperty0 ) {
      modelProperty0.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty1 = phet.paperLand.getModelComponent( 'isEnabled' );
    if ( modelProperty1 ) {
      modelProperty1.value = phet.paperLand.utils.getNormalizedProgramRotation( points ) > 0.25 && phet.paperLand.utils.getNormalizedProgramRotation( points ) < 0.75;
    }
const visualPosition = phet.paperLand.getModelComponent(`visualPosition`);
if (scratchpad.checkbox) {

    // Center the image based on the position of the paper.
    const centerPositionDisplayUnits = phet.paperLand.utils.paperToBoardCoordinates(visualPosition.value, sharedData.displaySize.width, sharedData.displaySize.height);
    scratchpad.checkbox.centerX = centerPositionDisplayUnits.x;
    scratchpad.checkbox.centerY = centerPositionDisplayUnits.y;
}
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty5 = phet.paperLand.getModelComponent( 'isFocused' );
    if ( modelProperty5 ) {
      modelProperty5.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty9 = phet.paperLand.getModelComponent( 'isFocused' );
    if ( modelProperty9 ) {
      modelProperty9.value = markers.length > 0;
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
  ctx.fillText('Multimodal Checkbox', canvas.width / 2, canvas.height / 2 + 20);
})();
