// Simple UART Example
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const happyBoolean = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'happyBoolean', happyBoolean );
    

    
      if ( true ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.sendRemovalStringMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'happyBoolean' ], ( happyBoolean ) => {
        
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
            let str = "";

if (happyBoolean) {
    str = "happy";
} else {
    str = "sad";
}

writeStringToCharacteristic(str);

console.log(`Sent ${str} to micro:bit.`);
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
              let str = "";

if (happyBoolean) {
    str = "happy";
} else {
    str = "sad";
}

writeStringToCharacteristic(str);

console.log(`Sent ${str} to micro:bit.`); 
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
      phet.paperLand.removeModelComponent( 'happyBoolean' );
    

     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
       '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.sendRemovalStringMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [ 'happyBoolean' ], scratchpad.sendRemovalStringMultilinkId );
       delete scratchpad.sendRemovalStringMultilinkId;
     }
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty177 = phet.paperLand.getModelComponent( 'happyBoolean' );
    if ( modelProperty177 ) {
      modelProperty177.value = markers.length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty180 = phet.paperLand.getModelComponent( 'happyBoolean' );
    if ( modelProperty180 ) {
      modelProperty180.value = markers.length > 0;
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
  ctx.fillText('Simple UART Example', canvas.width / 2, canvas.height / 2 + 20);
})();
