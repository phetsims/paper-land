// Planetary Gravity from List - Markers
// Keywords: radio, buttons, markers, example, voicing
// =============================== //
// Program Dependencies:
// Recommended Programs:
// Program Description: Creates a "radio group" that controls gravity. The value is controlled by the
//                      number of markers on this program. 0 markers sets to first value, 1 markers sets
//                      to second value, and so on.                          

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // This is the function we want to call whenever a marker is added or removed from the program. You
    // could copy/paste the body of this function right into onProgramMarkersAdded/Removed functions,
    // but it is created once here and assigned to the scratchpad to avoid code duplication. The function
    // takes a single argument, the current number of markers contained in the program.
    scratchpad.handleMarkersChanged = currentMarkers => {

      // get a reference to the Property to control
      const planetNameProperty = sharedData.model.get( 'planetNameProperty' );
      const planetNames = sharedData.model.get( 'planetNames' );
      if ( planetNameProperty && planetNames ) {
        
        // The number of markers control the current value.
        const numberOfMarkers = currentMarkers.length;
        if ( numberOfMarkers < planetNames.length ) {
          planetNameProperty.value = planetNames[ numberOfMarkers ];
        }
        else {
            
          // There are more markers in the program than there are values, just set to the last
          // possible value
          planetNameProperty.value = planetNames[ planetNames.length - 1 ];
        }
      }
      else {
        phet.paperLand.console.warn( 'No planetNameProperty to control yet. Add the World program.' );
      }
    }

    // Observe the changing Property. addModelPropertyLink returns a uniqueID which is saved to the
    // scratchpad so it can be easily unlinked later.
    scratchpad.linkId = phet.paperLand.addModelPropertyLink( 'planetNameProperty', value => {
      phet.paperLand.console.log( `New radio value: ${value}` );
    } );
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    // unlink the Property listener that was logging the new value to the console
    scratchpad.linkId = phet.paperLand.removeModelPropertyLink( 'planetNameProperty', scratchpad.linkId );
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


