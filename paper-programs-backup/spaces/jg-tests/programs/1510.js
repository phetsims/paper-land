// Load Simulation
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    // Create the simulation simFrame.
const simFrame = document.createElement('iframe');
simFrame.src = 'https://phet-dev.colorado.edu/html/quadrilateral/1.0.0-paperLandTest.3/phet/quadrilateral_en_phet.html?brand=phet&ea&deviceConnection&postMessageOnLoad&voicingInitiallyEnabled'
//simFrame.src = 'http://localhost:8080/quadrilateral/quadrilateral_en.html?brand=phet&ea&debugger&deviceConnection&postMessageOnLoad&voicingInitiallyEnabled'

// Styling to make the iframe go on top of the interactive display.
// HACK ALERT!! If this id changes, there will be problems.
const displayElement = document.getElementById('scenery-display');

// Remove the iframe from the flow of the document and adjust its size
simFrame.style.position = 'absolute';
simFrame.style.width = `${displayElement.offsetWidth}px`;
simFrame.style.height = `${displayElement.offsetHeight}px`;
simFrame.style.top = `${displayElement.offsetTop}px`;
simFrame.style.left = `${displayElement.offsetLeft}px`;

// Add the iframe as a sibling of the display element.
displayElement.parentNode.insertBefore(simFrame, displayElement.nextSibling);

// Save a reference to the iframe so that it can be removed onProgramRemoved.
scratchpad.simFrame = simFrame;

// A message that will be sent from paper playground into the simulation, attempting to calibrate.
const loadMessage = JSON.stringify({
    type: 'quadrilateralCalibration',
    width: sharedData.displaySize.width,
    height: sharedData.displaySize.height
});

const iframeWindow = simFrame.contentWindow;

// Try sending the message right away just in case (but we probably need to wait for the sim to load).
iframeWindow.postMessage(loadMessage, '*');

// The sim sends a message when loading is complete (postMessageOnLoad query param). When loading is complete,
// send a message back attempting to calibrate to map paper playground coordinates to simulation coordinates.
scratchpad.windowMessageListener = event => {
    const data = JSON.parse(event.data);

    if (data.type === 'load') {
        iframeWindow.postMessage(loadMessage, '*');
    }
};
window.addEventListener('message', scratchpad.windowMessageListener);

// Forward 4 positions in normalized paper-land coordinates to the simulation.
const updateFromPaperLandPositions = (vertexA, vertexB, vertexC, vertexD) => {

    // Convert each point from normalized paper-land coordinates to
    // display coordinates - working in display coordinates is better
    // because no matter what the projection transform is, paper positions
    // will more likely match quadrilateral positions.
    const displayWidth = sharedData.displaySize.width;
    const displayHeight = sharedData.displaySize.height;
    const displayPointA = phet.paperLand.utils.paperToDisplayCoordinates( vertexA, displayWidth, displayHeight );
    const displayPointB = phet.paperLand.utils.paperToDisplayCoordinates( vertexB, displayWidth, displayHeight );
    const displayPointC = phet.paperLand.utils.paperToDisplayCoordinates( vertexC, displayWidth, displayHeight );
    const displayPointD = phet.paperLand.utils.paperToDisplayCoordinates( vertexD, displayWidth, displayHeight );

    iframeWindow.postMessage(JSON.stringify({
        type: 'quadrilateralControl',
        vertexA: {
            x: displayPointA.x,
            y: displayPointA.y
        },
        vertexB: {
            x: displayPointB.x,
            y: displayPointB.y
        },
        vertexC: {
            x: displayPointC.x,
            y: displayPointC.y
        },
        vertexD: {
            x: displayPointD.x,
            y: displayPointD.y
        },
    }), '*');
};

// When all corner programs are detected, add a multilink that will update
// simulation positions to match paper positions.
scratchpad.vertexPositionMultilink = phet.paperLand.addModelPropertyMultilink(
    ['vertexA', 'vertexB', 'vertexC', 'vertexD'],
    (vertexA, vertexB, vertexC, vertexD) => {
        updateFromPaperLandPositions( vertexA, vertexB, vertexC, vertexD );

    }
);

// When the program representing all vertex positions is added,
// forward those values to the simulation.
scratchpad.combinedVertexPositionMultilink = phet.paperLand.addModelPropertyMultilink(
    [ 'vertexACombined', 'vertexBCombined', 'vertexCCombined', 'vertexDCombined' ],
    ( vertexA, vertexB, vertexC, vertexD ) => {
        updateFromPaperLandPositions( vertexA, vertexB, vertexC, vertexD );
    }
);
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    // Remove the simFrame from the body when the program is removed
scratchpad.simFrame.remove();
delete scratchpad.simFrame;

// Remove the multilink for the vertex positions on individual programs.
phet.paperLand.removeModelPropertyMultilink(
    [ 'vertexA', 'vertexB', 'vertexC', 'vertexD' ],
    scratchpad.vertexPositionMultilink
);
delete scratchpad.vertexPositionMultilink;

// Remove the multilink for the vertex positions on the same program.
phet.paperLand.removeModelPropertyMultilink(
    [ 'vertexACombined', 'vertexBCombined', 'vertexCCombined', 'vertexDCombined' ],
    scratchpad.combinedVertexPositionMultilink
);
delete scratchpad.combinedVertexPositionMultilink;
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
  ctx.fillText('Load Simulation', canvas.width / 2, canvas.height / 2 + 20);
})();
