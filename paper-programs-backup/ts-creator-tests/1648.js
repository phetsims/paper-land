// Voicing Checkbox
// Keywords: voicing, voicing responses, checkbox
// Description: A simple checkbox interaction to demonstrate the required responses for pointer- and focus-based input methods. Name & context responses are required; An optional hint response provides additional context for focus-based alternative input.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const checkboxState = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'checkboxState', checkboxState );
    

      const focusState = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'focusState', focusState );
    

      // Speak the description whenever the dependencies change.
      const checkboxResponsesDescriptionFunction = ( checkboxState ) => {
        // Name & Context Responses for checkbox.
return checkboxState ? 'Force Values, Shown in newtons.' : 'Force Values, Hidden.';
      }
      
      scratchpad.checkboxResponsesDescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'checkboxState' ], ( checkboxState ) => {
        const descriptionString = checkboxResponsesDescriptionFunction( checkboxState );
        phet.scenery.voicingUtteranceQueue.addToBack( descriptionString );
      } ); 
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'checkboxState' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'focusState' );
    

      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'checkboxState' ], scratchpad.checkboxResponsesDescriptionMultilinkId );
      delete scratchpad.checkboxResponsesDescriptionMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty2 = phet.paperLand.getModelComponent( 'checkboxState' );
    if ( modelProperty2 ) {
      modelProperty2.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty5 = phet.paperLand.getModelComponent( 'checkboxState' );
    if ( modelProperty5 ) {
      modelProperty5.value = markers.length > 0;
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
        onProgramSeparated: onProgramSeparated.toString()
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
  ctx.fillText('1648', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Voicing Checkbox', canvas.width / 2, canvas.height / 2 + 20);
})();
