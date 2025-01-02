// Sound A
// Keywords: speech, description, sound, marker
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const markerIsOnA = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'markerIsOnA', markerIsOnA );
    

      const simonATrigger = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'simonATrigger', simonATrigger );
    

      const aPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'aPosition', aPosition );
    

      const aSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/d-tone.mp3' );
      const aSoundSoundClip = new phet.tambo.SoundClip( aSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( aSoundSoundClip );
      scratchpad.aSoundWrappedAudioBuffer = aSoundWrappedAudioBuffer;
      
      let aSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let aSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.aSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.aSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'markerIsOnA', 'playersTurn' ], ( markerIsOnA, playersTurn ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              aSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              aSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !aSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - aSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !aSoundSoundClip.isPlaying ) {
                  aSoundSoundClip.play();
                }
                aSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( aSoundStopSoundTimeout ){
                  window.clearTimeout( aSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  aSoundStopSoundTimeout = window.setTimeout( () => {
                    aSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( aSoundStopSoundTimeout ){
                window.clearTimeout( aSoundStopSoundTimeout );
              }
              aSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( playersTurn && markerIsOnA ) {

    // It is the player's turn and they put a marker on this paper - play the tone.
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.aSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.aSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.aSoundSoundClip = aSoundSoundClip;
    

      const simonASoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/d-tone.mp3' );
      const simonASoundSoundClip = new phet.tambo.SoundClip( simonASoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( simonASoundSoundClip );
      scratchpad.simonASoundWrappedAudioBuffer = simonASoundWrappedAudioBuffer;
      
      let simonASoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let simonASoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.simonASoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.simonASoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'simonATrigger' ], ( simonATrigger ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              simonASoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              simonASoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !simonASoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - simonASoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !simonASoundSoundClip.isPlaying ) {
                  simonASoundSoundClip.play();
                }
                simonASoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( simonASoundStopSoundTimeout ){
                  window.clearTimeout( simonASoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  simonASoundStopSoundTimeout = window.setTimeout( () => {
                    simonASoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( simonASoundStopSoundTimeout ){
                window.clearTimeout( simonASoundStopSoundTimeout );
              }
              simonASoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( simonATrigger ) {
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.simonASoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.simonASoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.simonASoundSoundClip = simonASoundSoundClip;
    


      // Create a shape with kite.
      const aViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.05, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const aViewPath = new phet.scenery.Path( aViewShape, {
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
      sharedData.scene.addChild( aViewPath );
      scratchpad.aViewPath = aViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.aViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'markerIsOnA', 'simonATrigger', 'aPosition', 'playersTurn' ], ( markerIsOnA, simonATrigger, aPosition, playersTurn ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const aViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.05, sharedData.displaySize.width ) )
        scratchpad.aViewPath.setShape( aViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.aViewPath.mutate( {
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
        aViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        aViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        aViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        aViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        aViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        aViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        aViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        aViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        aViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        aViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const aViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( aViewPath.localBounds.width || 1 ) / ( aViewPath.localBounds.height || 1 );

        const scaleX = aViewPathViewBounds.width / ( aViewPath.localBounds.width || 1 );
        const scaleY = aViewPathViewBounds.height / ( aViewPath.localBounds.height || 1 );

        if ( stretch ) {
          aViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          aViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        aViewPath.center = aViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          aViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          aViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          aViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          aView_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          aViewPath.shape = phet.kite.Shape.lineSegment( aView_x1, aView_y1, aView_x2, aView_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          aView_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          aViewPath.shape = phet.kite.Shape.lineSegment( aView_x1, aView_y1, aView_x2, aView_y2 );
        };

        const setX2 = ( newX2 ) => {
          aView_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          aViewPath.shape = phet.kite.Shape.lineSegment( aView_x1, aView_y1, aView_x2, aView_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          aView_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          aViewPath.shape = phet.kite.Shape.lineSegment( aView_x1, aView_y1, aView_x2, aView_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          aViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          aViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          aViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        if ( ( playersTurn && markerIsOnA ) || simonATrigger ) {
    setFill( 'green' );
    setRadius( 0.15 );
}
else {
    setFill( 'purple' );
    setRadius( 0.05 );
}

setStroke( 'black' );

setCenterX( aPosition.x );
setCenterY( aPosition.y );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'markerIsOnA' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'simonATrigger' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'aPosition' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.aSoundSoundClip );
      delete scratchpad.aSoundSoundClip;
      
      scratchpad.aSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.aSoundWrappedAudioBufferListener );
      delete scratchpad.aSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'markerIsOnA', 'playersTurn' ], scratchpad.aSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.aSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.simonASoundSoundClip );
      delete scratchpad.simonASoundSoundClip;
      
      scratchpad.simonASoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.simonASoundWrappedAudioBufferListener );
      delete scratchpad.simonASoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'simonATrigger' ], scratchpad.simonASoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.simonASoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.aViewPath );
      delete scratchpad.aViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'markerIsOnA', 'simonATrigger', 'aPosition', 'playersTurn' ], scratchpad.aViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.aViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty868 = phet.paperLand.getModelComponent( 'aPosition' );
    if ( modelProperty868 ) {
      modelProperty868.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty871 = phet.paperLand.getModelComponent( 'markerIsOnA' );
    if ( modelProperty871 ) {
      modelProperty871.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty874 = phet.paperLand.getModelComponent( 'markerIsOnA' );
    if ( modelProperty874 ) {
      modelProperty874.value = markers.length > 0;
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
  ctx.fillText('Sound A', canvas.width / 2, canvas.height / 2 + 20);
})();
