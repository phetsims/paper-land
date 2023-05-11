// PointC
// Keywords: point, C
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: General Template (templates)
// Program Description: Example program with functioning Board and Projector code!
// !!!UPDATE ME WITH A BETTER BOARD EXAMPLE!!!

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    // The position of this "point" in the space
    phet.paperLand.addModelComponent( 'pointCProperty', new phet.axon.Property( new phet.dot.Vector2( 0, 0 ) ) );

    // Representation of the angle between other points in this space
    phet.paperLand.addModelComponent( 'angleProperty', new phet.axon.Property( 0 ) );
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {
    const model = sharedData.model;

    // The center of this program in camera space
    const displayCenter = new phet.dot.Vector2(
      ( positionPoints[ 0 ].x + ( positionPoints[ 2 ].x - positionPoints[ 0 ].x ) / 2 ) * sharedData.displaySize.width,
      ( 1 - ( positionPoints[ 0 ].y + ( positionPoints[ 2 ].y - positionPoints[ 0 ].y ) / 2 ) ) * sharedData.displaySize.height,
    )

    if ( model.has( 'pointCProperty' ) ) {
      model.get( 'pointCProperty' ).value = displayCenter;
    }


    if ( model.has( 'pointAProperty' ) && model.has( 'pointBProperty' ) ) {
        const pointAPosition = model.get( 'pointAProperty' ).value;
        const pointBPosition = model.get( 'pointBProperty' ).value;
        const pointCPosition = model.get( 'pointCProperty' ).value;

        const a = pointCPosition.distance( pointBPosition );
        const b = pointCPosition.distance( pointAPosition );
        const c = pointBPosition.distance( pointAPosition );

        // law of cosines
        const angle = Math.acos( (b * b + a * a - c * c) / ( 2 * b * a ) );
        model.get( 'angleProperty' ).value = angle;
    }
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
      phet.paperLand.removeModelComponent( 'pointCProperty' );
      phet.paperLand.removeModelComponent( 'angleProperty' );
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
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
  ctx.fillText('Point', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('C', canvas.width / 2, canvas.height / 2 + 20);

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

