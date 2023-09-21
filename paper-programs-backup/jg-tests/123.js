// Text component
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const positionComponent = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'positionComponent', positionComponent );
    

      // Create the text and add it to the view.
      const textComponentText = new phet.scenery.Text( '', { stroke: 'white' } );
      
      sharedData.scene.addChild( textComponentText );
      scratchpad.textComponentText = textComponentText;
      
      // Update the text when a dependency changes.
      scratchpad.textComponentTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'positionComponent' ], ( positionComponent ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const setCenterX = ( x ) => {
        textComponentText.centerX = x;
        textComponentText.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        textComponentText.centerY = y;
      };
      
      const setScale = ( scale ) => {
        textComponentText.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        textComponentText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        textComponentText.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        textComponentText.rotation = rotation;
      };

        const setString = ( string ) => {
          textComponentText.string = string;
        };
        
        const setFontSize = ( size ) => {
          textComponentText.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          textComponentText.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          textComponentText.fontFamily = family;
        };
      

        // the function that the user wrote to update the text      
        setCenterX( 100 );
setCenterY( 100 );
setFontSize( 48 );
setTextColor( 'red' );
setString( 'Hello World!' );
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'positionComponent' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.textComponentText );
      delete scratchpad.textComponentText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'positionComponent' ], scratchpad.textComponentTextMultilinkId );
      delete scratchpad.textComponentTextMultilinkId;
    
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
  ctx.fillText('', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Text component', canvas.width / 2, canvas.height / 2 + 20);
})();
