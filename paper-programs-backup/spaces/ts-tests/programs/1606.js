// Voicing PhET Checkbox - TS
// Keywords: checkbox, view, simple, phet, voice
// ------------------------------- //
// Required Programs (dependencies) [none]
// Recommended Programs (work well with no modifications, but not necessary) [none]
// Voicing PhET Checkboxes: Name matches on-screen text; Do not have object responses.  

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    // Voicing responses
    const voicingNameResponse = 'Force Values';
    const voicingHintResponse = 'Explore with or without newtons.';
    
    // Create a checkbox and add it to the scene.
    const checkBoxLabelText = voicingNameResponse
    const fontSize = 16;
    const checkboxLabel = new phet.scenery.Text( checkBoxLabelText, {
      font: new phet.sceneryPhet.PhetFont( fontSize )
    } );
    const booleanProperty = new phet.axon.BooleanProperty( false );
    const checkbox = new phet.sun.Checkbox( booleanProperty, checkboxLabel );
    sharedData.scene.addChild( checkbox );
    scratchpad.checkbox = checkbox;

    //Adds to PaperLand
    phet.paperLand.addModelComponent('checkboxBooleanProperty', booleanProperty);

    // A work around to get around a bug with checkbox because default checkbox utterances
    // will override low priority utterance.
    const utterance = new phet.utteranceQueue.Utterance( {
        priority: 5 
    } );
    scratchpad.linkID = phet.paperLand.addModelPropertyLink('checkboxBooleanProperty', checked => {
        const nameResponse = voicingNameResponse
        // Vocing responses that change with the checkbox checked state.
        //const objectResponse = checked ? '' : ''
        const contextResponse = checked ? 'Shown in newtons!' : 'Hidden!'
        
        // What voices when the checkbox is toggled (all input)
        utterance.alert = new phet.utteranceQueue.ResponsePacket({
            nameResponse: nameResponse, 
            //objectResponse: objectResponse,
            contextResponse: contextResponse
        });
        phet.scenery.voicingUtteranceQueue.addToBack( utterance );
    });

    // Needed to voice name and hint on focus    
    checkbox.addInputListener( {
        focus: event => {
            utterance.alert = new phet.utteranceQueue.ResponsePacket({
                nameResponse: voicingNameResponse,
                hintResponse: voicingHintResponse 
            });
            phet.scenery.voicingUtteranceQueue.addToBack( utterance )
        }
    } )


  };

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {
    console.log( `onProgramChangedPosition called for ppn ${paperProgramNumber}`);

    if ( scratchpad.checkbox ){

      // Center the image based on the position of the paper.
      const paperCenterX = ( positionPoints[0].x + positionPoints[1].x ) / 2;
      const paperCenterY = ( positionPoints[0].y + positionPoints[2].y ) / 2;
      scratchpad.checkbox.centerX = paperCenterX * sharedData.displaySize.width;
      scratchpad.checkbox.centerY = paperCenterY * sharedData.displaySize.height;
    }
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {    
    sharedData.scene.removeChild( scratchpad.checkbox );
    scratchpad.checkbox = null;
    
    phet.paperLand.removeModelPropertyLink('checkboxBooleanProperty', scratchpad.linkID);
    phet.paperLand.removeModelComponent('checkboxBooleanProperty');
  };

   // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramRemoved: onProgramRemoved.toString()
      }
    }
  } );

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Add some text to the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(155,25,34)';
  ctx.fillText('PhET', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(155,25,34)';
  ctx.fillText('Checkbox', canvas.width / 2, canvas.height / 2 + 20);
})();



