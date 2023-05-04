// Altitude Control - Rotation
// Keywords: controller, mass, dial, rotation, paper
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: General Template (templates)
// Program Description: Controls the mass of the lander by rotating the program.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
  };

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {

    // this controller will change the mass to be within this range
    // NOTE: You could put this in model component if multiple things care about this range.
    // NOTE: That would also be more efficient, notice we are creating a new Range every
    //       time the program moves!
    
    const range = new phet.dot.Range( 1, 1000 ); // this is the altitude range

    // check to see that the model has the Property we want to control
    if ( sharedData.model.has( 'altitudeProperty' ) ) {

      // get a reference to the model Property so we can change it
      const altitudeProperty = sharedData.model.get( 'altitudeProperty' );

      // this utility function takes the paper points (from Jan's Paper API) and calculates a normalized
      // rotation. 0 means no rotation, 1 means it rotated a full 360 degrees. You can also use
      // getProgramRotation() if you want the value in radians. A normalized value will often be easier
      // to scale a model value.
      const normalizedRotation = phet.paperLand.utils.getNormalizedProgramRotation( positionPoints );

      // calculate new mass from rotation - we want 0 rotation to be the min of the range (not zero mass),
      // so the value is offset by the minimum mass. 
      const scaledAltitude = range.min + normalizedRotation * ( range.max - range.min );
     

      // set the new value to the mass Property
      altitudeProperty.value = scaledAltitude;
      phet.paperLand.console.log(altitudeProperty );
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
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramRemoved: onProgramRemoved.toString()
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
  ctx.fillText('Mass', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Dial', canvas.width / 2, canvas.height / 2 + 20);

})();

