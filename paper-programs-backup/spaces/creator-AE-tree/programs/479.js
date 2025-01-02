// Servo Controller
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const redMarkerOn = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'redMarkerOn', redMarkerOn );
    

      const blueMarkerOn = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'blueMarkerOn', blueMarkerOn );
    

      const greenMarkerOn = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'greenMarkerOn', greenMarkerOn );
    

      const blackMarkerOn = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'blackMarkerOn', blackMarkerOn );
    

    
      if ( true ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.writeToMicrobitMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'redMarkerOn', 'blueMarkerOn', 'greenMarkerOn', 'blackMarkerOn' ], ( redMarkerOn, blueMarkerOn, greenMarkerOn, blackMarkerOn ) => {
        
          // references to each model components that will just be read from (not part of the multilink) - since
          // they are not part of the multilink, they may not exist yet
          if ( phet.paperLand.hasAllModelComponents( [  ] ) ) {
            
            
            const writeToCharacteristic = _newCharacteristicValue => {
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e', _newCharacteristicValue );
            };
            
            const writeStringToCharacteristic = ( _newCharacteristicValueString, _startDelim = '$', _endDelim = '|' ) => {
            
              // wrap the string in delimiters for the device
              const _wrappedString = _startDelim + _newCharacteristicValueString + _endDelim;
              
              // encode as UTF-8 Uint8Array
              const _encodedValue = new TextEncoder().encode( _wrappedString );
            
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e', _encodedValue );
            };
            
            // _matrix is a 5x5 2D array of 1s and 0s, corresponding to the LED matrix
            const writeMatrixToCharacteristic = ( _matrix ) => {
              const _ledMatrix = new Int8Array(5);
              const _buffer = [
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']
              ]
              for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 5; j++) {
                  _buffer[i][7-j] = _matrix[i][4 - j]
                }
              }
              for (var i = 0; i < 5; i++) {
                const _string = _buffer[i].join("");
                _ledMatrix[i]=parseInt(_string,2)
              }
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400003-b5a3-f393-e0a9-e50e24dcca9e', _ledMatrix );
            };
            
            // the code block that the user wrote to change controlled Properties
            let sendString = "";

if (redMarkerOn && !blueMarkerOn && !greenMarkerOn && !blackMarkerOn) {
    //sendString = "speed:50";
    //calling the wash routine from MakeCode
    //sendString = "wash:50";
    //phet.paperLand.console.log("sending wash command");
}
else if (!redMarkerOn && blueMarkerOn && !greenMarkerOn && !blackMarkerOn) {
    sendString = "speed:-50";
}
else if (redMarkerOn && blueMarkerOn && !greenMarkerOn && !blackMarkerOn) {
    sendString = "speed:0";
}
else if (!redMarkerOn && !blueMarkerOn && greenMarkerOn && !blackMarkerOn) {
    //sendString = "angle:0";
    sendString = "wash:50";
    phet.paperLand.console.log("sending wash command");
}
else if (!redMarkerOn && !blueMarkerOn && !greenMarkerOn && blackMarkerOn) {
    //sendString = "angle:180";
    //sendString = "wash:50";
    //phet.paperLand.console.log("sending wash command");
}

