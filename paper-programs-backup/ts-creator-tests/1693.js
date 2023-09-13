// Focus Whisker
// Keywords: focus
// Description: Move paper close to other program to mimic moving the focus to a new interaction.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty16 = phet.paperLand.getModelComponent( 'focusState' );
    if ( modelProperty16 ) {
      modelProperty16.value = true;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty19 = phet.paperLand.getModelComponent( 'focusState' );
    if ( modelProperty19 ) {
      modelProperty19.value = false;
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
  ctx.fillText('1693', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Focus Whisker', canvas.width / 2, canvas.height / 2 + 20);
})();
