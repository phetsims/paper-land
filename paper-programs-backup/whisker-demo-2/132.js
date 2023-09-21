// Whiskers - Share Data A
// Keywords: 
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: 
// Program Description: This is a light. When connected to the source, it will light up.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    phet.paperLand.setProgramData( paperProgramNumber, 'myData', { value: 'A' } );
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  };

  const onProgramAdjacent = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} ${direction} of ${programNumber}` );
  };

  const onProgramSeparated = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} detached from ${programNumber} ${direction}` );
  };

  // Called when the program moves.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString()
      }
    }
  } );

  //----------------------------------------------------------------------
  // Projector code
  //----------------------------------------------------------------------

  const canvas = await paper.get('canvas');

  // Draw "Hello world" on the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Whisker A', canvas.width / 2, canvas.height / 2 - 10);

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get('supporterCanvas');
  const supporterCtx = supporterCanvas.getContext('2d');
})();




