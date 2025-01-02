// Brick Four
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const brick4Visible = new phet.axon.BooleanProperty(true);
      phet.paperLand.addModelComponent( 'brick4Visible', brick4Visible );
    

      const brick4Bounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 0.25, 0.25 )
      );
      phet.paperLand.addModelComponent( 'brick4Bounds', brick4Bounds );
    

      const brick4BreakSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/click.mp3' );
      const brick4BreakSoundSoundClip = new phet.tambo.SoundClip( brick4BreakSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( brick4BreakSoundSoundClip );
      scratchpad.brick4BreakSoundWrappedAudioBuffer = brick4BreakSoundWrappedAudioBuffer;
      
      let brick4BreakSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let brick4BreakSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.brick4BreakSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.brick4BreakSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'brick4Visible' ], ( brick4Visible ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              brick4BreakSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              brick4BreakSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !brick4BreakSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - brick4BreakSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !brick4BreakSoundSoundClip.isPlaying ) {
                  brick4BreakSoundSoundClip.play();
                }
                brick4BreakSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( brick4BreakSoundStopSoundTimeout ){
                  window.clearTimeout( brick4BreakSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  brick4BreakSoundStopSoundTimeout = window.setTimeout( () => {
                    brick4BreakSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( brick4BreakSoundStopSoundTimeout ){
                window.clearTimeout( brick4BreakSoundStopSoundTimeout );
              }
              brick4BreakSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( !brick4Visible ) {
    setOutputLevel(1);
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.brick4BreakSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.brick4BreakSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.brick4BreakSoundSoundClip = brick4BreakSoundSoundClip;
    


      // Create a shape with kite.
      const brick4ViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const brick4ViewPath = new phet.scenery.Path( brick4ViewShape, {
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
      sharedData.scene.addChild( brick4ViewPath );
      scratchpad.brick4ViewPath = brick4ViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.brick4ViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'brick4Visible', 'brick4Bounds' ], ( brick4Visible, brick4Bounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const brick4ViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.brick4ViewPath.setShape( brick4ViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.brick4ViewPath.mutate( {
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
        brick4ViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        brick4ViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        brick4ViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        brick4ViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        brick4ViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        brick4ViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        brick4ViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        brick4ViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        brick4ViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        brick4ViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const brick4ViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( brick4ViewPath.localBounds.width || 1 ) / ( brick4ViewPath.localBounds.height || 1 );

        const scaleX = brick4ViewPathViewBounds.width / ( brick4ViewPath.localBounds.width || 1 );
        const scaleY = brick4ViewPathViewBounds.height / ( brick4ViewPath.localBounds.height || 1 );

        if ( stretch ) {
          brick4ViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          brick4ViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        brick4ViewPath.center = brick4ViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          brick4ViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          brick4ViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          brick4ViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          brick4View_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          brick4ViewPath.shape = phet.kite.Shape.lineSegment( brick4View_x1, brick4View_y1, brick4View_x2, brick4View_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          brick4View_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          brick4ViewPath.shape = phet.kite.Shape.lineSegment( brick4View_x1, brick4View_y1, brick4View_x2, brick4View_y2 );
        };

        const setX2 = ( newX2 ) => {
          brick4View_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          brick4ViewPath.shape = phet.kite.Shape.lineSegment( brick4View_x1, brick4View_y1, brick4View_x2, brick4View_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          brick4View_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          brick4ViewPath.shape = phet.kite.Shape.lineSegment( brick4View_x1, brick4View_y1, brick4View_x2, brick4View_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          brick4ViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          brick4ViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          brick4ViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        matchBounds( brick4Bounds, true );
setVisible( brick4Visible )
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'brick4Visible' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'brick4Bounds' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.brick4BreakSoundSoundClip );
      delete scratchpad.brick4BreakSoundSoundClip;
      
      scratchpad.brick4BreakSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.brick4BreakSoundWrappedAudioBufferListener );
      delete scratchpad.brick4BreakSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'brick4Visible' ], scratchpad.brick4BreakSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.brick4BreakSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.brick4ViewPath );
      delete scratchpad.brick4ViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'brick4Visible', 'brick4Bounds' ], scratchpad.brick4ViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.brick4ViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty139 = phet.paperLand.getModelComponent( 'brick4Bounds' );
    if ( modelProperty139 ) {
      modelProperty139.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('Brick Four', canvas.width / 2, canvas.height / 2 + 20);
})();
