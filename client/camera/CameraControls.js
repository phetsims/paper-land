/**
 * CameraControls is a React component that provides a UI and underlying functional code for adjusting parameters of the
 * camera.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from './CameraMain.css';

class CameraControls extends React.Component {

  constructor( props ) {
    super( props );

    // State information, used for rendering.
    this.state = {
      exposureMode: 'continuous',
      exposureTime: 0,
      focusMode: 'continuous',
      focusDistance: 0,
      contrast: 0
    };

    // {MediaStreamTrack|null} - the video track of the camera that is watching the papers
    this.track = null;
    this.trackCapabilities = null;

    // Get the media stream.
    // TODO: We should probably make the video track part of the state.
    navigator.mediaDevices.getUserMedia( { video: true } )
      .then( mediaStream => {

        // Create a local reference to the video track.
        this.track = mediaStream.getVideoTracks()[ 0 ];

        // Make the track capabilities available to the rending method.
        this.trackCapabilities = this.track.getCapabilities();

        // Set the component state with initial values from the track settings.
        const settings = this.track.getSettings();
        this.state.exposureMode = settings.exposureMode;
        this.state.exposureTime = settings.exposureTime;
        this.state.focusMode = settings.focusMode;
        this.state.focusDistance = settings.focusDistance;
        this.state.contrast = settings.contrast;
      } )
      .catch( e => {
        console.log( `Error getting media track: e = ${e}` );
      } );

    // TODO: Is this really a good way to ensure sequential setting of params?  See https://github.com/phetsims/paper-land/issues/56.
    this.cameraSettingPromises = Promise.resolve();
  }

  /**
   * Render the component
   * @returns {JSX.Element}
   * @public
   */
  render() {

    // Render a temporary message until the track information is available.
    if ( this.track === null ) {
      return <>
        <p>Awaiting video track info...</p>
      </>;
    }

    return (
      <>
        <h3 className={styles.headerWithOption}>Camera Settings</h3>

        {/*Exposure control*/}
        <>
          <p>Exposure:</p>
          <BootstrapSwitchButton
            checked={this.state.exposureMode === 'continuous'}
            width={100}
            size='sm'
            onlabel='Auto'
            offlabel='Manual'
            onChange={checked => {
              const exposureMode = checked ? 'continuous' : 'manual';
              this.setState( { exposureMode } );
              console.log( `exposureMode = ${exposureMode}` );
              this.cameraSettingPromises.then( () => {
                this.track.applyConstraints( {
                  advanced: [ { exposureMode } ]
                } );
              } );
            }}
          />
          <br/>
          {this.state.exposureMode === 'manual' ? (
            <input
              name='exposure'
              type='range'
              min={this.trackCapabilities.exposureTime.min.toString()}
              max={this.trackCapabilities.exposureTime.max.toString()}
              step={this.trackCapabilities.exposureTime.step.toString()}
              value={this.state.exposureTime}
              onChange={event => {
                const exposureTime = event.target.valueAsNumber;
                this.setState( { exposureTime: exposureTime } );
                this.cameraSettingPromises.then( () => {
                  this.track.applyConstraints( {
                    advanced: [ { exposureTime: exposureTime } ]
                  } );
                  console.log( `exposureTime = ${exposureTime}` );
                } );
              }}
            /> ) : ( '' )}
        </>

        {/*Focus control*/}
        <>
          <p>Focus:</p>
          <BootstrapSwitchButton
            checked={this.state.focusMode === 'continuous'}
            width={100}
            size='sm'
            onlabel='Auto'
            offlabel='Manual'
            onChange={checked => {
              const focusMode = checked ? 'continuous' : 'manual';
              this.setState( { focusMode } );
              console.log( `focusMode = ${focusMode}` );
              this.cameraSettingPromises.then( () => {
                this.track.applyConstraints( {
                  advanced: [ { focusMode } ]
                } );
              } );
            }}
          />
          <br/>
          {this.state.focusMode === 'manual' ? (
            <input
              name='focus'
              type='range'
              min={this.trackCapabilities.focusDistance.min.toString()}
              max={this.trackCapabilities.focusDistance.max.toString()}
              step={this.trackCapabilities.focusDistance.step.toString()}
              value={this.state.focusDistance}
              onChange={event => {
                const focusDistance = event.target.valueAsNumber;
                this.setState( { focusDistance } );
                this.cameraSettingPromises.then( () => {
                  this.track.applyConstraints( {
                    advanced: [ { focusDistance } ]
                  } );
                  console.log( `focusDistance = ${focusDistance}` );
                } );
              }}
            /> ) : ( '' )}
        </>

        {/*Contrast control*/}
        <>
          <p>Contrast:</p>
          <br/>

          <input
            name='contrast'
            type='range'
            min={this.trackCapabilities.contrast.min.toString()}
            max={this.trackCapabilities.contrast.max.toString()}
            step={this.trackCapabilities.contrast.step.toString()}
            value={this.state.contrast}
            onChange={event => {
              const contrast = event.target.valueAsNumber;
              this.setState( { contrast: contrast } );
              this.cameraSettingPromises.then( () => {
                this.track.applyConstraints( {
                  advanced: [ { contrast: contrast } ]
                } );
                console.log( `contrast = ${contrast}` );
              } );
            }}
          />
        </>

        {/*Platform info button*/}
        <br></br>
        <Button
          onClick={() => {

            // Get a list of the supported constraints for the devices available from this browser.
            const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
            console.log( '------------- Supported Constraints -------------------' );
            console.log( `${JSON.stringify( supportedConstraints, null, 2 )}` );

            // Get a list of all media devices and log some of the information to the console.
            navigator.mediaDevices
              .enumerateDevices()
              .then( devices => {
                console.log( '------------- Device List -------------------' );
                devices.forEach( device => {
                  console.log( `${device.kind}: ${device.label} id = ${device.deviceId}` );
                } );
              } )
              .catch( err => {
                console.error( `${err.name}: ${err.message}` );
              } );

            // Get a list of all devices that support video.
            navigator.mediaDevices.getUserMedia( { video: true } ).then( mediaStream => {
              const track = mediaStream.getVideoTracks()[ 0 ];
              if ( track ) {
                console.log( `---------------- found track = ${track.label}, capabilities below -----------------` );
                console.log( `${JSON.stringify( track.getCapabilities(), null, 2 )}` );
              }
            } );
          }
          }
        >
          Test Button
        </Button>
      </>
    );
  }
}

export default CameraControls;