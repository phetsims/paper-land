// Paper Elements Game Model
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const IsP1Winner = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'IsP1Winner', IsP1Winner );
    

      const IsP2Winner = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'IsP2Winner', IsP2Winner );
    

      const playArea = new phet.axon.Property(
        new phet.dot.Bounds2( 0.3, 0, 0.66, 1 )
      );
      phet.paperLand.addModelComponent( 'playArea', playArea );
    

      const p1CardArrayAddedItem = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( 'p1CardArrayAddedItem', p1CardArrayAddedItem );
    

      const p1CardArrayRemovedItem = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( 'p1CardArrayRemovedItem', p1CardArrayRemovedItem );
    

      const p2CardArrayAddedItem = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( 'p2CardArrayAddedItem', p2CardArrayAddedItem );
    

      const p2CardArrayRemovedItem = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( 'p2CardArrayRemovedItem', p2CardArrayRemovedItem );
    

      const p1CardArray = new phet.axon.Property( [] );
      phet.paperLand.addModelComponent( 'p1CardArray', p1CardArray );
    

      const p2CardArray = new phet.axon.Property( [] );
      phet.paperLand.addModelComponent( 'p2CardArray', p2CardArray );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const p1CardArrayLength = new phet.axon.Property( null );
      scratchpad.p1CardArrayLengthDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'p1CardArray' ], ( p1CardArray ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          return p1CardArray.length;
        };
        p1CardArrayLength.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'p1CardArrayLength', p1CardArrayLength );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const p2CardArrayLength = new phet.axon.Property( null );
      scratchpad.p2CardArrayLengthDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'p2CardArray' ], ( p2CardArray ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          return p2CardArray.length;
        };
        p2CardArrayLength.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'p2CardArrayLength', p2CardArrayLength );
    

      const winningSoundWrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/short-success.mp3' );
      const winningSoundSoundClip = new phet.tambo.SoundClip( winningSoundWrappedAudioBuffer, {
        loop: false,
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( winningSoundSoundClip );
      scratchpad.winningSoundWrappedAudioBuffer = winningSoundWrappedAudioBuffer;
      
      let winningSoundStopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds - initial value is very small
      // so that it can be played immediately
      let winningSoundLastPlayTime = 0;
      
      // The listener that will observe the model and play sounds is added as soon as the sounds are loaded, and
      // added to the scratch pad so that it can be removed later.
      scratchpad.winningSoundWrappedAudioBufferListener = _buffer => {
        if ( _buffer ) {
        
          // Play the sound when any dependencies change value.
          scratchpad.winningSoundSoundMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'IsP1Winner', 'IsP2Winner' ], ( IsP1Winner, IsP2Winner ) => {
            
            // in a local scope, define the functions that the user can use to manipulate the sound
            const setOutputLevel = ( level ) => {
            
              // As a safety measure, don't let the user set a level below zero and above 2.
              const outputLevel = Math.max( 0, Math.min( 2, level ) );
              winningSoundSoundClip.outputLevel = outputLevel;
            };
            const setPlaybackRate = ( rate ) => {
            
              // As a safety measure, the playback rate cannot go below zero.
              const playbackRate = Math.max( 0, rate );
              winningSoundSoundClip.setPlaybackRate( playbackRate );
            };
            
            // a function the user can call to play the sound
            const play = () => {
            
              // Play the sound - if looping, we don't want to start playing again if already playing. The sound
              // can only be played at a limited interval for safety.
              if ( ( !winningSoundSoundClip.isPlaying || !false ) && phet.paperLand.elapsedTimeProperty.value - winningSoundLastPlayTime > 0.25 ) {
      
                // only start playing again if it has been stopped - but we still enter this block to update
                // the last play time and timeouts        
                if ( !winningSoundSoundClip.isPlaying ) {
                  winningSoundSoundClip.play();
                }
                winningSoundLastPlayTime = phet.paperLand.elapsedTimeProperty.value;
                
                // Set a timer to turn off the sound when the value stops changing.
                if ( winningSoundStopSoundTimeout ){
                  window.clearTimeout( winningSoundStopSoundTimeout );
                }
                
                // only stop if not looping
                if ( !false ) {
                  winningSoundStopSoundTimeout = window.setTimeout( () => {
                    winningSoundSoundClip.stop();
                  }, 5000 );
                }  
              }
            };
            
            const stop = () => {
              // Set a timer to turn off the sound when the value stops changing.
              if ( winningSoundStopSoundTimeout ){
                window.clearTimeout( winningSoundStopSoundTimeout );
              }
              winningSoundSoundClip.stop();
            };
            
            if ( false ) {
              play();
            }
            
            // declare the references so that they can be used in the control function
            
          
            setOutputLevel(1);

if ( IsP1Winner || IsP2Winner ) {
    play();
    phet.paperLand.console.log("Someone Won!");
}
          }, {
            otherReferences: [  ],
          } );  
        }
      };     
      scratchpad.winningSoundWrappedAudioBuffer.audioBufferProperty.link( scratchpad.winningSoundWrappedAudioBufferListener );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.winningSoundSoundClip = winningSoundSoundClip;
    

      // Create an image and add it to the view.
      let playAreaImageImageElement = document.createElement( 'img' );
      playAreaImageImageElement.src = 'media/images/fantasy-card-mat.jpg';
      const playAreaImageImage = new phet.scenery.Image( playAreaImageImageElement );

      // As soon as the image loads, update a Property added to the multilink so that the control
      // function is called again to update the positioning.       
      const playAreaImageImageLoadProperty = new phet.axon.Property( 0 );
      playAreaImageImageElement.addEventListener( 'load', () => { playAreaImageImageLoadProperty.value = playAreaImageImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( playAreaImageImage );
      scratchpad.playAreaImageImage = playAreaImageImage;
      
      // Update the image when a dependency changes, and redraw if the board resizes. This is async because
      // function in the control function might be async to support loading images.
      scratchpad.playAreaImageImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playArea' ], async ( playArea ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        playAreaImageImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        playAreaImageImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        playAreaImageImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        playAreaImageImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        playAreaImageImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        playAreaImageImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        playAreaImageImage.visible = visible;
      };
      
      const moveToFront = () => {
        playAreaImageImage.moveToFront();
      };
      
      const moveToBack = () => {
        playAreaImageImage.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        playAreaImageImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const playAreaImageImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( playAreaImageImage.localBounds.width || 1 ) / ( playAreaImageImage.localBounds.height || 1 );

        const scaleX = playAreaImageImageViewBounds.width / ( playAreaImageImage.localBounds.width || 1 );
        const scaleY = playAreaImageImageViewBounds.height / ( playAreaImageImage.localBounds.height || 1 );

        if ( stretch ) {
          playAreaImageImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          playAreaImageImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        playAreaImageImage.center = playAreaImageImageViewBounds.center;
      };
      

      
        // This is async so that we can wait for the image to load before doing other things
        const setImage = async imageName => {
        
          return new Promise( (resolve, reject) => {
          
            // Get the current image name relative to the local paper playground path
            let currentImageName;
            if ( playAreaImageImage.image ) {
              const startIndex = playAreaImageImage.image.src.indexOf( 'media/images/' );
              currentImageName = playAreaImageImage.image.src.substring( startIndex );
            }
            else {
              currentImageName = '';
            }
            
            const newImageName = 'media/images/' + imageName;
            
            // only update the image if there is a change
            if ( currentImageName !== newImageName ) {
              const playAreaImageImageImageElement = document.createElement( 'img' );
              playAreaImageImageImageElement.src = newImageName;
              playAreaImageImage.image = playAreaImageImageImageElement;

              // Wait for the image to load before resolving              
              playAreaImageImageImageElement.addEventListener( 'load', () => {
                resolve();
              } );
            }
            else {
              
              // No change, so resolve immediately
              resolve();
            }
          } );
        };
      
        
        // bring in the reference components so they are available in the control function
        
      
        matchBounds(playArea, true);
moveToBack();
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty, playAreaImageImageLoadProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const playAreaViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const playAreaViewPath = new phet.scenery.Path( playAreaViewShape, {
        fill: 'transparent',
        stroke: 'red',
        lineWidth: 5,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( playAreaViewPath );
      scratchpad.playAreaViewPath = playAreaViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.playAreaViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'playArea' ], ( playArea ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const playAreaViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.playAreaViewPath.setShape( playAreaViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.playAreaViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
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
        playAreaViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        playAreaViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        playAreaViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        playAreaViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        playAreaViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        playAreaViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        playAreaViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        playAreaViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        playAreaViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        playAreaViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const playAreaViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( playAreaViewPath.localBounds.width || 1 ) / ( playAreaViewPath.localBounds.height || 1 );

        const scaleX = playAreaViewPathViewBounds.width / ( playAreaViewPath.localBounds.width || 1 );
        const scaleY = playAreaViewPathViewBounds.height / ( playAreaViewPath.localBounds.height || 1 );

        if ( stretch ) {
          playAreaViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          playAreaViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        playAreaViewPath.center = playAreaViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          playAreaViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          playAreaViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          playAreaViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          playAreaViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          playAreaViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          playAreaViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          playAreaViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          playAreaViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          playAreaViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          playAreaViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( playArea );
moveToFront();
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const isP1WinnerTruthTellerShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.005, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const isP1WinnerTruthTellerPath = new phet.scenery.Path( isP1WinnerTruthTellerShape, {
        fill: 'red',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && 0.01) ? phet.paperLand.utils.paperToBoardX( 0.01, sharedData.displaySize.width ) : 0.01,
        centerY: ('model' === 'model' && 0.01) ? phet.paperLand.utils.paperToBoardY( 0.01, sharedData.displaySize.height) : 0.01,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( isP1WinnerTruthTellerPath );
      scratchpad.isP1WinnerTruthTellerPath = isP1WinnerTruthTellerPath;
      
      // Update the shape when a dependency changes.
      scratchpad.isP1WinnerTruthTellerPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'IsP1Winner' ], ( IsP1Winner ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const isP1WinnerTruthTellerShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.005, sharedData.displaySize.width ) )
        scratchpad.isP1WinnerTruthTellerPath.setShape( isP1WinnerTruthTellerShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.isP1WinnerTruthTellerPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && 0.01) ? phet.paperLand.utils.paperToBoardX( 0.01, sharedData.displaySize.width ) : 0.01,
          centerY: ('model' === 'model' && 0.01) ? phet.paperLand.utils.paperToBoardY( 0.01, sharedData.displaySize.height) : 0.01,
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
        isP1WinnerTruthTellerPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        isP1WinnerTruthTellerPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        isP1WinnerTruthTellerPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        isP1WinnerTruthTellerPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        isP1WinnerTruthTellerPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        isP1WinnerTruthTellerPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        isP1WinnerTruthTellerPath.visible = visible;
      };
      
      const moveToFront = () => {
        isP1WinnerTruthTellerPath.moveToFront();
      };
      
      const moveToBack = () => {
        isP1WinnerTruthTellerPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        isP1WinnerTruthTellerPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const isP1WinnerTruthTellerPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( isP1WinnerTruthTellerPath.localBounds.width || 1 ) / ( isP1WinnerTruthTellerPath.localBounds.height || 1 );

        const scaleX = isP1WinnerTruthTellerPathViewBounds.width / ( isP1WinnerTruthTellerPath.localBounds.width || 1 );
        const scaleY = isP1WinnerTruthTellerPathViewBounds.height / ( isP1WinnerTruthTellerPath.localBounds.height || 1 );

        if ( stretch ) {
          isP1WinnerTruthTellerPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          isP1WinnerTruthTellerPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        isP1WinnerTruthTellerPath.center = isP1WinnerTruthTellerPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          isP1WinnerTruthTellerPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          isP1WinnerTruthTellerPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          isP1WinnerTruthTellerPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          isP1WinnerTruthTellerPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        if ( IsP1Winner ) {
    setFill( 'green' );
} else {
    setFill( 'red' );
}
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    

      scratchpad.setActiveCardsControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'p1FireImgPosition', 'p1IceImgPosition', 'p1TornadoImgPosition', 'playArea', 'p2TornadoImgPosition', 'p2IceImgPosition', 'p2FireImgPosition' ], ( p1FireImgPosition, p1IceImgPosition, p1TornadoImgPosition, playArea, p2TornadoImgPosition, p2IceImgPosition, p2FireImgPosition ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'isActiveCardP1Fire', 'isActiveCardP1Ice', 'isActiveCardP1Tornado', 'isActiveCardP2Tornado', 'isActiveCardP2Ice', 'isActiveCardP2Fire' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const isActiveCardP1Fire = phet.paperLand.getModelComponent( 'isActiveCardP1Fire' ).value;
const isActiveCardP1Ice = phet.paperLand.getModelComponent( 'isActiveCardP1Ice' ).value;
const isActiveCardP1Tornado = phet.paperLand.getModelComponent( 'isActiveCardP1Tornado' ).value;
const isActiveCardP2Tornado = phet.paperLand.getModelComponent( 'isActiveCardP2Tornado' ).value;
const isActiveCardP2Ice = phet.paperLand.getModelComponent( 'isActiveCardP2Ice' ).value;
const isActiveCardP2Fire = phet.paperLand.getModelComponent( 'isActiveCardP2Fire' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setIsActiveCardP1Fire = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'isActiveCardP1Fire' );
        modelComponent.value = newValue;  
      }
      
const setIsActiveCardP1Ice = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'isActiveCardP1Ice' );
        modelComponent.value = newValue;  
      }
      
const setIsActiveCardP1Tornado = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'isActiveCardP1Tornado' );
        modelComponent.value = newValue;  
      }
      
const setIsActiveCardP2Tornado = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'isActiveCardP2Tornado' );
        modelComponent.value = newValue;  
      }
      
