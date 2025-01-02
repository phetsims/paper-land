// Slider - Smooth Quantitative
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isFocused = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isFocused', isFocused );
    

      const nameResponseSmooth = new phet.axon.StringProperty( 'V, Voltage.' );
      phet.paperLand.addModelComponent( 'nameResponseSmooth', nameResponseSmooth );
    

      const sizeChangeParameters = new phet.axon.StringProperty( 'shrinks', {
        validValues: [ 'shrinks', 'grows' ]
      } );
      phet.paperLand.addModelComponent( 'sizeChangeParameters', sizeChangeParameters );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const contextResponse = new phet.axon.Property( null );
      scratchpad.contextResponseDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'sizeChangeParameters', 'currentValue' ], ( sizeChangeParameters, currentValue ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          const decimalPlaces = 1;
const factor = Math.pow(10, decimalPlaces);
return `As letter V ${sizeChangeParameters}, letter I ${sizeChangeParameters}. Current now ${Math.floor(currentValue * factor) / factor} milliamps.`;

        };
        contextResponse.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'contextResponse', contextResponse );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const objectResponseQuantitative = new phet.axon.Property( null );
      scratchpad.objectResponseQuantitativeDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'voltageValue' ], ( voltageValue ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          return `${Math.floor(voltageValue)} Volts.`
        };
        objectResponseQuantitative.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'objectResponseQuantitative', objectResponseQuantitative );
    

      // Speak whenever the dependencies change.
      const voiceContextResponsesSpeechFunction = ( contextResponse, objectResponseQuantitative ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        voiceContextResponsesSpeech.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        voiceContextResponsesSpeech.centerY = y;
      };
      
      const setLeft = ( left ) => {
        voiceContextResponsesSpeech.left = left;
      };
      
      const setTop = ( top ) => {
        voiceContextResponsesSpeech.top = top;
      };
      
      const setScale = ( scale ) => {
        voiceContextResponsesSpeech.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        voiceContextResponsesSpeech.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        voiceContextResponsesSpeech.visible = visible;
      };
      
      const moveToFront = () => {
        voiceContextResponsesSpeech.moveToFront();
      };
      
      const moveToBack = () => {
        voiceContextResponsesSpeech.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        voiceContextResponsesSpeech.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const voiceContextResponsesSpeechViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( voiceContextResponsesSpeech.localBounds.width || 1 ) / ( voiceContextResponsesSpeech.localBounds.height || 1 );

        const scaleX = voiceContextResponsesSpeechViewBounds.width / ( voiceContextResponsesSpeech.localBounds.width || 1 );
        const scaleY = voiceContextResponsesSpeechViewBounds.height / ( voiceContextResponsesSpeech.localBounds.height || 1 );

        if ( stretch ) {
          voiceContextResponsesSpeech.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          voiceContextResponsesSpeech.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        voiceContextResponsesSpeech.center = voiceContextResponsesSpeechViewBounds.center;
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
          scratchpad.voiceContextResponsesSpeechUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.voiceContextResponsesSpeechUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        return objectResponseQuantitative + contextResponse
      }
      
      // a reusable utterance for this speech component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.voiceContextResponsesSpeechUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.voiceContextResponsesSpeechMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'contextResponse', 'objectResponseQuantitative' ], ( contextResponse, objectResponseQuantitative ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const speechResult = voiceContextResponsesSpeechFunction( contextResponse, objectResponseQuantitative );
        if ( speechResult && speechResult.toString ) {
          const speechString = speechResult.toString();
          if ( speechString && speechString.length > 0 ) {
            scratchpad.voiceContextResponsesSpeechUtterance.alert = speechString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.voiceContextResponsesSpeechUtterance ); 
          }
        }
      }, {
        lazy: true,
        otherReferences: [  ]
      } ); 
    

      // Speak whenever the dependencies change.
      const voiceFocusedResponsesSpeechFunction = ( isFocused, nameResponseSmooth, objectResponseQuantitative ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        voiceFocusedResponsesSpeech.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        voiceFocusedResponsesSpeech.centerY = y;
      };
      
      const setLeft = ( left ) => {
        voiceFocusedResponsesSpeech.left = left;
      };
      
      const setTop = ( top ) => {
        voiceFocusedResponsesSpeech.top = top;
      };
      
      const setScale = ( scale ) => {
        voiceFocusedResponsesSpeech.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        voiceFocusedResponsesSpeech.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        voiceFocusedResponsesSpeech.visible = visible;
      };
      
      const moveToFront = () => {
        voiceFocusedResponsesSpeech.moveToFront();
      };
      
      const moveToBack = () => {
        voiceFocusedResponsesSpeech.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        voiceFocusedResponsesSpeech.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const voiceFocusedResponsesSpeechViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( voiceFocusedResponsesSpeech.localBounds.width || 1 ) / ( voiceFocusedResponsesSpeech.localBounds.height || 1 );

        const scaleX = voiceFocusedResponsesSpeechViewBounds.width / ( voiceFocusedResponsesSpeech.localBounds.width || 1 );
        const scaleY = voiceFocusedResponsesSpeechViewBounds.height / ( voiceFocusedResponsesSpeech.localBounds.height || 1 );

        if ( stretch ) {
          voiceFocusedResponsesSpeech.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          voiceFocusedResponsesSpeech.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        voiceFocusedResponsesSpeech.center = voiceFocusedResponsesSpeechViewBounds.center;
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
          scratchpad.voiceFocusedResponsesSpeechUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.voiceFocusedResponsesSpeechUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if (isFocused) {
    return nameResponseSmooth + objectResponseQuantitative
}
      }
      
      // a reusable utterance for this speech component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.voiceFocusedResponsesSpeechUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.voiceFocusedResponsesSpeechMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isFocused', 'nameResponseSmooth', 'objectResponseQuantitative' ], ( isFocused, nameResponseSmooth, objectResponseQuantitative ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const speechResult = voiceFocusedResponsesSpeechFunction( isFocused, nameResponseSmooth, objectResponseQuantitative );
        if ( speechResult && speechResult.toString ) {
          const speechString = speechResult.toString();
          if ( speechString && speechString.length > 0 ) {
            scratchpad.voiceFocusedResponsesSpeechUtterance.alert = speechString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.voiceFocusedResponsesSpeechUtterance ); 
          }
        }
      }, {
        lazy: true,
        otherReferences: [  ]
      } ); 
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isFocused' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'nameResponseSmooth' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'sizeChangeParameters' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'sizeChangeParameters', 'currentValue' ], scratchpad.contextResponseDerivedPropertyObserverId );
      delete scratchpad.contextResponseDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'contextResponse' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'voltageValue' ], scratchpad.objectResponseQuantitativeDerivedPropertyObserverId );
      delete scratchpad.objectResponseQuantitativeDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'objectResponseQuantitative' );
    

      // Remove the Speech multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'contextResponse', 'objectResponseQuantitative' ], scratchpad.voiceContextResponsesSpeechMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.voiceContextResponsesSpeechMultilinkId;
      
      // Remove the utterance
      delete scratchpad.voiceContextResponsesSpeechUtterance;
    

      // Remove the Speech multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'isFocused', 'nameResponseSmooth', 'objectResponseQuantitative' ], scratchpad.voiceFocusedResponsesSpeechMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.voiceFocusedResponsesSpeechMultilinkId;
      
      // Remove the utterance
      delete scratchpad.voiceFocusedResponsesSpeechUtterance;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty179 = phet.paperLand.getModelComponent( 'voltageValue' );
    if ( modelProperty179 ) {
      modelProperty179.value = modelProperty179.range.min + ( 1 - phet.paperLand.utils.getProgramCenter( points ).y ) * ( modelProperty179.range.max - modelProperty179.range.min );
    }

    const modelProperty180 = phet.paperLand.getModelComponent( 'sizeChangeParameters' );
    if ( modelProperty180 ) {
      modelProperty180.value = phet.paperLand.utils.getEnumerationValueFromProgramRotation( points, ["shrinks","grows"] );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty190 = phet.paperLand.getModelComponent( 'isFocused' );
    if ( modelProperty190 ) {
      modelProperty190.value = otherPaperNumber === 20;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty193 = phet.paperLand.getModelComponent( 'isFocused' );
    if ( modelProperty193 ) {
      modelProperty193.value = otherPaperNumber === 20 ? false : modelProperty193.value;
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
  ctx.fillText('Slider - Smooth Quantitative', canvas.width / 2, canvas.height / 2 + 20);
})();
