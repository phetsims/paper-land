// Sound B
// Keywords: speech, description, sound, marker
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const markerIsOnB = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'markerIsOnB', markerIsOnB );
    

      const simonBTrigger = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'simonBTrigger', simonBTrigger );
    

      const bPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'bPosition', bPosition );
    

      const bSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/b-tone.mp3' );
      const bSoundSoundClip = new phet.tambo.SoundClip( bSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( bSoundSoundClip );
      scratchpad.bSoundWrappedAudioBuffer = bSoundWrappedAudioBuffer;
      
      let bSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let bSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.bSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.bSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playersTurn', 'markerIsOnB' ], ( playersTurn, markerIsOnB ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              bSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              bSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !bSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - bSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !bSoundSoundClip.isPlaying ) {
                  bSoundSoundClip.play();
                }
                bSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( bSoundStopSoundTimeout ){
                  window.clearTimeout( bSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  bSoundStopSoundTimeout = window.setTimeout( () => {
                    bSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( bSoundStopSoundTimeout ){
                window.clearTimeout( bSoundStopSoundTimeout );
              }
              bSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( playersTurn && markerIsOnB ) {

    // It is the player's turn and they put a marker on this paper - play the tone.
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.bSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.bSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.bSoundSoundClip = bSoundSoundClip;
    

      const simonBSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/b-tone.mp3' );
      const simonBSoundSoundClip = new phet.tambo.SoundClip( simonBSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( simonBSoundSoundClip );
      scratchpad.simonBSoundWrappedAudioBuffer = simonBSoundWrappedAudioBuffer;
      
      let simonBSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let simonBSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.simonBSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.simonBSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'simonBTrigger' ], ( simonBTrigger ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              simonBSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              simonBSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !simonBSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - simonBSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !simonBSoundSoundClip.isPlaying ) {
                  simonBSoundSoundClip.play();
                }
                simonBSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( simonBSoundStopSoundTimeout ){
                  window.clearTimeout( simonBSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  simonBSoundStopSoundTimeout = window.setTimeout( () => {
                    simonBSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( simonBSoundStopSoundTimeout ){
                window.clearTimeout( simonBSoundStopSoundTimeout );
              }
              simonBSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( simonBTrigger ) {
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.simonBSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.simonBSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.simonBSoundSoundClip = simonBSoundSoundClip;
    


      // Create a shape with kite.
      const bViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.05, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const bViewPath = new phet.scenery.Path( bViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ) : 0.5,
        centerY: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height) : 0.5,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( bViewPath );
      scratchpad.bViewPath = bViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.bViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playersTurn', 'markerIsOnB', 'simonBTrigger', 'bPosition' ], ( playersTurn, markerIsOnB, simonBTrigger, bPosition ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const bViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.05, sharedData.displaySize.width ) )
        scratchpad.bViewPath.setShape( bViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.bViewPath.mutate( {
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
        bViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        bViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        bViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        bViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        bViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        bViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        bViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        bViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        bViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        bViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const bViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( bViewPath.localBounds.width || 1 ) / ( bViewPath.localBounds.height || 1 );

        const scaleX = bViewPathViewBounds.width / ( bViewPath.localBounds.width || 1 );
        const scaleY = bViewPathViewBounds.height / ( bViewPath.localBounds.height || 1 );

        if ( stretch ) {
          bViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          bViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        bViewPath.center = bViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          bViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          bViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          bViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          bView_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          bViewPath.shape = phet.kite.Shape.lineSegment( bView_x1, bView_y1, bView_x2, bView_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          bView_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          bViewPath.shape = phet.kite.Shape.lineSegment( bView_x1, bView_y1, bView_x2, bView_y2 );
        };

        const setX2 = ( newX2 ) => {
          bView_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          bViewPath.shape = phet.kite.Shape.lineSegment( bView_x1, bView_y1, bView_x2, bView_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          bView_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          bViewPath.shape = phet.kite.Shape.lineSegment( bView_x1, bView_y1, bView_x2, bView_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          bViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          bViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          bViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        if ( ( playersTurn && markerIsOnB ) || simonBTrigger ) {
    setFill( 'blue' );
    setRadius( 0.15 );
}
else {
    setFill( 'purple' );
    setRadius( 0.05 );
}

setStroke( 'black' );

setCenterX( bPosition.x );
setCenterY( bPosition.y );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'markerIsOnB' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'simonBTrigger' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'bPosition' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.bSoundSoundClip );
      delete scratchpad.bSoundSoundClip;
      
      scratchpad.bSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.bSoundWrappedAudioBufferListener );
      delete scratchpad.bSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'playersTurn', 'markerIsOnB' ], scratchpad.bSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.bSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.simonBSoundSoundClip );
      delete scratchpad.simonBSoundSoundClip;
      
      scratchpad.simonBSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.simonBSoundWrappedAudioBufferListener );
      delete scratchpad.simonBSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'simonBTrigger' ], scratchpad.simonBSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.simonBSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.bViewPath );
      delete scratchpad.bViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'playersTurn', 'markerIsOnB', 'simonBTrigger', 'bPosition' ], scratchpad.bViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.bViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty879 = phet.paperLand.getModelComponent( 'bPosition' );
    if ( modelProperty879 ) {
      modelProperty879.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty882 = phet.paperLand.getModelComponent( 'markerIsOnB' );
    if ( modelProperty882 ) {
      modelProperty882.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty885 = phet.paperLand.getModelComponent( 'markerIsOnB' );
    if ( modelProperty885 ) {
      modelProperty885.value = markers.length > 0;
    }
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
  ctx.fillText('Sound B', canvas.width / 2, canvas.height / 2 + 20);
})();
