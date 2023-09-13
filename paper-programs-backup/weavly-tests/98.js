// Backward 1
// Keywords: weavly
// =============================== //
// Program Dependencies:
// Recommended Programs: 
// Program Description: 

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( programNumber, scratchpad, sharedData ) => {
      const connectionElement = new phet.paperLand.SingleChildConnectionElement();
      phet.paperLand.addModelComponent( `${programNumber}-connectionElement`, connectionElement );
      phet.paperLand.setProgramData( programNumber, 'connectionElement', connectionElement );

      connectionElement.setElementData( 'backward1' );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( programNumber, scratchpad, sharedData ) => {
    phet.paperLand.removeModelComponent( `${programNumber}-connectionElement` );
    phet.paperLand.removeProgramData( programNumber, 'connectionElement' );
  };

  const onProgramAdjacent = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} ${direction} of ${programNumber}` );

    // Look at the other program and see if it has a ConnectionElement to connect to
    const otherConnectionElement = phet.paperLand.getProgramData( otherProgramNumber, 'connectionElement' );

    if ( otherConnectionElement ) {

      // if it does, add this connection element as a child
      otherConnectionElement.addChild( phet.paperLand.getModelComponent( `${programNumber}-connectionElement` ) );
    }
  };

  const onProgramSeparated = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} detached from ${programNumber} ${direction}` );

    // Look at the other program and see if it has a ConnectionElement that we are attached to
    const otherConnectionElement = phet.paperLand.getProgramData( otherProgramNumber, 'connectionElement' );
    if ( otherConnectionElement ) {
      const thisElement = phet.paperLand.getModelComponent( `${programNumber}-connectionElement` );

      if ( otherConnectionElement.children.includes( thisElement ) ) {
        otherConnectionElement.removeChild( thisElement );
      }
    }
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
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


