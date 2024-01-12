/**
 * CameraControls is a React component that provides a UI and underlying functional code for adjusting parameters of the
 * camera.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './CameraMain.css';

const DEFAULT_EXPOSURE_TIME = 1 / 30; // 1/30 seconds is the default exposure time
const DEFAULT_FOCUS_DISTANCE = 0; // unsure about what a reasonable default for this is
const DEFAULT_CONTRAST = 50; // seems to look OK, browser reports the ranges is 0-255, but values above 100 look bad
const DEFAULT_SHARPNESS = 50; // seems to look OK,  browser reports the ranges is 0-255, but values above 100 look bad

export default function CameraControls( props ) {

  // Whether the platform supports the desired controls
  const [ supportsExposureMode, setSupportsExposureMode ] = useState( false );
  const [ supportsExposureTime, setSupportsExposureTime ] = useState( false );
  const [ supportsFocusMode, setSupportsFocusMode ] = useState( false );
  const [ supportsFocusDistance, setSupportsFocusDistance ] = useState( false );
  const [ supportsContrast, setSupportsContrast ] = useState( false );
  const [ supportsSharpness, setSupportsSharpness ] = useState( false );

  // Modes and values for various controls
  const [ exposureMode, setExposureMode ] = useState( 'continuous' );
  const [ exposureTime, setExposureTime ] = useState( DEFAULT_EXPOSURE_TIME ); // 1/30 seconds is the default exposure time
  const [ focusMode, setFocusMode ] = useState( 'continuous' );
  const [ focusDistance, setFocusDistance ] = useState( DEFAULT_FOCUS_DISTANCE );
  const [ contrast, setContrast ] = useState( DEFAULT_CONTRAST ); // assuming this goes from 0 to 100
  const [ sharpness, setSharpness ] = useState( DEFAULT_SHARPNESS ); // assuming this goes from 0 to 100

  // {MediaStreamTrack|null} - the video track of the camera that is watching the papers
  const [ track, setTrack ] = useState( null );

  // {MediaStream|null} - the media stream that contains the video track, reference is kept so we
  // can clear it before switching to a new camera
  const [ currentMediaStream, setCurrentMediaStream ] = useState( null );

  // {MediaTrackCapabilities|null} - the capabilities of the track
  const [ trackCapabilities, setTrackCapabilities ] = useState( null );

  // as soon as the component is mounted, get the track and its capabilities
  useEffect( () => {

    // If there is a current media stream, stop it. This prevent an error like
    // "NotReadableError: Could not start video source" when switching cameras.
    if ( currentMediaStream ) {
      currentMediaStream.getTracks().forEach( track => {
        track.stop();
      } );
    }

    // If there is a selected camera, request that one specifically.
    const selectedDeviceId = props.selectedCameraDeviceId;
    const constraints = {
      video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined }
    };

    // Get the media stream.
    navigator.mediaDevices.getUserMedia( constraints )
      .then( mediaStream => {

        // Save the media stream so we can stop it if the camera is changed.
        setCurrentMediaStream( mediaStream );

        // Create a local reference to the video track - saved to a local variable because the state won't be updated
        // until the next render cycle.
        const immediateTrack = mediaStream.getVideoTracks()[ 0 ];
        setTrack( immediateTrack );

        // Not all browsers support getCapabilities.
        if ( immediateTrack.getCapabilities ) {

          // These are the supported capabilities on this platform and we can use them to determine supported controls
          // and ranges.
          const capabilities = immediateTrack.getCapabilities();
          setTrackCapabilities( capabilities );

          // Set the component state with initial values from the track capabilities
          setSupportsContrast( !!capabilities.contrast );
          setSupportsExposureMode( !!capabilities.exposureMode );
          setSupportsExposureTime( !!capabilities.exposureTime );
          setSupportsFocusDistance( !!capabilities.focusDistance );
          setSupportsFocusMode( !!capabilities.focusMode );
          setSupportsSharpness( !!capabilities.sharpness );

          // set the component state with initial values from the track settings
          const settings = immediateTrack.getSettings();
          setExposureMode( settings.exposureMode );
          setExposureTime( settings.exposureTime );
          setFocusMode( settings.focusMode );
          setFocusDistance( settings.focusDistance );
          setContrast( settings.contrast );
          setSharpness( settings.sharpness );
        }
      } )
      .catch( e => {
        console.log( `Error getting media track: e = ${e}` );
      } );
  }, [ props.selectedCameraDeviceId ] ); // Update the track when the selected camera changes

  // Whenever a constraint state variable changes, apply the changes to the track.
  useEffect( () => {
    if ( track ) {
      const constraints = {};
      if ( supportsExposureMode ) {
        constraints.exposureMode = exposureMode;
      }
      if ( supportsExposureTime ) {
        constraints.exposureTime = exposureTime;
      }
      if ( supportsFocusMode ) {
        constraints.focusMode = focusMode;
      }
      if ( supportsFocusDistance ) {
        constraints.focusDistance = focusDistance;
      }
      if ( supportsContrast ) {
        constraints.contrast = contrast;
      }
      if ( supportsSharpness ) {
        constraints.sharpness = sharpness;
      }
      track.applyConstraints( constraints )
        .then( () => {

          // success! Nothing to be done here.
        } )
        .catch( e => {
          console.log( `Error applying constraints: e = ${e}` );
          alert( `Error applying constraints to camera: ${e}` );
        } );
    }
  }, [ exposureMode, exposureTime, focusMode, focusDistance, contrast, sharpness ] );

  return (
    <>
      <h3 className={styles.headerWithOption}>Camera Settings</h3>

      {/*Camera flip controls*/}
      <label className={styles.detectionControlLabel}>Flip Camera Feed:</label>
      <div className={styles.detectionControlInput}>
        <input id='flip-x-checkbox' type='checkbox' checked={props.flipCameraFeedX} onChange={event => {
          props.onCameraFlipChanged( event.target.checked, props.flipCameraFeedY );
        }}/><label htmlFor='flip-x-checkbox'>X</label><br/>
        <input id='flip-y-checkbox' type='checkbox' checked={props.flipCameraFeedY} onChange={event => {
          props.onCameraFlipChanged( props.flipCameraFeedX, event.target.checked );
        }}/><label htmlFor='flip-y-checkbox'>Y</label><br/>
      </div>

      <>{track === null ? (
        <p>Awaiting video track info...</p>
      ) : (
           <>

             {/*Exposure control*/}
             {supportsExposureMode && supportsExposureTime ? (
               <>
                 <label className={styles.detectionControlLabel}>Exposure:</label>
                 <div className={styles.detectionControlInput}>
                   <BootstrapSwitchButton
                     checked={exposureMode === 'continuous'}
                     width={100}
                     size='sm'
                     onlabel='Auto'
                     offlabel='Manual'
                     onChange={checked => {
                       setExposureMode( checked ? 'continuous' : 'manual' );
                     }}
                   />
                   <br/>
                   {exposureMode === 'manual' ? (
                     <input
                       name='exposure'
                       type='range'
                       min={trackCapabilities.exposureTime.min.toString()}
                       max={trackCapabilities.exposureTime.max.toString()}
                       step={trackCapabilities.exposureTime.step.toString()}
                       value={exposureTime}
                       onChange={event => {
                         setExposureTime( event.target.valueAsNumber );
                       }}
                     /> ) : ( '' )}
                 </div>
               </>
             ) : ''}

             {/*Focus control*/}
             {supportsFocusMode && supportsFocusDistance ? (
               <>
                 <label className={styles.detectionControlLabel}>Focus:</label>
                 <div className={styles.detectionControlInput}>
                   <BootstrapSwitchButton
                     checked={focusMode === 'continuous'}
                     width={100}
                     size='sm'
                     onlabel='Auto'
                     offlabel='Manual'
                     onChange={checked => {
                       setFocusMode( checked ? 'continuous' : 'manual' );
                     }}
                   />
                   <br/>
                   {focusMode === 'manual' ? (
                     <input
                       name='focus'
                       type='range'
                       min={trackCapabilities.focusDistance.min.toString()}
                       max={trackCapabilities.focusDistance.max.toString()}
                       step={trackCapabilities.focusDistance.step.toString()}
                       value={focusDistance}
                       onChange={event => {
                         setFocusDistance( event.target.valueAsNumber );
                       }}
                     /> ) : ( '' )}
                 </div>
               </>
             ) : ''}

             {/*Contrast control*/}
             {supportsContrast ? (
               <>
                 <label className={styles.detectionControlLabel}>Contrast:</label>
                 <div className={styles.detectionControlInput}>
                   <input
                     name='contrast'
                     type='range'
                     min={trackCapabilities.contrast.min.toString()}
                     max={trackCapabilities.contrast.max.toString()}
                     step={trackCapabilities.contrast.step.toString()}
                     value={contrast}
                     onChange={event => {
                       setContrast( event.target.valueAsNumber );
                     }}
                   />
                 </div>
               </>
             ) : ''}

             {/*Sharpness control*/}
             {supportsSharpness ? (
               <>
                 <label className={styles.detectionControlLabel}>Sharpness:</label>
                 <div className={styles.detectionControlInput}>
                   <input
                     name='sharpness'
                     type='range'
                     min={trackCapabilities.sharpness.min.toString()}
                     max={trackCapabilities.sharpness.max.toString()}
                     step={trackCapabilities.sharpness.step.toString()}
                     value={sharpness}
                     onChange={event => {
                       setSharpness( event.target.valueAsNumber );
                     }}
                   />
                 </div>
               </>

             ) : ''}

             {/*Reset button*/}
             <Button
               onClick={() => {
                 setExposureMode( 'continuous' );
                 setExposureTime( DEFAULT_EXPOSURE_TIME );
                 setFocusMode( 'continuous' );
                 setFocusDistance( DEFAULT_FOCUS_DISTANCE );
                 setContrast( DEFAULT_CONTRAST );
                 setSharpness( DEFAULT_SHARPNESS );
               }}
             >
               Reset
             </Button>


             {/*Platform info button*/}
             {/*<Button*/}
             {/*  onClick={() => {*/}

             {/*    // Get a list of the supported constraints for the devices available from this browser.*/}
             {/*    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();*/}
             {/*    console.log( '------------- Supported Constraints -------------------' );*/}
             {/*    console.log( `${JSON.stringify( supportedConstraints, null, 2 )}` );*/}

             {/*    // Get a list of all media devices and log some of the information to the console.*/}
             {/*    navigator.mediaDevices*/}
             {/*      .enumerateDevices()*/}
             {/*      .then( devices => {*/}
             {/*        console.log( '------------- Device List -------------------' );*/}
             {/*        devices.forEach( device => {*/}
             {/*          console.log( `${device.kind}: ${device.label} id = ${device.deviceId}` );*/}
             {/*        } );*/}
             {/*      } )*/}
             {/*      .catch( err => {*/}
             {/*        console.error( `${err.name}: ${err.message}` );*/}
             {/*      } );*/}

             {/*    // Get a list of all devices that support video.*/}
             {/*    navigator.mediaDevices.getUserMedia( { video: true } ).then( mediaStream => {*/}
             {/*      const track = mediaStream.getVideoTracks()[ 0 ];*/}
             {/*      if ( track ) {*/}
             {/*        console.log( `---------------- found track = ${track.label}, capabilities below -----------------` );*/}
             {/*        console.log( `${JSON.stringify( track.getCapabilities(), null, 2 )}` );*/}
             {/*      }*/}
             {/*    } );*/}
             {/*  }*/}
             {/*  }*/}
             {/*>*/}
             {/*  Platform Information*/}
             {/*</Button>*/}
           </>
         )}
      </>

    </>
  );
}