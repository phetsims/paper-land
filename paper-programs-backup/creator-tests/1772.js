// Triangle
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    

      // Create a shape with kite.
      
        const triangleShape = phet.kite.Shape.polygon( [
          new phet.dot.Vector2( 100 / 2, 0 ),
          new phet.dot.Vector2( 0, 100 ),
          new phet.dot.Vector2( -100 / 2, 0 )
        ] );
      
      
      // create a path for the shape
      const trianglePath = new phet.scenery.Path( triangleShape, {
        fill: '#AA0000',
        stroke: '#808080',
        lineWidth: 7,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: 300,
        centerY: 400,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( trianglePath );
      scratchpad.trianglePath = trianglePath;
      
      // Update the shape when a dependency changes.
      scratchpad.trianglePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
      
        // the functions that are available for this view type
        
      const setCenterX = ( x ) => {
        trianglePath.centerX = x;
        trianglePath.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        trianglePath.centerY = y;
      };
      
      const setScale = ( scale ) => {
        trianglePath.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        trianglePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        trianglePath.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        trianglePath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          trianglePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          trianglePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          trianglePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = newX1;
          trianglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = newY1;
          trianglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = newX2;
          trianglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = newY2;
          trianglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          trianglePath.radius = radius;
        };
        
        
        
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.trianglePath );
      delete scratchpad.trianglePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.trianglePathMultilinkId );
      delete scratchpad.trianglePathMultilinkId;
    
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
  ctx.fillText('1772', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Triangle', canvas.width / 2, canvas.height / 2 + 20);
})();
