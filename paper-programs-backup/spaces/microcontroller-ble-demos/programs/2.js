// LED Text Emoji by Rotation
// Keywords: 
// Description: A simple program to send a happy or sad face as LED Text to the micro:bit by rotating the paper program.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const paperRotated = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'paperRotated', paperRotated );
    

    
      if ( true ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.bleFaceControllerMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'paperRotated' ], ( paperRotated ) => {
        
          // references to each model components that will just be read from (not part of the multilink) - since
          // they are not part of the multilink, they may not exist yet
          if ( phet.paperLand.hasAllModelComponents( [  ] ) ) {
            
            
            const writeToCharacteristic = _newCharacteristicValue => {
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( 'e95dd91d-251d-470a-a062-fa1922dfa9a8', 'e95d93ee-251d-470a-a062-fa1922dfa9a8', _newCharacteristicValue );
            };
            
            const writeStringToCharacteristic = ( _newCharacteristicValueString, _startDelim = '$', _endDelim = '|' ) => {
            
              // wrap the string in delimiters for the device
              const _wrappedString = _startDelim + _newCharacteristicValueString + _endDelim;
              
              // encode as UTF-8 Uint8Array
              const _encodedValue = new TextEncoder().encode( _wrappedString );
            
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( 'e95dd91d-251d-470a-a062-fa1922dfa9a8', 'e95d93ee-251d-470a-a062-fa1922dfa9a8', _encodedValue );
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
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( 'e95dd91d-251d-470a-a062-fa1922dfa9a8', 'e95d93ee-251d-470a-a062-fa1922dfa9a8', _ledMatrix );
            };
            
            // the code block that the user wrote to change controlled Properties
            // micro:bit LED Text expects a UTF8 string.
// Create an encoder and encode. Do not use writeStringToCharacteristic()
// as this will add delimiters to your string.

const encoder = new TextEncoder();

const faceString = paperRotated ? ':)' : ':(';
writeToCharacteristic( encoder.encode( faceString ) );

console.log( `sent data: ${faceString}` );
          }
        } );
      }
      else {
      
        // Reading from the characteristic, in this case we are controlling other model components
        phet.paperLand.boardBluetoothServers.addCharacteristicListener(
          'e95dd91d-251d-470a-a062-fa1922dfa9a8',
          'e95d93ee-251d-470a-a062-fa1922dfa9a8',
          deviceValue => {
          
            if ( phet.paperLand.hasAllModelComponents( [  ] ) ) {
            
              // Make available as a string for easy reading
              const _textDecoder = new TextDecoder('utf-8'); // Default is utf-8, which is typical for UART text data
              const deviceValueString = _textDecoder.decode(deviceValue);
            
              // references to each model component controlled by this listener
              
            
              // the functions create in the local scope to manipulate the controlled components
              
              
              // the function that that the user wrote
              // micro:bit LED Text expects a UTF8 string.
// Create an encoder and encode. Do not use writeStringToCharacteristic()
// as this will add delimiters to your string.

const encoder = new TextEncoder();

const faceString = paperRotated ? ':)' : ':(';
writeToCharacteristic( encoder.encode( faceString ) );

console.log( `sent data: ${faceString}` ); 
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
      phet.paperLand.removeModelComponent( 'paperRotated' );
    

     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       'e95dd91d-251d-470a-a062-fa1922dfa9a8',
       'e95d93ee-251d-470a-a062-fa1922dfa9a8',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.bleFaceControllerMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [ 'paperRotated' ], scratchpad.bleFaceControllerMultilinkId );
       delete scratchpad.bleFaceControllerMultilinkId;
     }
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty150 = phet.paperLand.getModelComponent( 'paperRotated' );
    if ( modelProperty150 ) {
      modelProperty150.value = phet.paperLand.utils.getNormalizedProgramRotation( points ) > 0.25 && phet.paperLand.utils.getNormalizedProgramRotation( points ) < 0.75;
    }
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
  ctx.fillText('LED Text Emoji by Rotation', canvas.width / 2, canvas.height / 2 + 20);
})();
