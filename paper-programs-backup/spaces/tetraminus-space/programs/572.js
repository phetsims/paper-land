// Anchor
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const anchorPosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'anchorPosition', anchorPosition );
    


      // Create a shape with kite.
      const anchorCircleShape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( 20, sharedData.displaySize.width ) )
      
      // create a path for the shape
      const anchorCirclePath = new phet.scenery.Path( anchorCircleShape, {
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
      sharedData.scene.addChild( anchorCirclePath );
      scratchpad.anchorCirclePath = anchorCirclePath;
      
      // Update the shape when a dependency changes.
      scratchpad.anchorCirclePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'anchorPosition' ], ( anchorPosition ) => {
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        anchorCirclePath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        anchorCirclePath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        anchorCirclePath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        anchorCirclePath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        anchorCirclePath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        anchorCirclePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        anchorCirclePath.visible = visible;
      };
      
      const moveToFront = () => {
        anchorCirclePath.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        anchorCirclePath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          anchorCirclePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          anchorCirclePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          anchorCirclePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          // x1 = newX1;
          // anchorCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setX1 not implemented' );
        };
        
        const setY1 = ( newY1 ) => {
          // y1 = newY1;
          // anchorCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setY1 not implemented' );
        };

        const setX2 = ( newX2 ) => {
          // x2 = newX2;
          // anchorCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setX2 not implemented' );
        };
        
        const setY2 = ( newY2 ) => {
          // y2 = newY2;
          // anchorCirclePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
          phet.paperLand.console.warn( 'setY2 not implemented' );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          anchorCirclePath.radius = phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          anchorCirclePath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        setCenterX( anchorPosition.x );
setCenterY( anchorPosition.y );
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'anchorPosition' );
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.anchorCirclePath );
      delete scratchpad.anchorCirclePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'anchorPosition' ], scratchpad.anchorCirclePathMultilinkId );
      delete scratchpad.anchorCirclePathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty21 = phet.paperLand.getModelComponent( 'anchorPosition' );
    if ( modelProperty21 ) {
      modelProperty21.value = phet.paperLand.utils.getProgramCenter( points );
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
  ctx.fillText('Anchor', canvas.width / 2, canvas.height / 2 + 20);
})();
