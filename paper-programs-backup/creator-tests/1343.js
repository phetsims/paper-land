// Spinning Rectangle (Animation)
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const rectangleRotation = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 6.28 )
      });
      phet.paperLand.addModelComponent( 'rectangleRotation', rectangleRotation );
    


      // Create a shape with kite.
      const spinningRectangleShape = phet.kite.Shape.rectangle( 0, 0, 100, 50 )
      
      // create a path for the shape
      const spinningRectanglePath = new phet.scenery.Path( spinningRectangleShape, {
        fill: '#2e8b57',
        stroke: '#C0c0c0',
        lineWidth: 5,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: 500,
        centerY: 200,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( spinningRectanglePath );
      scratchpad.spinningRectanglePath = spinningRectanglePath;
      
      // Update the shape when a dependency changes.
      scratchpad.spinningRectanglePathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'rectangleRotation' ], ( rectangleRotation ) => {
      
        // the functions that are available for this view type
        
      const setCenterX = ( x ) => {
        spinningRectanglePath.centerX = x;
        spinningRectanglePath.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        spinningRectanglePath.centerY = y;
      };
      
      const setScale = ( scale ) => {
        spinningRectanglePath.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        spinningRectanglePath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        spinningRectanglePath.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        spinningRectanglePath.rotation = rotation;
      };

        const setStroke = ( color ) => {
          spinningRectanglePath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          spinningRectanglePath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          spinningRectanglePath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = newX1;
          spinningRectanglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = newY1;
          spinningRectanglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = newX2;
          spinningRectanglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = newY2;
          spinningRectanglePath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          spinningRectanglePath.radius = radius;
        };
        
        
        setRotation( rectangleRotation );
      } );
    

      const rotationAnimationControllerAnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( [ 'rectangleRotation' ] ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          const rectangleRotation = phet.paperLand.getModelComponent( 'rectangleRotation' ).value;
        
          // the functions create in the local scope to manipulate the controlled components
          const setRectangleRotation = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'rectangleRotation' );
        modelComponent.value = newValue;  
      }
      
          
          // the function that that the user wrote
          setRectangleRotation( Math.sin( elapsedTime ) * 3.14 ); 
        }
      };
      scratchpad.rotationAnimationControllerAnimationListener = rotationAnimationControllerAnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( rotationAnimationControllerAnimationListener );
      
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'rectangleRotation' );
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.spinningRectanglePath );
      delete scratchpad.spinningRectanglePath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'rectangleRotation' ], scratchpad.spinningRectanglePathMultilinkId );
      delete scratchpad.spinningRectanglePathMultilinkId;
    

      phet.axon.stepTimer.removeListener( scratchpad.rotationAnimationControllerAnimationListener );
      delete scratchpad.rotationAnimationControllerAnimationListener;
    
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
  ctx.fillText('1343', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Spinning Rectangle (Animation)', canvas.width / 2, canvas.height / 2 + 20);
})();
