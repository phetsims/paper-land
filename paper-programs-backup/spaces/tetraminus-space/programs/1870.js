// Bob
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const bobPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'bobPosition', bobPosition );
    

      const period = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'period', period );
    

      const length = new phet.axon.NumberProperty( 300, {
        range: new phet.dot.Range( 0, 500 )
      });
      phet.paperLand.addModelComponent( 'length', length );
    

      const bobSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/c-tone.mp3' );
      const bobSoundSoundClip = new phet.tambo.SoundClip( bobSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( bobSoundSoundClip );
      
      let bobSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds
      let bobSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;

      // Play the sound when any dependencies change value.
      scratchpad.bobSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'anchorPosition', 'bobPosition', 'period', 'length' ], ( anchorPosition, bobPosition, period, length ) => {
        // in a local scope, define the functions that the user can use to manipulate the sound
        const setOutputLevel = ( level ) => {
        
          // As a safety measure, don't let the user set a level below zero and above 2.
          const outputLevel = Math.max( 0, Math.min( 2, level ) );
          bobSoundSoundClip.outputLevel = outputLevel;
        };
        const setPlaybackRate = ( rate ) => {
        
          // As a safety measure, the playback rate cannot go below zero.
          const playbackRate = Math.max( 0, rate );
          bobSoundSoundClip.setPlaybackRate( playbackRate );
        };
        
        // a function the user can call to play the sound
        const play = () => {
        
          // Play the sound - if looping, we don't want to start playing again if already playing. The sound
          // can only be played at a limited interval for safety.
          if ( ( !bobSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - bobSoundLastPlayTime > 0.25 ) {
            bobSoundSoundClip.play();
            bobSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
            
            // Set a timer to turn off the sound when the value stops changing.
            if ( bobSoundStopSoundTimeout ){
              window.clearTimeout( bobSoundStopSoundTimeout );
            }
            
            // only stop if looping
            if ( false ) {
              bobSoundStopSoundTimeout = window.setTimeout( () => {
                bobSoundSoundClip.stop();
              }, 5000 );
            }  
          }
        };
        
        const stop = () => {
          // Set a timer to turn off the sound when the value stops changing.
          if ( bobSoundStopSoundTimeout ){
            window.clearTimeout( bobSoundStopSoundTimeout );
          }
          bobSoundSoundClip.stop();
        };
        
        if ( true ) {
          play();
        }
      
          var lowestPoint = anchorPosition.y + length; // Calculate the lowest point
  var range = 2; // Define a small range around the lowest point

  if (Math.abs(bobPosition.y - lowestPoint) <= range) { // Check if bob is within the range of the lowest point
    setPlaybackRate(1);
    setOutputLevel(1);
    play();
  }
            
      } );       
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.bobSoundSoundClip = bobSoundSoundClip;
    


      // Create a shape with kite.
      const bobCircleShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 50, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const bobCirclePath = new phet.scenery.Path( bobCircleShape, {
        fill: '#007BFF',
        stroke: '#001F3F',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( bobCirclePath );
      scratchpad.bobCirclePath = bobCirclePath;
      
      // Update the shape when a dependency changes.
      scratchpad.bobCirclePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'bobPosition' ], ( bobPosition ) => {
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        bobCirclePath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        bobCirclePath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        bobCirclePath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        bobCirclePath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        bobCirclePath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        bobCirclePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        bobCirclePath.visible = visible;
      };
      
      const moveToFront = () => {
        bobCirclePath.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        bobCirclePath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          bobCirclePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          bobCirclePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          bobCirclePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          // x1 = newX1;
          // bobCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setX1 not implemented' );
        };
        
        const setY1 = ( newY1 ) => {
          // y1 = newY1;
          // bobCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setY1 not implemented' );
        };

        const setX2 = ( newX2 ) => {
          // x2 = newX2;
          // bobCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setX2 not implemented' );
        };
        
        const setY2 = ( newY2 ) => {
          // y2 = newY2;
          // bobCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setY2 not implemented' );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          bobCirclePath.radius = phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          bobCirclePath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        setCenterX( bobPosition.x );
setCenterY( bobPosition.y );
      } );
    

      const bobControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'anchorPosition', 'bobPosition', 'period', 'length' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const anchorPosition = phet.paperLand.getModelComponent( 'anchorPosition' ).value;
const bobPosition = phet.paperLand.getModelComponent( 'bobPosition' ).value;
const period = phet.paperLand.getModelComponent( 'period' ).value;
const length = phet.paperLand.getModelComponent( 'length' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setAnchorPosition = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'anchorPosition' );
        modelComponent.value = newValue;  
      }
      
const setBobPosition = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'bobPosition' );
        modelComponent.value = newValue;  
      }
      
const setPeriod = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'period' );
        modelComponent.value = newValue;  
      }
      
const setLength = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'length' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
            // Calculate the angle of the pendulum
  const angle = Math.sin((2 * Math.PI / period) * elapsedTime);

  // Calculate the new position of the bob
  const newX = anchorPosition.x + length * Math.sin(angle);
  const newY = anchorPosition.y + length * Math.cos(angle);

  // Update the position of the bob
  setBobPosition(new phet.dot.Vector2(newX, newY)); 
        }
      };
      scratchpad.bobControllerAnimationListener = bobControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( bobControllerAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'bobPosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'period' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'length' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.bobSoundSoundClip );
      delete scratchpad.bobSoundSoundClip;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'anchorPosition', 'bobPosition', 'period', 'length' ], scratchpad.bobSoundSoundMultilinkId );
      delete scratchpad.bobSoundSoundMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.bobCirclePath );
      delete scratchpad.bobCirclePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'bobPosition' ], scratchpad.bobCirclePathMultilinkId );
      delete scratchpad.bobCirclePathMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.bobControllerAnimationListener );
      delete scratchpad.bobControllerAnimationListener;
    
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
  ctx.fillText('Bob', canvas.width / 2, canvas.height / 2 + 20);
})();
