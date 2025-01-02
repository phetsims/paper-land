// UART to IO Pins (LEDs) with Markers
// Keywords: 
// Description: This program sends a string over UART RX to set p0 to up (red marker) or p1 to up (green marker), which will light up an LED in circuit with those pins.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const led1p0UpBoolean = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'led1p0UpBoolean', led1p0UpBoolean );
    

      const led2p1UpBoolean = new phet.axon.BooleanProperty(false);
      phet.paperLand.addModelComponent( 'led2p1UpBoolean', led2p1UpBoolean );
    

      const receivedUARTString = new phet.axon.StringProperty( '' );
      phet.paperLand.addModelComponent( 'receivedUARTString', receivedUARTString );
    

      // Create the text and add it to the view - using RichText for nice markup support.
      const receivedUARTTextText = new phet.scenery.RichText( '', { fill: 'white' } );
      
      sharedData.scene.addChild( receivedUARTTextText );
      scratchpad.receivedUARTTextText = receivedUARTTextText;
      
      // Update the text when a dependency changes.
      scratchpad.receivedUARTTextTextMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'receivedUARTString' ], ( receivedUARTString ) => {
      
        // the additional reference constants
        
      
        // in a local scope, define the functions that the user can use to manipulate the text
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        receivedUARTTextText.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        receivedUARTTextText.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        receivedUARTTextText.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        receivedUARTTextText.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        receivedUARTTextText.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        receivedUARTTextText.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        receivedUARTTextText.visible = visible;
      };
      
      const moveToFront = () => {
        receivedUARTTextText.moveToFront();
      };
      
      const moveToBack = () => {
        receivedUARTTextText.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        receivedUARTTextText.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const receivedUARTTextTextViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( receivedUARTTextText.localBounds.width || 1 ) / ( receivedUARTTextText.localBounds.height || 1 );

        const scaleX = receivedUARTTextTextViewBounds.width / ( receivedUARTTextText.localBounds.width || 1 );
        const scaleY = receivedUARTTextTextViewBounds.height / ( receivedUARTTextText.localBounds.height || 1 );

        if ( stretch ) {
          receivedUARTTextText.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          receivedUARTTextText.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        receivedUARTTextText.center = receivedUARTTextTextViewBounds.center;
      };
      

        const setString = ( string ) => {
          receivedUARTTextText.string = string;
        };
        
        const setFontSize = ( size ) => {
        
          // RichText has no setter for size, so we need to create a new font. Use
          // state from the old font to maintain the family.
          const currentFont = receivedUARTTextText.font;
          const newFont = new phet.scenery.Font( { size: size, family: currentFont.family } );
          receivedUARTTextText.font = newFont;
        };

        const setTextColor = ( color ) => {
          receivedUARTTextText.fill = color;
        };

        const setFontFamily = ( family ) => {
        
          // RichText has no setter for fontFamily, so we need to create a new font. Use
          // state from the old font to maintain the size.
          const currentFont = receivedUARTTextText.font;
          const newFont = new phet.scenery.Font( { size: currentFont.size, family: family } );
          receivedUARTTextText.font = newFont;
        };
      

        // the function that the user wrote to update the text      
        setTop(0.5);
setLeft(0.5);
setFontSize(32);
setString( "micro:bit confirms:" + receivedUARTString );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    

    
      if ( true ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.p0BLEWriterMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'led1p0UpBoolean' ], ( led1p0UpBoolean ) => {
        
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

if (led1p0UpBoolean) {
    str = "p0U";
} else {
    str = "p0D";
}

writeStringToCharacteristic(str);

console.log(`pin 0 being set to ${str}`);

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

if (led1p0UpBoolean) {
    str = "p0U";
} else {
    str = "p0D";
}

writeStringToCharacteristic(str);

console.log(`pin 0 being set to ${str}`);
 
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
    

    
      if ( true ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.p1BLEWriterMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'led2p1UpBoolean' ], ( led2p1UpBoolean ) => {
        
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

if (led2p1UpBoolean) {
    str = "p1U";
} else {
    str = "p1D";
}

writeStringToCharacteristic(str);

console.log(`pin 1 being set to ${str}`);
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

if (led2p1UpBoolean) {
    str = "p1U";
} else {
    str = "p1D";
}

writeStringToCharacteristic(str);

console.log(`pin 1 being set to ${str}`); 
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
    

    
      if ( false ) {
        
        // Writing to a characteristic, in this case we are controlling the device from the paper playground model.
        // We can set up a mulilink that will write to the characteristic when the dependency properties change.
        scratchpad.readMicrobitUARTStringsMultilinkId = phet.paperLand.addModelPropertyMultilink( [  ], (  ) => {
        
          // references to each model components that will just be read from (not part of the multilink) - since
          // they are not part of the multilink, they may not exist yet
          if ( phet.paperLand.hasAllModelComponents( [ 'receivedUARTString' ] ) ) {
            const receivedUARTString = phet.paperLand.getModelComponent( 'receivedUARTString' ).value;
            
            const writeToCharacteristic = _newCharacteristicValue => {
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400002-b5a3-f393-e0a9-e50e24dcca9e', _newCharacteristicValue );
            };
            
            const writeStringToCharacteristic = ( _newCharacteristicValueString, _startDelim = '$', _endDelim = '|' ) => {
            
              // wrap the string in delimiters for the device
              const _wrappedString = _startDelim + _newCharacteristicValueString + _endDelim;
              
              // encode as UTF-8 Uint8Array
              const _encodedValue = new TextEncoder().encode( _wrappedString );
            
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400002-b5a3-f393-e0a9-e50e24dcca9e', _encodedValue );
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
              phet.paperLand.boardBluetoothServers.writeToCharacteristic( '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400002-b5a3-f393-e0a9-e50e24dcca9e', _ledMatrix );
            };
            
            // the code block that the user wrote to change controlled Properties
            setReceivedUARTString( deviceValueString );

console.log( `received ${deviceValueString}` );
          }
        } );
      }
      else {
      
        // Reading from the characteristic, in this case we are controlling other model components
        phet.paperLand.boardBluetoothServers.addCharacteristicListener(
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
          deviceValue => {
          
            if ( phet.paperLand.hasAllModelComponents( [ 'receivedUARTString' ] ) ) {
            
              // Make available as a string for easy reading
              const _textDecoder = new TextDecoder('utf-8'); // Default is utf-8, which is typical for UART text data
              const deviceValueString = _textDecoder.decode(deviceValue);
            
              // references to each model component controlled by this listener
              const receivedUARTString = phet.paperLand.getModelComponent( 'receivedUARTString' ).value;
            
              // the functions create in the local scope to manipulate the controlled components
              const setReceivedUARTString = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( 'receivedUARTString' );
        modelComponent.value = newValue;  
      }
      
              
              // the function that that the user wrote
              setReceivedUARTString( deviceValueString );

console.log( `received ${deviceValueString}` ); 
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
      phet.paperLand.removeModelComponent( 'led1p0UpBoolean' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'led2p1UpBoolean' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'receivedUARTString' );
    

      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.receivedUARTTextText );
      delete scratchpad.receivedUARTTextText;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'receivedUARTString' ], scratchpad.receivedUARTTextTextMultilinkId, {
        otherReferences: [  ]
      });
      delete scratchpad.receivedUARTTextTextMultilinkId;
    

     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
       '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.p0BLEWriterMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [ 'led1p0UpBoolean' ], scratchpad.p0BLEWriterMultilinkId );
       delete scratchpad.p0BLEWriterMultilinkId;
     }
    

     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
       '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.p1BLEWriterMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [ 'led2p1UpBoolean' ], scratchpad.p1BLEWriterMultilinkId );
       delete scratchpad.p1BLEWriterMultilinkId;
     }
    

     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
       '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
     
     if ( scratchpad.readMicrobitUARTStringsMultilinkId ) {
       phet.paperLand.removeModelPropertyMultilink( [  ], scratchpad.readMicrobitUARTStringsMultilinkId );
       delete scratchpad.readMicrobitUARTStringsMultilinkId;
     }
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty159 = phet.paperLand.getModelComponent( 'led1p0UpBoolean' );
    if ( modelProperty159 ) {
      modelProperty159.value = _.filter(markers, { colorName: 'red' }).length > 0;
    }

    const modelProperty161 = phet.paperLand.getModelComponent( 'led2p1UpBoolean' );
    if ( modelProperty161 ) {
      modelProperty161.value = _.filter(markers, { colorName: 'green' }).length > 0;
    }
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
    const modelProperty164 = phet.paperLand.getModelComponent( 'led1p0UpBoolean' );
    if ( modelProperty164 ) {
      modelProperty164.value = _.filter(markers, { colorName: 'red' }).length > 0;
    }

    const modelProperty166 = phet.paperLand.getModelComponent( 'led2p1UpBoolean' );
    if ( modelProperty166 ) {
      modelProperty166.value = _.filter(markers, { colorName: 'green' }).length > 0;
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
  ctx.fillText('UART to IO Pins (LEDs) with Markers', canvas.width / 2, canvas.height / 2 + 20);
})();
