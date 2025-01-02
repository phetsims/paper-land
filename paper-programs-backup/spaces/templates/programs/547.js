// PhET Checkbox
// Keywords: 
// Description: A sample checkbox with sound and description.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isEnabled = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isEnabled', isEnabled );
    

      const isFocused = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isFocused', isFocused );
    

      const centerPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0.5, 0.5 )
      );
      phet.paperLand.addModelComponent( 'centerPosition', centerPosition );
    

      const fontSize = new phet.axon.NumberProperty( 24, {
        range: new phet.dot.Range( 0, 48 )
      });
      phet.paperLand.addModelComponent( 'fontSize', fontSize );
    

      const checkboxLabel = new phet.axon.StringProperty( 'Force Values' );
      phet.paperLand.addModelComponent( 'checkboxLabel', checkboxLabel );
    

      // Speak the description whenever the dependencies change.
      const viewDescriptionForceValuesDescriptionFunction = ( isEnabled ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        viewDescriptionForceValuesDescription.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        viewDescriptionForceValuesDescription.centerY = y;
      };
      
      const setLeft = ( left ) => {
        viewDescriptionForceValuesDescription.left = left;
      };
      
      const setTop = ( top ) => {
        viewDescriptionForceValuesDescription.top = top;
      };
      
      const setScale = ( scale ) => {
        viewDescriptionForceValuesDescription.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        viewDescriptionForceValuesDescription.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        viewDescriptionForceValuesDescription.visible = visible;
      };
      
      const moveToFront = () => {
        viewDescriptionForceValuesDescription.moveToFront();
      };
      
      const moveToBack = () => {
        viewDescriptionForceValuesDescription.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        viewDescriptionForceValuesDescription.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const viewDescriptionForceValuesDescriptionViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( viewDescriptionForceValuesDescription.localBounds.width || 1 ) / ( viewDescriptionForceValuesDescription.localBounds.height || 1 );

        const scaleX = viewDescriptionForceValuesDescriptionViewBounds.width / ( viewDescriptionForceValuesDescription.localBounds.width || 1 );
        const scaleY = viewDescriptionForceValuesDescriptionViewBounds.height / ( viewDescriptionForceValuesDescription.localBounds.height || 1 );

        if ( stretch ) {
          viewDescriptionForceValuesDescription.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          viewDescriptionForceValuesDescription.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        viewDescriptionForceValuesDescription.center = viewDescriptionForceValuesDescriptionViewBounds.center;
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
          scratchpad.viewDescriptionForceValuesDescriptionUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.viewDescriptionForceValuesDescriptionUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if (isEnabled) {
  return "Force values shown in newtons.";
} 
else {
  return "Force values hidden."
}
      }
      
      // a reusable utterance for this description component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.viewDescriptionForceValuesDescriptionUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.viewDescriptionForceValuesDescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isEnabled' ], ( isEnabled ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const descriptionResult = viewDescriptionForceValuesDescriptionFunction( isEnabled );
        if ( descriptionResult && descriptionResult.toString ) {
          const descriptionString = descriptionResult.toString();
          if ( descriptionString && descriptionString.length > 0 ) {
            scratchpad.viewDescriptionForceValuesDescriptionUtterance.alert = descriptionString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.viewDescriptionForceValuesDescriptionUtterance ); 
          }
        }
      }, {
        lazy: true,
        otherReferences: [  ]
      } ); 
    

      // Speak the description whenever the dependencies change.
      const viewDescriptionForFocusDescriptionFunction = ( isFocused ) => {
      
        // get the additional reference constants so they are available in the control function
        const checkboxLabel = phet.paperLand.getModelComponent('checkboxLabel').value;
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        viewDescriptionForFocusDescription.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        viewDescriptionForFocusDescription.centerY = y;
      };
      
      const setLeft = ( left ) => {
        viewDescriptionForFocusDescription.left = left;
      };
      
      const setTop = ( top ) => {
        viewDescriptionForFocusDescription.top = top;
      };
      
      const setScale = ( scale ) => {
        viewDescriptionForFocusDescription.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        viewDescriptionForFocusDescription.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        viewDescriptionForFocusDescription.visible = visible;
      };
      
      const moveToFront = () => {
        viewDescriptionForFocusDescription.moveToFront();
      };
      
      const moveToBack = () => {
        viewDescriptionForFocusDescription.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        viewDescriptionForFocusDescription.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const viewDescriptionForFocusDescriptionViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( viewDescriptionForFocusDescription.localBounds.width || 1 ) / ( viewDescriptionForFocusDescription.localBounds.height || 1 );

        const scaleX = viewDescriptionForFocusDescriptionViewBounds.width / ( viewDescriptionForFocusDescription.localBounds.width || 1 );
        const scaleY = viewDescriptionForFocusDescriptionViewBounds.height / ( viewDescriptionForFocusDescription.localBounds.height || 1 );

        if ( stretch ) {
          viewDescriptionForFocusDescription.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          viewDescriptionForFocusDescription.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        viewDescriptionForFocusDescription.center = viewDescriptionForFocusDescriptionViewBounds.center;
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
          scratchpad.viewDescriptionForFocusDescriptionUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.viewDescriptionForFocusDescriptionUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if (isFocused){
    return checkboxLabel;
}
      }
      
      // a reusable utterance for this description component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.viewDescriptionForFocusDescriptionUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.viewDescriptionForFocusDescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isFocused' ], ( isFocused ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const descriptionResult = viewDescriptionForFocusDescriptionFunction( isFocused );
        if ( descriptionResult && descriptionResult.toString ) {
          const descriptionString = descriptionResult.toString();
          if ( descriptionString && descriptionString.length > 0 ) {
            scratchpad.viewDescriptionForFocusDescriptionUtterance.alert = descriptionString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.viewDescriptionForFocusDescriptionUtterance ); 
          }
        }
      }, {
        lazy: true,
        otherReferences: [ 'checkboxLabel' ]
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
const checkboxLabelA = phet.paperLand.getModelComponent(`checkboxLabel`);
const isEnabledA = phet.paperLand.getModelComponent(`isEnabled`);

const checkboxLabelText = new phet.scenery.Text(checkboxLabelA.value, {
    font: new phet.sceneryPhet.PhetFont(fontSizeA.value)
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
      phet.paperLand.removeModelComponent( 'centerPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'fontSize' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'checkboxLabel' );
    

      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'isEnabled' ], scratchpad.viewDescriptionForceValuesDescriptionMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.viewDescriptionForceValuesDescriptionMultilinkId;
      
      // Remove the utterance
      delete scratchpad.viewDescriptionForceValuesDescriptionUtterance;
    

      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'isFocused' ], scratchpad.viewDescriptionForFocusDescriptionMultilinkId, {
        otherReferences: [ 'checkboxLabel' ]
       } );
      delete scratchpad.viewDescriptionForFocusDescriptionMultilinkId;
      
      // Remove the utterance
      delete scratchpad.viewDescriptionForFocusDescriptionUtterance;
    

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
    
    const modelProperty0 = phet.paperLand.getModelComponent( 'centerPosition' );
    if ( modelProperty0 ) {
      modelProperty0.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty3 = phet.paperLand.getModelComponent( 'isFocused' );
    if ( modelProperty3 ) {
      modelProperty3.value = phet.paperLand.utils.getNormalizedProgramRotation( points ) > 0.25 && phet.paperLand.utils.getNormalizedProgramRotation( points ) < 0.75;
    }
const centerPosition = phet.paperLand.getModelComponent(`centerPosition`);
if (scratchpad.checkbox) {

    // Center the image based on the position of the paper.
    const centerPositionDisplayUnits = phet.paperLand.utils.paperToBoardCoordinates(centerPosition.value, sharedData.displaySize.width, sharedData.displaySize.height);
    scratchpad.checkbox.centerX = centerPositionDisplayUnits.x;
    scratchpad.checkbox.centerY = centerPositionDisplayUnits.y;
}
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty4 = phet.paperLand.getModelComponent( 'isEnabled' );
    if ( modelProperty4 ) {
      modelProperty4.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty8 = phet.paperLand.getModelComponent( 'isEnabled' );
    if ( modelProperty8 ) {
      modelProperty8.value = markers.length > 0;
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
  ctx.fillText('PhET Checkbox', canvas.width / 2, canvas.height / 2 + 20);
})();
