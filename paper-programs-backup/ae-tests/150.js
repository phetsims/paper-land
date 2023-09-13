// Line Color Picker
// Keywords: markers, callbacks, function
// ------------------------------- //
// Required Programs (dependencies) [none]
// Recommended Programs (work well with no modifications, but not necessary) [none]

// working example:  starts with black screen; add one marker = yellow; 2 markers = red.

importScripts('paper.js');

(async () => {

// look for lineColorProperty
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
    const model = sharedData.model;
    if ( model.has( 'lineColorProperty' ) ) {
      scratchpad.lineColor = model.get( 'lineColorProperty' );
      //phet.paperLand.console.log('1048-17 getting circleColorProperty',scratchpad.circleColor);
    }


    // a function that can be used when markers are added or removed from the program
    scratchpad.printColorCounts = currentMarkers => {
      const colorCounts = _.countBy( currentMarkers, 'colorName' );
      phet.paperLand.console.log(
        `red: ${colorCounts[ 'red' ] || 0 }`,
        `green: ${colorCounts[ 'green' ] || 0 }`,
        `blue: ${colorCounts[ 'blue' ] || 0 }`,
        `black: ${colorCounts[ 'black' ] || 0 }`
      );

      console.log( currentMarkers.length );
    }

   //=================================================================================================================
    // Easily Changed Parameters

    //scratchpad.backgroundColor = 'rgb( 0, 0, 255)';
    //const backgroundColor = '#000000';
    
    //=================================================================================================================

  // do a black rectangle when program is started
  scratchpad.redValue = 0;
  scratchpad.greenValue = 0;
  scratchpad.blueValue = 0;

    scratchpad.backgroundColor = 'rgb( 0, 0, 0)';
    scratchpad.backgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height, {
      fill: scratchpad.backgroundColor
    } );
    sharedData.scene.addChild( scratchpad.backgroundRectangle );
    scratchpad.backgroundRectangle.moveToFront();

  };  //end onProgramAdded

  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
 
 // remove the rectangle
    if ( scratchpad.backgroundRectangle ){
      sharedData.scene.removeChild( scratchpad.backgroundRectangle );
      scratchpad.backgroundRectangle = null;
    }
    else {
      alert( 'Error: backgroundRectangle node not found in scratchpad data.' );
    }
  };

  const onProgramMarkersAdded = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.printColorCounts( currentMarkers );
  };

  const onProgramMarkersRemoved = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    scratchpad.printColorCounts( currentMarkers );
  };

// 05.10.23 - use the y value as the marker position.  The y value is parameterized relative to the top and bottom of the rectangle.
  const onProgramMarkersChangedPosition = ( programNumber, programPoints, scratchpad, sharedData, currentMarkers ) => {
    //scratchpad.backgroundRectangle.setFill('rgb('+ scratchpad.redValue + ','+ scratchpad.greenValue +','+ scratchpad.blueValue +')');
    const model = sharedData.model;
 
    
    const firstMarker = currentMarkers[ 0 ];
    if ( firstMarker ) {
      const firstMarkerValue = (1-firstMarker.positionOnPaper.y)*255;
      if (firstMarker.colorName == 'red') {
        scratchpad.redValue = firstMarkerValue;
        phet.paperLand.console.log('firstMarker redvalue is', scratchpad.redValue);
      }; //end if firstMarker == 'red'
      if (firstMarker.colorName == 'green'){
        scratchpad.greenValue = firstMarkerValue;
        phet.paperLand.console.log('firstMarker greenvalue is', scratchpad.greenValue);
      }; // end green
      if (firstMarker.colorName == 'blue'){
        scratchpad.blueValue = firstMarkerValue;
        phet.paperLand.console.log('firstMarker bluevalue is', scratchpad.blueValue);
      }; // end blue
      // used previously in rectangle rgb
      //scratchpad.backgroundRectangle.setFill('rgb('+ scratchpad.redValue + ','+ scratchpad.greenValue +','+ scratchpad.blueValue +')');
    };  // end if(firstMarker)
    // ***************************************************************

    // 05.25.23 - generalize for multiple markers
    const secondMarker = currentMarkers[1];
    if (secondMarker) {
      const secondMarkerValue = (1-secondMarker.positionOnPaper.y)*255;
      
      if (secondMarker.colorName == 'red') {
        scratchpad.redValue = secondMarkerValue;
        //phet.paperLand.console.log('secondMarker redvalue is', redValue);
      }; //end if firstMarker == 'red'
      if (secondMarker.colorName == 'green'){
        scratchpad.greenValue = secondMarkerValue;
        //phet.paperLand.console.log('secondMarker greenvalue is', greenValue);
      }; // end green
      if (secondMarker.colorName == 'blue'){
        scratchpad.blueValue = secondMarkerValue;
        //phet.paperLand.console.log('secondMarker bluevalue is', blueValue);
      }; // end blue
    
      // used previously in rectangle rgb
      //scratchpad.backgroundRectangle.setFill('rgb('+ scratchpad.redValue + ','+ scratchpad.greenValue +','+ scratchpad.blueValue +')');
    }; //end if secondMarker

    const thirdMarker = currentMarkers[2];
    if (thirdMarker){
    const thirdMarkerValue = (1-thirdMarker.positionOnPaper.y)*255;
      if (thirdMarker.colorName == 'red') {
        scratchpad.redValue = thirdMarkerValue;
        //phet.paperLand.console.log('secondMarker redvalue is', redValue);
      }; //end if firstMarker == 'red'
      if (thirdMarker.colorName == 'green'){
        scratchpad.greenValue = thirdMarkerValue;
        //phet.paperLand.console.log('secondMarker greenvalue is', greenValue);
      }; // end green
      if (thirdMarker.colorName == 'blue'){
        scratchpad.blueValue = thirdMarkerValue;
        //phet.paperLand.console.log('secondMarker bluevalue is', blueValue);
      }; // end blue
    } // end thirdMarker
   
   phet.paperLand.console.log('line 147');
   //if (sharedData.model.has('circleColorProperty')){
     //const circleColorProperty = sharedData.model.get('circleColorProperty');
   //}
    scratchpad.lineColor = 'rgb('+ scratchpad.redValue + ','+ scratchpad.greenValue +','+ scratchpad.blueValue +')';
    //phet.paperLand.console.log('circleColorProperty', circleColorProperty.value);
    //phet.paperLand.console.log('line 154', scratchpad.circleColor);
    //circleColorProperty.set(scratchpad.circleColor);
    // circleColorProperty is set prog 1048 line 155

  // set the color of the LINE to the color indicated by the sliders
  if ( model.has( 'lineColorProperty' ) ) {
      //phet.paperLand.getModelComponent( 'circleColorProperty' ).value = 'rgb(0,255,0)';
      phet.paperLand.getModelComponent( 'lineColorProperty' ).value = scratchpad.lineColor;

  }

  }; // end markers moved

   // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString()
      }
    }
  } );

  // Get a canvas object for this paper.
  const canvas = await paper.get('canvas');

  // Draw a message to the Canvas
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(155,25,34)';
  ctx.fillText('PhET', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(155,25,34)';
  ctx.fillText('image', canvas.width / 2, canvas.height / 2 + 20);
})();







