// Marker testing - Copy
// Keywords: markers, callbacks, function
// ------------------------------- //
// Required Programs (dependencies) [none]
// Recommended Programs (work well with no modifications, but not necessary) [none]

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // a function that can be used when markers are added or removed from the program
    scratchpad.printColorCounts = currentMarkers => {
      const colorCounts = _.countBy( currentMarkers, 'colorName' );
      phet.paperLand.console.log(
        `1774 reports red: ${colorCounts[ 'red' ] || 0 }`,
        `1774 reports green: ${colorCounts[ 'green' ] || 0 }`,
        `1774 reports blue: ${colorCounts[ 'blue' ] || 0 }`,
        `1774 reports black: ${colorCounts[ 'black' ] || 0 }`
      );
    }
  };

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    const firstMarker = currentMarkers[ 0 ];
    if ( firstMarker ) {
      const height = 1 - firstMarker.positionOnPaper.y;
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
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString()
      }
    }
  } );

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw a message to the Canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(155,25,34)';
  ctx.fillText('PhET', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(155,25,34)';
  ctx.fillText('image', canvas.width / 2, canvas.height / 2 + 20);
})();



