// Circle: Model
// Keywords: circle, model, property
// ------------------------------- //
// Required Programs (dependencies) [none]
// Recommended Programs: Circle prefix
// Program Description: Contains the model properties for Circle
// and initial values. You can change whether this paper controls the value directly.

// Model
// Keywords: density, model
// ------------------------------- //
// Required Programs (dependencies): [none]
// Recommended Programs: Density prefix
// Program Description:

importScripts('paper.js');

(async () => {


  //-------------------------------------------------------------------
  // Projector code
  //-------------------------------------------------------------------
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Global model for all programs
    const model = sharedData.model;

    // note the use of axon here
    const myCircleColor = new phet.axon.Property('rgb(255,0,0)');

    phet.paperLand.addModelComponent( 'circleColorProperty', myCircleColor );

  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // removeModelComponent removes from the global model and disposes
    phet.paperLand.removeModelComponent( 'circleColorProperty' );

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

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw "Hello world" on the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Density', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Model', canvas.width / 2, canvas.height / 2 + 20);
})();

