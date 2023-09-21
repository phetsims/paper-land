// Altitude: Background Color Change
// Keywords: altitude, background color
// ------------------------------- //
// Required Programs (dependencies): Altitude: Model
// Recommended Programs: Altitude prefix
// Program Description: Changes the background color to white when altitude is above half its range.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Called when the program is detected or changed.
  const onProgramAdded = (paperProgramNumber, scratchpad, sharedData) => {

    // Global model for all programs
    const model = sharedData.model;

    const backgroundColor = sharedData.canvas.style.backgroundColor;
    const aboveHalfRangeColor = 'white';
    const propertyName = 'altitudeProperty';
    const halfRangeValue = model.get(propertyName).range.max / 2;

    const updateBackgroundColor = (newAltitude) => {
      sharedData.canvas.style.backgroundColor = newAltitude > halfRangeValue ? aboveHalfRangeColor : backgroundColor;
    };

    scratchpad.altitudeListenerId = phet.paperLand.addModelPropertyLink(propertyName, updateBackgroundColor);
  };

  // Called when the paper positions change.
  const onProgramChangedPosition = (paperProgramNumber, positionPoints, scratchpad, sharedData) => {
    // No need for position change in this program.
  };

  // Called when the program is changed or no longer detected.
  const onProgramRemoved = (paperProgramNumber, scratchpad, sharedData) => {
    // Global model for all programs
    const propertyName = scratchpad.propertyName;
    delete scratchpad.propertyName;

    phet.paperLand.removeModelPropertyLink(propertyName, scratchpad.altitudeListenerId);
    delete scratchpad.altitudeListenerId;
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
  });

  //----------------------------------------------------------------------
  // Projector code
  //----------------------------------------------------------------------

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw the name of the program on the canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Altitude', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Background', canvas.width / 2, canvas.height / 2 + 20);

})();
