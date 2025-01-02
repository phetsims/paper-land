// Game Logic
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const gameWon = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'gameWon', gameWon );
    

      const ballPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0.5, 0.5 )
      );
      phet.paperLand.addModelComponent( 'ballPosition', ballPosition );
    

      const ballVelocity = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0.05, 0.1 )
      );
      phet.paperLand.addModelComponent( 'ballVelocity', ballVelocity );
    

      const ballRotation = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'ballRotation', ballRotation );
    

      const gameBeatWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/musicalBeat.mp3' );
      const gameBeatSoundClip = new phet.tambo.SoundClip( gameBeatWrappedAudioBuffer, {
        loop: true,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( gameBeatSoundClip );
      scratchpad.gameBeatWrappedAudioBuffer = gameBeatWrappedAudioBuffer;
      
      let gameBeatStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let gameBeatLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.gameBeatWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.gameBeatSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'gameWon' ], ( gameWon ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              gameBeatSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              gameBeatSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !gameBeatSoundClip.isPlaying || !true ) && phet.paperLand.elapsedTimeProperty.value - gameBeatLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !gameBeatSoundClip.isPlaying ) {
                  gameBeatSoundClip.play();
                }
                gameBeatLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( gameBeatStopSoundTimeout ){
                  window.clearTimeout( gameBeatStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !true ) {
                  gameBeatStopSoundTimeout = window.setTimeout( () => {
                    gameBeatSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( gameBeatStopSoundTimeout ){
                window.clearTimeout( gameBeatStopSoundTimeout );
              }
              gameBeatSoundClip.stop();
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
      scratchpad.gameBeatWrappedAudioBuffer.audioBufferProperty.link( scratchpad.gameBeatWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.gameBeatSoundClip = gameBeatSoundClip;
    

      const gameWonSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/short-success.mp3' );
      const gameWonSoundSoundClip = new phet.tambo.SoundClip( gameWonSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( gameWonSoundSoundClip );
      scratchpad.gameWonSoundWrappedAudioBuffer = gameWonSoundWrappedAudioBuffer;
      
      let gameWonSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let gameWonSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.gameWonSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.gameWonSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'gameWon' ], ( gameWon ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              gameWonSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              gameWonSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !gameWonSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - gameWonSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !gameWonSoundSoundClip.isPlaying ) {
                  gameWonSoundSoundClip.play();
                }
                gameWonSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( gameWonSoundStopSoundTimeout ){
                  window.clearTimeout( gameWonSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  gameWonSoundStopSoundTimeout = window.setTimeout( () => {
                    gameWonSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( gameWonSoundStopSoundTimeout ){
                window.clearTimeout( gameWonSoundStopSoundTimeout );
              }
              gameWonSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( gameWon ) {
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.gameWonSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.gameWonSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.gameWonSoundSoundClip = gameWonSoundSoundClip;
    

      // Create the text and add it to the view - using RichText for nice markup support.
      const gameWonTextText = new phet.scenery.RichText( '', { fill: 'white' } );
      
      sharedData.scene.addChild( gameWonTextText );
      scratchpad.gameWonTextText = gameWonTextText;
      
      // Update the text when a dependency changes.
      scratchpad.gameWonTextTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'gameWon' ], ( gameWon ) => {
      
        // the additional reference constants
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        gameWonTextText.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        gameWonTextText.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        gameWonTextText.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        gameWonTextText.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        gameWonTextText.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        gameWonTextText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        gameWonTextText.visible = visible;
      };
      
      const moveToFront = () => {
        gameWonTextText.moveToFront();
      };
      
      const moveToBack = () => {
        gameWonTextText.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        gameWonTextText.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const gameWonTextTextViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( gameWonTextText.localBounds.width || 1 ) / ( gameWonTextText.localBounds.height || 1 );

        const scaleX = gameWonTextTextViewBounds.width / ( gameWonTextText.localBounds.width || 1 );
        const scaleY = gameWonTextTextViewBounds.height / ( gameWonTextText.localBounds.height || 1 );

        if ( stretch ) {
          gameWonTextText.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          gameWonTextText.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        gameWonTextText.center = gameWonTextTextViewBounds.center;
      };
      

        const setString = ( string ) => {
          gameWonTextText.string = string;
        };
        
        const setFontSize = ( size ) => {
        
          // RichText has no setter for size, so we need to create a new font. Use
          // state from the old font to maintain the family.
          const currentFont = gameWonTextText.font;
          const newFont = new phet.scenery.Font( { size: size, family: currentFont.family } );
          gameWonTextText.font = newFont;
        };

        const setTextColor = ( color ) => {
          gameWonTextText.fill = color;
        };

        const setFontFamily = ( family ) => {
        
          // RichText has no setter for fontFamily, so we need to create a new font. Use
          // state from the old font to maintain the size.
          const currentFont = gameWonTextText.font;
          const newFont = new phet.scenery.Font( { size: currentFont.size, family: family } );
          gameWonTextText.font = newFont;
        };
      

        // the function that the user wrote to update the text      
        setVisible( gameWon );
setString( 'You Won!!' );
setFontSize( 48 );

setCenterX( 0.5 )
setCenterY( 0.5 );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const ballViewShape = phet.kite.Shape.ellipse( phet.paperLand.utils.paperToBoardX( 0.03, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.03, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const ballViewPath = new phet.scenery.Path( ballViewShape, {
        fill: 'red',
        stroke: 'blue',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ) : 0.5,
        centerY: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height) : 0.5,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( ballViewPath );
      scratchpad.ballViewPath = ballViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.ballViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'ballPosition', 'ballRotation' ], ( ballPosition, ballRotation ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const ballViewShape = phet.kite.Shape.ellipse( phet.paperLand.utils.paperToBoardX( 0.03, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.03, sharedData.displaySize.height ) )
        scratchpad.ballViewPath.setShape( ballViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.ballViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ) : 0.5,
          centerY: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height) : 0.5,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        ballViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        ballViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        ballViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        ballViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        ballViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        ballViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        ballViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        ballViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        ballViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        ballViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const ballViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( ballViewPath.localBounds.width || 1 ) / ( ballViewPath.localBounds.height || 1 );

        const scaleX = ballViewPathViewBounds.width / ( ballViewPath.localBounds.width || 1 );
        const scaleY = ballViewPathViewBounds.height / ( ballViewPath.localBounds.height || 1 );

        if ( stretch ) {
          ballViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          ballViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        ballViewPath.center = ballViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          ballViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          ballViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          ballViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          ballView_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          ballViewPath.shape = phet.kite.Shape.lineSegment( ballView_x1, ballView_y1, ballView_x2, ballView_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          ballView_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          ballViewPath.shape = phet.kite.Shape.lineSegment( ballView_x1, ballView_y1, ballView_x2, ballView_y2 );
        };

        const setX2 = ( newX2 ) => {
          ballView_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          ballViewPath.shape = phet.kite.Shape.lineSegment( ballView_x1, ballView_y1, ballView_x2, ballView_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          ballView_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          ballViewPath.shape = phet.kite.Shape.lineSegment( ballView_x1, ballView_y1, ballView_x2, ballView_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          ballViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          ballViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          ballViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setCenterX( ballPosition.x );
setCenterY( ballPosition.y );

setRotation( ballRotation );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    

      // Speak whenever the dependencies change.
      const speakWonSpeechFunction = ( gameWon ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        speakWonSpeech.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        speakWonSpeech.centerY = y;
      };
      
      const setLeft = ( left ) => {
        speakWonSpeech.left = left;
      };
      
      const setTop = ( top ) => {
        speakWonSpeech.top = top;
      };
      
      const setScale = ( scale ) => {
        speakWonSpeech.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        speakWonSpeech.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        speakWonSpeech.visible = visible;
      };
      
      const moveToFront = () => {
        speakWonSpeech.moveToFront();
      };
      
      const moveToBack = () => {
        speakWonSpeech.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        speakWonSpeech.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const speakWonSpeechViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( speakWonSpeech.localBounds.width || 1 ) / ( speakWonSpeech.localBounds.height || 1 );

        const scaleX = speakWonSpeechViewBounds.width / ( speakWonSpeech.localBounds.width || 1 );
        const scaleY = speakWonSpeechViewBounds.height / ( speakWonSpeech.localBounds.height || 1 );

        if ( stretch ) {
          speakWonSpeech.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          speakWonSpeech.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        speakWonSpeech.center = speakWonSpeechViewBounds.center;
      };
      

      
        // Stop all speech and clear the queue
        const interruptSpeech = () => {
          phet.scenery.voicingUtteranceQueue.cancel();;
        };
        
        // Mute/unmute the utterance queue
        const setMuted = ( v ) => {
          phet.scenery.voicingUtteranceQueue.setMuted( v );
        };
        
        // Sets the priority of this utterance in the queue
        const setPriority = ( v ) => {
          scratchpad.speakWonSpeechUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.speakWonSpeechUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        if (gameWon) {
 return "You did it!"
}
      }
      
      // a reusable utterance for this speech component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.speakWonSpeechUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.speakWonSpeechMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'gameWon' ], ( gameWon ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const speechResult = speakWonSpeechFunction( gameWon );
        if ( speechResult && speechResult.toString ) {
          const speechString = speechResult.toString();
          if ( speechString && speechString.length > 0 ) {
            scratchpad.speakWonSpeechUtterance.alert = speechString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.speakWonSpeechUtterance ); 
          }
        }
      }, {
        lazy: false,
        otherReferences: [  ]
      } ); 
    

      const gameLoopAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'gameWon', 'ballPosition', 'ballVelocity', 'ballRotation', 'paddleCollideTrigger', 'paddleBounds', 'brick1Visible', 'brick1Bounds', 'resetGameTrigger', 'brick2Visible', 'brick2Bounds', 'brick3Visible', 'brick3Bounds', 'brick4Visible', 'brick4Bounds' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const gameWon = phet.paperLand.getModelComponent( 'gameWon' ).value;
const ballPosition = phet.paperLand.getModelComponent( 'ballPosition' ).value;
const ballVelocity = phet.paperLand.getModelComponent( 'ballVelocity' ).value;
const ballRotation = phet.paperLand.getModelComponent( 'ballRotation' ).value;
const paddleCollideTrigger = phet.paperLand.getModelComponent( 'paddleCollideTrigger' ).value;
const paddleBounds = phet.paperLand.getModelComponent( 'paddleBounds' ).value;
const brick1Visible = phet.paperLand.getModelComponent( 'brick1Visible' ).value;
const brick1Bounds = phet.paperLand.getModelComponent( 'brick1Bounds' ).value;
const resetGameTrigger = phet.paperLand.getModelComponent( 'resetGameTrigger' ).value;
const brick2Visible = phet.paperLand.getModelComponent( 'brick2Visible' ).value;
const brick2Bounds = phet.paperLand.getModelComponent( 'brick2Bounds' ).value;
const brick3Visible = phet.paperLand.getModelComponent( 'brick3Visible' ).value;
const brick3Bounds = phet.paperLand.getModelComponent( 'brick3Bounds' ).value;
const brick4Visible = phet.paperLand.getModelComponent( 'brick4Visible' ).value;
const brick4Bounds = phet.paperLand.getModelComponent( 'brick4Bounds' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setGameWon = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'gameWon' );
        modelComponent.value = newValue;  
      }
      
const setBallPosition = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'ballPosition' );
        modelComponent.value = newValue;  
      }
      
const setBallVelocity = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'ballVelocity' );
        modelComponent.value = newValue;  
      }
      
const setBallRotation = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'ballRotation' );
        modelComponent.value = newValue;  
      }
      
const setPaddleCollideTrigger = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'paddleCollideTrigger' );
        modelComponent.value = newValue;  
      }
      
const setPaddleBounds = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'paddleBounds' );
        modelComponent.value = newValue;  
      }
      
const setBrick1Visible = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick1Visible' );
        modelComponent.value = newValue;  
      }
      
const setBrick1Bounds = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick1Bounds' );
        modelComponent.value = newValue;  
      }
      
