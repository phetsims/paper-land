// AE Program 1
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isWinterComponent = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isWinterComponent', isWinterComponent );
    

      const isSummerComponent = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isSummerComponent', isSummerComponent );
    

      const seasonPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'seasonPosition', seasonPosition );
    

      const currentSeason = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 4 )
      });
      phet.paperLand.addModelComponent( 'currentSeason', currentSeason );
    

      const seasonChangeSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/d-tone.mp3' );
      const seasonChangeSoundSoundClip = new phet.tambo.SoundClip( seasonChangeSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( seasonChangeSoundSoundClip );
      
      let seasonChangeSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds
      let seasonChangeSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;

      // Play the sound when any dependencies change value.
      scratchpad.seasonChangeSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isWinterComponent' ], ( isWinterComponent ) => {
        // in a local scope, define the functions that the user can use to manipulate the sound
        const setOutputLevel = ( level ) => {
        
          // As a safety measure, don't let the user set a level below zero and above 2.
          const outputLevel = Math.max( 0, Math.min( 2, level ) );
          seasonChangeSoundSoundClip.outputLevel = outputLevel;
        };
        const setPlaybackRate = ( rate ) => {
        
          // As a safety measure, the playback rate cannot go below zero.
          const playbackRate = Math.max( 0, rate );
          seasonChangeSoundSoundClip.setPlaybackRate( playbackRate );
        };
        
        // a function the user can call to play the sound
        const play = () => {
        
          // Play the sound - if looping, we don't want to start playing again if already playing. The sound
          // can only be played at a limited interval for safety.
          if ( ( !seasonChangeSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - seasonChangeSoundLastPlayTime > 0.25 ) {
            seasonChangeSoundSoundClip.play();
            seasonChangeSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
            
            // Set a timer to turn off the sound when the value stops changing.
            if ( seasonChangeSoundStopSoundTimeout ){
              window.clearTimeout( seasonChangeSoundStopSoundTimeout );
            }
            
            // only stop if looping
            if ( false ) {
              seasonChangeSoundStopSoundTimeout = window.setTimeout( () => {
                seasonChangeSoundSoundClip.stop();
              }, 5000 );
            }  
          }
        };
        
        const stop = () => {
          // Set a timer to turn off the sound when the value stops changing.
          if ( seasonChangeSoundStopSoundTimeout ){
            window.clearTimeout( seasonChangeSoundStopSoundTimeout );
          }
          seasonChangeSoundSoundClip.stop();
        };
        
        if ( true ) {
          play();
        }
      
        if ( isWinterComponent ) {
    play();
    phet.paperLand.console.log('whisker twitch', isWinterComponent);
}
            
      } );       
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.seasonChangeSoundSoundClip = seasonChangeSoundSoundClip;
    

      // Create an image and add it to the view.
      let seasonViewImageElement = document.createElement( 'img' );
      seasonViewImageElement.src = 'media/images/hotairballoon.png';
      const seasonViewImage = new phet.scenery.Image( seasonViewImageElement );
      
      sharedData.scene.addChild( seasonViewImage );
      scratchpad.seasonViewImage = seasonViewImage;
      
      // Update the image when a dependency changes.
      scratchpad.seasonViewImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'seasonPosition' ], ( seasonPosition ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        seasonViewImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        seasonViewImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        seasonViewImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        seasonViewImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        seasonViewImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        seasonViewImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        seasonViewImage.visible = visible;
      };
      
      const moveToFront = () => {
        seasonViewImage.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        seasonViewImage.rotation = rotation;
      };

        const setImage = imageName => {
          let seasonViewImageImageElement = document.createElement( 'img' );
          seasonViewImageImageElement.src = 'media/images/' + imageName;
          seasonViewImage.image = seasonViewImageImageElement; 
        };
      
      
        //setCenter( new phet.dot.Vector2( helloPosition.x, helloPosition.y ));
setCenterX(seasonPosition.x);
setCenterY(seasonPosition.y);
      } );
    

      // Create an image and add it to the view.
      let summerViewImageElement = document.createElement( 'img' );
      summerViewImageElement.src = 'media/images/submarine.png';
      const summerViewImage = new phet.scenery.Image( summerViewImageElement );
      
      sharedData.scene.addChild( summerViewImage );
      scratchpad.summerViewImage = summerViewImage;
      
      // Update the image when a dependency changes.
      scratchpad.summerViewImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isSummerComponent' ], ( isSummerComponent ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        summerViewImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        summerViewImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        summerViewImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        summerViewImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        summerViewImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        summerViewImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        summerViewImage.visible = visible;
      };
      
      const moveToFront = () => {
        summerViewImage.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        summerViewImage.rotation = rotation;
      };

        const setImage = imageName => {
          let summerViewImageImageElement = document.createElement( 'img' );
          summerViewImageImageElement.src = 'media/images/' + imageName;
          summerViewImage.image = summerViewImageImageElement; 
        };
      
      
        setCenterX(seasonPosition.x);
setCenterY(seasonPosition.y);
setVisible(true);
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isWinterComponent' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isSummerComponent' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'seasonPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'currentSeason' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.seasonChangeSoundSoundClip );
      delete scratchpad.seasonChangeSoundSoundClip;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'isWinterComponent' ], scratchpad.seasonChangeSoundSoundMultilinkId );
      delete scratchpad.seasonChangeSoundSoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.seasonViewImage );
      delete scratchpad.seasonViewImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'seasonPosition' ], scratchpad.seasonViewImageMultilinkId );
      delete scratchpad.seasonViewImageMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.summerViewImage );
      delete scratchpad.summerViewImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'isSummerComponent' ], scratchpad.summerViewImageMultilinkId );
      delete scratchpad.summerViewImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty0 = phet.paperLand.getModelComponent( 'seasonPosition' );
    if ( modelProperty0 ) {
      modelProperty0.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty13 = phet.paperLand.getModelComponent( 'isWinterComponent' );
    if ( modelProperty13 ) {
      modelProperty13.value = otherPaperNumber === 10;
    }

    const modelProperty15 = phet.paperLand.getModelComponent( 'isSummerComponent' );
    if ( modelProperty15 ) {
      modelProperty15.value = true;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty18 = phet.paperLand.getModelComponent( 'isWinterComponent' );
    if ( modelProperty18 ) {
      modelProperty18.value = otherPaperNumber === 10 ? false : modelProperty18.value;
    }

    const modelProperty20 = phet.paperLand.getModelComponent( 'isSummerComponent' );
    if ( modelProperty20 ) {
      modelProperty20.value = false;
    }
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
  ctx.fillText('AE Program 1', canvas.width / 2, canvas.height / 2 + 20);
})();
