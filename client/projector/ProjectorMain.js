import React from 'react';
import { forwardProjectionMatrixForPoints, mult } from '../utils';
import Program from './Program.js';

function projectorSize() {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  return { width, height };
}

export default class ProjectorMain extends React.Component {

  constructor( props ) {
    super( props );

    // {string} - device ID of the currently selected camera
    this.selectedCameraDeviceId = '';
  }

  /**
   * Set the active camera based on the provided device ID.  This is generally done at initialization and when switching
   * between cameras.
   * @param {string} cameraDeviceId
   * @private
   */
  _setActiveCamera( cameraDeviceId ) {

    // Ignore this if it is a request to set the currently active camera as active.
    if ( this.selectedCameraDeviceId === cameraDeviceId ) {
      console.warn( `Ignoring attempt to set camera to the one that is already active, id = ${cameraDeviceId}` );
      return;
    }

    this.selectedCameraDeviceId = cameraDeviceId;

    // Get a list of the available cameras.
    navigator.mediaDevices.enumerateDevices()

      // Verify that the specified device exists and, if so, request a media stream from it.
      .then( devices => {

        const matchingCameras = devices.filter(
          device => device.kind === 'videoinput' && device.deviceId === cameraDeviceId
        );

        const selectedCamera = matchingCameras[ 0 ];

        if ( !selectedCamera ) {
          throw new Error( `Specified camera not found, device ID = ${cameraDeviceId}` );
        }

        this.setState( { activeCamera: selectedCamera } );

        // Request the media stream from the camera.
        const cameraConstraints = {
          audio: false,
          video: { deviceId: selectedCamera.deviceId }
        };
        return navigator.mediaDevices.getUserMedia( cameraConstraints );
      } )

      // Set up the stream so that we can process it.
      .then( stream => {
        this._videoCapture = new ImageCapture( stream.getVideoTracks()[ 0 ] );
      } )

      .catch( error => {
        console.error( `Error setting active camera: ${error}` );
      } );
  }

  grabCameraImageAndProjectionData = async () => {
    const cameraImage = await this._videoCapture.grabFrame();

    const outputCorners = this.props.knobPoints.map( ( { x, y } ) => ( {
      x: x * cameraImage.width,
      y: y * cameraImage.height
    } ) );

    const inputSize = projectorSize();
    const inputCorners = [
      { x: 0, y: 0 },
      { x: inputSize.width - 1, y: 0 },
      { x: inputSize.width - 1, y: inputSize.height - 1 },
      { x: 0, y: inputSize.height - 1 }
    ];

    const a = forwardProjectionMatrixForPoints( outputCorners );
    const b = forwardProjectionMatrixForPoints( inputCorners ).adjugate();
    const forwardProjectionData = a.multiply( b ).data;

    // TODO(JP): the above might be somewhat expensive to calculate.
    // Probably worth profiling and caching if necessary.

    return { cameraImage, forwardProjectionData };
  };

  render() {
    const { width, height } = projectorSize();
    const multPoint = { x: width, y: height };
    const cameraDeviceId = this.props.cameraDeviceId;

    if ( this.selectedCameraDeviceId !== cameraDeviceId ) {
      this._setActiveCamera( cameraDeviceId );
    }

    const papers = {};
    const programsToRenderByNumber = {};
    this.props.programsToRender.forEach( program => {
      const centerPoint = { x: 0, y: 0 };
      program.points.forEach( point => {
        centerPoint.x += point.x / 4;
        centerPoint.y += point.y / 4;
      } );

      papers[ program.number ] = {
        points: {
          topLeft: mult( program.points[ 0 ], multPoint ),
          topRight: mult( program.points[ 1 ], multPoint ),
          bottomRight: mult( program.points[ 2 ], multPoint ),
          bottomLeft: mult( program.points[ 3 ], multPoint ),
          center: mult( centerPoint, multPoint )
        },
        data: this.props.dataByProgramNumber[ program.number ] || {}
      };

      programsToRenderByNumber[ program.number ] = program;
    } );

    const markers = this.props.markers.map( data => ( {
      ...data,
      position: mult( data.position, multPoint )
    } ) );

    // used for unique IDs for this render - have to do this because markers are not
    // uniquely identifiable
    const thisTime = new Date().getTime();

    return (
      <div>
        {this.props.programsToRender.map( program => (
          <Program
            key={`${program.number}-${program.currentCodeHash}`}
            programsToRenderByNumber={programsToRenderByNumber}
            markers={markers}
            programNumber={program.number}
            grabCameraImageAndProjectionData={this.grabCameraImageAndProjectionData}
            papers={papers}
            width={width}
            height={height}
            paperRatio={this.props.paperRatio}
            onDataChange={( data, callback ) => {
              this.props.onDataByProgramNumberChange(
                {
                  ...this.props.dataByProgramNumber,
                  [ program.number ]: {
                    ...this.props.dataByProgramNumber[ program.number ],
                    ...data
                  }
                },
                callback
              );
            }}
          />
        ) )}
        {markers.map( ( marker, index ) => (
          <div
            key={`${index}-${thisTime}`}
            style={{
              position: 'absolute',
              left: `${marker.position.x}px`,
              top: `${marker.position.y}px`,
              width: `${200}px`,
              height: `${200}%px`,

              // positioned relative to left top, this puts marker position at center of div
              transform: 'translate(-50%, -50%)',

              // so that the SVG is centered within
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <svg viewBox='-50 -50 100 100'>
              <circle
                r='10%'
                fill={marker.colorName}
                stroke={'white'}
              />
            </svg>
          </div>
        ) )}
      </div>
    );
  }
}