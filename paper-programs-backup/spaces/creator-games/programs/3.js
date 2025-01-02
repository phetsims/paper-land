// Brick One
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const brick1Visible = new phet.axon.BooleanProperty(true);
      phet.paperLand.addModelComponent( 'brick1Visible', brick1Visible );
    

      const brick1Bounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 0.25, 0.25 )
      );
      phet.paperLand.addModelComponent( 'brick1Bounds', brick1Bounds );
    

      const brick1BreakSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/click.mp3' );
      const brick1BreakSoundSoundClip = new phet.tambo.SoundClip( brick1BreakSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( brick1BreakSoundSoundClip );
      scratchpad.brick1BreakSoundWrappedAudioBuffer = brick1BreakSoundWrappedAudioBuffer;
      
      let brick1BreakSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let brick1BreakSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.brick1BreakSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.brick1BreakSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'brick1Visible' ], ( brick1Visible ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              brick1BreakSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              brick1BreakSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !brick1BreakSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - brick1BreakSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !brick1BreakSoundSoundClip.isPlaying ) {
                  brick1BreakSoundSoundClip.play();
                }
                brick1BreakSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( brick1BreakSoundStopSoundTimeout ){
                  window.clearTimeout( brick1BreakSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  brick1BreakSoundStopSoundTimeout = window.setTimeout( () => {
                    brick1BreakSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( brick1BreakSoundStopSoundTimeout ){
                window.clearTimeout( brick1BreakSoundStopSoundTimeout );
              }
              brick1BreakSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            if ( !brick1Visible ) {
    play();
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.brick1BreakSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.brick1BreakSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.brick1BreakSoundSoundClip = brick1BreakSoundSoundClip;
    


      // Create a shape with kite.
      const brick1ViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const brick1ViewPath = new phet.scenery.Path( brick1ViewShape, {
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
      sharedData.scene.addChild( brick1ViewPath );
      scratchpad.brick1ViewPath = brick1ViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.brick1ViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'brick1Visible', 'brick1Bounds' ], ( brick1Visible, brick1Bounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const brick1ViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.brick1ViewPath.setShape( brick1ViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.brick1ViewPath.mutate( {
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
        brick1ViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        brick1ViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        brick1ViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        brick1ViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        brick1ViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        brick1ViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        brick1ViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        brick1ViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        brick1ViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        brick1ViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const brick1ViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( brick1ViewPath.localBounds.width || 1 ) / ( brick1ViewPath.localBounds.height || 1 );

        const scaleX = brick1ViewPathViewBounds.width / ( brick1ViewPath.localBounds.width || 1 );
        const scaleY = brick1ViewPathViewBounds.height / ( brick1ViewPath.localBounds.height || 1 );

        if ( stretch ) {
          brick1ViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          brick1ViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        brick1ViewPath.center = brick1ViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          brick1ViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          brick1ViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          brick1ViewPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          brick1View_x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          brick1ViewPath.shape = phet.kite.Shape.lineSegment( brick1View_x1, brick1View_y1, brick1View_x2, brick1View_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          brick1View_y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          brick1ViewPath.shape = phet.kite.Shape.lineSegment( brick1View_x1, brick1View_y1, brick1View_x2, brick1View_y2 );
        };

        const setX2 = ( newX2 ) => {
          brick1View_x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          brick1ViewPath.shape = phet.kite.Shape.lineSegment( brick1View_x1, brick1View_y1, brick1View_x2, brick1View_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          brick1View_y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          brick1ViewPath.shape = phet.kite.Shape.lineSegment( brick1View_x1, brick1View_y1, brick1View_x2, brick1View_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          brick1ViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          brick1ViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          brick1ViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        matchBounds( brick1Bounds, true );
setVisible( brick1Visible )
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'brick1Visible' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'brick1Bounds' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.brick1BreakSoundSoundClip );
      delete scratchpad.brick1BreakSoundSoundClip;
      
      scratchpad.brick1BreakSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.brick1BreakSoundWrappedAudioBufferListener );
      delete scratchpad.brick1BreakSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'brick1Visible' ], scratchpad.brick1BreakSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.brick1BreakSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.brick1ViewPath );
      delete scratchpad.brick1ViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'brick1Visible', 'brick1Bounds' ], scratchpad.brick1ViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.brick1ViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty126 = phet.paperLand.getModelComponent( 'brick1Bounds' );
    if ( modelProperty126 ) {
      modelProperty126.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('Brick One', canvas.width / 2, canvas.height / 2 + 20);
})();
