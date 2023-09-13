// Dice Two Roller
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const readyToRollDice2 = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'readyToRollDice2', readyToRollDice2 );
    

      const position1905 = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'position1905', position1905 );
    

      // Create the text and add it to the view.
      const dice2ScoreText = new phet.scenery.Text( '', { stroke: 'white' } );
      
      sharedData.scene.addChild( dice2ScoreText );
      scratchpad.dice2ScoreText = dice2ScoreText;
      
      // Update the text when a dependency changes.
      scratchpad.dice2ScoreTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'diceTwoValue', 'position1905' ], ( diceTwoValue, position1905 ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const setCenterX = ( x ) => {
        dice2ScoreText.centerX = x;
        dice2ScoreText.centerX = x;
      };
      
      const setCenterY = ( y ) => {
        dice2ScoreText.centerY = y;
      };
      
      const setScale = ( scale ) => {
        dice2ScoreText.scaleMagnitude = scale;
      };
      
      const setOpacity = ( opacity ) => {
        dice2ScoreText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        dice2ScoreText.visible = visible;
      };
      
      const setRotation = ( rotation ) => {
        dice2ScoreText.rotation = rotation;
      };

        const setString = ( string ) => {
          dice2ScoreText.string = string;
        };
        
        const setFontSize = ( size ) => {
          dice2ScoreText.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          dice2ScoreText.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          dice2ScoreText.fontFamily = family;
        };
      

        // the function that the user wrote to update the text      
        setString ( diceTwoValue );
setCenterX( position1905.x );
setCenterY( position1905.y );
setFontSize( 28 );
setTextColor( '#FFFFFF' );

      } );
    

      scratchpad.rollDice2LinkMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'readyToRollDice2' ], ( readyToRollDice2 ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'diceTwoValue' ] ) ) {
        
          // references to each model component controlled by this listener
          const diceTwoValue = phet.paperLand.getModelComponent( 'diceTwoValue' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setDiceTwoValue = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'diceTwoValue' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          if ( readyToRollDice2 ) {
    let randNum2;
    randNum2 = Math.floor(Math.random() * 20) + 1;
    setDiceTwoValue (randNum2);
}   
        }
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'readyToRollDice2' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'position1905' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.dice2ScoreText );
      delete scratchpad.dice2ScoreText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'diceTwoValue', 'position1905' ], scratchpad.dice2ScoreTextMultilinkId );
      delete scratchpad.dice2ScoreTextMultilinkId;
    

      phet.paperLand.removeModelPropertyMultilink( [ 'readyToRollDice2' ], scratchpad.rollDice2LinkMultilinkId );
      delete scratchpad.rollDice2LinkMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty275 = phet.paperLand.getModelComponent( 'position1905' );
    if ( modelProperty275 ) {
      modelProperty275.value = phet.paperLand.utils.getBoardPositionFromPoints( points, sharedData.displaySize );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty282 = phet.paperLand.getModelComponent( 'readyToRollDice2' );
    if ( modelProperty282 ) {
      modelProperty282.value = otherPaperNumber === 1616;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty285 = phet.paperLand.getModelComponent( 'readyToRollDice2' );
    if ( modelProperty285 ) {
      modelProperty285.value = otherPaperNumber === 1616 ? false : modelProperty285.value;
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
  ctx.fillText('1905', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Dice Two Roller', canvas.width / 2, canvas.height / 2 + 20);
})();
