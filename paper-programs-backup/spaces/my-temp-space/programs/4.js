// Sound C
// Keywords: speech, description, sound, marker
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const markerIsOnC = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'markerIsOnC', markerIsOnC );
    

      const simonCTrigger = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'simonCTrigger', simonCTrigger );
    

      const cPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'cPosition', cPosition );
    

      const cSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/g-tone.mp3' );
      const cSoundSoundClip = new phet.tambo.SoundClip( cSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( cSoundSoundClip );
      scratchpad.cSoundWrappedAudioBuffer = cSoundWrappedAudioBuffer;
      
      let cSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let cSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.cSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.cSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playersTurn', 'markerIsOnC' ], ( playersTurn, markerIsOnC ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              cSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              cSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !cSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - cSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !cSoundSoundClip.isPlaying ) {
                  cSoundSoundClip.play();
                }
                cSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( cSoundStopSoundTimeout ){
                  window.clearTimeout( cSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  cSoundStopSoundTimeout = window.setTimeout( () => {
                    cSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( cSoundStopSoundTimeout ){
                window.clearTimeout( cSoundStopSoundTimeout );
              }
              cSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( playersTurn && markerIsOnC ) {

    // It is the player's turn and they put a marker on this paper - play the tone.
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.cSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.cSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.cSoundSoundClip = cSoundSoundClip;
    

      const simonCSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/g-tone.mp3' );
      const simonCSoundSoundClip = new phet.tambo.SoundClip( simonCSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( simonCSoundSoundClip );
      scratchpad.simonCSoundWrappedAudioBuffer = simonCSoundWrappedAudioBuffer;
      
      let simonCSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let simonCSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.simonCSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.simonCSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'simonCTrigger' ], ( simonCTrigger ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              simonCSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              simonCSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !simonCSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - simonCSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !simonCSoundSoundClip.isPlaying ) {
                  simonCSoundSoundClip.play();
                }
                simonCSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( simonCSoundStopSoundTimeout ){
                  window.clearTimeout( simonCSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  simonCSoundStopSoundTimeout = window.setTimeout( () => {
                    simonCSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( simonCSoundStopSoundTimeout ){
                window.clearTimeout( simonCSoundStopSoundTimeout );
              }
              simonCSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( simonCTrigger ) {
    stop();
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.simonCSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.simonCSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.simonCSoundSoundClip = simonCSoundSoundClip;
    


      // Create a shape with kite.
      const cViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.05, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const cViewPath = new phet.scenery.Path( cViewShape, {
        fill: 'orange',
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
      sharedData.scene.addChild( cViewPath );
      scratchpad.cViewPath = cViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.cViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playersTurn', 'markerIsOnC', 'simonCTrigger', 'cPosition' ], ( playersTurn, markerIsOnC, simonCTrigger, cPosition ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const cViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.05, sharedData.displaySize.width ) )
        scratchpad.cViewPath.setShape( cViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.cViewPath.mutate( {
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
        cViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        cViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        cViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        cViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        cViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        cViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        cViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        cViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        cViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        cViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const cViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( cViewPath.localBounds.width || 1 ) / ( cViewPath.localBounds.height || 1 );

        const scaleX = cViewPathViewBounds.width / ( cViewPath.localBounds.width || 1 );
        const scaleY = cViewPathViewBounds.height / ( cViewPath.localBounds.height || 1 );

        if ( stretch ) {
          cViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          cViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        cViewPath.center = cViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          cViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          cViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          cViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          cView_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          cViewPath.shape = phet.kite.Shape.lineSegment( cView_x1, cView_y1, cView_x2, cView_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          cView_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          cViewPath.shape = phet.kite.Shape.lineSegment( cView_x1, cView_y1, cView_x2, cView_y2 );
        };

        const setX2 = ( newX2 ) => {
          cView_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          cViewPath.shape = phet.kite.Shape.lineSegment( cView_x1, cView_y1, cView_x2, cView_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          cView_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          cViewPath.shape = phet.kite.Shape.lineSegment( cView_x1, cView_y1, cView_x2, cView_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          cViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          cViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          cViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        if ( ( playersTurn && markerIsOnC ) || simonCTrigger ) {
    setFill( 'red' );
    setRadius( 0.15 );
}
else {
    setFill( 'purple' );
    setRadius( 0.05 );
}

setStroke( 'black' );

setCenterX( cPosition.x );
setCenterY( cPosition.y );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'markerIsOnC' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'simonCTrigger' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'cPosition' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.cSoundSoundClip );
      delete scratchpad.cSoundSoundClip;
      
      scratchpad.cSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.cSoundWrappedAudioBufferListener );
      delete scratchpad.cSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'playersTurn', 'markerIsOnC' ], scratchpad.cSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.cSoundSoundMultilinkId;
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.simonCSoundSoundClip );
      delete scratchpad.simonCSoundSoundClip;
      
      scratchpad.simonCSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.simonCSoundWrappedAudioBufferListener );
      delete scratchpad.simonCSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'simonCTrigger' ], scratchpad.simonCSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.simonCSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.cViewPath );
      delete scratchpad.cViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'playersTurn', 'markerIsOnC', 'simonCTrigger', 'cPosition' ], scratchpad.cViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.cViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty890 = phet.paperLand.getModelComponent( 'cPosition' );
    if ( modelProperty890 ) {
      modelProperty890.value = phet.paperLand.utils.getProgramCenter( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty893 = phet.paperLand.getModelComponent( 'markerIsOnC' );
    if ( modelProperty893 ) {
      modelProperty893.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty896 = phet.paperLand.getModelComponent( 'markerIsOnC' );
    if ( modelProperty896 ) {
      modelProperty896.value = markers.length > 0;
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
  ctx.fillText('Sound C', canvas.width / 2, canvas.height / 2 + 20);
})();
