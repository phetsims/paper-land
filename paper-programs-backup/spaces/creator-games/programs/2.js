// Paddle
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const paddleCollideTrigger = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'paddleCollideTrigger', paddleCollideTrigger );
    

      const paddleBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'paddleBounds', paddleBounds );
    

      const paddleHitSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/bong.mp3' );
      const paddleHitSoundSoundClip = new phet.tambo.SoundClip( paddleHitSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( paddleHitSoundSoundClip );
      scratchpad.paddleHitSoundWrappedAudioBuffer = paddleHitSoundWrappedAudioBuffer;
      
      let paddleHitSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let paddleHitSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.paddleHitSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.paddleHitSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'paddleCollideTrigger' ], ( paddleCollideTrigger ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              paddleHitSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              paddleHitSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !paddleHitSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - paddleHitSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !paddleHitSoundSoundClip.isPlaying ) {
                  paddleHitSoundSoundClip.play();
                }
                paddleHitSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( paddleHitSoundStopSoundTimeout ){
                  window.clearTimeout( paddleHitSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  paddleHitSoundStopSoundTimeout = window.setTimeout( () => {
                    paddleHitSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( paddleHitSoundStopSoundTimeout ){
                window.clearTimeout( paddleHitSoundStopSoundTimeout );
              }
              paddleHitSoundSoundClip.stop();
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
      scratchpad.paddleHitSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.paddleHitSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.paddleHitSoundSoundClip = paddleHitSoundSoundClip;
    


      // Create a shape with kite.
      const paddleViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const paddleViewPath = new phet.scenery.Path( paddleViewShape, {
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
      sharedData.scene.addChild( paddleViewPath );
      scratchpad.paddleViewPath = paddleViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.paddleViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'paddleBounds' ], ( paddleBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const paddleViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.paddleViewPath.setShape( paddleViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.paddleViewPath.mutate( {
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
        paddleViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        paddleViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        paddleViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        paddleViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        paddleViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        paddleViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        paddleViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        paddleViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        paddleViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        paddleViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const paddleViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( paddleViewPath.localBounds.width || 1 ) / ( paddleViewPath.localBounds.height || 1 );

        const scaleX = paddleViewPathViewBounds.width / ( paddleViewPath.localBounds.width || 1 );
        const scaleY = paddleViewPathViewBounds.height / ( paddleViewPath.localBounds.height || 1 );

        if ( stretch ) {
          paddleViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          paddleViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        paddleViewPath.center = paddleViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          paddleViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          paddleViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          paddleViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          paddleView_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          paddleViewPath.shape = phet.kite.Shape.lineSegment( paddleView_x1, paddleView_y1, paddleView_x2, paddleView_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          paddleView_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          paddleViewPath.shape = phet.kite.Shape.lineSegment( paddleView_x1, paddleView_y1, paddleView_x2, paddleView_y2 );
        };

        const setX2 = ( newX2 ) => {
          paddleView_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          paddleViewPath.shape = phet.kite.Shape.lineSegment( paddleView_x1, paddleView_y1, paddleView_x2, paddleView_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          paddleView_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          paddleViewPath.shape = phet.kite.Shape.lineSegment( paddleView_x1, paddleView_y1, paddleView_x2, paddleView_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          paddleViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          paddleViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          paddleViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        matchBounds( paddleBounds, true )
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'paddleCollideTrigger' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'paddleBounds' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.paddleHitSoundSoundClip );
      delete scratchpad.paddleHitSoundSoundClip;
      
      scratchpad.paddleHitSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.paddleHitSoundWrappedAudioBufferListener );
      delete scratchpad.paddleHitSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'paddleCollideTrigger' ], scratchpad.paddleHitSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.paddleHitSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.paddleViewPath );
      delete scratchpad.paddleViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'paddleBounds' ], scratchpad.paddleViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.paddleViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty125 = phet.paperLand.getModelComponent( 'paddleBounds' );
    if ( modelProperty125 ) {
      modelProperty125.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('Paddle', canvas.width / 2, canvas.height / 2 + 20);
})();
