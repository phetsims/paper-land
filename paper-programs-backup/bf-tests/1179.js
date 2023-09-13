// Dice One Roller
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const readyToRollDice1 = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'readyToRollDice1', readyToRollDice1 );
    

      const position1179 = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'position1179', position1179 );
    

      // Create the text and add it to the view.
      const dice1ScoreText = new phet.scenery.Text( '', { stroke: 'white' } );
      
      sharedData.scene.addChild( dice1ScoreText );
      scratchpad.dice1ScoreText = dice1ScoreText;
      
      // Update the text when a dependency changes.
      scratchpad.dice1ScoreTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'diceOneValue', 'position1179' ], ( diceOneValue, position1179 ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const setCenterX = ( x ) => {
        dice1ScoreText.centerX = x;
        dice1ScoreText.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        dice1ScoreText.centerY = y;
      };
      
      const setScale = ( scale ) => {
        dice1ScoreText.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        dice1ScoreText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        dice1ScoreText.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        dice1ScoreText.rotation = rotation;
      };

        const setString = ( string ) => {
          dice1ScoreText.string = string;
        };
        
        const setFontSize = ( size ) => {
          dice1ScoreText.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          dice1ScoreText.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          dice1ScoreText.fontFamily = family;
        };
      

        // the function that the user wrote to update the text      
        setString ( diceOneValue );
setCenterX( position1179.x );
setCenterY( position1179.y );
setFontSize( 28 );
setTextColor( '#FFFFFF' );
      } );
    

      scratchpad.rollDice1LinkMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'readyToRollDice1' ], ( readyToRollDice1 ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'diceOneValue' ] ) ) {
        
          // references to each model component controlled by this listener
          const diceOneValue = phet.paperLand.getModelComponent( 'diceOneValue' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setDiceOneValue = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'diceOneValue' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if (readyToRollDice1) {
    let randNum1;
    randNum1 = Math.floor(Math.random() * 20) + 1;
    setDiceOneValue (randNum1);
}   
        }
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'readyToRollDice1' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'position1179' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.dice1ScoreText );
      delete scratchpad.dice1ScoreText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'diceOneValue', 'position1179' ], scratchpad.dice1ScoreTextMultilinkId );
      delete scratchpad.dice1ScoreTextMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'readyToRollDice1' ], scratchpad.rollDice1LinkMultilinkId );
      delete scratchpad.rollDice1LinkMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty264 = phet.paperLand.getModelComponent( 'position1179' );
    if ( modelProperty264 ) {
      modelProperty264.value = phet.paperLand.utils.getBoardPositionFromPoints( points, sharedData.displaySize );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty271 = phet.paperLand.getModelComponent( 'readyToRollDice1' );
    if ( modelProperty271 ) {
      modelProperty271.value = otherPaperNumber === 1616;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty274 = phet.paperLand.getModelComponent( 'readyToRollDice1' );
    if ( modelProperty274 ) {
      modelProperty274.value = otherPaperNumber === 1616 ? false : modelProperty274.value;
    }
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
  ctx.fillText('1179', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Dice One Roller', canvas.width / 2, canvas.height / 2 + 20);
})();
