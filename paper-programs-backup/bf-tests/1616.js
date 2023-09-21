// Game Model
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const diceOneValue = new phet.axon.NumberProperty( 1, {
        range: new phet.dot.Range( 1, 20 )
      });
      phet.paperLand.addModelComponent( 'diceOneValue', diceOneValue );
    

      const diceTwoValue = new phet.axon.NumberProperty( 1, {
        range: new phet.dot.Range( 1, 20 )
      });
      phet.paperLand.addModelComponent( 'diceTwoValue', diceTwoValue );
    

      // Create the text and add it to the view.
      const scoreViewText = new phet.scenery.Text( '', { stroke: 'white' } );
      
      sharedData.scene.addChild( scoreViewText );
      scratchpad.scoreViewText = scoreViewText;
      
      // Update the text when a dependency changes.
      scratchpad.scoreViewTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'diceOneValue', 'diceTwoValue' ], ( diceOneValue, diceTwoValue ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const setCenterX = ( x ) => {
        scoreViewText.centerX = x;
        scoreViewText.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        scoreViewText.centerY = y;
      };
      
      const setScale = ( scale ) => {
        scoreViewText.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        scoreViewText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        scoreViewText.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        scoreViewText.rotation = rotation;
      };

        const setString = ( string ) => {
          scoreViewText.string = string;
        };
        
        const setFontSize = ( size ) => {
          scoreViewText.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          scoreViewText.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          scoreViewText.fontFamily = family;
        };
      

        // the function that the user wrote to update the text      
        setCenterX( 320 );
setCenterY( 40 );
setFontSize( 28 );
setTextColor( `#FFFFFF` );
setFontFamily( 'serif' );


if ( diceOneValue > diceTwoValue ) {
    setString( `Player One wins!` );
} else if ( diceOneValue === diceTwoValue ) {
    setString ( `Tie! Roll again.` )
} else {
    setString( `Player Two wins!` );
}

      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'diceOneValue' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'diceTwoValue' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.scoreViewText );
      delete scratchpad.scoreViewText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'diceOneValue', 'diceTwoValue' ], scratchpad.scoreViewTextMultilinkId );
      delete scratchpad.scoreViewTextMultilinkId;
    
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
  ctx.fillText('1616', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Game Model', canvas.width / 2, canvas.height / 2 + 20);
})();
