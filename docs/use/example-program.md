# Example JavaScript Paper Programs - Altitude Demo

Below you will find a set of example paper programs written in full JavaScript using the [paperLand API](./paperland-api.md) that create the abstract idea of controlling and mapping displays to an object hovering above the ground, without implementing any physics. 

!!! danger
    If you are not extremely comfortable with JavaScript, you should move over to the [*Creator* tutorial](../setup/creator.md) for easy paper program creation!

We'll create a `Property` for its "altitude" above the ground and then create a few other programs to get the altitude value and control or display it across multiple modalities.

!!! note

    These examples use the Paper Event functions (`onProgramAdded`, `onProgramChangedPosition`, `onProgramRemoved`) to run code on the *Interactive Display* (board.html). They include basic code for the Projector (projector.html) to provide names if viewing that window. For more advanced usage of Projector, please see the [legacy Paper API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md).

## Model Program

In this simple example, this paper program establishes the properties (`altitudeProperty`) that we can control or display with other paper programs. Optionally, this program lets you control the value of the created altitudeProperty with the paper's position within the `onProgramChangedPosition` function.

```js
// Altitude: Model
// Keywords: altitude, model, property
// ------------------------------- //
// Required Programs (dependencies) [none]
// Recommended Programs: Altitude prefix
// Program Description: Contains the model properties for Altitude, including range 
// and initial values. You can change whether this paper controls the value directly.

importScripts( 'paper.js' );

( async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get( 'number' );

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // -----------------------------------------------------
    // Template Variables
    // -----------------------------------------------------
    // IMPORTANT! Change this to a unique name that identifies this Property.
    // The name you choose here is how you will refer to this Property in other
    // programs. 
    const propertyName = 'altitudeProperty';

    // Controls how paper motion changes the value.
    // 'linear' - value increases linearly as program moves.
    // 'exponential' - value increases exponentially as program moves.
    // 'inverse' - The value is set like 1/x as the program moves.
    // 'none' - The value does NOT change with the program movement.
    const controlType = 'none';

    // Does the value change when moving the program left/right or up/down? 
    // 'horizontal' - left is min, right is max
    // 'vertical' - bottom is min, top is max
    const controlDirection = 'vertical';

    // range for the value as the program moves.
    const range = new phet.dot.Range( 0, 100 );

    // If true, Text will be drawn to the board to display the value for debugging
    const showText = true;

    // number of decimal places when representing the value
    const decimalPlaces = 0;

    // font size for debugging text to see the value on the Board
    const fontSize = 50;

    // positioning of the debugging text, relative to the top left of the board
    const textLeft = 50;
    const textTop = 50;

    // -----------------------------------------------------
    // Create and add components
    // -----------------------------------------------------

    // Global model for all programs
    const model = sharedData.model;

    // Use scene.addChild( someNode ) to draw components in the Board.
    const scene = sharedData.scene;

    // Create the NumberProperty and add to the board model
    const valueProperty = new phet.axon.NumberProperty( range.min, {
      range: range
    } );
    phet.paperLand.addModelComponent( propertyName, valueProperty );

    // Print the value to the board for debugging
    scratchpad.valueText = new phet.scenery.Text( '', {
      font: new phet.scenery.Font( { size: fontSize } ),
      leftTop: new phet.dot.Vector2( textLeft, textTop ),
      visible: showText
    } );
    scene.addChild( scratchpad.valueText );

    // update the debugging text when the value changes
    const valueTextListener = value => {
      scratchpad.valueText.string = phet.dot.Utils.toFixed( value, decimalPlaces );
    };
    scratchpad.textObserverId = phet.paperLand.addModelPropertyLink( propertyName, valueTextListener );

    // Assign template variables to the scratchpad so they can be used in the other program
    // callbacks but only need to be defined in one place
    scratchpad.propertyName = propertyName;
    scratchpad.controlType = controlType;
    scratchpad.controlDirection = controlDirection;
    scratchpad.showText = showText;
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {
    const propertyName = scratchpad.propertyName;
    const controlType = scratchpad.controlType;
    const controlDirection = scratchpad.controlDirection;

    if ( controlType === 'none' ) {
      return;
    }

    // global model for the board (all )    
    const model = sharedData.model;

    if ( model.has( propertyName ) ) {
      const range = model.get( propertyName ).range;
      const positionDimension = controlDirection === 'horizontal' ? 'x' : 'y';

      // This is the center in x or y dimensions of the paper, normalized from 0 to 1.
      let paperCenterValue = ( positionPoints[ 0 ][ positionDimension ] + positionPoints[ 2 ][ positionDimension ] ) / 2;

      // account for origin being at the top
      if ( controlDirection === 'vertical' ) {
        paperCenterValue = 1 - paperCenterValue;
      }

      let calculatedValue = model.get( propertyName ).value;
      if ( controlType === 'linear' ) {
        calculatedValue = paperCenterValue * range.max;
      }
      else if ( controlType === 'exponential' ) {
        calculatedValue = Math.pow( paperCenterValue * Math.sqrt( range.max ), 2 );
      }
      else if ( controlType === 'inverse' ) {

        const scaleFactor = 10; // stretches the curve so you can see the behavior in more space
        calculatedValue = ( 1 / ( paperCenterValue / scaleFactor ) ) - scaleFactor;
      }
      else {
        alert( 'Invalid value for controlType' );
      }

      // make sure value is within the range
      const constrainedValue = Math.max( Math.min( calculatedValue, range.max ), range.min );
      model.get( propertyName ).value = constrainedValue
    }
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    const propertyName = scratchpad.propertyName;
    delete scratchpad.propertyName;

    // Global model for all programs
    const model = sharedData.model;

    // Use scene.removeChild( someNode ) to remove components in the Board.
    const scene = sharedData.scene;

    // unlink listener that updates debugging Text
    phet.paperLand.removeModelPropertyLink( propertyName, scratchpad.textObserverId );
    delete scratchpad.textObserverId;

    // remove the component from the model
    phet.paperLand.removeModelComponent( propertyName );

    // Remove Text from the view and remove references.
    scene.removeChild( scratchpad.valueText );
    delete scratchpad.valueText;

    // delete the other scratchpad items
    delete scratchpad.controlType;
    delete scratchpad.controlDirection;
    delete scratchpad.showText;
    
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set( 'data', {
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

  // Get a canvas object for this paper.
  const canvas = await paper.get( 'canvas' );

  // Draw the name of the program on the canvas
  const ctx = canvas.getContext( '2d' );
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText( 'Altitude', canvas.width / 2, canvas.height / 2 - 10 );
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText( 'Model', canvas.width / 2, canvas.height / 2 + 20 );
} )();
```

