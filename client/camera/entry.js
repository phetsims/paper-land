import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import PaperWhiskerManager from '../common/PaperWhiskerManager.js';

import CameraMain from './CameraMain';

const storedConfig = JSON.parse( localStorage.paperProgramsConfig || '{}' );

// Check to see if there is an existing, previously selected space in local storage.  If not, create a default.
const selectedSpaceName = storedConfig.selectedSpaceName || uuidv4().slice( 0, 8 );

export const DEFAULT_KNOB_POINTS = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }
];

// Define a default
const defaultConfig = {
  paperSize: 'LETTER',
  colorsRGB: [ [ 119, 43, 24, 255 ], [ 94, 104, 48, 255 ], [ 65, 80, 84, 255 ], [ 0, 0, 0, 255 ] ],
  paperDotSizes: [ 8, 8, 8, 8 ],
  knobPoints: DEFAULT_KNOB_POINTS,
  zoomTransform: d3.zoomIdentity,
  showOverlayKeyPointCircles: true,
  showOverlayKeyPointText: true,
  showOverlayComponentLines: true,
  showWhiskerLines: false,
  showOverlayShapeId: true,
  showOverlayProgram: true,
  selectedSpaceName,
  freezeDetection: false,
  showPrintedInQueue: false,

  // detection parameters
  scaleFactor: 1,
  faster: false,
  thresholdStep: 10,
  minThreshold: 50,
  maxThreshold: 230,
  minArea: 25,
  maxArea: 500,
  minDistBetweenBlobs: 10,

  // When true, a program will only be detected if all corners are detected. Generally this should be false, and
  // detectPrograms will try to guess where missing corners are for easier detection. But there are cases where
  // you will want to only detect programs that are fully visible.
  requireAllCorners: false,

  // The ID of the selected camera
  selectedCameraDeviceId: '',

  // If false, teh camera feed is disabled and we just use debug programs
  cameraEnabled: true,

  // {boolean} - Whether camera feed gets flipped in the horizontal or vertical direction
  flipCameraFeedX: false,
  flipCameraFeedY: false
};

function sanitizeConfig( config ) {
  const newConfig = { ...config };
  if ( newConfig.colorsRGB.length !== defaultConfig.colorsRGB.length ) {
    newConfig.colorsRGB = defaultConfig.colorsRGB;
  }

  if ( !newConfig.paperDotSizes ) {
    newConfig.paperDotSizes = defaultConfig.paperDotSizes;
  }
  return newConfig;
}

localStorage.paperProgramsConfig = JSON.stringify(
  sanitizeConfig( {
    ...defaultConfig,
    ...storedConfig
  } )
);

if ( localStorage.paperProgramsProgramsToRender === undefined ) {
  localStorage.paperProgramsProgramsToRender = JSON.stringify( [] );
}

if ( localStorage.paperProgramsMarkers === undefined ) {
  localStorage.paperProgramsMarkers = JSON.stringify( [] );
}

if ( localStorage.paperProgramsWhiskers === undefined ) {
  localStorage.paperProgramsWhiskers = JSON.stringify( [] );
}

const element = document.createElement( 'div' );
document.body.appendChild( element );

function render() {
  ReactDOM.render(
    <CameraMain
      config={JSON.parse( localStorage.paperProgramsConfig )}
      paperProgramsProgramsToRender={JSON.parse( localStorage.paperProgramsProgramsToRender )}
      onConfigChange={config => {
        localStorage.paperProgramsConfig = JSON.stringify( config );
        render();
      }}
      onMarkersChange={markers => {
        localStorage.paperProgramsMarkers = JSON.stringify( markers );
        render();
      }}
      onProgramsChange={programs => {

        debugger;
        localStorage.paperProgramsProgramsToRender = JSON.stringify( programs );

        // save state of whiskers before updating programs as we want them accurate before
        // triggering program change events
        PaperWhiskerManager.updatePaperWhiskerMap( programs );
        localStorage.paperProgramsWhiskers = PaperWhiskerManager.getPaperWhiskerMapString();
        render();
      }}
    />,
    element
  );
}

render();