const setIsActiveCardP2Ice = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'isActiveCardP2Ice' );
        modelComponent.value = newValue;  
      }
      
const setIsActiveCardP2Fire = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'isActiveCardP2Fire' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if (playArea.containsPoint(p1FireImgPosition)) {
    setIsActiveCardP1Fire(true);
    setIsActiveCardP1Ice(false);
    setIsActiveCardP1Tornado(false);

    phet.paperLand.console.log(isActiveCardP1Fire);
    phet.paperLand.console.log(isActiveCardP1Tornado);
    phet.paperLand.console.log(isActiveCardP1Ice);

} else if (playArea.containsPoint(p1IceImgPosition)) {
    setIsActiveCardP1Fire(false);
    setIsActiveCardP1Ice(true);
    setIsActiveCardP1Tornado(false);

    phet.paperLand.console.log(isActiveCardP1Fire);
    phet.paperLand.console.log(isActiveCardP1Tornado);
    phet.paperLand.console.log(isActiveCardP1Ice);

} else if (playArea.containsPoint(p1TornadoImgPosition)) {
    setIsActiveCardP1Fire(false);
    setIsActiveCardP1Ice(false);
    setIsActiveCardP1Tornado(true);

    phet.paperLand.console.log(isActiveCardP1Fire);
    phet.paperLand.console.log(isActiveCardP1Tornado);
    phet.paperLand.console.log(isActiveCardP1Ice);

} else {
    setIsActiveCardP1Fire(false);
    setIsActiveCardP1Ice(false);
    setIsActiveCardP1Tornado(false);

    phet.paperLand.console.log(isActiveCardP1Fire);
    phet.paperLand.console.log(isActiveCardP1Tornado);
    phet.paperLand.console.log(isActiveCardP1Ice);
}

