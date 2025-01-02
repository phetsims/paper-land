// Slider - Snappy Qualitative
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const isFocused2 = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'isFocused2', isFocused2 );
    

      const value2 = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'value2', value2 );
    

      const roundedRegionValue = new phet.axon.NumberProperty( 5, {
        range: new phet.dot.Range( 0, 10 )
      });
      phet.paperLand.addModelComponent( 'roundedRegionValue', roundedRegionValue );
    

      scratchpad.roundTheNumberLinkMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'value2' ], ( value2 ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( [ 'roundedRegionValue' ] ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          const roundedRegionValue = phet.paperLand.getModelComponent( 'roundedRegionValue' ).value;
      
          // the functions that are available to the client from their selected dependencies
          const setRoundedRegionValue = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'roundedRegionValue' );
        modelComponent.value = newValue;  
      }
      
      
          // the code block that the user wrote to change controlled Properties
          setRoundedRegionValue(Math.floor(value2));

phet.paperLand.console.log(`${value2} to ${roundedRegionValue}`);   
        }
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'isFocused2' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'value2' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'roundedRegionValue' );
    

      phet.paperLand.removeModelPropertyMultilink( [ 'value2' ], scratchpad.roundTheNumberLinkMultilinkId );
      delete scratchpad.roundTheNumberLinkMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty198 = phet.paperLand.getModelComponent( 'value2' );
    if ( modelProperty198 ) {
      modelProperty198.value = modelProperty198.range.min + ( 1 - phet.paperLand.utils.getProgramCenter( points ).y ) * ( modelProperty198.range.max - modelProperty198.range.min );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty206 = phet.paperLand.getModelComponent( 'isFocused2' );
    if ( modelProperty206 ) {
      modelProperty206.value = otherPaperNumber === 20;
    }
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
    const modelProperty209 = phet.paperLand.getModelComponent( 'isFocused2' );
    if ( modelProperty209 ) {
      modelProperty209.value = otherPaperNumber === 20 ? false : modelProperty209.value;
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
  ctx.fillText('Slider - Snappy Qualitative', canvas.width / 2, canvas.height / 2 + 20);
})();
