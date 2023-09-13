// Light 2
// Keywords: 
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: 
// Program Description: This is a light. When connected to the source, it will light up.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Create a Scenery image node for a light and add it to the scene
    const onImageElement = document.createElement( 'img' );
    onImageElement.setAttribute( 'src', 'media/images/on-bulb.png' );
    const onImageNode = new phet.scenery.Image( onImageElement, {
      maxWidth: 80,

      // initially visible until there is a connection
      visible: false
    } );
    sharedData.scene.addChild( onImageNode );
    scratchpad.onImageNode = onImageNode;

    const offImageElement = document.createElement( 'img' );
    offImageElement.setAttribute( 'src', 'media/images/off-bulb.png' );
    const offImageNode = new phet.scenery.Image( offImageElement, {
      maxWidth: 80
    } );
    sharedData.scene.addChild( offImageNode );
    scratchpad.offImageNode = offImageNode;

    scratchpad.visibilityListener = isLit => {
      scratchpad.onImageNode.visible = isLit;
      scratchpad.offImageNode.visible = !isLit;
    };

    scratchpad.observerId = phet.paperLand.addModelObserver( 'connectionElementConstructor',
    elementConstructor => {
      
      // constructor is available, add this element
      const connectionElement = new elementConstructor( false );
      phet.paperLand.addModelComponent( 'element2', connectionElement );

      // update the image when lit Property changes
      connectionElement.isLitProperty.link( scratchpad.visibilityListener );

      phet.paperLand.setProgramData( paperProgramNumber, 'connectionElement', connectionElement );
    },
    () => {
      // constructor is no longer available, remove the element
      
      // if connected to the data structure, remove from the parent
      const connectionElement = phet.paperLand.getModelComponent( 'element2' );
      if ( connectionElement ) {
        connectionElement.parent && connectionElement.parent.removeChild( connectionElement );

        // need to unlink because the images will be unavailable
        connectionElement.isLitProperty.unlink( scratchpad.visibilityListener );

        phet.paperLand.removeModelComponent( 'element2' );
        phet.paperLand.removeProgramData( 'element2' );
      }
    } );
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // remove the images
    sharedData.scene.removeChild( scratchpad.offImageNode );
    delete scratchpad.offImageNode;

    sharedData.scene.removeChild( scratchpad.onImageNode );
    delete scratchpad.onImageNode;

    // destroy the model component, removing visibility listeners first
    const element = phet.paperLand.getModelComponent( 'element2' );
    if ( element ) {
      element.isLitProperty.unlink( scratchpad.visibilityListener );
      delete scratchpad.visibilityListener;

      element.dispose();

      phet.paperLand.removeModelComponent( 'element2' );
    }

    // remove program specific data
    phet.paperLand.removeProgramData( paperProgramNumber, 'connectionElement' );

    // remove the connection element constructor observer
    phet.paperLand.removeModelObserver( 'connectionElementConstructor', scratchpad.observerId );
  };

  const onProgramAdjacent = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} ${direction} of ${programNumber}` );

    // Look at the other program and see if it has a ConnectionElement to connect to
    const otherConnectionElement = phet.paperLand.getProgramData( otherProgramNumber, 'connectionElement' );

    if ( otherConnectionElement ) {

      // if it does, add this connection element as a child
      otherConnectionElement.addChild( phet.paperLand.getModelComponent( 'element2' ) );
    }
  };

  const onProgramSeparated = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} detached from ${programNumber} ${direction}` );

    // Look at the other program and see if it has a ConnectionElement that we are attached to
    const otherConnectionElement = phet.paperLand.getProgramData( otherProgramNumber, 'connectionElement' );
    if ( otherConnectionElement ) {
      const thisElement = phet.paperLand.getModelComponent( 'element2' );

      if ( otherConnectionElement.children.includes( thisElement ) ) {
        otherConnectionElement.removeChild( thisElement );
      }
    }
  };

  // Called when the program moves.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {

    // Center the image based on the position of the paper.
    const paperCenterX = ( positionPoints[0].x + positionPoints[1].x ) / 2;
    const paperCenterY = ( positionPoints[0].y + positionPoints[2].y ) / 2;
    scratchpad.onImageNode.centerX = paperCenterX * sharedData.displaySize.width;
    scratchpad.onImageNode.centerY = paperCenterY * sharedData.displaySize.height;

    scratchpad.offImageNode.centerX = paperCenterX * sharedData.displaySize.width;
    scratchpad.offImageNode.centerY = paperCenterY * sharedData.displaySize.height;
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
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
  ctx.fillText('Whisker A', canvas.width / 2, canvas.height / 2 - 10);

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get('supporterCanvas');
  const supporterCtx = supporterCanvas.getContext('2d');
})();



