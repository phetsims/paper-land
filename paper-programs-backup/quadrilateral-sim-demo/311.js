// All Vertex Controller
// Keywords: controller
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: General Template (templates)
// Program Description: Controls all vertices of the quadrilateral, each vertex is a corner of the program.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Create a function that converts from paper points to positions usable by the sim. Paper
    // points have +y going down, so this gets the inverted y value and scales by display dimensions.
    // TODO: Shouldn't it be scaled by CAMERA dimensions?? Why display dimensions?
    scratchpad.pointToSimPosition = point => {
      return new phet.dot.Vector2( point.x * sharedData.displaySize.width, ( 1 - point.y ) * sharedData.displaySize.height );
    };
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {

    // Use each paper point to set each vertex positions. Paper points are ordered starting at the top left
    // and then moving clockwise. Just like quadrilateral! Before setting, each point is transformed into 
    // a value that the sim can use (scaled to screen dimensions and inverted y) - a function was added
    // to the scratchpad to support this.
    if ( sharedData.model.has( 'vertexAPositionProperty' ) ) {
      sharedData.model.get( 'vertexAPositionProperty' ).value = scratchpad.pointToSimPosition( positionPoints[ 0 ] );
    }
    if ( sharedData.model.has( 'vertexBPositionProperty' ) ) {
      sharedData.model.get( 'vertexBPositionProperty' ).value = scratchpad.pointToSimPosition( positionPoints[ 1 ] );
    }
    if ( sharedData.model.has( 'vertexCPositionProperty' ) ) {
      sharedData.model.get( 'vertexCPositionProperty' ).value = scratchpad.pointToSimPosition( positionPoints[ 2 ] );
    }
    if ( sharedData.model.has( 'vertexDPositionProperty' ) ) {
      sharedData.model.get( 'vertexDPositionProperty' ).value = scratchpad.pointToSimPosition( positionPoints[ 3 ] );
    }
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString()
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
  ctx.fillText('Hello', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('world', canvas.width / 2, canvas.height / 2 + 20);

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get('supporterCanvas');
  const supporterCtx = supporterCanvas.getContext('2d');

  // Repeat every 100 milliseconds.
  setInterval(async () => {
    // Get a list of all the papers.
    const papers = await paper.get('papers');

    // Clear out the supporter canvas. We get our own canvas, so we won't
    // interfere with other programs by doing this.
    supporterCtx.clearRect(0, 0, supporterCanvas.width, supporterCanvas.height);

    // Draw a circle in the center of our paper.
    const myCenter = papers[myPaperNumber].points.center;
    supporterCtx.fillStyle = supporterCtx.strokeStyle = 'rgb(0, 255, 255)';
    supporterCtx.beginPath();
    supporterCtx.arc(myCenter.x, myCenter.y, 10, 0, 2*Math.PI);
    supporterCtx.fill();

    // Draw a line from our paper to each other paper.
    Object.keys(papers).forEach(otherPaperNumber => {
      if (otherPaperNumber !== myPaperNumber) {
        const otherCenter = papers[otherPaperNumber].points.center;

        supporterCtx.beginPath();
        supporterCtx.moveTo(myCenter.x, myCenter.y);
        supporterCtx.lineTo(otherCenter.x, otherCenter.y);
        supporterCtx.stroke();
      }
    });
  }, 100);
})();
