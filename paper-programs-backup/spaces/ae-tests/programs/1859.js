// Circle location, radius, color
// Keywords: simple, view, background, color
// =============================== //
// Program Dependencies: #2094 Circle: Model, #1048 Circle Color Picker, #1859 Circle location, radius, color
// Recommended Programs: n/a
// Program Description: allows a marker to locate the center of a circle relative to the 
// position of the marker on the paper.  A second marker determines the radius.
importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    //=================================================================================================================
    // Easily Changed Parameters

    const backgroundColor = 'rgb( 255, 155, 100)';
    scratchpad.circleColor = '#000000';
    scratchpad.centerX = sharedData.displaySize.width / 2;
    scratchpad.centerY = sharedData.displaySize.height / 2;
  };
 
  // Called when the program is removed.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    if ( scratchpad.testCircle ){
      sharedData.scene.removeChild( scratchpad.testCircle );
      scratchpad.testCircle = null;
    }
    phet.paperLand.removeModelComponent( 'circleColorProperty' );
  };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    
    const firstMarker = currentMarkers[0];
    if (firstMarker){
      if (firstMarker.colorName == 'red'){
      const firstMarkerValueY = (firstMarker.positionOnPaper.y);
      const firstMarkerValueX = (firstMarker.positionOnPaper.x);
      //phet.paperLand.console.log('firstMarker is', firstMarkerValue);
    if ( scratchpad.testCircle ){
    sharedData.scene.removeChild( scratchpad.testCircle );
    }
    scratchpad.circleRadius = 25;
    scratchpad.circleCenterX = sharedData.displaySize.width * firstMarkerValueX;
    scratchpad.circleCenterY = sharedData.displaySize.height * firstMarkerValueY;
    //scratchpad.testCircle = new phet.scenery.Circle( scratchpad.circleRadius, {x:scratchpad.circleCenterX, y:scratchpad.circleCenterY,
      //fill: scratchpad.circleColor
    //} );
    //sharedData.scene.addChild(scratchpad.testCircle );

      // do the thing to scale the circle
      // the marker is parameterized from 0 to 1 on the y-axis
      }; // end if firstMarker.colorName == red
    
    if (firstMarker.colorName == 'blue'){
    };

    }; //end if (firstMarker)

  const secondMarker = currentMarkers[1];
    if (secondMarker){

      const secondMarkerValueY = (secondMarker.positionOnPaper.y);
      const secondMarkerValueX = (secondMarker.positionOnPaper.x);

      if (secondMarker.colorName == 'blue'){
        phet.paperLand.console.log('blue marker added');
        scratchpad.circleOuterX = sharedData.displaySize.width * secondMarkerValueX;
        scratchpad.circleOuterY = sharedData.displaySize.height * secondMarkerValueY;
        // measure distance between center and blue marker to determine radius
        scratchpad.circleRadius = Math.hypot(scratchpad.circleCenterX-scratchpad.circleOuterX, 
        scratchpad.circleCenterY-scratchpad.circleOuterY);
        //phet.paperLand.console.log('markerDistance', markerDistance);

      }; // end if secondMarker is blue

    }; //end if secondMarker

    const model = sharedData.model;
    if ( model.has( 'circleColorProperty' ) ) {
      phet.paperLand.console.log('inside circleColorProperty in prog 1859');
      scratchpad.circleColor = model.get( 'circleColorProperty' );
      phet.paperLand.console.log('line 118, prog 1859', scratchpad.circleColor);
      //phet.paperLand.console.log('current circle color is', circleColorProperty.value);
    }

    scratchpad.testCircle = new phet.scenery.Circle( scratchpad.circleRadius, {x:scratchpad.circleCenterX, y:scratchpad.circleCenterY,
      fill: scratchpad.circleColor
    } );
    sharedData.scene.addChild(scratchpad.testCircle );

  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString()
      }
    }
  } );

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Add text to the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Add', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillText('Background', canvas.width / 2, canvas.height / 2 + 20);
})();







