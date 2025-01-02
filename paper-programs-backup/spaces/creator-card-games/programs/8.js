// Background
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      // Create a background rectangle and add it to the view.
      const backgroundComponentBackgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height, {
        fill: 'green'
      } );
      
      // If there are no dependencies for the background, add it to the view immediately. Otherwise, we will add it
      // once all dependencies are available.
      if ( [  ].length === 0 ) {
        sharedData.scene.addChild( backgroundComponentBackgroundRectangle );
        backgroundComponentBackgroundRectangle.moveToBack();
      }
      
      // Assign to the scratchpad so that we can remove it later.
      scratchpad.backgroundComponentBackgroundRectangle = backgroundComponentBackgroundRectangle;
  
      const backgroundComponentBackgroundColorDependencies = [  ];

      // Get a new background color whenever a dependency changes. The control function should return a color string.
      const backgroundComponentBackgroundFunction = (  ) => {
      
        // bring in the references so they are available in the control function
        
      
        
      }
      
      // Update the background rectangle whenever the dependencies change.
      scratchpad.backgroundComponentBackgroundMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
    
        const backgroundColorString = backgroundComponentBackgroundFunction(  );
        
        // wait to add the background until all dependencies are available (only add this once)
        if ( scratchpad.backgroundComponentBackgroundRectangle.parents.length === 0 ) {
          sharedData.scene.addChild( backgroundComponentBackgroundRectangle );
          backgroundComponentBackgroundRectangle.moveToBack();
        }
        
        // the function may not be implemented
        if ( backgroundColorString ) {
          backgroundComponentBackgroundRectangle.fill = backgroundColorString;
        }
        
        backgroundComponentBackgroundRectangle.setRect( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the background rectangle from the view.
      sharedData.scene.removeChild( scratchpad.backgroundComponentBackgroundRectangle );
      delete scratchpad.backgroundComponentBackgroundRectangle;
      
      // Remove the multilink if there were any dependencies
      if ( scratchpad.backgroundComponentBackgroundMultilinkId ) {
        phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.backgroundComponentBackgroundMultilinkId, {
          otherReferences: [  ]
        } );
        delete scratchpad.backgroundComponentBackgroundMultilinkId;
      }
    
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
  ctx.fillText('Background', canvas.width / 2, canvas.height / 2 + 20);
})();
