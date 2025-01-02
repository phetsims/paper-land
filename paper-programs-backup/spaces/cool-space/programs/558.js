// Movable Object
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const position = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'position', position );
    

      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const objectBounds = new phet.axon.Property( null );
      scratchpad.objectBoundsDerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ 'position', 'leftTopBounds', 'centerTopBounds', 'rightTopBounds', 'leftCenterBounds', 'centerBounds', 'rightCenterBounds', 'leftBottomBounds', 'centerBottomBounds', 'rightBottomBounds' ], ( position, leftTopBounds, centerTopBounds, rightTopBounds, leftCenterBounds, centerBounds, rightCenterBounds, leftBottomBounds, centerBottomBounds, rightBottomBounds ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          if ( leftTopBounds.containsPoint( position ) ) {
    return leftTopBounds;
}
else if ( centerTopBounds.containsPoint( position ) ) {
    return centerTopBounds;
}
else if ( rightTopBounds.containsPoint( position ) ) {
    return rightTopBounds;
}
else if ( leftCenterBounds.containsPoint( position ) ) {
    return leftCenterBounds;
}
else if ( centerBounds.containsPoint( position ) ) {
    return centerBounds;
}
else if ( rightCenterBounds.containsPoint( position ) ) {
    return rightCenterBounds;
}
else if ( leftBottomBounds.containsPoint( position ) ) {
    return leftBottomBounds;
}
else if ( centerBottomBounds.containsPoint( position ) ) {
    return centerBottomBounds;
}
else if ( rightBottomBounds.containsPoint( position ) ) {
    return rightBottomBounds;
}
else {
    return null;
}

        };
        objectBounds.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( 'objectBounds', objectBounds );
    

      // Speak the description whenever the dependencies change.
      const objectBoundsDescriptionDescriptionFunction = ( position, leftTopBounds, centerTopBounds, rightTopBounds, leftCenterBounds, centerBounds, rightCenterBounds, leftBottomBounds, centerBottomBounds, rightBottomBounds, objectBounds, cupcakeBounds ) => {
      
        // get the additional reference constants so they are available in the control function
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        objectBoundsDescriptionDescription.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        objectBoundsDescriptionDescription.centerY = y;
      };
      
      const setLeft = ( left ) => {
        objectBoundsDescriptionDescription.left = left;
      };
      
      const setTop = ( top ) => {
        objectBoundsDescriptionDescription.top = top;
      };
      
      const setScale = ( scale ) => {
        objectBoundsDescriptionDescription.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        objectBoundsDescriptionDescription.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        objectBoundsDescriptionDescription.visible = visible;
      };
      
      const moveToFront = () => {
        objectBoundsDescriptionDescription.moveToFront();
      };
      
      const moveToBack = () => {
        objectBoundsDescriptionDescription.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        objectBoundsDescriptionDescription.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const objectBoundsDescriptionDescriptionViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( objectBoundsDescriptionDescription.localBounds.width || 1 ) / ( objectBoundsDescriptionDescription.localBounds.height || 1 );

        const scaleX = objectBoundsDescriptionDescriptionViewBounds.width / ( objectBoundsDescriptionDescription.localBounds.width || 1 );
        const scaleY = objectBoundsDescriptionDescriptionViewBounds.height / ( objectBoundsDescriptionDescription.localBounds.height || 1 );

        if ( stretch ) {
          objectBoundsDescriptionDescription.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          objectBoundsDescriptionDescription.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        objectBoundsDescriptionDescription.center = objectBoundsDescriptionDescriptionViewBounds.center;
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
          scratchpad.objectBoundsDescriptionDescriptionUtterance.priorityProperty.value = v;
        }
        
        const setAlertStableDelay = ( v ) => {
          scratchpad.objectBoundsDescriptionDescriptionUtterance.setAlertStableDelay( v );
        };
        
        const setVoiceRate = ( v ) => {
          phet.scenery.voicingManager.voiceRateProperty.value = v;
        };
        
        const setVoicePitch = ( v ) => {
          phet.scenery.voicingManager.voicePitchProperty.value = v;
        };
      
      
        let objectBoundsDescription = '';
if ( leftTopBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'left top';
}
else if ( centerTopBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'center top';
}
else if ( rightTopBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'right top'
}
else if ( leftCenterBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'left center'
}
else if ( centerBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'center'
}
else if ( rightCenterBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'right center'
}
else if ( leftBottomBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'left bottom'
}
else if ( centerBottomBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'center bottom'
}
else if ( rightBottomBounds.containsPoint( position ) ) {
    objectBoundsDescription = 'right bottom'
}

console.log( objectBounds );
if ( objectBounds === cupcakeBounds ) {
    return objectBoundsDescription + ', you found the cupcake!';
}
else {
    return objectBoundsDescription;
}
      }
      
      // a reusable utterance for this description component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.objectBoundsDescriptionDescriptionUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.objectBoundsDescriptionDescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'position', 'leftTopBounds', 'centerTopBounds', 'rightTopBounds', 'leftCenterBounds', 'centerBounds', 'rightCenterBounds', 'leftBottomBounds', 'centerBottomBounds', 'rightBottomBounds', 'objectBounds', 'cupcakeBounds' ], ( position, leftTopBounds, centerTopBounds, rightTopBounds, leftCenterBounds, centerBounds, rightCenterBounds, leftBottomBounds, centerBottomBounds, rightBottomBounds, objectBounds, cupcakeBounds ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const descriptionResult = objectBoundsDescriptionDescriptionFunction( position, leftTopBounds, centerTopBounds, rightTopBounds, leftCenterBounds, centerBounds, rightCenterBounds, leftBottomBounds, centerBottomBounds, rightBottomBounds, objectBounds, cupcakeBounds );
        if ( descriptionResult && descriptionResult.toString ) {
          const descriptionString = descriptionResult.toString();
          if ( descriptionString && descriptionString.length > 0 ) {
            scratchpad.objectBoundsDescriptionDescriptionUtterance.alert = descriptionString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.objectBoundsDescriptionDescriptionUtterance ); 
          }
        }
      }, {
        lazy: false,
        otherReferences: [  ]
      } ); 
    


      // Create a shape with kite.
      const objectViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.1, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const objectViewPath = new phet.scenery.Path( objectViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( objectViewPath );
      scratchpad.objectViewPath = objectViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.objectViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'position' ], ( position ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const objectViewShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 0.1, sharedData.displaySize.width ) )
        scratchpad.objectViewPath.setShape( objectViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.objectViewPath.mutate( {
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
        objectViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        objectViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        objectViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        objectViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        objectViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        objectViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        objectViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        objectViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        objectViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        objectViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const objectViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( objectViewPath.localBounds.width || 1 ) / ( objectViewPath.localBounds.height || 1 );

        const scaleX = objectViewPathViewBounds.width / ( objectViewPath.localBounds.width || 1 );
        const scaleY = objectViewPathViewBounds.height / ( objectViewPath.localBounds.height || 1 );

        if ( stretch ) {
          objectViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          objectViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        objectViewPath.center = objectViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          objectViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          objectViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          objectViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          objectViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          objectViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          objectViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          objectViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          objectViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          objectViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          objectViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setCenterX( position.x );
setCenterY( position.y );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'position' );
    


      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( [ 'position', 'leftTopBounds', 'centerTopBounds', 'rightTopBounds', 'leftCenterBounds', 'centerBounds', 'rightCenterBounds', 'leftBottomBounds', 'centerBottomBounds', 'rightBottomBounds' ], scratchpad.objectBoundsDerivedPropertyObserverId );
      delete scratchpad.objectBoundsDerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( 'objectBounds' );
    

      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'position', 'leftTopBounds', 'centerTopBounds', 'rightTopBounds', 'leftCenterBounds', 'centerBounds', 'rightCenterBounds', 'leftBottomBounds', 'centerBottomBounds', 'rightBottomBounds', 'objectBounds', 'cupcakeBounds' ], scratchpad.objectBoundsDescriptionDescriptionMultilinkId, {
        otherReferences: [  ]
       } );
      delete scratchpad.objectBoundsDescriptionDescriptionMultilinkId;
      
      // Remove the utterance
      delete scratchpad.objectBoundsDescriptionDescriptionUtterance;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.objectViewPath );
      delete scratchpad.objectViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'position' ], scratchpad.objectViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.objectViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty80 = phet.paperLand.getModelComponent( 'position' );
    if ( modelProperty80 ) {
      modelProperty80.value = phet.paperLand.utils.getProgramCenter( points );
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
  ctx.fillText('Movable Object', canvas.width / 2, canvas.height / 2 + 20);
})();
