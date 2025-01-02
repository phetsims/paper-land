// 
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const flipped = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'flipped', flipped );
    

      const birdCallFlipWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/birdCall.mp3' );
      const birdCallFlipSoundClip = new phet.tambo.SoundClip( birdCallFlipWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( birdCallFlipSoundClip );
      scratchpad.birdCallFlipWrappedAudioBuffer = birdCallFlipWrappedAudioBuffer;
      
      let birdCallFlipStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let birdCallFlipLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.birdCallFlipWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.birdCallFlipSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'flipped' ], ( flipped ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              birdCallFlipSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              birdCallFlipSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !birdCallFlipSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - birdCallFlipLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !birdCallFlipSoundClip.isPlaying ) {
                  birdCallFlipSoundClip.play();
                }
                birdCallFlipLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( birdCallFlipStopSoundTimeout ){
                  window.clearTimeout( birdCallFlipStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  birdCallFlipStopSoundTimeout = window.setTimeout( () => {
                    birdCallFlipSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( birdCallFlipStopSoundTimeout ){
                window.clearTimeout( birdCallFlipStopSoundTimeout );
              }
              birdCallFlipSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.birdCallFlipWrappedAudioBuffer.audioBufferProperty.link( scratchpad.birdCallFlipWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.birdCallFlipSoundClip = birdCallFlipSoundClip;
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'flipped' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.birdCallFlipSoundClip );
      delete scratchpad.birdCallFlipSoundClip;
      
      scratchpad.birdCallFlipWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.birdCallFlipWrappedAudioBufferListener );
      delete scratchpad.birdCallFlipWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'flipped' ], scratchpad.birdCallFlipSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.birdCallFlipSoundMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty185 = phet.paperLand.getModelComponent( 'flipped' );
    if ( modelProperty185 ) {
      modelProperty185.value = phet.paperLand.utils.getNormalizedProgramRotation( points ) > 0.25 && phet.paperLand.utils.getNormalizedProgramRotation( points ) < 0.75;
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
  ctx.fillText('', canvas.width / 2, canvas.height / 2 + 20);
})();