const setResetGameTrigger = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'resetGameTrigger' );
        modelComponent.value = newValue;  
      }
      
const setBrick2Visible = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick2Visible' );
        modelComponent.value = newValue;  
      }
      
const setBrick2Bounds = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick2Bounds' );
        modelComponent.value = newValue;  
      }
      
const setBrick3Visible = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick3Visible' );
        modelComponent.value = newValue;  
      }
      
const setBrick3Bounds = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick3Bounds' );
        modelComponent.value = newValue;  
      }
      
const setBrick4Visible = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick4Visible' );
        modelComponent.value = newValue;  
      }
      
const setBrick4Bounds = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'brick4Bounds' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          // A constant used to set speed of the ball, change this value to make it move faster
// or slower - ball velocity will be set based on game state using this value.
const ballSpeedY = 0.3;
const ballSpeedX = 0.2;

// just for fun, make the ball rotate
setBallRotation( elapsedTime * 10 );

// Update the ball to its new position based on the current velocity
setBallPosition( new phet.dot.Vector2(
    ballPosition.x + ballVelocity.x * dt,
    ballPosition.y + ballVelocity.y * dt,
) );

// if the ball goes below the paddle, reset its position and velocity to keep playing
if ( ballPosition.y > 1 ) {
    setBallPosition( new phet.dot.Vector2( 0.5, 0.5 ) );
    setBallVelocity( new phet.dot.Vector2( 0, ballSpeedY ) );
}