if (playArea.containsPoint(p2TornadoImgPosition)) {
    setIsActiveCardP2Tornado(true);
    setIsActiveCardP2Ice(false);
    setIsActiveCardP2Fire(false);
} else if (playArea.containsPoint(p2IceImgPosition)) {
    setIsActiveCardP2Tornado(false);
    setIsActiveCardP2Ice(true);
    setIsActiveCardP2Fire(false);
} else if (playArea.containsPoint(p2FireImgPosition)) {
    setIsActiveCardP2Tornado(false);
    setIsActiveCardP2Ice(false);
    setIsActiveCardP2Fire(true);
} else {
    setIsActiveCardP2Tornado(false);
    setIsActiveCardP2Ice(false);
    setIsActiveCardP2Fire(false);
}

// if (playArea.containsPoint(p1FireImgPosition)) {
//     setIsActiveCardP1Fire(true);
//     setIsActiveCardP1Ice(false);
//     setIsActiveCardP1Tornado(false);
// } else if (playArea.containsPoint(p1IceImgPosition) && !isActiveCardP1Fire) {
//     setIsActiveCardP1Fire(false);
//     setIsActiveCardP1Ice(true);
//     setIsActiveCardP1Tornado(false);
// } else if (playArea.containsPoint(p1TornadoImgPosition) && !isActiveCardP1Fire && !isActiveCardP1Ice) {
//     setIsActiveCardP1Fire(false);
//     setIsActiveCardP1Ice(false);
//     setIsActiveCardP1Tornado(true);
// } else {
//     setIsActiveCardP1Fire(false);
//     setIsActiveCardP1Ice(false);
//     setIsActiveCardP1Tornado(false);
// }

