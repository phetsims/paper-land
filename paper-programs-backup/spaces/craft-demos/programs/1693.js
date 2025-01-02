// Froggie
// Keywords: pop-up
// Description: This program plays a simple sound file.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const imagePosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'imagePosition', imagePosition );
    

      const imageRotation = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 6.28 )
      });
      phet.paperLand.addModelComponent( 'imageRotation', imageRotation );
    

      const imageScale = new phet.axon.NumberProperty( 1, {
        range: new phet.dot.Range( 0.1, 2 )
      });
      phet.paperLand.addModelComponent( 'imageScale', imageScale );
    

      const frogNoiseWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/uploads/Frog-sound-ribbit.mp3' );
      const frogNoiseSoundClip = new phet.tambo.SoundClip( frogNoiseWrappedAudioBuffer, {
        loop: true,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( frogNoiseSoundClip );
      scratchpad.frogNoiseWrappedAudioBuffer = frogNoiseWrappedAudioBuffer;
      
      let frogNoiseStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let frogNoiseLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.frogNoiseWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.frogNoiseSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'imagePosition' ], ( imagePosition ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              frogNoiseSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              frogNoiseSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !frogNoiseSoundClip.isPlaying || !true ) && phet.paperLand.elapsedTimeProperty.value - frogNoiseLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !frogNoiseSoundClip.isPlaying ) {
                  frogNoiseSoundClip.play();
                }
                frogNoiseLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( frogNoiseStopSoundTimeout ){
                  window.clearTimeout( frogNoiseStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !true ) {
                  frogNoiseStopSoundTimeout = window.setTimeout( () => {
                    frogNoiseSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( frogNoiseStopSoundTimeout ){
                window.clearTimeout( frogNoiseStopSoundTimeout );
              }
              frogNoiseSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            play();
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.frogNoiseWrappedAudioBuffer.audioBufferProperty.link( scratchpad.frogNoiseWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.frogNoiseSoundClip = frogNoiseSoundClip;
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'imagePosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'imageRotation' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'imageScale' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.frogNoiseSoundClip );
      delete scratchpad.frogNoiseSoundClip;
      
      scratchpad.frogNoiseWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.frogNoiseWrappedAudioBufferListener );
      delete scratchpad.frogNoiseWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'imagePosition' ], scratchpad.frogNoiseSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.frogNoiseSoundMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty2 = phet.paperLand.getModelComponent( 'imagePosition' );
    if ( modelProperty2 ) {
      modelProperty2.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };

  await paper.set( 'data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString(),
      },
      customWhiskerLengths: {
        top: 0.2,
        right: 0.2,
        bottom: 0.2,
        left: 0.2
      }
    }
  } );
  
  // PROJECTOR CODE //
  // Get a canvas object for this paper to draw something to the Projector.
  const canvas = await paper.get('canvas');

  // Draw the name of the program to the projector
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Froggie', canvas.width / 2, canvas.height / 2 + 20);
})();
