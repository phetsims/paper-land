// Line Drawing
// Keywords: simple, view, background, color
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: n/a
// Program Description: Shape testing

importScripts('paper.js');

(async () => {

// some notes 06.09.23
// it would probably make sense for a slider object (parameterized 0 to 1)
// sitting on top of this program to scale the corresponding shape.
// initialize the shape to be a set percentage of the display window
// and then at slider = 1, shape is full size of display window.


  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
scratchpad.lineEndpoint1x = 0;
scratchpad.lineEndpoint1y = 0;
scratchpad.lineEndpoint2x = 0;
scratchpad.lineEndpoint2y = 0;

  // really should put this on scratchpad to remove later but this is a quick test
 //   scene.addChild( new phet.scenery.Line( 8, 8, 56, 56, {
 // stroke: 'red', lineWidth: 5, lineCap: 'round'
 // } ) );
  };

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {
          // these values are normalized within the camera window
      phet.paperLand.console.log( 'test' );
      
// Find the initial paper size, and the initial radius of the circle.
  const initialPaperWidth = positionPoints[ 2 ].x - positionPoints[ 0 ].x;
  const initialPaperHeight = positionPoints[ 2 ].y - positionPoints[ 0 ].y;
  const initialPaperArea = initialPaperWidth * initialPaperHeight;
  phet.paperLand.console.log( 'initialPaperArea: ', initialPaperArea);

      
      
      const paperWidth = positionPoints[ 2 ].x - positionPoints[ 0 ].x;
      const paperHeight = positionPoints[ 2 ].y - positionPoints[ 0 ].y;
      const area = paperWidth * paperHeight;
      phet.paperLand.console.log( 'width: ', paperWidth);
      phet.paperLand.console.log( 'height: ', paperHeight );
     // if ( scratchpad.backgroundRectangle ){
      //sharedData.scene.removeChild( scratchpad.backgroundRectangle );
      //scratchpad.backgroundRectangle = null;
   // }
 };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );

  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //if there's only a single marker, the line is "anchored" at the upper left (0,0)

    phet.paperLand.console.log('inside onProgramMarkersChangedPosition');
    const firstMarker = currentMarkers[0];
    if (firstMarker){
      scratchpad.lineEndpoint1x = sharedData.displaySize.width * firstMarker.positionOnPaper.x;
      scratchpad.lineEndpoint1y = sharedData.displaySize.height * firstMarker.positionOnPaper.y;
      phet.paperLand.console.log('lineEndpoint1x is', scratchpad.lineEndpoint1x);
    };

    const secondMarker = currentMarkers[1];
    if (secondMarker){
      scratchpad.lineEndpoint2x = sharedData.displaySize.width * secondMarker.positionOnPaper.x;
      scratchpad.lineEndpoint2y = sharedData.displaySize.height * secondMarker.positionOnPaper.y;
      //phet.paperLand.console.log('lineEndpoint1x is', scratchpad.lineEndpoint1x);
    };

    // get the color of the line
    const model = sharedData.model;
    if ( model.has( 'lineColorProperty' ) ) {
      //phet.paperLand.console.log('inside circleColorProperty in prog 1859');
      scratchpad.lineColor = model.get( 'lineColorProperty' );
      //phet.paperLand.console.log('line 118, prog 1859', scratchpad.circleColor);
      //phet.paperLand.console.log('current circle color is', circleColorProperty.value);
    }

    if ( scratchpad.testLine ){
    sharedData.scene.removeChild( scratchpad.testLine );
    };
    scratchpad.testLine = new phet.scenery.Line( scratchpad.lineEndpoint1x, scratchpad.lineEndpoint1y, scratchpad.lineEndpoint2x, scratchpad.lineEndpoint2y, {stroke: scratchpad.lineColor, lineWidth:5, lineCap:'round'
    } );
    sharedData.scene.addChild(scratchpad.testLine );

  };

  // Called when the program is removed.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    // add cleanup here
    if ( scratchpad.testLine ){
    sharedData.scene.removeChild( scratchpad.testLine );
    };
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
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
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






