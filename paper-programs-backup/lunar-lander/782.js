// Thrust Control - Y
// Keywords: controller, model, move, position, change
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: N/A
// Program Description: Controls just the Y component of the force of thrust by
//                      moving the program up and down.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {

    const thrustProperty = sharedData.model.get( 'landerThrustProperty' );
    if ( thrustProperty ) {
      const range = new phet.dot.Range( 0, 25 );

      // This is the center.y, normalized from 0 to 1. Graphics coordinate system has 0
      // at top so subtract from 1 so that 0 is at the bottom.
      const paperCenterY = 1 - ( positionPoints[ 0 ].y + positionPoints[ 2 ].y ) / 2;  

      // normalized value scaled by our range
      const newY = paperCenterY * range.max;

      // make sure value is within the range
      const constrainedY = range.constrainValue( newY );

      // The axon.Property requires a Vector2 value - so we create a new Vector2 for it,
      // using the new y value and the existing x value
      thrustProperty.value = new phet.dot.Vector2( thrustProperty.value.x, constrainedY );
    }
    phet.paperLand.console.log( 'Thrust Y: ' + thrustProperty.value.y )    
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