// if the ball hits the left or right edge of the screen, set the x component
// so that it stays in screen
if ( ballPosition.x < 0 ) {
    setBallVelocity( new phet.dot.Vector2( ballSpeedX, ballVelocity.y ) );
}
if ( ballPosition.x > 1 ) {
    setBallVelocity( new phet.dot.Vector2( -ballSpeedX, ballVelocity.y ) );
}

// if the ball hits the top (0), flip the y component of velocity
if ( ballPosition.y < 0 ) {
    setBallVelocity( new phet.dot.Vector2( ballVelocity.x, ballSpeedY ) );
}

// If the ball hits the paddle, make it move up and give a random component of x velocity
if ( paddleBounds.containsPoint( ballPosition ) ) {

    // Ball will move in the direction of the side of the paddle it hits
    let ballVelocityX = 0.5 * ( ( ballPosition.x - paddleBounds.centerX ) / paddleBounds.width );
    setBallVelocity( new phet.dot.Vector2( ballVelocityX, -ballSpeedY ) );

    // Set a trigger that will play a sound on the collision
    setPaddleCollideTrigger( true );
}
else {

    // The paddle is no longer touching the ball, set the collide trigger to false
    setPaddleCollideTrigger( false );
}


// collect brick bounds, visibility, and visibility setter functions into an array to work with them easily
const allBrickBounds = [
    brick1Bounds,
    brick2Bounds,
    brick3Bounds,
    brick4Bounds
];

