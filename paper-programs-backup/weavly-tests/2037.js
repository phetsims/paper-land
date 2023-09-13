// Weavly
// Keywords: testing, hacks!
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: General Template (templates)
// Program Description: Example program with functioning Board and Projector code!
// !!!UPDATE ME WITH A BETTER BOARD EXAMPLE!!!

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');



  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    phet.paperLand.console.log( 'Creating a new iframe' );
    const iframe = document.createElement( 'iframe' );
    iframe.src = 'http://localhost:3000/'; // Weavly will be running here!
    iframe.width = '1200px';
    iframe.height = '800px';
    document.body.appendChild( iframe );

    phet.paperLand.addModelComponent( 'weavlyFrame', iframe );

    scratchpad.windowMessageListener = event => {
        if ( event.data.type === 'paper-playground-weavly-message' ) {
            phet.paperLand.console.log( event.data.message );
        }
    };
    window.addEventListener( 'message', scratchpad.windowMessageListener );


    // create a root
    const rootElement = new phet.paperLand.SingleChildConnectionElement();
    phet.paperLand.addModelComponent( 'rootElement', rootElement );

    // Add this element to the program data itself so that adjacent programs can find it
    phet.paperLand.setProgramData( paperProgramNumber, 'connectionElement', rootElement );

    // Update the program data whenever the tree changes
    rootElement.subtreeChangedEmitter.addListener( () => {

        const programSequence = [];
        rootElement.walkDownTree( ( connectionElement ) => {
        const actionType = connectionElement.getElementData();
          programSequence.push( { block: actionType } );
        } );

        phet.paperLand.console.log( JSON.stringify( programSequence ) );

        // Send a message to Weavly to create a program with one forward block.
        phet.paperLand.console.log( 'Sending message to Weavly' );
        iframe.contentWindow.postMessage( {

        // We will probably want different message types.
        // For example, this is an 'update' message, we might want to signify that.
        type: 'paper-playground-weavly-message',
        message: {
            command: 'setProgram',
            program: programSequence
        }
        }, '*' );
    } );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    phet.paperLand.removeModelComponent( 'rootElement' );
    phet.paperLand.removeProgramData( paperProgramNumber, 'connectionElement' );

    // remove the iframe from the document
    const iframe = phet.paperLand.getModelComponent( 'weavlyFrame' );
    document.body.removeChild( iframe );

    // remove the iframe from the paper-land model
    phet.paperLand.removeModelComponent( 'weavlyFrame' );
  };

  const onProgramChangedPosition = ( paperProgramNumber, paperPoints, scratchpad, sharedData ) => {
    // const iframeWindow = phet.paperLand.getModelComponent( 'weavlyFrame' );   

    // phet.paperLand.console.log( 'Sending message to Weavly' );
    // iframeWindow.postMessage( {
    //    type: 'paper-playground-weavly-message',
    //    message: 'Hello Weavly!'
    // }, '*' );
  };

  const onProgramMarkersAdded = ( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram ) => {
    if ( markersOnProgram.length > 0 ) {

        // just got a new marker, run the program!
        phet.paperLand.console.log( 'starting!' );
        const iframe = phet.paperLand.getModelComponent( 'weavlyFrame' );   
        iframe.contentWindow.postMessage( {
            type: 'paper-playground-weavly-message',
            message: {
                command: 'start'
            }
        }, '*' );
    }
  };

  const onProgramMarkersRemoved = ( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram ) => {
    if ( markersOnProgram.length === 0 ) {

        // all markers removed, stop!
        phet.paperLand.console.log( 'stopping!' );
        const iframe = phet.paperLand.getModelComponent( 'weavlyFrame' );   
        iframe.contentWindow.postMessage( {
            type: 'paper-playground-weavly-message',
            message: {
                command: 'stop'
            }
        }, '*' );
    }
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString()
      }
    }
  } );

  //----------------------------------------------------------------------
  // Projector code
  //----------------------------------------------------------------------

  const canvas = await paper.get('canvas');

  // Draw "Hello world" on the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Hello', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('world', canvas.width / 2, canvas.height / 2 + 20);

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get('supporterCanvas');
  const supporterCtx = supporterCanvas.getContext('2d');

  // Repeat every 100 milliseconds.
  setInterval(async () => {
    // Get a list of all the papers.
    const papers = await paper.get('papers');

    // Clear out the supporter canvas. We get our own canvas, so we won't
    // interfere with other programs by doing this.
    supporterCtx.clearRect(0, 0, supporterCanvas.width, supporterCanvas.height);

    // Draw a circle in the center of our paper.
    const myCenter = papers[myPaperNumber].points.center;
    supporterCtx.fillStyle = supporterCtx.strokeStyle = 'rgb(0, 255, 255)';
    supporterCtx.beginPath();
    supporterCtx.arc(myCenter.x, myCenter.y, 10, 0, 2*Math.PI);
    supporterCtx.fill();

    // Draw a line from our paper to each other paper.
    Object.keys(papers).forEach(otherPaperNumber => {
      if (otherPaperNumber !== myPaperNumber) {
        const otherCenter = papers[otherPaperNumber].points.center;

        supporterCtx.beginPath();
        supporterCtx.moveTo(myCenter.x, myCenter.y);
        supporterCtx.lineTo(otherCenter.x, otherCenter.y);
        supporterCtx.stroke();
      }
    });
  }, 100);
})();
