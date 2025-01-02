// Basic Markers
// Keywords: example, demo
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: General Template (templates)
// Program Description: An example of the marker functions. These functions are generally provided with
//                      an array of the added/removed/current markers. Each marker in that array has
//                      info of Jan Paul's Markers API, see https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    
    // Whenever a marker is added to the camera view
    scratchpad.globalMarkersAddedListener = addedMarkers => {
      phet.paperLand.console.log( `Added ${addedMarkers.length} marker(s) to camera` );
    };
    phet.paperLand.markersAddedEmitter.addListener( scratchpad.globalMarkersAddedListener );

    // Whenever a marker is removed from the camera view
    scratchpad.globalMarkersRemovedListener = removedMarkers => {
      phet.paperLand.console.log( `Removed ${removedMarkers.length} marker(s) from camera` );
    }
    phet.paperLand.markersRemovedEmitter.addListener( scratchpad.globalMarkersRemovedListener );

    // Whenever a marker moves, this function is called
    scratchpad.globalMarkersChangedPositionListener = movedMarkers => {
      phet.paperLand.console.log( `Moved ${movedMarkers.length} marker(s) in camera` );
    }
    phet.paperLand.markersChangedPositionEmitter.addListener( scratchpad.globalMarkersChangedPositionListener );
  };

  // When markers are specifically added to THIS program.
  const onProgramMarkersAdded = ( paperProgramNumber, currentPaperProgramPoints, scratchpad, sharedData, currentMarkersForProgram ) => {
    phet.paperLand.console.log( `${currentMarkersForProgram.length} marker(s) added to program ${paperProgramNumber}` );
  }

  // When markers are specifically removed from THIS program.
  const onProgramMarkersRemoved = ( paperProgramNumber, currentPaperProgramPoints, scratchpad, sharedData, currentMarkersForProgram ) => {
    phet.paperLand.console.log( `marker(s) removed from program ${paperProgramNumber}, ${currentMarkersForProgram.length} remain` );
  };

  // When markers are specifically moved on THIS program
  const onProgramMarkersChangedPosition = ( paperProgramNumber, currentPaperProgramPoints, scratchpad, sharedData, currentMarkersForProgram ) => {
    phet.paperLand.console.log( `${currentMarkersForProgram.length} markers(s) moved on program ${paperProgramNumber}!` );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Remove all the listeners when the program is removed.
    phet.paperLand.markersAddedEmitter.removeListener( scratchpad.globalMarkersAddedListener );
    phet.paperLand.markersRemovedEmitter.removeListener( scratchpad.globalMarkersRemovedListener );
    phet.paperLand.markersChangedPositionEmitter.removeListener( scratchpad.globalMarkersChangedPositionListener );
    delete scratchpad.globalMarkersAddedListener;
    delete scratchpad.globalMarkersRemovedListener;
    delete scratchpad.globalMarkersChangedPositionListener;
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
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
  ctx.fillText('Basic', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Markers', canvas.width / 2, canvas.height / 2 + 20);
})();