const allBrickVisibles = [
    brick1Visible,
    brick2Visible,
    brick3Visible,
    brick4Visible
];

const brickVisibleSetters = [
    setBrick1Visible,
    setBrick2Visible,
    setBrick3Visible,
    setBrick4Visible
];

// If the ball hits any brick, make it invisible and then make the ball move down
allBrickBounds.forEach( ( bounds, index ) => {

    // NOTE - this assumes that the bricks in bounds and visibilities are IN THE SAME ORDER
    // because the lookup for visibility setter uses the index from the bounds array.
    const isBrickVisible = allBrickVisibles[ index ];
    if ( isBrickVisible && bounds.containsPoint( ballPosition ) ) {
        brickVisibleSetters[ index ]( false );
        setBallVelocity( new phet.dot.Vector2( ballVelocity.x, ballSpeedY ) );
    }
} );

// instead of using a link, it is easiest to reset the game state directly in the game loop since
// we have the collections of bricks set up here
if ( resetGameTrigger ) {
    setBallVelocity( new phet.dot.Vector2( ballSpeedX, ballSpeedY ) );
    setBallPosition( new phet.dot.Vector2( 0.5, 0.5 ) );

    brickVisibleSetters.forEach( visibleSetter => {
        visibleSetter( true );
    } );
}

// game is won when all bricks are invisible
setGameWon( allBrickVisibles.every( brickVisible => !brickVisible ) ); 
        }
      };
      scratchpad.gameLoopAnimationListener = gameLoopAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( gameLoopAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'gameWon' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'ballPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'ballVelocity' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'ballRotation' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.gameBeatSoundClip );
      delete scratchpad.gameBeatSoundClip;
      
      scratchpad.gameBeatWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.gameBeatWrappedAudioBufferListener );
      delete scratchpad.gameBeatWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'gameWon' ], scratchpad.gameBeatSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.gameBeatSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.gameWonSoundSoundClip );
      delete scratchpad.gameWonSoundSoundClip;
      
      scratchpad.gameWonSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.gameWonSoundWrappedAudioBufferListener );
      delete scratchpad.gameWonSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'gameWon' ], scratchpad.gameWonSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.gameWonSoundSoundMultilinkId;
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.gameWonTextText );
      delete scratchpad.gameWonTextText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'gameWon' ], scratchpad.gameWonTextTextMultilinkId, {
        otherReferences: [  ]
      });
      delete scratchpad.gameWonTextTextMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.ballViewPath );
      delete scratchpad.ballViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'ballPosition', 'ballRotation' ], scratchpad.ballViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.ballViewPathMultilinkId;
    

      // Remove the Speech multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'gameWon' ], scratchpad.speakWonSpeechMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.speakWonSpeechMultilinkId;
      
      // Remove the utterance
      delete scratchpad.speakWonSpeechUtterance;
    

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
