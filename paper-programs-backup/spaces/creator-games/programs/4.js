// Brick Two
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const brick2Visible = new phet.axon.BooleanProperty(true);
      phet.paperLand.addModelComponent( 'brick2Visible', brick2Visible );
    

      const brick2Bounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 0.25, 0.25 )
      );
      phet.paperLand.addModelComponent( 'brick2Bounds', brick2Bounds );
    

      const brick2BreakSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/click.mp3' );
      const brick2BreakSoundSoundClip = new phet.tambo.SoundClip( brick2BreakSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( brick2BreakSoundSoundClip );
      scratchpad.brick2BreakSoundWrappedAudioBuffer = brick2BreakSoundWrappedAudioBuffer;
      
      let brick2BreakSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let brick2BreakSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.brick2BreakSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.brick2BreakSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'brick2Visible' ], ( brick2Visible ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              brick2BreakSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              brick2BreakSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !brick2BreakSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - brick2BreakSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !brick2BreakSoundSoundClip.isPlaying ) {
                  brick2BreakSoundSoundClip.play();
                }
                brick2BreakSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( brick2BreakSoundStopSoundTimeout ){
                  window.clearTimeout( brick2BreakSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  brick2BreakSoundStopSoundTimeout = window.setTimeout( () => {
                    brick2BreakSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( brick2BreakSoundStopSoundTimeout ){
                window.clearTimeout( brick2BreakSoundStopSoundTimeout );
              }
              brick2BreakSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( !brick2Visible ) {
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.brick2BreakSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.brick2BreakSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.brick2BreakSoundSoundClip = brick2BreakSoundSoundClip;
    


      // Create a shape with kite.
      const brick2ViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const brick2ViewPath = new phet.scenery.Path( brick2ViewShape, {
        fill: '#AA4A44',
        stroke: 'white',
        lineWidth: 2,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ) : 0.5,
        centerY: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height) : 0.5,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( brick2ViewPath );
      scratchpad.brick2ViewPath = brick2ViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.brick2ViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'brick2Visible', 'brick2Bounds' ], ( brick2Visible, brick2Bounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const brick2ViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.brick2ViewPath.setShape( brick2ViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.brick2ViewPath.mutate( {
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
        brick2ViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        brick2ViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        brick2ViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        brick2ViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        brick2ViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        brick2ViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        brick2ViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        brick2ViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        brick2ViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        brick2ViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const brick2ViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( brick2ViewPath.localBounds.width || 1 ) / ( brick2ViewPath.localBounds.height || 1 );

        const scaleX = brick2ViewPathViewBounds.width / ( brick2ViewPath.localBounds.width || 1 );
        const scaleY = brick2ViewPathViewBounds.height / ( brick2ViewPath.localBounds.height || 1 );

        if ( stretch ) {
          brick2ViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          brick2ViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        brick2ViewPath.center = brick2ViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          brick2ViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          brick2ViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          brick2ViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          brick2View_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          brick2ViewPath.shape = phet.kite.Shape.lineSegment( brick2View_x1, brick2View_y1, brick2View_x2, brick2View_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          brick2View_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          brick2ViewPath.shape = phet.kite.Shape.lineSegment( brick2View_x1, brick2View_y1, brick2View_x2, brick2View_y2 );
        };

        const setX2 = ( newX2 ) => {
          brick2View_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          brick2ViewPath.shape = phet.kite.Shape.lineSegment( brick2View_x1, brick2View_y1, brick2View_x2, brick2View_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          brick2View_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          brick2ViewPath.shape = phet.kite.Shape.lineSegment( brick2View_x1, brick2View_y1, brick2View_x2, brick2View_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          brick2ViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          brick2ViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          brick2ViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        matchBounds( brick2Bounds, true );
setVisible( brick2Visible )
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'brick2Visible' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'brick2Bounds' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.brick2BreakSoundSoundClip );
      delete scratchpad.brick2BreakSoundSoundClip;
      
      scratchpad.brick2BreakSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.brick2BreakSoundWrappedAudioBufferListener );
      delete scratchpad.brick2BreakSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'brick2Visible' ], scratchpad.brick2BreakSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.brick2BreakSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.brick2ViewPath );
      delete scratchpad.brick2ViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'brick2Visible', 'brick2Bounds' ], scratchpad.brick2ViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.brick2ViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty137 = phet.paperLand.getModelComponent( 'brick2Bounds' );
    if ( modelProperty137 ) {
      modelProperty137.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('Brick Two', canvas.width / 2, canvas.height / 2 + 20);
})();
