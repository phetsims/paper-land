// World (Model)
// Keywords: gravity, physics, model
// ------------------------------- //
// Required Programs (dependencies) [none]
// Recommended Programs: Lander, Thrust, Lander Voicing, Thrust Sound
// Program Description: Creates a world for lunar lander.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // create a world with p2 physics and add to the global model
    const world = new p2.World();
    phet.paperLand.addModelComponent( 'world', world );
    phet.scratch = {};
    phet.scratch.world = world;

    // All of the available planet names that the model can use
    const planetNames = [
      'Moon',
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
      'Pluto'
    ];
    phet.paperLand.addModelComponent( 'planetNames', planetNames );

    const planetNameProperty = new phet.axon.Property( 'Moon' );
    phet.paperLand.addModelComponent( 'planetNameProperty', planetNameProperty );

    // create a Property that will control acceleration due to gravity
    const gravityProperty = new phet.axon.Property( -9.8 );
    phet.paperLand.addModelComponent( 'gravityProperty', gravityProperty );

    // When the selected planet name changes, set the gravity value to that planet's 
    // acceleration due to gravity
    scratchpad.nameLinkId = phet.paperLand.addModelPropertyLink( 'planetNameProperty', planetName => {
      sharedData.model.get( 'gravityProperty' ).value = planetName === 'Moon' ? -1.625 :
                                                        planetName === 'Mercury' ? -3.721 :
                                                        planetName === 'Venus' ? -8.87 :
                                                        planetName === 'Earth' ? -9.807 :
                                                        planetName === 'Mars' ? -3.721 :
                                                        planetName === 'Jupiter' ? -24.79 :
                                                        planetName === 'Saturn' ? -10.44 :
                                                        planetName === 'Uranus' ? -8.87 :
                                                        planetName === 'Neptune' ? -11.15 :
                                                        planetName === 'Pluto' ? -0.62 :
                                                        0;
    } );

    // create an Emitter that other programs to listen to that fires an event after p2 physics has completed
    // a step and updated all physical bodies
    const worldStepEmitter = new phet.axon.Emitter();
    phet.paperLand.addModelComponent( 'worldStepEmitter', worldStepEmitter );

    // create "ground" so the lander stops at the bottom
    const planeShape = new p2.Box( { width: sharedData.displaySize.width * 2, height: 500 } );
    const planeBody = new p2.Body( {
      type: p2.Body.KINEMATIC,
      mass: 0, // tells p2 that this body shouldn't respond to forces
      position: [ 0, -225 ], // initial position
    } );
    planeBody.addShape( planeShape );
    world.addBody( planeBody );

    // Add a function to the model to convert from p2 model coordinates to "board view" coordinates
    const modelToViewPosition = modelPosition => {
      return new phet.dot.Vector2( modelPosition.x + sharedData.displaySize.width / 2, sharedData.displaySize.height - modelPosition.y );
    };
    phet.paperLand.addModelComponent( 'modelToViewPosition', modelToViewPosition );

    // Add a function to the model to convert board "view" coordinates to p2 model coordinates
    const viewToModelPosition = viewPosition => {
      return new phet.dot.Vector2(
        viewPosition.x - sharedData.displaySize.width / 2,
        sharedData.displaySize.height - viewPosition.y
      )
    }
    phet.paperLand.addModelComponent( 'viewToModelPosition', viewToModelPosition );

    // move physics bodies forward in time
    scratchpad.stepListener = dt => {

      // limit dt to prevent odd behaviors that could happen with really large time steps
      dt = Math.min( dt, 0.02 ); // in seconds
      world.step( dt );
      worldStepEmitter.emit();
    }
    phet.axon.stepTimer.addListener( scratchpad.stepListener );

    // set p2 physics gravity when model gravity changes
    const gravityListener = yGravity => {
      world.gravity = [ 0, yGravity ];
    };
    scratchpad.gravityListenerId = phet.paperLand.addModelPropertyLink( 'gravityProperty', gravityListener );
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    phet.paperLand.removeModelPropertyLink( 'gravityProperty', scratchpad.gravityListenerId );
    delete scratchpad.gravityListenerId;

    phet.paperLand.removeModelPropertyLink( 'planetNameProperty', scratchpad.nameLinkId );
    delete scratchpad.nameLinkId;

    phet.paperLand.removeModelComponent( 'world' );
    phet.paperLand.removeModelComponent( 'worldStepEmitter' );
    phet.paperLand.removeModelComponent( 'gravityProperty' );
    phet.paperLand.removeModelComponent( 'modelToViewPosition' );
    phet.paperLand.removeModelComponent( 'viewToModelPosition' );
    phet.paperLand.removeModelComponent( 'planetNames' );
    phet.paperLand.removeModelComponent( 'planetNameProperty' );

    phet.axon.stepTimer.removeListener( scratchpad.stepListener );
    delete scratchpad.stepListener;
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
  ctx.fillText('Lunar', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Model', canvas.width / 2, canvas.height / 2 + 20);
})();
