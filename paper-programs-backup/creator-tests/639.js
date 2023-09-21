// Circle
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    

      // Create a shape with kite.
      const circleShape = phet.kite.Shape.circle( 50 )
      
      // create a path for the shape
      const circlePath = new phet.scenery.Path( circleShape, {
        fill: '#001f3f',
        stroke: '#FFFFFF',
        lineWidth: 3,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: 100,
        centerY: 100,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( circlePath );
      scratchpad.circlePath = circlePath;
      
      // Update the shape when a dependency changes.
      scratchpad.circlePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
      
        // the functions that are available for this view type
        
      const setCenterX = ( x ) => {
        circlePath.centerX = x;
        circlePath.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        circlePath.centerY = y;
      };
      
      const setScale = ( scale ) => {
        circlePath.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        circlePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        circlePath.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        circlePath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          circlePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          circlePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          circlePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = newX1;
          circlePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = newY1;
          circlePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = newX2;
          circlePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = newY2;
          circlePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          circlePath.radius = radius;
        };
        
        
        
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.circlePath );
      delete scratchpad.circlePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.circlePathMultilinkId );
      delete scratchpad.circlePathMultilinkId;
    
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
        onProgramSeparated: onProgramSeparated.toString()
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
  ctx.fillText('639', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Circle', canvas.width / 2, canvas.height / 2 + 20);
})();
