/* global cv */

import * as d3 from 'd3';
import React from 'react';

import clientConstants from '../clientConstants';
import styles from './CameraVideo.css';
import DebugMarker from './DebugMarker.js';
import DebugProgram from './DebugProgram';
import detectPrograms from './detectPrograms';
import Knob from './Knob';

export default class CameraVideo extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      keyPoints: [],
      videoWidth: 1,
      videoHeight: 1,
      activeCamera: null
    };

    // {boolean} - flag used to prevent multiple simultaneous attempts to set the camera
    this.cameraSelectionInProgress = false;
  }

  componentDidMount() {
    this._attachZoomer();
  }

  _attachZoomer = () => {
    const surface = d3.select( this._zoomSurface );

    // create zoom object and update event
    const zoom = d3
      .zoom()
      .scaleExtent( [ 1, 4 ] )
      .filter( () => {

        // shift key required - it is too easy to change this accidentally and we don't want to transform unless
        // user really wants it. Thanks to https://stackoverflow.com/questions/45189490/d3-change-zoom-and-pan-gestures.
        return d3.event.shiftKey;
      } )
      .on( 'zoom', () => {
        const { x, y, k } = d3.event.transform;
        this.props.onConfigChange( { ...this.props.config, zoomTransform: { x, y, k } } );
      } );

    // initialize zoom
    const { x, y, k } = this.props.config.zoomTransform;
    surface.call( zoom.transform, d3.zoomIdentity.translate( x, y ).scale( k ) );

    // attach zoom handler
    surface.call( zoom );
  };

  _disableZoomer = () => {
    const surface = d3.select( this._zoomSurface );
    surface.on( '.zoom', null );
  };

  _processVideo = () => {
    setTimeout( this._processVideo );
    if ( this.props.config.freezeDetection ) {return;}

    const displayMat = new cv.Mat(
      this._videoCapture.video.height,
      this._videoCapture.video.width,
      cv.CV_8UC4
    );

    try {
      const {
        programsToRender, markers, keyPoints, dataToRemember, framerate
      } = detectPrograms( {
        config: this.props.config,
        videoCapture: this._videoCapture,
        dataToRemember: this._dataToRemember,
        displayMat,
        scaleFactor: this.props.config.scaleFactor,
        allBlobsAreKeyPoints: this.props.allowSelectingDetectedPoints,
        debugPrograms: this.props.debugPrograms,
        debugMarkers: this.props.debugMarkers
      } );
      this._dataToRemember = dataToRemember;
      this.setState( { keyPoints } );
      this.props.onProcessVideo( { programsToRender, markers, framerate } );
    }
    catch( error ) {
      console.log( error );
    }

    cv.imshow( this._canvas, displayMat );
    displayMat.delete();
  };

  /**
   * Set the active camera based on the provided device ID.  This is generally done at initialization and when switching
   * between cameras.
   * @param {string} cameraDeviceId
   * @private
   */
  _setActiveCamera( cameraDeviceId ) {

    // Ignore this if it is a request to set the currently active camera as active.
    if ( this.state.activeCamera && this.state.activeCamera.deviceId === cameraDeviceId ) {
      console.warn( `Ignoring attempt to set camera to the one that is already active, id = ${cameraDeviceId}` );
      return;
    }

    this.cameraSelectionInProgress = true;

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

        // Initialize the video stream.
        const video = this._videoInput;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          this.setState( { videoWidth: video.width, videoHeight: video.height } );
          this._videoCapture = new cv.VideoCapture( video );
          this._dataToRemember = {};
          this._processVideo();
        };

        // Clear the flag used for preventing overlapping selection attempts.
        this.cameraSelectionInProgress = false;
      } )

      .catch( error => {
        console.error( `Error setting active camera: ${error}` );
        this.cameraSelectionInProgress = false;
      } );
  }

  render() {
    const width = this.props.width;
    const height = width / this.state.videoWidth * this.state.videoHeight;
    const { x, y, k } = this.props.config.zoomTransform;
    const cameraDeviceId = this.props.cameraDeviceId;

    // If OpenCV is initialized and no camera has been set up yet or the camera selection was switched, set up an active
    // camera.
    if ( cv.Mat && !this.cameraSelectionInProgress && cameraDeviceId.length > 0 &&
         ( !this.state.activeCamera || cameraDeviceId !== this.state.activeCamera.deviceId ) ) {
      this._setActiveCamera( cameraDeviceId );
    }

    return (
      <div ref={el => ( this._el = el )} style={{ width, height, overflow: 'hidden' }}>
        <video id='videoInput' style={{ display: 'none' }} ref={el => ( this._videoInput = el )}/>
        <div
          style={{
            position: 'relative',
            width,
            height,
            background: 'linen'
          }}
          ref={el => ( this._zoomSurface = el )}
        >
          <canvas
            id='canvasOutput'
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px) scale(${k})`,
              transformOrigin: '0 0',
              width,
              height
            }}
            ref={el => ( this._canvas = el )}
          />
          <div
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px) scale(${k})`,
              transformOrigin: '0 0',
              width,
              height
            }}
          >
            {this.props.debugPrograms.map( program => {
              return (
                <DebugProgram
                  key={program.number}
                  program={program}
                  onMouseEnter={() => this._disableZoomer()}
                  onRelease={() => this._attachZoomer()}
                  videoWidth={this.state.videoWidth}
                  videoHeight={this.state.videoHeight}
                  remove={() => this.props.removeDebugProgram( program )}
                />
              );
            } )}
            {this.props.debugMarkers.map( ( marker, index ) => {
              return (
                <DebugMarker
                  key={marker.count}
                  marker={marker}
                  onMouseEnter={() => this._disableZoomer()}
                  onRelease={() => this._attachZoomer()}
                  videoWidth={this.state.videoWidth}
                  videoHeight={this.state.videoHeight}
                  remove={() => {
                    this.props.removeDebugMarker( marker );
                  }}
                ></DebugMarker>
              );
            } )}
          </div>
          {[ 0, 1, 2, 3 ].map( position => {
            const point = this.props.config.knobPoints[ position ];
            return (
              <Knob
                key={position}
                label={clientConstants.cornerNames[ position ]}
                x={point.x * width * k + x}
                y={point.y * height * k + y}
                onChange={newPoint => {
                  const knobPoints = this.props.config.knobPoints.slice();
                  knobPoints[ position ] = {
                    x: ( newPoint.x - x ) / k / width,
                    y: ( newPoint.y - y ) / k / height
                  };
                  this.props.onConfigChange( { ...this.props.config, knobPoints } );
                }}
              />
            );
          } )}
          {this.props.allowSelectingDetectedPoints &&
           this.state.keyPoints.map( ( point, index ) => {
             const px = ( point.pt.x - point.size / 2 ) / this.state.videoWidth * width * k + x;
             const py = ( point.pt.y - point.size / 2 ) / this.state.videoHeight * height * k + y;
             return (
               <div
                 key={index}
                 className={styles.keyPoint}
                 style={{
                   transform: `translate(${px}px, ${py}px) scale(${k})`,
                   transformOrigin: '0 0',
                   width: point.size / this.state.videoWidth * width,
                   height: point.size / this.state.videoHeight * height
                 }}
                 onClick={() => {
                   this.props.onSelectPoint( { color: point.avgColor, size: point.size } );
                 }}
               />
             );
           } )}
        </div>
      </div>
    );
  }
}