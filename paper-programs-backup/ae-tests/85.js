// Rectangle location, size, color
// Keywords: simple, view, background, color
// =============================== //
// Program Dependencies: Model, Color Picker
// Recommended Programs: n/a
// Program Description: Red marker positions the upper left vertex; Blue marker lower right

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    //=================================================================================================================
    // Easily Changed Parameters

    const backgroundColor = 'rgb( 255, 155, 100)';
    scratchpad.rectColor = '#000000';
    scratchpad.centerX = sharedData.displaySize.width / 2;
    scratchpad.centerY = sharedData.displaySize.height / 2;
  };
 
  // Called when the program is removed.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

    if ( scratchpad.testRectangle ){
      sharedData.scene.removeChild( scratchpad.testRectangle );
      scratchpad.testRectangle = null;
    }
    // add back for color
    //phet.paperLand.removeModelComponent( 'circleColorProperty' );
  };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
  //scratchpad.printColorCounts( currentMarkers );
  // 2 markers on the plane - red for positioning and blue for lower corner
    

  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    
    const firstMarker = currentMarkers[0];
    if (firstMarker){
      const firstMarkerValueY = (firstMarker.positionOnPaper.y);
      const firstMarkerValueX = (firstMarker.positionOnPaper.x);

      if (firstMarker.colorName == 'red'){
      phet.paperLand.console.log('firstMarker is', firstMarker);

    if ( scratchpad.testRectangle ){
    sharedData.scene.removeChild( scratchpad.testRectangle );
    }
    scratchpad.rectangleOriginX = sharedData.displaySize.width * firstMarkerValueX;
    scratchpad.rectangleOriginY = sharedData.displaySize.height * firstMarkerValueY;
      phet.paperLand.console.log('rectangleOriginX', scratchpad.rectangleOriginX);
      phet.paperLand.console.log('rectangleOriginY', scratchpad.rectangleOriginY);

    //scratchpad.testCircle = new phet.scenery.Circle( scratchpad.circleRadius, {x:scratchpad.circleCenterX, y:scratchpad.circleCenterY,
      //fill: scratchpad.circleColor
    //} );
    //sharedData.scene.addChild(scratchpad.testCircle );

      // do the thing to scale the circle
      // the marker is parameterized from 0 to 1 on the y-axis
      }; // end if firstMarker.colorName == red
    
    if (firstMarker.colorName == 'blue'){
      // the blue marker is the lower corner
      scratchpad.rectangleLowerCornerX = sharedData.displaySize.width * firstMarkerValueX;
      scratchpad.rectangleLowerCornerY = sharedData.displaySize.height * firstMarkerValueY;
    }; // end firstMarker is blue

    }; //end if (firstMarker)

  const secondMarker = currentMarkers[1];
    if (secondMarker){

      const secondMarkerValueY = (secondMarker.positionOnPaper.y);
      const secondMarkerValueX = (secondMarker.positionOnPaper.x);

      if (secondMarker.colorName == 'blue'){
        phet.paperLand.console.log('blue marker added');
        scratchpad.rectangleLowerCornerX = sharedData.displaySize.width * secondMarkerValueX;
        scratchpad.rectangleLowerCornerY = sharedData.displaySize.height * secondMarkerValueY;
      }; // end if secondMarker is blue

      // length and width calculations - need to take absolute value
      scratchpad.rectangleLength = Math.abs(scratchpad.rectangleOriginX-scratchpad.rectangleLowerCornerX);
      scratchpad.rectangleWidth = Math.abs(scratchpad.rectangleOriginY-scratchpad.rectangleLowerCornerY);
      phet.paperLand.console.log('length is', scratchpad.rectangleLength);
      phet.paperLand.console.log('width is', scratchpad.rectangleWidth);


    }; //end if secondMarker

// add in later for color
    //const model = sharedData.model;
    //if ( model.has( 'rectColorProperty' ) ) {
      //phet.paperLand.console.log('inside circleColorProperty in prog 1859');
    //  scratchpad.rectColor = model.get( 'rectColorProperty' );
    //}

      phet.paperLand.console.log('line 105 before calling rectangle');
    scratchpad.testRectangle = new phet.scenery.Rectangle(scratchpad.rectangleOriginX, scratchpad.rectangleOriginY, scratchpad.rectangleLength, scratchpad.rectangleWidth, {
          fill: '#000000'} );
    sharedData.scene.addChild(scratchpad.testRectangle );

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








