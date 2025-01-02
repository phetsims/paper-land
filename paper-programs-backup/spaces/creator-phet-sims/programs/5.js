// Quad (All Vertices)
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const vertexACombined = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'vertexACombined', vertexACombined );
    

      const vertexBCombined = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'vertexBCombined', vertexBCombined );
    

      const vertexCCombined = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'vertexCCombined', vertexCCombined );
    

      const vertexDCombined = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'vertexDCombined', vertexDCombined );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'vertexACombined' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'vertexBCombined' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'vertexCCombined' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'vertexDCombined' );
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    // Since all of these components are created by this program,
// they are guaranteed to be available.
const vA = phet.paperLand.getModelComponent( 'vertexACombined' );
const vB = phet.paperLand.getModelComponent( 'vertexBCombined' );
const vC = phet.paperLand.getModelComponent( 'vertexCCombined' );
const vD = phet.paperLand.getModelComponent( 'vertexDCombined' );

// We can use Vector2.fromStateObject go easily convert from
// paper programs object literal to dot.Vector2 instance.
// Note that paper programs points order just happens to match
// Quadrilateral order.
vA.value = phet.dot.Vector2.fromStateObject( points[ 0 ] );
vB.value = phet.dot.Vector2.fromStateObject( points[ 1 ] );
vC.value = phet.dot.Vector2.fromStateObject( points[ 2 ] );
vD.value = phet.dot.Vector2.fromStateObject( points[ 3 ] );
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
  ctx.fillText('Quad (All Vertices)', canvas.width / 2, canvas.height / 2 + 20);
})();