## Control Altitude with a Paper's Position

This program controls the value of `altitudeProperty` by mapping it to the vertical position of the paper. This is an alternative to controlling the value within the Model program above.

```js
// Altitude: Change Altitude with Paper Position
// Keywords: altitude, model, positionPoints
// ------------------------------- //
// Required Programs (dependencies): Altitude: Model
// Recommended Programs: Altitude prefix
// Program Description: Sets the Altitude property value set in Altitude Model by
// the center position of this paper.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed. Create new components here.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    // Nothing to create! This program controls an existing model Property.
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {
    
    // Global model for all programs
    const model = sharedData.model;

    if ( model.has( 'altitudeProperty' ) ) {
      const altitudeProperty = model.get( 'altitudeProperty' );
      const range = altitudeProperty.range;

      // This is the center in x or y dimensions of the paper, normalized from 0 to 1.
      // Graphics coordinate system has 0 at top so subtract from 1 so that 0 is at the bottom.
      let paperCenterY = 1 - ( positionPoints[ 0 ].y + positionPoints[ 2 ].y ) / 2;
      const newValue = paperCenterY * range.max;

      // make sure value is within the range
      const constrainedValue = Math.max( Math.min( newValue, range.max ), range.min );
      altitudeProperty.value = constrainedValue;
    }
  };

  // Called when the program is changed or no longer detected. Destroy components here.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    // Nothing to destroy! This program is only a controller.
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

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw the name of the program on the canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Altitude', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Control', canvas.width / 2, canvas.height / 2 + 20);
})();
```


## Play a Sound mapped to Altitude

This program creates a simple sound generator to map pitch of a tone to the magnitude of altitudeProperty.

```js
// Altitude: Continuous Sound for Altitude Magnitude
// Keywords: altitude, sound, sound generator, view
// ------------------------------- //
// Required Programs (dependencies) Altitude: Model
// Recommended Programs: Altitude prefix
// Program Description: Map pitch of a tone to the magnitude of altitudeProperty.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    const availableSoundFiles = [
      'stringsLoopMiddleCOscilloscope.mp3',
      'saturatedSineLoop220Hz.mp3',
      'loonCall.mp3',
      'windsLoopC3Oscilloscope.mp3',
      'chargesInBody.mp3'
    ];

    // Create and add the sound generator.
    const wrappedAudioBuffer = createAndLoadWrappedAudioBuffer( `media/sounds/${availableSoundFiles[ 4 ]}` );
    const altitudeSound = new phet.tambo.SoundClip( wrappedAudioBuffer, { 
      loop: true,
      initialOutputLevel: 0.1
    } );

    // Global model for all programs
    const model = sharedData.model;

    phet.tambo.soundManager.addSoundGenerator( altitudeSound );
    scratchpad.altitudeSound = altitudeSound;

    const soundOnWhenIdleTime = 1; // in seconds
    let stopSoundTimeout = null;

    const soundListener = ( newAltitude ) => {

      if ( !altitudeSound.isPlaying ){
        altitudeSound.play();
      }

      // 100 is the maximum of the altitude range - to be more robust, add a direct dependency on the
      // altitudeProperty with addModelObserver instead of using addModelPropertyLink. Then in handleAttach
      // you would have a reference to the modelProperty and its range.
      altitudeSound.setPlaybackRate( 0.5 + newAltitude / 100 * 1.5 );

      // Set a timer to turn off the sound when the altitude is no longer changing.
      if ( stopSoundTimeout ){
        window.clearTimeout( stopSoundTimeout );
      }
      stopSoundTimeout = window.setTimeout( () => {
        altitudeSound.stop();
      }, soundOnWhenIdleTime * 1000 );
    };

    scratchpad.altitudeListenerId = phet.paperLand.addModelPropertyLink( 'altitudeProperty', soundListener );
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {

    // No need to observe paper position for this program! However, you could describe the altitude
    // based on positionPoints instead of altitudeProperty if you wanted to.
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // stop observing the altitudeProperty
    phet.paperLand.removeModelPropertyLink( 'altitudeProperty', scratchpad.altitudeListenerId );
    delete scratchpad.altitudeListenerId;

    // stop sounds and remove
    scratchpad.altitudeSound.stop();
    phet.tambo.soundManager.removeSoundGenerator( scratchpad.altitudeSound );
    delete scratchpad.altitudeSound;
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

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw the name of the program on the canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Altitude', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Sound', canvas.width / 2, canvas.height / 2 + 20);
})();
```