// if (playArea.containsPoint(p2TornadoImgPosition)) {
//     setIsActiveCardP2Tornado(true);
//     setIsActiveCardP2Ice(false);
//     setIsActiveCardP2Fire(false);
// } else if (playArea.containsPoint(p2IceImgPosition) && !isActiveCardP2Tornado) {
//     setIsActiveCardP2Tornado(false);
//     setIsActiveCardP2Ice(true);
//     setIsActiveCardP2Fire(false);
// } else if (playArea.containsPoint(p2FireImgPosition) && !isActiveCardP2Tornado && !isActiveCardP2Ice) {
//     setIsActiveCardP2Tornado(false);
//     setIsActiveCardP2Ice(false);
//     setIsActiveCardP2Fire(true);
// } else {
//     setIsActiveCardP2Tornado(false);
//     setIsActiveCardP2Ice(false);
//     setIsActiveCardP2Fire(false);
// }   
        }
      } );
    

      scratchpad.DetermineWinnerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'isActiveCardP1Fire', 'isActiveCardP1Ice', 'isActiveCardP1Tornado', 'isActiveCardP2Tornado', 'isActiveCardP2Ice', 'isActiveCardP2Fire' ], ( isActiveCardP1Fire, isActiveCardP1Ice, isActiveCardP1Tornado, isActiveCardP2Tornado, isActiveCardP2Ice, isActiveCardP2Fire ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'IsP1Winner', 'IsP2Winner' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const IsP1Winner = phet.paperLand.getModelComponent( 'IsP1Winner' ).value;
const IsP2Winner = phet.paperLand.getModelComponent( 'IsP2Winner' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setIsP1Winner = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'IsP1Winner' );
        modelComponent.value = newValue;  
      }
      
