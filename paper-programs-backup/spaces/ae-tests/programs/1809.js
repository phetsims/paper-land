// Altitude: Image Y-Position mapped to Altitude - Copy
// Keywords: altitude, image, asset, view
// ------------------------------- //
// Required Programs (dependencies) Altitude: Model
// Recommended Programs: Altitude prefix
// Program Description:

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    //----------------------------------------------------------------------
    // Template Variables
    //----------------------------------------------------------------------
    const propertyName = 'altitudeProperty';

    const imageWidthInPixels = 50; // Must be positive.

    const aboveZeroImageFile = 'hotairballoon.png';
    // const aboveZeroImageFile = 'lunarLander.png';
    // const aboveZeroImageFile = 'birdInAir.png';

    const belowZeroImageFile = 'sub.png';
    // const belowZeroImageFile = 'girlInWater.png';

    //----------------------------------------------------------------------
    
    // Global model for all programs
    const model = sharedData.model;

    const aboveZeroImageElement = document.createElement( 'img' );
    aboveZeroImageElement.setAttribute( 'src', `media/images/${aboveZeroImageFile}` );
    const aboveZeroImageNode = new phet.scenery.Image( aboveZeroImageElement, {
      minWidth: imageWidthInPixels,
      maxWidth: imageWidthInPixels
    } );
    const belowZeroImageElement = document.createElement( 'img' );
    belowZeroImageElement.setAttribute( 'src', `media/images/${belowZeroImageFile}` );
    const belowZeroImageNode = new phet.scenery.Image( belowZeroImageElement, {
      minWidth: imageWidthInPixels,
      maxWidth: imageWidthInPixels
    } );

    sharedData.scene.addChild( aboveZeroImageNode );
    sharedData.scene.addChild( belowZeroImageNode );

    // This the function to implement to watch the changing Property.
    const componentListener = value => {

      // Transform the model position into a view position.
      const valueProperty = model.get( propertyName );
      const range = valueProperty.range;
      const viewAltitude =  -( value + range.min ) / range.getLength() * sharedData.displaySize.height;
      
      // Set the position of the images.
      aboveZeroImageNode.centerY = viewAltitude;
      aboveZeroImageNode.centerX = sharedData.displaySize.width / 2;
      belowZeroImageNode.centerY = viewAltitude;
      belowZeroImageNode.centerX = sharedData.displaySize.width / 2;

      // Set the visibility of the images.
      aboveZeroImageNode.visible = value > 0;
      belowZeroImageNode.visible = value <= 0;
    }
    scratchpad.altitudeListenerId = phet.paperLand.addModelPropertyLink( propertyName, componentListener );

    // Assign components to the scratchpad so that they can be removed later.
    scratchpad.propertyName = propertyName;
    scratchpad.aboveZeroImageNode = aboveZeroImageNode;
    scratchpad.belowZeroImageNode = belowZeroImageNode;
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Global model for all programs
    const propertyName = scratchpad.propertyName;
    delete scratchpad.propertyName;

    phet.paperLand.removeModelPropertyLink( propertyName, scratchpad.altitudeListenerId );
    delete scratchpad.altitudeListenerId;

    sharedData.scene.removeChild( scratchpad.aboveZeroImageNode );
    delete scratchpad.aboveZeroImageNode;
    sharedData.scene.removeChild( scratchpad.belowZeroImageNode );
    delete scratchpad.belowZeroImageNode;
  }

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
  ctx.fillText('Altitude', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Image', canvas.width / 2, canvas.height / 2 + 20);
})();


