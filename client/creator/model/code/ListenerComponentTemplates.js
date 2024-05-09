const ListenerComponentTemplates = {
  AnimationListenerComponent: {
    onProgramAdded: `
      const {{NAME}}AnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( {{DEPENDENCY_NAMES_ARRAY}} ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          {{COMPONENT_REFERENCES}}
        
          // the functions create in the local scope to manipulate the controlled components
          {{CONTROL_FUNCTIONS}}
          
          // the function that that the user wrote
          {{CONTROL_FUNCTION}} 
        }
      };
      scratchpad.{{NAME}}AnimationListener = {{NAME}}AnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( {{NAME}}AnimationListener );
      
    `,
    onProgramRemoved: `
      phet.axon.stepTimer.removeListener( scratchpad.{{NAME}}AnimationListener );
      delete scratchpad.{{NAME}}AnimationListener;
    `
  },
  MultilinkListenerComponent: {
    onProgramAdded: `
      scratchpad.{{NAME}}MultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( {{CONTROLLED_NAMES_ARRAY}} ) ) {
        
          // references to the model components that are controlled by this listener AND the model compnoents
          // that are selected as references
          {{COMPONENT_REFERENCES}}
      
          // the functions that are available to the client from their selected dependencies
          {{CONTROL_FUNCTIONS}}
      
          // the code block that the user wrote to change controlled Properties
          {{CONTROL_FUNCTION}}   
        }
      } );
    `,
    onProgramRemoved: `
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}MultilinkId );
      delete scratchpad.{{NAME}}MultilinkId;
    `
  },
  BluetoothListenerComponent: {
    onProgramAdded: `
    
      if ( {{WRITE_TO_CHARACTERISTIC}} ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.{{NAME}}MultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        
          // references to each model components that will just be read from (not part of the multilink) - since
          // they are not part of the multilink, they may not exist yet
          if ( phet.paperLand.hasAllModelComponents( {{COMPONENT_REFERENCES_NAMES}} ) ) {
            {{COMPONENT_REFERENCES}}
            
            const writeToCharacteristic = _newCharacteristicValue => {
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '{{SERVICE_ID}}', '{{CHARACTERISTIC_ID}}', _newCharacteristicValue );
            };
            
            const writeStringToCharacteristic = ( _newCharacteristicValueString, _startDelim = '$', _endDelim = '|' ) => {
            
              // wrap the string in delimiters for the device
              const _wrappedString = _startDelim + _newCharacteristicValueString + _endDelim;
              
              // encode as UTF-8 Uint8Array
              const _encodedValue = new TextEncoder().encode( _wrappedString );
            
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '{{SERVICE_ID}}', '{{CHARACTERISTIC_ID}}', _encodedValue );
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
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '{{SERVICE_ID}}', '{{CHARACTERISTIC_ID}}', _ledMatrix );
            };
            
            // the code block that the user wrote to change controlled Properties
            {{CONTROL_FUNCTION}}
          }
        } );
      }
      else {
      
        // Reading from the characteristic, in this case we are controlling other model components
        phet.paperLand.boardBluetoothServers.addCharacteristicListener(
          '{{SERVICE_ID}}',
          '{{CHARACTERISTIC_ID}}',
          deviceValue => {
          
            if ( phet.paperLand.hasAllModelComponents( {{COMPONENT_REFERENCES_NAMES}} ) ) {
            
              // Make available as a string for easy reading
              const _textDecoder = new TextDecoder('utf-8'); // Default is utf-8, which is typical for UART text data
              const deviceValueString = _textDecoder.decode(deviceValue);
            
              // references to each model component controlled by this listener
              {{CONTROLLED_REFERENCES}}
            
              // the functions create in the local scope to manipulate the controlled components
              {{CONTROL_FUNCTIONS}}
              
              // the function that that the user wrote
              {{CONTROL_FUNCTION}} 
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
    `,
    onProgramRemoved: `
     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '{{SERVICE_ID}}',
       '{{CHARACTERISTIC_ID}}',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.{{NAME}}MultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}MultilinkId );
       delete scratchpad.{{NAME}}MultilinkId;
     }
    `
  }
};

export default ListenerComponentTemplates;