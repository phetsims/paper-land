// BLE Button
// Keywords: microbit, button, controller
// Description: Example for reading and setting a model component value using a button press from a micro:bit.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
    
      if ( false ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.bleButtonControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
        
          // references to each model components that will just be read from (not part of the multilink) - since
          // they are not part of the multilink, they may not exist yet
          if ( phet.paperLand.hasAllModelComponents( [ 'buttonPressed' ] ) ) {
            const buttonPressed = phet.paperLand.getModelComponent( 'buttonPressed' ).value;
            
            const writeToCharacteristic = _newCharacteristicValue => {
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( 'e95d9882-251d-470a-a062-fa1922dfa9a8', 'e95dda91-251d-470a-a062-fa1922dfa9a8', _newCharacteristicValue );
            };
            
            const writeStringToCharacteristic = ( _newCharacteristicValueString, _startDelim = '$', _endDelim = '|' ) => {
            
              // wrap the string in delimiters for the device
              const _wrappedString = _startDelim + _newCharacteristicValueString + _endDelim;
              
              // encode as UTF-8 Uint8Array
              const _encodedValue = new TextEncoder().encode( _wrappedString );
            
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( 'e95d9882-251d-470a-a062-fa1922dfa9a8', 'e95dda91-251d-470a-a062-fa1922dfa9a8', _encodedValue );
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
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( 'e95d9882-251d-470a-a062-fa1922dfa9a8', 'e95dda91-251d-470a-a062-fa1922dfa9a8', _ledMatrix );
            };
            
            // the code block that the user wrote to change controlled Properties
            
// The button is pressed if the deviceValue (8bit unsigned int)
// is greater than 0.
setButtonPressed( deviceValue.getUint8( 0 ) > 0 );
          }
        } );
      }
      else {
      
        // Reading from the characteristic, in this case we are controlling other model components
        phet.paperLand.boardBluetoothServers.addCharacteristicListener(
          'e95d9882-251d-470a-a062-fa1922dfa9a8',
          'e95dda91-251d-470a-a062-fa1922dfa9a8',
          deviceValue => {
          
            if ( phet.paperLand.hasAllModelComponents( [ 'buttonPressed' ] ) ) {
            
              // Make available as a string for easy reading
              const _textDecoder = new TextDecoder('utf-8'); // Default is utf-8, which is typical for UART text data
              const deviceValueString = _textDecoder.decode(deviceValue);
            
              // references to each model component controlled by this listener
              const buttonPressed = phet.paperLand.getModelComponent( 'buttonPressed' ).value;
            
              // the functions create in the local scope to manipulate the controlled components
              const setButtonPressed = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'buttonPressed' );
        modelComponent.value = newValue;  
      }
      
              
              // the function that that the user wrote
              
// The button is pressed if the deviceValue (8bit unsigned int)
// is greater than 0.
setButtonPressed( deviceValue.getUint8( 0 ) > 0 ); 
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
    
     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       'e95d9882-251d-470a-a062-fa1922dfa9a8',
       'e95dda91-251d-470a-a062-fa1922dfa9a8',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.bleButtonControllerMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.bleButtonControllerMultilinkId );
       delete scratchpad.bleButtonControllerMultilinkId;
     }
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
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
  ctx.fillText('BLE Button', canvas.width / 2, canvas.height / 2 + 20);
})();
