// Circle location
// Keywords: simple, view, background, color
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: n/a
// Program Description: allows a marker to locate the center of a circle relative to the 
// position of the marker on the paper.  Parameterized in the x and y directions from 0 to 1

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    //=================================================================================================================
    // Easily Changed Parameters

    const backgroundColor = 'rgb( 255, 155, 100)';
    scratchpad.circleColor = '#000000';
    scratchpad.centerX = sharedData.displaySize.width / 2;
    scratchpad.centerY = sharedData.displaySize.height / 2;
    
    
    //=================================================================================================================

  // Create a rectangle and add it to the view.
   // const backgroundRectangle = new phet.scenery.Rectangle( 10, 10, 400, 200, {
   //   fill: backgroundColor
   // } );
   // sharedData.scene.addChild( backgroundRectangle );
   // backgroundRectangle.moveToBack();

  // Create a circle and add it to the view.  
  //scratchpad.circleRadius = sharedData.displaySize.height/2;

    //scratchpad.testCircle = new phet.scenery.Circle( scratchpad.circleRadius, {x:scratchpad.centerX, y:scratchpad.centerY,
      //fill: scratchpad.circleColor
    //} );
    //sharedData.scene.addChild(scratchpad.testCircle );

  };
 
  // Called when the program is removed.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Remove the background from the view.
    if ( scratchpad.backgroundRectangle ){
      sharedData.scene.removeChild( scratchpad.backgroundRectangle );
      scratchpad.backgroundRectangle = null;
    }
    if ( scratchpad.testCircle ){
      sharedData.scene.removeChild( scratchpad.testCircle );
      scratchpad.testCircle = null;
    }

    else {
      alert( 'Error: backgroundRectangle node not found in scratchpad data.' );
    }
  };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    const firstMarker = currentMarkers[0];
    if (firstMarker){
      const firstMarkerValueY = (firstMarker.positionOnPaper.y);
      const firstMarkerValueX = (firstMarker.positionOnPaper.x);
      //phet.paperLand.console.log('firstMarker is', firstMarkerValue);
    if ( scratchpad.testCircle ){
    sharedData.scene.removeChild( scratchpad.testCircle );
    }
    scratchpad.circleRadius = 25;
    scratchpad.circleCenterX = sharedData.displaySize.width * firstMarkerValueX;
    scratchpad.circleCenterY = sharedData.displaySize.height * firstMarkerValueY;
    scratchpad.testCircle = new phet.scenery.Circle( scratchpad.circleRadius, {x:scratchpad.circleCenterX, y:scratchpad.circleCenterY,
      fill: scratchpad.circleColor
    } );
    sharedData.scene.addChild(scratchpad.testCircle );

      // do the thing to scale the circle
      // the marker is parameterized from 0 to 1 on the y-axis

    };
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
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString()
      }
    }
  } );

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Add text to the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Add', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Background', canvas.width / 2, canvas.height / 2 + 20);
})();





