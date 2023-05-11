// Print Voicing - Copy
// Keywords: simple, view, voicing, text
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: N/A
// Program Description: Prints any speech from Voicing as it is spoken with phet.scenery.voicingUtteranceQueue.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    //=================================================================================================================
    // Easily Changed Parameters
    const textColor = 'rgb(197,76,134)';
    const fontSize = 20;
    const lineWrap = 600; // length of each line before wrapping
    const printCount = 5; // how many responses to print at a time
    
    //=================================================================================================================

    // Create a VBox - a vertical scenery layout container for the text
    const vBox = new phet.scenery.VBox( {
      align: 'left',
      spacing: 5
    } );

    // Add the container to the scene and the scratchpad.
    sharedData.scene.addChild( vBox );
    scratchpad.vBox = vBox;

    // add a listener to scenery's voicingManager - whenever it starts speaking something,
    // that gets printed to the board
    scratchpad.startSpeakingListener = content => {
      
      // create the text to be added
      const textContent = new phet.scenery.RichText( content, {
        font: new phet.scenery.Font( {
          size: fontSize
        } ),
        fill: textColor,
        lineWrap: lineWrap
      } );

      // add the text to the layout container
      vBox.addChild( textContent );

      // vBox puts new children at the end of the list. We want the most recent
      // text at the top. Moving new child to back of graph will put at top of VBox.
      textContent.moveToBack();

      // remove the oldest text, keeping the desired amount of content
      while( vBox.children.length > printCount ) {
        vBox.removeChild( vBox.children[ vBox.children.length - 1 ] );
      }
    }
    phet.scenery.voicingManager.startSpeakingEmitter.addListener( scratchpad.startSpeakingListener );
  };

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {

    if ( scratchpad.vBox ){

      // Center the layout container based on the position of the paper.
      const paperCenterX = ( positionPoints[0].x + positionPoints[1].x ) / 2;
      const paperCenterY = ( positionPoints[0].y + positionPoints[2].y ) / 2;
      scratchpad.vBox.centerX = paperCenterX * sharedData.displaySize.width;
      scratchpad.vBox.centerY = paperCenterY * sharedData.displaySize.height;
    }
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    phet.scenery.voicingManager.startSpeakingEmitter.removeListener( scratchpad.startSpeakingListener );

    sharedData.scene.removeChild( scratchpad.vBox );
    delete scratchpad.vBox;
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

  //----------------------------------------------------------------------
  // Projector code
  //----------------------------------------------------------------------

  const canvas = await paper.get('canvas');

  // Draw a message on the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Show', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Text', canvas.width / 2, canvas.height / 2 + 20);
})();



