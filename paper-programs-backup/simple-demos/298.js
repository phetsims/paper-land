// Radio Group - Markers
// Keywords: radio, buttons, markers, example, voicing
// =============================== //
// Program Dependencies: N/A
// Recommended Programs:
// Program Description: Creates a "radio group" that lets user select a value from a number of values. The
//                      number of markers controls the value. 0 markers sets to first value, 1 markers sets
//                      to second value, and so on.                                

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // Values for the group. This list can have any number of values. The values of 
    // this example are strings, but they can be any kind of type. They must all
    // be different.
    const values = [
      'VALUE_A',
      'VALUE_B',
      'VALUE_C',
      'VALUE_D'
    ];

    // Create an axon.Property for the model that any program can observe and control.
    phet.paperLand.addModelComponent( 'radioProperty', new phet.axon.Property( values[ 0 ] ) );

    // This is the function we want to call whenever a marker is added or removed from the program. You
    // could copy/paste the body of this function right into onProgramMarkersAdded/Removed functions,
    // but it is created once here and assigned to the scratchpad to avoid code duplication. The function
    // takes a single argument, the current number of markers contained in the program.
    scratchpad.handleMarkersChanged = currentMarkers => {

      // If the model doesn't have the Property we created when the program was added,
      // something went wrong and this function will fail!
      if ( !sharedData.model.has( 'radioProperty' ) ) {
        phet.paperLand.console.error( 'radioProperty does not exist in the model!' );
        return;
      }

      // get a reference to the Property now that we know it exists
      const radioProperty = sharedData.model.get( 'radioProperty' );

      // The number of markers control the current value.
      const numberOfMarkers = currentMarkers.length;
      if ( numberOfMarkers < values.length ) {
        radioProperty.value = values[ numberOfMarkers ];
      }
      else {
        
        // There are more markers in the program than there are values, just set to the last
        // possible value
        radioProperty.value = values[ values.length - 1 ];
      }
    }

    // Observe the changing Property - this function just prints the new value to the console, but
    // you could do anything in this function or put this function in a different program. addModelPropertyLink
    // returns a uniqueID which is saved to the scratchpad so it can be easily unlinked later.
    scratchpad.linkId = phet.paperLand.addModelPropertyLink( 'radioProperty', value => {
      phet.paperLand.console.warn( `New radio value: ${value}` );


    } );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // unlink the Property listener that was logging the new value to the console
    scratchpad.linkId = phet.paperLand.removeModelPropertyLink( 'radioProperty', scratchpad.linkId );
    delete scratchpad.linkId;

    // remove the Property from the model
    phet.paperLand.removeModelComponent( 'radioProperty' );

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

