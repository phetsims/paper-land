// Game Logic
// Keywords: 
// Description: The 'game logic'. Uses an animation component to play the song sequence and receive notes from the player.
// 
// The song sequence is encoded in a string for convenience. Would be nice if the array component could work but it doesn't support this case. It
// would be better if we had a catch-all component for any kind of JavaScript object for this kind of thing.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const playersTurn = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'playersTurn', playersTurn );
    

      const playerWon = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'playerWon', playerWon );
    

      const songPlaybackIndex = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 8 )
      });
      phet.paperLand.addModelComponent( 'songPlaybackIndex', songPlaybackIndex );
    

      const timeSinceComputerNote = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'timeSinceComputerNote', timeSinceComputerNote );
    

      const gameSequence = new phet.axon.StringProperty( 'a-b-c-d' );
      phet.paperLand.addModelComponent( 'gameSequence', gameSequence );
    

      const playerPlaybackSequence = new phet.axon.StringProperty( '' );
      phet.paperLand.addModelComponent( 'playerPlaybackSequence', playerPlaybackSequence );
    

      const sequenceLength = new phet.axon.NumberProperty( 4, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'sequenceLength', sequenceLength );
    

      // Create the text and add it to the view - using RichText for nice markup support.
      const gameStateTextText = new phet.scenery.RichText( '', { fill: 'white' } );
      
      sharedData.scene.addChild( gameStateTextText );
      scratchpad.gameStateTextText = gameStateTextText;
      
      // Update the text when a dependency changes.
      scratchpad.gameStateTextTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'simonATrigger', 'playersTurn', 'playerWon', 'simonBTrigger', 'simonCTrigger', 'simonDTrigger' ], ( simonATrigger, playersTurn, playerWon, simonBTrigger, simonCTrigger, simonDTrigger ) => {
      
        // the additional reference constants
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        gameStateTextText.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        gameStateTextText.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        gameStateTextText.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        gameStateTextText.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        gameStateTextText.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        gameStateTextText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        gameStateTextText.visible = visible;
      };
      
      const moveToFront = () => {
        gameStateTextText.moveToFront();
      };
      
      const moveToBack = () => {
        gameStateTextText.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        gameStateTextText.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const gameStateTextTextViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( gameStateTextText.localBounds.width || 1 ) / ( gameStateTextText.localBounds.height || 1 );

        const scaleX = gameStateTextTextViewBounds.width / ( gameStateTextText.localBounds.width || 1 );
        const scaleY = gameStateTextTextViewBounds.height / ( gameStateTextText.localBounds.height || 1 );

        if ( stretch ) {
          gameStateTextText.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          gameStateTextText.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        gameStateTextText.center = gameStateTextTextViewBounds.center;
      };
      

        const setString = ( string ) => {
          gameStateTextText.string = string;
        };
        
        const setFontSize = ( size ) => {
        
          // RichText has no setter for size, so we need to create a new font. Use
          // state from the old font to maintain the family.
          const currentFont = gameStateTextText.font;
          const newFont = new phet.scenery.Font( { size: size, family: currentFont.family } );
          gameStateTextText.font = newFont;
        };

        const setTextColor = ( color ) => {
          gameStateTextText.fill = color;
        };

        const setFontFamily = ( family ) => {
        
          // RichText has no setter for fontFamily, so we need to create a new font. Use
          // state from the old font to maintain the size.
          const currentFont = gameStateTextText.font;
          const newFont = new phet.scenery.Font( { size: currentFont.size, family: family } );
          gameStateTextText.font = newFont;
        };
      

        // the function that the user wrote to update the text      
        if ( playerWon ) {
    setString( 'You won!' );
}
else if ( playersTurn ) {
    setString( 'Your turn!' );
}
else if ( simonATrigger ) {
    setString( 'Up!' );
}
else if ( simonBTrigger ) {
    setString( 'Left!' );
}
else if ( simonCTrigger ) {
    setString( 'Right!' );
}
else if ( simonDTrigger ) {
    setString( 'Down!');
}

setFontSize( 48 );
setCenterX( 0.5 );
setCenterY( 0.5 );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    

      const yippeeWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/uploads/yipee-45360.mp3' );
      const yippeeSoundClip = new phet.tambo.SoundClip( yippeeWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( yippeeSoundClip );
      scratchpad.yippeeWrappedAudioBuffer = yippeeWrappedAudioBuffer;
      
      let yippeeStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let yippeeLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.yippeeWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.yippeeSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playerWon' ], ( playerWon ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              yippeeSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              yippeeSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !yippeeSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - yippeeLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !yippeeSoundClip.isPlaying ) {
                  yippeeSoundClip.play();
                }
                yippeeLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( yippeeStopSoundTimeout ){
                  window.clearTimeout( yippeeStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  yippeeStopSoundTimeout = window.setTimeout( () => {
                    yippeeSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( yippeeStopSoundTimeout ){
                window.clearTimeout( yippeeStopSoundTimeout );
              }
              yippeeSoundClip.stop();
            };
            
            if ( true ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( playerWon ) {
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.yippeeWrappedAudioBuffer.audioBufferProperty.link( scratchpad.yippeeWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.yippeeSoundClip = yippeeSoundClip;
    

      scratchpad.playerSequenceControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'markerIsOnA', 'playersTurn', 'markerIsOnB', 'markerIsOnC', 'markerIsOnD' ], ( markerIsOnA, playersTurn, markerIsOnB, markerIsOnC, markerIsOnD ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'playerPlaybackSequence' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const playerPlaybackSequence = phet.paperLand.getModelComponent( 'playerPlaybackSequence' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setPlayerPlaybackSequence = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'playerPlaybackSequence' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if ( playersTurn ) {
    let nextNote;
    if ( markerIsOnA ) {
        nextNote = playerPlaybackSequence.length > 0 ? '-a' : 'a';
    }
    else if ( markerIsOnB ) {
        nextNote = playerPlaybackSequence.length > 0 ? '-b' : 'b';
    }
    else if ( markerIsOnC ) {
        nextNote = playerPlaybackSequence.length > 0 ? '-c' : 'c';
    }
    else if ( markerIsOnD ) {
        nextNote = playerPlaybackSequence.length > 0 ? '-d' : 'd';
    }

    // Add the next note to the player sequence
    if ( nextNote ) {
        setPlayerPlaybackSequence( playerPlaybackSequence + nextNote );
    }
}   
        }
      } );
    

      const gameLoopAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'simonATrigger', 'playersTurn', 'playerWon', 'songPlaybackIndex', 'timeSinceComputerNote', 'gameSequence', 'playerPlaybackSequence', 'simonBTrigger', 'simonCTrigger', 'simonDTrigger', 'sequenceLength' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const simonATrigger = phet.paperLand.getModelComponent( 'simonATrigger' ).value;
const playersTurn = phet.paperLand.getModelComponent( 'playersTurn' ).value;
const playerWon = phet.paperLand.getModelComponent( 'playerWon' ).value;
const songPlaybackIndex = phet.paperLand.getModelComponent( 'songPlaybackIndex' ).value;
const timeSinceComputerNote = phet.paperLand.getModelComponent( 'timeSinceComputerNote' ).value;
const gameSequence = phet.paperLand.getModelComponent( 'gameSequence' ).value;
const playerPlaybackSequence = phet.paperLand.getModelComponent( 'playerPlaybackSequence' ).value;
const simonBTrigger = phet.paperLand.getModelComponent( 'simonBTrigger' ).value;
const simonCTrigger = phet.paperLand.getModelComponent( 'simonCTrigger' ).value;
const simonDTrigger = phet.paperLand.getModelComponent( 'simonDTrigger' ).value;
const sequenceLength = phet.paperLand.getModelComponent( 'sequenceLength' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setSimonATrigger = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'simonATrigger' );
        modelComponent.value = newValue;  
      }
      
const setPlayersTurn = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'playersTurn' );
        modelComponent.value = newValue;  
      }
      
const setPlayerWon = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'playerWon' );
        modelComponent.value = newValue;  
      }
      