const setIsP2Winner = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'IsP2Winner' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          
// Fire beats Ice
if (isActiveCardP1Fire && isActiveCardP2Ice) {
    setIsP1Winner(true);
    setIsP2Winner(false);
} else if (isActiveCardP1Ice && isActiveCardP2Fire) {
    setIsP1Winner(false);
    setIsP2Winner(true);
}
// Ice beats Tornado
else if (isActiveCardP1Ice && isActiveCardP2Tornado) {
    setIsP1Winner(true);
    setIsP2Winner(false);
} else if (isActiveCardP1Tornado && isActiveCardP2Ice) {
    setIsP1Winner(false);
    setIsP2Winner(true);
}
// Tornado beats Fire
else if (isActiveCardP1Tornado && isActiveCardP2Fire) {
    setIsP1Winner(true);
    setIsP2Winner(false);
} else if (isActiveCardP1Fire && isActiveCardP2Tornado) {
    setIsP1Winner(false);
    setIsP2Winner(true);
}
// Handles the case where both players choose the same card
else if ((isActiveCardP1Fire && isActiveCardP2Fire) || (isActiveCardP1Ice && isActiveCardP2Ice) || (isActiveCardP1Tornado && isActiveCardP2Tornado)) {
    setIsP1Winner(false);
    setIsP2Winner(false);
} else {
    // Fallback for any unhandled cases
    setIsP1Winner(false);
    setIsP2Winner(false);
}
   
        }
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'IsP1Winner' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'IsP2Winner' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'playArea' );
    

     // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1CardArrayAddedItem' );
    

     // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1CardArrayRemovedItem' );
    

     // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2CardArrayAddedItem' );
    

     // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2CardArrayRemovedItem' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p1CardArray' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'p2CardArray' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'p1CardArray' ], scratchpad.p1CardArrayLengthDerivedPropertyObserverId );
      delete scratchpad.p1CardArrayLengthDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'p1CardArrayLength' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'p2CardArray' ], scratchpad.p2CardArrayLengthDerivedPropertyObserverId );
      delete scratchpad.p2CardArrayLengthDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'p2CardArrayLength' );
    

      phet.tambo.soundManager.removeSoundGenerator( scratchpad.winningSoundSoundClip );
      delete scratchpad.winningSoundSoundClip;
      
      scratchpad.winningSoundWrappedAudioBuffer.audioBufferProperty.unlink( scratchpad.winningSoundWrappedAudioBufferListener );
      delete scratchpad.winningSoundWrappedAudioBufferListener;
      
      phet.paperLand.removeModelPropertyMultilink( [ 'IsP1Winner', 'IsP2Winner' ], scratchpad.winningSoundSoundMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.winningSoundSoundMultilinkId;
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.playAreaImageImage );
      delete scratchpad.playAreaImageImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'playArea' ], scratchpad.playAreaImageImageMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.playAreaImageImageMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.playAreaViewPath );
      delete scratchpad.playAreaViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'playArea' ], scratchpad.playAreaViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.playAreaViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.isP1WinnerTruthTellerPath );
      delete scratchpad.isP1WinnerTruthTellerPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'IsP1Winner' ], scratchpad.isP1WinnerTruthTellerPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.isP1WinnerTruthTellerPathMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'p1FireImgPosition', 'p1IceImgPosition', 'p1TornadoImgPosition', 'playArea', 'p2TornadoImgPosition', 'p2IceImgPosition', 'p2FireImgPosition' ], scratchpad.setActiveCardsControllerMultilinkId );
      delete scratchpad.setActiveCardsControllerMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'isActiveCardP1Fire', 'isActiveCardP1Ice', 'isActiveCardP1Tornado', 'isActiveCardP2Tornado', 'isActiveCardP2Ice', 'isActiveCardP2Fire' ], scratchpad.DetermineWinnerMultilinkId );
      delete scratchpad.DetermineWinnerMultilinkId;
    
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
  ctx.fillText('Paper Elements Game Model', canvas.width / 2, canvas.height / 2 + 20);
})();
