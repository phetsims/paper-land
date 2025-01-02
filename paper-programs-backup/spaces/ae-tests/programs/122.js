// Physical marker tests - Copy
// Keywords: view

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Create view components (graphics, Voicing, sound, anything)
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    someFunctionWithATypo();
  };

  const onProgramChangedPosition = ( paperProgramNumber, scratchPad, sharedData ) => {
    someFunctionWithATypo();
  };

  // This is tear down code that removes the programs when phyical papers are removed 
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  };

  const onProgramMarkersAdded = ( programNumber, points, scratchpad, sharedData, markers ) => {
    phet.paperLand.console.log( markers );
  };

// Added from lunar lander markers
  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    const firstMarker = currentMarkers[ 0 ];
    if ( firstMarker ) {
      const height = 1 - firstMarker.positionOnPaper.y;
      phet.paperLand.console.log(${height});
      phet.paperLand.console.log( height, firstMarker.colorName );
    }
  };



  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString()
      }
    }
  } );

  //----------------------------------------------------------------------
  // Projector code
  //----------------------------------------------------------------------

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw the name of the program on the canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Physical', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Marker Tests', canvas.width / 2, canvas.height / 2 + 20);
})();



