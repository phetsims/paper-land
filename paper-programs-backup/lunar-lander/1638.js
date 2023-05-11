// Gravity Voicing
// Keywords: speech, synthesis, responses
// =============================== //
// Program Dependencies: World (Model)
// Recommended Programs:
// Program Description: Prints Voicing responses when the gravityProperty changes.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // When the gravity changes, generate response strings and speak them. A linkId is saved
    // to the scratchpad so that we can unlink this behavior when the program is removed.
    scratchpad.linkId = phet.paperLand.addModelPropertyLink( 'gravityProperty', ( currentGravity, oldGravity ) => {

      // The oldGravity may be undefined if this is the first time the function is called. In that case,
      // describe change relative to 0 gravity.
      oldGravity = oldGravity || 0;

      // We want to describe if the Lander feels lighter or heavier. Compare oldGravity to currentGravity
      // to determine this and save to a string variable for use in responses. Note that gravity is negative,
      // so we negate the values before the comparison for the description. The ? operator is called
      // the ternary operator and is shorthand for if/else.
      const weightChangeString = -currentGravity > -oldGravity ? 'heavier' : 'lighter';

      // We want to describe HOW MUCH the weight has changed. Map the difference in weight to a described scale.
      const weightChange = Math.abs( oldGravity - currentGravity ); // absolute value for scale
      const weightChangeAmountString = weightChange < 3 ? 'a little' :
                                       weightChange < 8 ? 'much' :
                                       'much much'; // else case, anything more than last value is 'much much'

      const planetName = sharedData.model.get( 'planetNameProperty' ).value;                                   
    
      // The value with limitted precision so it sounds nice when read.
      const formattedValue = phet.dot.Utils.toFixed( currentGravity, 3 );

      // Assemble responses 
      const utterance = new phet.utteranceQueue.Utterance( {
        alert: new phet.utteranceQueue.ResponsePacket( {
          nameResponse: `Landing on ${planetName}`, // Name of the value
          //objectResponse: `Now ${formattedValue} meters per second squared`, // The new value itself
          //objectResponse: `Now on ${planetName}`, // The value of gravity expressed as body.
          contextResponse: `Lander seems ${weightChangeAmountString} ${weightChangeString}.` // Contextual changes after the changing value
        } )
      } );

      phet.scenery.voicingUtteranceQueue.addToBack( utterance );
    } );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

      // Remove the link to the gravityProperty when the program is removed
      phet.paperLand.removeModelPropertyLink( 'gravityProperty', scratchpad.linkId );
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString()
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
