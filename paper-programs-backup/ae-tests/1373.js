// Polygon Drawing Test
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

    //=================================================================================================================
    // Easily Changed Parameters

    const backgroundColor = 'rgb( 255, 155, 100)';
        
    //=================================================================================================================

    // Create a polygon and add it to the view.
    scene.addChild( new phet.scenery.Path( phet.kite.Shape.regularPolygon( 8, 25 ), {
  x: 64, y: 32,
  fill: '#88f',
  cursor: 'pointer', // classic hand
  pickable: true // since it wouldn't be hit-tested otherwise
} ) );

    // Create a rectangle and add it to the view.
    const backgroundRectangle = new phet.scenery.Rectangle( 10, 10, 400, 200, {
      fill: backgroundColor
    } );
    sharedData.scene.addChild( backgroundRectangle );
    backgroundRectangle.moveToBack();

    const circleRadius = sharedData.displaySize.width/4;


    scratchpad.circle = new phet.scenery.Circle( circleRadius, {
    fill: 'red',
    centerX: sharedData.displaySize.width / 2,
    centerY: sharedData.displaySize.height / 2
    });
    sharedData.scene.addChild( scratchpad.circle );

    // Assign to the scratchpad so that we can remove it later.
    scratchpad.backgroundRectangle = backgroundRectangle;

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

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramRemoved: onProgramRemoved.toString()
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






