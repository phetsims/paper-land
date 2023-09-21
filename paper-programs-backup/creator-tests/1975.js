// Line
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    

      // Create a shape with kite.
      
        let x1 = 25;
        let y1 = 10;
        let x2 = 500;
        let y2 = 25;
        const lineShape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 )
      
      
      // create a path for the shape
      const linePath = new phet.scenery.Path( lineShape, {
        fill: '#FFFFFF',
        stroke: '#FFFFFF',
        lineWidth: 5,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: 200,
        centerY: 200,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( linePath );
      scratchpad.linePath = linePath;
      
      // Update the shape when a dependency changes.
      scratchpad.linePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
      
        // the functions that are available for this view type
        
      const setCenterX = ( x ) => {
        linePath.centerX = x;
        linePath.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        linePath.centerY = y;
      };
      
      const setScale = ( scale ) => {
        linePath.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        linePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        linePath.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        linePath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          linePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          linePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          linePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = newX1;
          linePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = newY1;
          linePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = newX2;
          linePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = newY2;
          linePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          linePath.radius = radius;
        };
        
        
        
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.linePath );
      delete scratchpad.linePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.linePathMultilinkId );
      delete scratchpad.linePathMultilinkId;
    
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
  ctx.fillText('1975', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Line', canvas.width / 2, canvas.height / 2 + 20);
})();
