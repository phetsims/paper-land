// Angle sound
// Keywords: angle, sound, sound generator, view
// ------------------------------- //
// Required Programs (dependencies) 
// Recommended Programs: circle prefix
// Program Description:

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
    const wrappedAudioBuffer = createAndLoadWrappedAudioBuffer( `media/sounds/${availableSoundFiles[ 2 ]}` );
    const angleSound = new phet.tambo.SoundClip( wrappedAudioBuffer, { 
      loop: true,
      initialOutputLevel: 0.1
    } );

    // Global model for all programs
    const model = sharedData.model;

    phet.tambo.soundManager.addSoundGenerator( angleSound );
    scratchpad.angleSound = angleSound;

    const soundOnWhenIdleTime = 1; // in seconds
    let stopSoundTimeout = null;

    const soundListener = ( newAngle ) => {
      if ( !angleSound.isPlaying ){
        angleSound.play();
      }

      // 100 is the maximum of the angle range - to be more robust, add a direct dependency on the
      // angleProperty with addModelObserver instead of using addModelPropertyLink. Then in handleAttach
      // you would have a reference to the modelProperty and its range.
      newAngle = Math.max( newAngle, 0.1 );
      const playbackRate = (1 / ( newAngle / 3.14 )) / 5;
      console.log( playbackRate );
      angleSound.setPlaybackRate( playbackRate );

      // Set a timer to turn off the sound when the angle is no longer changing.
      if ( stopSoundTimeout ){
        window.clearTimeout( stopSoundTimeout );
      }
      stopSoundTimeout = window.setTimeout( () => {
        angleSound.stop();
      }, soundOnWhenIdleTime * 1000 );
    };

    scratchpad.angleListenerId = phet.paperLand.addModelPropertyLink( 'angleProperty', soundListener );
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchPad, sharedData ) => {

    // No need to observe paper position for this program! However, you could describe the angle
    // based on positionPoints instead of angleProperty if you wanted to.
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // stop observing the angleProperty
    phet.paperLand.removeModelPropertyLink( 'angleProperty', scratchpad.angleListenerId );
    delete scratchpad.angleListenerId;

    // stop sounds and remove
    scratchpad.angleSound.stop();
    phet.tambo.soundManager.removeSoundGenerator( scratchpad.angleSound );
    delete scratchpad.angleSound;
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
  ctx.fillText('Circle', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Sound', canvas.width / 2, canvas.height / 2 + 20);
})();