if (sendString !== "") {
    phet.paperLand.console.log(`Sending servo command ${sendString}`)
    writeStringToCharacteristic(sendString);
}
          }
        } );
      }
      else {
      
        // Reading from the characteristic, in this case we are controlling other model components
        phet.paperLand.boardBluetoothServers.addCharacteristicListener(
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
          deviceValue => {
          
            if ( phet.paperLand.hasAllModelComponents( [  ] ) ) {
            
              // Make available as a string for easy reading
              const _textDecoder = new TextDecoder('utf-8'); // Default is utf-8, which is typical for UART text data
              const deviceValueString = _textDecoder.decode(deviceValue);
            
              // references to each model component controlled by this listener
              
            
              // the functions create in the local scope to manipulate the controlled components
              
              
              // the function that that the user wrote
              let sendString = "";

if (redMarkerOn && !blueMarkerOn && !greenMarkerOn && !blackMarkerOn) {
    //sendString = "speed:50";
    //calling the wash routine from MakeCode
    //sendString = "wash:50";
    //phet.paperLand.console.log("sending wash command");
}
else if (!redMarkerOn && blueMarkerOn && !greenMarkerOn && !blackMarkerOn) {
    sendString = "speed:-50";
}
else if (redMarkerOn && blueMarkerOn && !greenMarkerOn && !blackMarkerOn) {
    sendString = "speed:0";
}
else if (!redMarkerOn && !blueMarkerOn && greenMarkerOn && !blackMarkerOn) {
    //sendString = "angle:0";
    sendString = "wash:50";
    phet.paperLand.console.log("sending wash command");
}
else if (!redMarkerOn && !blueMarkerOn && !greenMarkerOn && blackMarkerOn) {
    //sendString = "angle:180";
    //sendString = "wash:50";
    //phet.paperLand.console.log("sending wash command");
}

if (sendString !== "") {
    phet.paperLand.console.log(`Sending servo command ${sendString}`)
    writeStringToCharacteristic(sendString);
} 
            }
         
          }
        )
        .then( addedListener => {
          scratchpad.characteristicListener = addedListener;
        } )
        .catch( error => {
          phet.paperLand.console.error( error );
        } );
      }
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'redMarkerOn' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'blueMarkerOn' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'greenMarkerOn' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'blackMarkerOn' );
    

     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
       '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.writeToMicrobitMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [ 'redMarkerOn', 'blueMarkerOn', 'greenMarkerOn', 'blackMarkerOn' ], scratchpad.writeToMicrobitMultilinkId );
       delete scratchpad.writeToMicrobitMultilinkId;
     }
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty8 = phet.paperLand.getModelComponent( 'redMarkerOn' );
    if ( modelProperty8 ) {
      modelProperty8.value = _.filter(markers, { colorName: 'red' }).length > 0;
    }

    const modelProperty10 = phet.paperLand.getModelComponent( 'blueMarkerOn' );
    if ( modelProperty10 ) {
      modelProperty10.value = _.filter(markers, { colorName: 'blue' }).length > 0;
    }

    const modelProperty12 = phet.paperLand.getModelComponent( 'greenMarkerOn' );
    if ( modelProperty12 ) {
      modelProperty12.value = _.filter(markers, { colorName: 'green' }).length > 0;
    }

    const modelProperty14 = phet.paperLand.getModelComponent( 'blackMarkerOn' );
    if ( modelProperty14 ) {
      modelProperty14.value = _.filter(markers, { colorName: 'black' }).length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty17 = phet.paperLand.getModelComponent( 'redMarkerOn' );
    if ( modelProperty17 ) {
      modelProperty17.value = _.filter(markers, { colorName: 'red' }).length > 0;
    }

    const modelProperty19 = phet.paperLand.getModelComponent( 'blueMarkerOn' );
    if ( modelProperty19 ) {
      modelProperty19.value = _.filter(markers, { colorName: 'blue' }).length > 0;
    }

    const modelProperty21 = phet.paperLand.getModelComponent( 'greenMarkerOn' );
    if ( modelProperty21 ) {
      modelProperty21.value = _.filter(markers, { colorName: 'green' }).length > 0;
    }

    const modelProperty23 = phet.paperLand.getModelComponent( 'blackMarkerOn' );
    if ( modelProperty23 ) {
      modelProperty23.value = _.filter(markers, { colorName: 'black' }).length > 0;
    }
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };

  await paper.set( 'data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString(),
      },
      customWhiskerLengths: {
        top: 0.2,
        right: 0.2,
        bottom: 0.2,
        left: 0.2
      }
    }
  } );
  
  // PROJECTOR CODE //
  // Get a canvas object for this paper to draw something to the Projector.
  const canvas = await paper.get('canvas');

  // Draw the name of the program to the projector
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Servo Controller', canvas.width / 2, canvas.height / 2 + 20);
})();
