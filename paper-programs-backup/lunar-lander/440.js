// Thrust Control - X
// Keywords: controller, model, move, position, change, paper
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: N/A
// Program Description: Controls just the X component of the force of thrust by
//                      moving the program left and right.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board cod
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {

    const thrustProperty = sharedData.model.get( 'landerThrustProperty' );
    if ( thrustProperty ) {
      const range = new phet.dot.Range( 0, 25 );

      // This is the center in x or y dimensions of the paper, normalized from 0 to 1.
      const paperCenterX = ( positionPoints[ 0 ].x + positionPoints[ 2 ].x ) / 2;

      // multiply normalized value by max of range 
      const newX = paperCenterX * range.max;

      // make sure value is within the range
      const constrainedX = range.constrainValue( newX );

      // offset because for x component of thrust, we want 0 at the center of the screen
      const centeredX = constrainedX - ( range.max / 2 );

      // The axon.Property must take a Vector2, so we update it by creating a new Vector2
      // with new X component and current y component
      thrustProperty.value = new phet.dot.Vector2( centeredX, thrustProperty.value.y );

    }
    phet.paperLand.console.log( 'Thrust X: ' + thrustProperty.value.x )
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramChangedPosition: onProgramChangedPosition.toString(),
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
})();