const setSongPlaybackIndex = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'songPlaybackIndex' );
        modelComponent.value = newValue;  
      }
      
const setTimeSinceComputerNote = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'timeSinceComputerNote' );
        modelComponent.value = newValue;  
      }
      
const setGameSequence = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'gameSequence' );
        modelComponent.value = newValue;  
      }
      
const setPlayerPlaybackSequence = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'playerPlaybackSequence' );
        modelComponent.value = newValue;  
      }
      
const setSimonBTrigger = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'simonBTrigger' );
        modelComponent.value = newValue;  
      }
      
const setSimonCTrigger = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'simonCTrigger' );
        modelComponent.value = newValue;  
      }
      
const setSimonDTrigger = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'simonDTrigger' );
        modelComponent.value = newValue;  
      }
      
const setSequenceLength = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'sequenceLength' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          if ( playersTurn ) {
    const sequenceArray = gameSequence.split( '-' );
    const playerSequenceArray = playerPlaybackSequence.split( '-' );

    // otherwise, if they are the same, player wins
    if ( playerPlaybackSequence === gameSequence ) {
        setPlayerWon( true );

        setSequenceLength( sequenceLength + 1 );

        setPlayersTurn( false );
        setPlayerPlaybackSequence( '' );
        setTimeSinceComputerNote( 0 );

        // create a new game sequence with 4 notes
        const letters = [ 'a', 'b', 'c', 'd' ];
        let newSequence = letters[ Math.round( Math.random() * 3 ) ];
        for ( let i = 0; i < sequenceLength; i++ ) {
            const randomLetter = letters[ Math.round( Math.random() * 3 ) ];
            newSequence = `${newSequence}-${randomLetter}`;
        } 
        setGameSequence( newSequence );
    }
    else {

      // if any of the player's sequences are wrong, stop and move to computer turn
      playerSequenceArray.forEach( ( note, index ) => {
          if ( note && sequenceArray[ index ] !== note ) {
            setPlayersTurn( false );
            setPlayerPlaybackSequence( '' );
            setTimeSinceComputerNote( 0 );
          }
      } );
        
    }
}
else {

    // Its the computer's turn - play through the song sequence one note at a time


    // increment time since the last note
    setTimeSinceComputerNote( timeSinceComputerNote + dt );

    // if it has been long enough, play the next note
    const interval = 1;

    if ( timeSinceComputerNote > interval / 2 ) {

        // reset computer note triggers before playing the next tone
        setSimonATrigger( false );
        setSimonBTrigger( false );
        setSimonCTrigger( false );
        setSimonDTrigger( false );
    }

    if ( timeSinceComputerNote > interval ) {

        // if the player won last game, reset this state so that we go back to turn text
        setPlayerWon( false );

        const gameSequenceArray = gameSequence.split( '-' );

        const nextNoteToPlay = gameSequenceArray[ songPlaybackIndex ]

        if ( nextNoteToPlay === 'a' ) {
            setSimonATrigger( true );
        }
        else if ( nextNoteToPlay === 'b' ) {
            setSimonBTrigger( true );
        }
        else if ( nextNoteToPlay === 'c' ) {
            setSimonCTrigger( true );
        }
        else if ( nextNoteToPlay === 'd' ) {
            setSimonDTrigger( true );
        }

        // reset interval to play the next note after a delay
        setTimeSinceComputerNote( 0 );

        setSongPlaybackIndex( songPlaybackIndex + 1 );

        if ( songPlaybackIndex === gameSequenceArray.length ) {

            // We have played through all the notes, switch to player turn
            setPlayersTurn( true );
            setSongPlaybackIndex( 0 );
        }
    }

} 
        }
      };
      scratchpad.gameLoopAnimationListener = gameLoopAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( gameLoopAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'playersTurn' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'playerWon' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'songPlaybackIndex' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'timeSinceComputerNote' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'gameSequence' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'playerPlaybackSequence' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'sequenceLength' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.gameStateTextText );
      delete scratchpad.gameStateTextText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'simonATrigger', 'playersTurn', 'playerWon', 'simonBTrigger', 'simonCTrigger', 'simonDTrigger' ], scratchpad.gameStateTextTextMultilinkId, {
        otherReferences: [  ]
      });
      delete scratchpad.gameStateTextTextMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.yippeeSoundClip );
      delete scratchpad.yippeeSoundClip;
      
      scratchpad.yippeeWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.yippeeWrappedAudioBufferListener );
      delete scratchpad.yippeeWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'playerWon' ], scratchpad.yippeeSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.yippeeSoundMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'markerIsOnA', 'playersTurn', 'markerIsOnB', 'markerIsOnC', 'markerIsOnD' ], scratchpad.playerSequenceControllerMultilinkId );
      delete scratchpad.playerSequenceControllerMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.gameLoopAnimationListener );
      delete scratchpad.gameLoopAnimationListener;
    
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
  ctx.fillText('Game Logic', canvas.width / 2, canvas.height / 2 + 20);
})();
