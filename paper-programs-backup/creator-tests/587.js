// Polygon
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    

      // Create a shape with kite.
      const polygonShape = phet.kite.Shape.polygon( [new phet.dot.Vector2( 0, 0 ), new phet.dot.Vector2( 100, 0 ), new phet.dot.Vector2( 150, 150 ), new phet.dot.Vector2( 100, 100 ), new phet.dot.Vector2( 0, 50 )] )
      
      // create a path for the shape
      const polygonPath = new phet.scenery.Path( polygonShape, {
        fill: '#007BFF',
        stroke: '#001F3F',
        lineWidth: 5,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: 300,
        centerY: 100,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( polygonPath );
      scratchpad.polygonPath = polygonPath;
      
      // Update the shape when a dependency changes.
      scratchpad.polygonPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
      
        // the functions that are available for this view type
        
      const setCenterX = ( x ) => {
        polygonPath.centerX = x;
        polygonPath.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        polygonPath.centerY = y;
      };
      
      const setScale = ( scale ) => {
        polygonPath.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        polygonPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        polygonPath.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        polygonPath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          polygonPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          polygonPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          polygonPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = newX1;
          polygonPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = newY1;
          polygonPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = newX2;
          polygonPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = newY2;
          polygonPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          polygonPath.radius = radius;
        };
        
        
        
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.polygonPath );
      delete scratchpad.polygonPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.polygonPathMultilinkId );
      delete scratchpad.polygonPathMultilinkId;
    
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
  ctx.fillText('587', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Polygon', canvas.width / 2, canvas.height / 2 + 20);
})();
