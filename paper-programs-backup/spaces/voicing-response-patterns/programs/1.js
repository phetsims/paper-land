// Model Data
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const voltageValue = new phet.axon.NumberProperty( 4.5, {
        range: new phet.dot.Range( 0.1, 9.0 )
      });
      phet.paperLand.addModelComponent( 'voltageValue', voltageValue );
    

      const resistanceValue = new phet.axon.NumberProperty( 500, {
        range: new phet.dot.Range( 10, 1000 )
      });
      phet.paperLand.addModelComponent( 'resistanceValue', resistanceValue );
    

      const currentValue = new phet.axon.NumberProperty( 0.009, {
        range: new phet.dot.Range( 0.0001, 0.9 )
      });
      phet.paperLand.addModelComponent( 'currentValue', currentValue );
    

      scratchpad.calculateCurrentLinkMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'voltageValue', 'resistanceValue' ], ( voltageValue, resistanceValue ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'currentValue' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const currentValue = phet.paperLand.getModelComponent( 'currentValue' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setCurrentValue = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'currentValue' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          setCurrentValue( (1000 * voltageValue) / (resistanceValue) );
// returns milliamps   
        }
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'voltageValue' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'resistanceValue' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'currentValue' );
    

      phet.paperLand.removeModelPropertyMultilink( [ 'voltageValue', 'resistanceValue' ], scratchpad.calculateCurrentLinkMultilinkId );
      delete scratchpad.calculateCurrentLinkMultilinkId;
    
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
  ctx.fillText('Model Data', canvas.width / 2, canvas.height / 2 + 20);
})();
