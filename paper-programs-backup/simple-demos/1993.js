// Marker Toggle
// Keywords: a/b, switch, toggle, markers, example
// =============================== //
// Program Dependencies: N/A
// Recommended Programs:
// Program Description: Creates a component that toggles between two values. Adding a marker (any color)
//                      to the program sets the value to the "right" value.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // The values for the toggle - when toggled, it takes on the valueB value.
    // Note that values do not need to be boolean (but they can be if you would like).
    scratchpad.valueA = 'VALUE_A';
    scratchpad.valueB = 'VALUE_B';

    // Create an axon.Property for the model that any program can observe.
    phet.paperLand.addModelComponent( 'toggleProperty', new phet.axon.Property( scratchpad.valueA ) );

    // This is the function we want to call whenever a marker is added or removed from the program. You
    // could copy/paste the body of this function right into onProgramMarkersAdded/Removed functions,
    // but it is created once here and assigned to the scratchpad to avoid code duplication. The function
    // takes a single argument, the current number of markers contained in the program.
    scratchpad.handleMarkersChanged = currentMarkers => {

      // If the model doesn't have the Property we created when the program was added,
      // something went wrong and this function will fail!
      if ( !sharedData.model.has( 'toggleProperty' ) ) {
        phet.paperLand.console.error( 'toggleProperty does not exist in the model!' );
        return;
      }

      // get a reference to the Property now that we know it exists
      const toggleProperty = sharedData.model.get( 'toggleProperty' );

      // This toggle takes on the 'valueB' value when there are any number of markers in the program
      // This is called the ternary operator, it is shorthand for if/else.
      toggleProperty.value = currentMarkers.length > 0 ? scratchpad.valueB : scratchpad.valueA;
    }

    // Observe the changing Property - this function just prints the new value to the console, but
    // you could do anything in this function or put this function in a different program. addModelPropertyLink
    // returns a uniqueID which is saved to the scratchpad so it can be easily unlinked later.
    scratchpad.linkId = phet.paperLand.addModelPropertyLink( 'toggleProperty', value => {
      phet.paperLand.console.warn( `New toggle value: ${value}` );
    } );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // remove the Property from the model
    phet.paperLand.removeModelComponent( 'toggleProperty' );

    // unlink the Property listener that was logging the new value to the console
    scratchpad.linkId = phet.paperLand.removeModelPropertyLink( 'toggleProperty', scratchpad.linkId );
    delete scratchpad.linkId;

    // we are done with our Property controller function
    delete scratchpad.handleMarkersChanged;
  };

  // Called whenever a marker is added to the program
  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.handleMarkersChanged( currentMarkers );
  };

  // Called whenever a marker is removed from the program
  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.handleMarkersChanged( currentMarkers );
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
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
  ctx.fillText('Toggle', canvas.width / 2, canvas.height / 2 - 10);
})();
