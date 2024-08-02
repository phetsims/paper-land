/**
 * Controls that impact the behavior of the display in paper-land.
 */

import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import bluetoothServiceData from '../common/bluetoothServiceData.js';
import styles from './DisplayMain.css';

// Program positions are normalized from 0-1 in both dimensions. So a value of 0.05 means that the program
// must move 5% of the distance in X or Y to be considered a change and trigger events.
const MIN_POSITION_INTERVAL = 0;
const MAX_POSITION_INTERVAL = 0.5;
const POSITION_INTERVAL_STEP = 0.01;

// A delay in seconds that controls how long a program must be out of detection before calling
// any removal callbacks (onProgramRemoved, onProgramMarkersRemoved).
const MIN_REMOVAL_DELAY = 0;
const MAX_REMOVAL_DELAY = 5;
const REMOVAL_INTERVAL_STEP = 0.5;

export default function PaperLandControls( props ) {
  const [ positionInterval, setPositionInterval ] = useState( props.initialPositionInterval );
  const [ removalDelay, setRemovalDelay ] = useState( props.initialRemovalDelay );
  const [ consoleVisible, setConsoleVisible ] = useState( true );
  const [ printSpeechSynthesis, setPrintSpeechSynthesis ] = useState( false );

  // A reference to the resize observer which will be created when we enter full-screen, and removed when we exit
  const resizeObserverRef = useRef( null );

  useEffect( () => {
    const fullScreenListener = fullScreen => {
      if ( props.sceneryDisplay ) {
        if ( fullScreen ) {

          // remove the styling that positions the display for development
          props.sceneryDisplay.domElement.classList.remove( styles.simDisplayPanel );
          props.sceneryDisplay.domElement.classList.remove( styles.displayPanel );

          // If we still have a resize observer, make sure it is disconnected
          if ( resizeObserverRef.current ) {
            resizeObserverRef.current.disconnect();
          }

          // There is a delay between when the resize happens and when the values for window dimensions are updated.
          // Waiting until the resize event confirms that we will set the scenery display and paper-land display
          // size to accurate values.
          resizeObserverRef.current = new ResizeObserver( entries => {
            for ( const entry of entries ) {

              // Assumes that we are observing the full-screen element (the Display domElement)
              const { width, height } = entry.contentRect;
              props.sceneryDisplay.setWidthHeight( width, height );
              phet.paperLand.displaySizeProperty.value = new phet.dot.Dimension2( width, height );
            }
          } );
          resizeObserverRef.current.observe( props.sceneryDisplay.domElement );
        }
        else {

          // We are done with the resize observer, disconnect it
          if ( resizeObserverRef.current ) {
            resizeObserverRef.current.disconnect();
            resizeObserverRef.current = null;
          }

          const smallWidth = 640;
          const smallHeight = 480;

          // re-apply styling for development
          props.sceneryDisplay.domElement.classList.add( styles.simDisplayPanel );
          props.sceneryDisplay.domElement.classList.add( styles.displayPanel );
          props.sceneryDisplay.setWidthHeight( smallWidth, smallHeight );
          phet.paperLand.displaySizeProperty.value = new phet.dot.Dimension2( smallWidth, smallHeight );
        }
      }
    };
    phet.scenery.FullScreen.isFullScreenProperty.link( fullScreenListener );


    // cleanup, removing the listener before re-render
    return () => {
      phet.scenery.FullScreen.isFullScreenProperty.unlink( fullScreenListener );
    };
  }, [ props.sceneryDisplay ] );

  // Print speech synthesis to the console
  useEffect( () => {
    const printListener = response => {
      if ( printSpeechSynthesis ) {
        phet.paperLand.console.log( 'Speech', `"${response}"` );
      }
    };
    phet.scenery.voicingManager.startSpeakingEmitter.addListener( printListener );

    return () => {
      phet.scenery.voicingManager.startSpeakingEmitter.removeListener( printListener );
    };
  }, [ printSpeechSynthesis ] );

  return (
    <div className={`${styles.displayPanel}`}>
      <>
        <>
          <div>
            <Form.Label>Position Interval (%):</Form.Label>
            <p className={styles.inlineValue}>{positionInterval}</p>
            <Form.Range
              min={MIN_POSITION_INTERVAL}
              max={MAX_POSITION_INTERVAL}
              step={POSITION_INTERVAL_STEP}
              value={positionInterval}
              onChange={event => {
                const newValue = event.target.value;
                setPositionInterval( newValue );
                props.updatePositionInterval( newValue );
              }}
            />
          </div>
        </>
      </>
      <>
        <div>
          <Form.Label>Removal Delay (seconds):</Form.Label>
          <p className={styles.inlineValue}>{removalDelay}</p>
          <Form.Range
            min={MIN_REMOVAL_DELAY}
            max={MAX_REMOVAL_DELAY}
            step={REMOVAL_INTERVAL_STEP}
            value={removalDelay}
            onChange={event => {
              const newValue = event.target.value;
              setRemovalDelay( newValue );
              props.updateRemovalDelay( newValue );
            }}
          />
        </div>
      </>
      <>
        <Form.Check
          type='checkbox'
          label='Show Console'
          checked={consoleVisible}
          onChange={event => {
            const newValue = event.target.checked;
            setConsoleVisible( newValue );
            props.updateConsoleVisibility( newValue );
          }}
        />
      </>
      <>
        <Form.Check
          type='checkbox'
          label='Print Speech'
          checked={printSpeechSynthesis}
          onChange={event => {
            setPrintSpeechSynthesis( event.target.checked );
          }}
        ></Form.Check>
      </>
      <>
        <Button
          onClick={() => {
            if ( props.sceneryDisplay ) {
              phet.scenery.FullScreen.enterFullScreen( props.sceneryDisplay );
            }
          }}
        >Projector Mode</Button>
      </>
      <div
        className={styles.paddingTop}
      >
        <Button
          onClick={() => {

            // Request the device for a Bluetooth connection
            navigator.bluetooth.requestDevice( {
              acceptAllDevices: true,

              // Putting the services here lets us connect even on an insecure origin.
              optionalServices: bluetoothServiceData.services
            } )
              .then( device => {

                // Connect to the GATT server of the device.
                device.gatt.connect().then( server => {

                  // if there is alreadyd a server for this device, it is an error - print it and do no further work
                  if ( phet.paperLand.displayBluetoothServers.getServerForDevice( device ) ) {
                    phet.paperLand.console.error( 'ERROR: Server already exists for this device', device.name );
                    return;
                  }

                  // When the connection is successful, store the device-server pair.
                  phet.paperLand.displayBluetoothServers.addServer( device, server );

                  // Handle the disconnection if it happens.
                  device.addEventListener( 'gattserverdisconnected', event => {

                    const disconnectedDevice = event.target; // this is the device (should equal the device)
                    phet.paperLand.console.log( 'WARNING: Device has disconnected', disconnectedDevice.name );

                    // Remove the server associated with this device.
                    const server = phet.paperLand.displayBluetoothServers.getServerForDevice( disconnectedDevice );
                    if ( server ) {
                      phet.paperLand.displayBluetoothServers.clearServerForDevice( disconnectedDevice );
                    }
                  } );

                  // For testing, see if you can get the service/characteristic directly from the device
                  // (without going through Creator generated code).
                  // server.getPrimaryService( 'e95d9882-251d-470a-a062-fa1922dfa9a8' ).then( service => {
                  //   phet.paperLand.console.log( 'Found service' );
                  //   return service.getCharacteristic( 'e95dda90-251d-470a-a062-fa1922dfa9a8' );
                  // } ).then( characteristic => {
                  //   phet.paperLand.console.log( 'Found characteristic' );
                  //   return characteristic.readValue();
                  // } ).catch( error => {
                  //   console.log( 'could not get characteristic', error );
                  // } );

                  phet.paperLand.console.log( 'Connected to bluetooth device', device.name );
                } ).catch( error => {

                  phet.paperLand.console.error( 'Connection to GATT server failed', error );
                } );
              } )
              .catch( error => {
                phet.paperLand.console.error( 'Connection to device failed', error );
              } );
          }}
        >Connect to BLE</Button>
      </div>
    </div>
  );
}