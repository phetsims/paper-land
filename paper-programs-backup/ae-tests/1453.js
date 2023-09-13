// Multi Slider Color Changer
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
        `red: ${colorCounts[ 'red' ] || 0 }`,
        `green: ${colorCounts[ 'green' ] || 0 }`,
        `blue: ${colorCounts[ 'blue' ] || 0 }`,
        `black: ${colorCounts[ 'black' ] || 0 }`
      );

      console.log( currentMarkers.length );
    }
  };  //end onProgramAdded

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {
  };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.printColorCounts( currentMarkers );
  };

// 05.10.23 - use the y value as the marker position.  The y value is parameterized relative to the top and bottom of the rectangle.
  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    const firstMarker = currentMarkers[ 0 ];
    if ( firstMarker ) {
        //if (firstMarker.colorName === 'RED'){
          //const firstMarkerHeight = 1 - firstMarker.positionOnPaper.y;
          phet.paperLand.console.log('SCALED HEIGHT OF FIRST MARKER');
          //phet.paperLand.console.log( firstMarkerHeight, firstMarker.colorName );
        }
      }
    // 05.25.23 - generalize for multiple markers
    const secondMarker = currentMarkers[1];
    if (secondMarker) {
      const secondMarkerHeight = 1 - secondMarker.positionOnPaper.y;
      phet.paperLand.console.log( secondMarkerHeight, secondMarker.colorName );
    }

    const thirdMarker = currentMarkers[2];
    if (thirdMarker){
      thirdMarkerHeight = 1 - thirdMarker.positionOnPaper.y;
      phet.paperLand.console.log( thirdMarkerHeight, thirdMarker.colorName );
    }

// 05.25.23 - link the marker color to the value passed as RGB parameter
    //if (firstMarker.colorName == 'red') {
      //phet.paperLand.console.log('RED MARKER VALUE');
      //phet.paperLand.console.log(firstMarkerHeight);
    //} else if (firstMarker.colorName == 'green') {
      //phet.paperLand.console.log('GREEN MARKER VALUE');
      //scratchpad.valueGreen = firstMarkerHeight;
      //phet.paperLand.console.log(scratchpad.valueGreen);
      //} else if (firstMarker.colorName == 'blue') {
        //phet.paperLand.console.log('BLUE MARKER VALUE');
        //scratchpad.valueBlue = firstMarkerHeight;
        //phet.paperLand.console.log(scratchpad.valueBlue);
      //};

    //if (secondMarker.colorName == 'red') {
      //phet.paperLand.console.log('RED MARKER VALUE');
      //const valueRed = secondMarkerHeight;
      //phet.paperLand.console.log(valueRed);
    //} else if (secondMarker.colorName == 'green') {
      //phet.paperLand.console.log('GREEN MARKER VALUE');
      //const valueGreen = secondMarkerHeight;
      //phet.paperLand.console.log(valueGreen);
      //} else if (secondMarker.colorName == 'blue') {
        //phet.paperLand.console.log('BLUE MARKER VALUE');
        //const valueBlue = secondMarkerHeight;
        //phet.paperLand.console.log(valueBlue);
      //}

  };

///////////////////////////////////////////////////////

 
  // Called when the program is removed.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString()
      }
    }
  } );



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





