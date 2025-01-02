// Animated Image
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const position = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'position', position );
    

      const rotation = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 6.28 )
      });
      phet.paperLand.addModelComponent( 'rotation', rotation );
    

      // Create an image and add it to the view.
      let imageImageElement = document.createElement( 'img' );
      imageImageElement.src = 'media/images/frosted.png';
      const imageImage = new phet.scenery.Image( imageImageElement );
      
      sharedData.scene.addChild( imageImage );
      scratchpad.imageImage = imageImage;
      
      // Update the image when a dependency changes.
      scratchpad.imageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'position', 'rotation' ], ( position, rotation ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        imageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        imageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        imageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        imageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        imageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        imageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        imageImage.visible = visible;
      };
      
      const moveToFront = () => {
        imageImage.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        imageImage.rotation = rotation;
      };

        const setImage = imageName => {
          let imageImageImageElement = document.createElement( 'img' );
          imageImageImageElement.src = 'media/images/' + imageName;
          imageImage.image = imageImageImageElement; 
        };
      
      
        setRotation( rotation );

setCenterX( position.x );
setCenterY( position.y );
      } );
    

      const playsoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/b-tone.mp3' );
      const playsoundSoundClip = new phet.tambo.SoundClip( playsoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( playsoundSoundClip );
      
      let playsoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds
      let playsoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;

      // Play the sound when any dependencies change value.
      scratchpad.playsoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'position' ], ( position ) => {
        // in a local scope, define the functions that the user can use to manipulate the sound
        const setOutputLevel = ( level ) => {
        
          // As a safety measure, don't let the user set a level below zero and above 2.
          const outputLevel = Math.max( 0, Math.min( 2, level ) );
          playsoundSoundClip.outputLevel = outputLevel;
        };
        const setPlaybackRate = ( rate ) => {
        
          // As a safety measure, the playback rate cannot go below zero.
          const playbackRate = Math.max( 0, rate );
          playsoundSoundClip.setPlaybackRate( playbackRate );
        };
        
        // a function the user can call to play the sound
        const play = () => {
        
          // Play the sound - if looping, we don't want to start playing again if already playing. The sound
          // can only be played at a limited interval for safety.
          if ( ( !playsoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - playsoundLastPlayTime > 0.25 ) {
            playsoundSoundClip.play();
            playsoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
            
            // Set a timer to turn off the sound when the value stops changing.
            if ( playsoundStopSoundTimeout ){
              window.clearTimeout( playsoundStopSoundTimeout );
            }
            
            // only stop if looping
            if ( false ) {
              playsoundStopSoundTimeout = window.setTimeout( () => {
                playsoundSoundClip.stop();
              }, 5000 );
            }  
          }
        };
        
        const stop = () => {
          // Set a timer to turn off the sound when the value stops changing.
          if ( playsoundStopSoundTimeout ){
            window.clearTimeout( playsoundStopSoundTimeout );
          }
          playsoundSoundClip.stop();
        };
        
        if ( true ) {
          play();
        }
      
        if (position.x > window.innerWidth / 2) {
    setPlaybackRate(1);
    setOutputLevel(0.5);
    play();
} else {
    setPlaybackRate(0.5);
    setOutputLevel(0.2);
    play();
}
            
      } );       
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.playsoundSoundClip = playsoundSoundClip;
    

      const animationAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'position', 'rotation' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const position = phet.paperLand.getModelComponent( 'position' ).value;
const rotation = phet.paperLand.getModelComponent( 'rotation' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setPosition = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'position' );
        modelComponent.value = newValue;  
      }
      
const setRotation = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'rotation' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          // Move the position up and down over time with a sin function
setPosition( new phet.dot.Vector2( 0.5, Math.sin( elapsedTime ) * 0.25 + 0.4 ) );

// Make the rotation change a bit so that it looks like it moves up and down
setRotation( Math.sin( elapsedTime ) * 0.2 );
 
        }
      };
      scratchpad.animationAnimationListener = animationAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( animationAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'position' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'rotation' );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.imageImage );
      delete scratchpad.imageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'position', 'rotation' ], scratchpad.imageImageMultilinkId );
      delete scratchpad.imageImageMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.playsoundSoundClip );
      delete scratchpad.playsoundSoundClip;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'position' ], scratchpad.playsoundSoundMultilinkId );
      delete scratchpad.playsoundSoundMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.animationAnimationListener );
      delete scratchpad.animationAnimationListener;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
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
  ctx.fillText('Animated Image', canvas.width / 2, canvas.height / 2 + 20);
})();