## Add an Image vertically mapped to Altitude

This program pulls an image from the `./www/media` directory and maps its vertical position in the Board to 

```js
// Altitude: Image Y-Position mapped to Altitude
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

    const imageFile = 'girlInAir.png';
    // const imageFile = 'lunarLander.png';
    // const imageFile = 'birdInAir.png';

    //----------------------------------------------------------------------
    
    // Global model for all programs
    const model = sharedData.model;

    const imageElement = document.createElement( 'img' );
    imageElement.setAttribute( 'src', `media/images/${imageFile}` );
    const imageNode = new phet.scenery.Image( imageElement, {
      minWidth: imageWidthInPixels,
      maxWidth: imageWidthInPixels
    } );

    sharedData.scene.addChild( imageNode );

    // This the function to implement to watch the changing Property.
    const componentListener = value => {
      const viewAltitude =  sharedData.displaySize.height * ( 1 - value / 100 ); // 100 is the max of the range
      imageNode.centerY = viewAltitude;
      imageNode.centerX = sharedData.displaySize.width / 2;
    }
    scratchpad.altitudeListenerId = phet.paperLand.addModelPropertyLink( propertyName, componentListener );

    // assign components to the scratchpad so that they can be removed later
    scratchpad.propertyName = propertyName;
    scratchpad.imageNode = imageNode;
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Global model for all programs
    const propertyName = scratchpad.propertyName;
    delete scratchpad.propertyName;

    phet.paperLand.removeModelPropertyLink( propertyName, scratchpad.altitudeListenerId );
    delete scratchpad.altitudeListenerId;

    sharedData.scene.removeChild( scratchpad.imageNode );
    delete scratchpad.imageNode;
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
```

## Add Spoken Description for Altitude

This program adds speech to describe different ranges for altitude as the value enters each range.

```js
// Altitude: Voice Altitude Value
// Keywords: altitude, voicing, view
// ------------------------------- //
// Required Programs (dependencies) Altitude: Model
// Recommended Programs: Altitude prefix
// Program Description: Adds speech to describe different ranges for altitude as the value enters each range.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Global model for all programs
    const model = sharedData.model;

    // Create new components here!
    const utterance = new phet.utteranceQueue.Utterance( {
      priority: 5
    } );

    let previousDescribedAltitude = 0;

    const altitudeVoicingListener = ( newAltitude ) => {
      const valueChange = Math.abs( newAltitude - previousDescribedAltitude );

      // if the value changed enough to voicing something new...
      if ( valueChange > 15 ) {

        let voicingContent = '';
        if ( newAltitude > 88 ) {
          voicingContent = 'At extreme altitude! You are a cosmic climber!';
        }
        else if ( newAltitude > 70 ) {
          voicingContent = 'At very high altitude! You are at the edge of space!';
        }
        else if ( newAltitude > 50 ) {
          voicingContent = 'At high altitude! You are a stratospheric soarer!';
        }
        else if ( newAltitude > 40 ) {
          voicingContent = 'At medium altitude! You are a cloud cruiser!';
        }
        else if ( newAltitude > 20 ) {
          voicingContent = 'At low altitude! You are a tree top flyer!';
        }
        else {
          voicingContent = 'At sea level! You are in the splash zone!';
        }

        utterance.alert = voicingContent;
        phet.paperLand.console.log( voicingContent );
        phet.scenery.voicingUtteranceQueue.addToBack( utterance );

        previousDescribedAltitude = newAltitude;
      }
    };

    scratchpad.altitudeObserverId = phet.paperLand.addModelPropertyLink( 'altitudeProperty', altitudeVoicingListener );
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {

    // No need to observe paper position for this program! However, you could describe the altitude
    // based on positionPoints instead of altitudeProperty if you wanted to.
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    phet.paperLand.removeModelPropertyLink( 'altitudeProperty', scratchpad.altitudeObserverId );
    delete scratchpad.altitudeObserverId;
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

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw the name of the program on the canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Altitude', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Voicing', canvas.width / 2, canvas.height / 2 + 20);
})();
```

!!! info

    See more examples in the [hard-coded Paper Programs Database](https://github.com/phetsims/paper-land/tree/main/paper-programs-backup)!