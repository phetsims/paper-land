/* global cv */

/* eslint-disable author-annotation */

// This file uses an object destructuring technique for function parameters that PhET doesn't use, and that triggers
// some of PhET's lint rules.  To compensate, indentation checking is not done for this file.
/* eslint-disable indent */

import colorDiff from 'color-diff';
import partition from 'lodash/partition';
import sortBy from 'lodash/sortBy';
import clientConstants from '../clientConstants';
import PaperWhiskerManager from '../common/PaperWhiskerManager.js';
import { code8400 } from '../dotCodes';
import { add, clamp, cross, diff, div, findProgramContainingMarker, forwardProjectionMatrixForPoints, mult, norm, projectPoint, shrinkPoints } from '../utils';
import simpleBlobDetector from './simpleBlobDetector';

const WHISKER_COLOR = [ 139, 0, 0, 255 ];

function keyPointToAvgColor( keyPoint, videoMat ) {
  const x = Math.floor( keyPoint.pt.x - keyPoint.size / 2 );
  const y = Math.floor( keyPoint.pt.y - keyPoint.size / 2 );

  const circleROI = videoMat.roi( {
    x,
    y,
    width: keyPoint.size,
    height: keyPoint.size
  } );

  const circleMask = cv.Mat.zeros( keyPoint.size, keyPoint.size, cv.CV_8UC1 );
  cv.circle(
    circleMask,
    { x: Math.floor( keyPoint.size / 2 ), y: Math.floor( keyPoint.size / 2 ) },
    keyPoint.size / 2 - 1,
    [ 255, 255, 255, 0 ],
    -1
  );

  const circleMean = cv.mean( circleROI, circleMask );
  circleROI.delete();
  circleMask.delete();

  // Find the corners of the circle ROI, but just one pixel outside of it to be
  // more sure to capture white pixels.
  const corners = [
    videoMat.ptr( clamp( y - 1, 0, videoMat.rows ), clamp( x - 1, 0, videoMat.cols ) ),
    videoMat.ptr( clamp( y - 1, 0, videoMat.rows ), clamp( x + keyPoint.size + 1, 0, videoMat.cols ) ),
    videoMat.ptr( clamp( y + keyPoint.size + 1, 0, videoMat.rows ), clamp( x - 1, 0, videoMat.cols ) ),
    videoMat.ptr(
      clamp( y + keyPoint.size + 1, 0, videoMat.rows ),
      clamp( x + keyPoint.size + 1, 0, videoMat.cols )
    )
  ];

  const whiteMax = [
    Math.max( corners[ 0 ][ 0 ], corners[ 1 ][ 0 ], corners[ 2 ][ 0 ], corners[ 3 ][ 0 ] ),
    Math.max( corners[ 0 ][ 1 ], corners[ 1 ][ 1 ], corners[ 2 ][ 1 ], corners[ 3 ][ 1 ] ),
    Math.max( corners[ 0 ][ 2 ], corners[ 1 ][ 2 ], corners[ 2 ][ 2 ], corners[ 3 ][ 2 ] ),
    255
  ];

  // Normalize to the white colour.
  return [
    clamp( circleMean[ 0 ] / whiteMax[ 0 ] * 255, 0, 255 ),
    clamp( circleMean[ 1 ] / whiteMax[ 1 ] * 255, 0, 255 ),
    clamp( circleMean[ 2 ] / whiteMax[ 2 ] * 255, 0, 255 ),
    255
  ];
}

function colorToRGB( c ) {
  return { R: Math.round( c[ 0 ] ), G: Math.round( c[ 1 ] ), B: Math.round( c[ 2 ] ) };
}

function colorIndexForColor( matchColor, colors ) {
  const colorsRGB = colors.map( colorToRGB );
  return colorsRGB.indexOf( colorDiff.closest( colorToRGB( matchColor ), colorsRGB ) );
}

function shapeToId( colorIndexes ) {
  return code8400.indexOf( colorIndexes.join( '' ) ) % ( code8400.length / 4 );
}

function shapeToCornerNum( colorIndexes ) {
  return Math.floor( code8400.indexOf( colorIndexes.join( '' ) ) / ( code8400.length / 4 ) );
}

function knobPointsToROI( knobPoints, videoMat ) {
  const clampedKnobPoints = knobPoints.map( point => ( {
    x: clamp( point.x, 0, 1 ),
    y: clamp( point.y, 0, 1 )
  } ) );
  const minX = Math.min( ...clampedKnobPoints.map( point => point.x * videoMat.cols ) );
  const minY = Math.min( ...clampedKnobPoints.map( point => point.y * videoMat.rows ) );
  const maxX = Math.max( ...clampedKnobPoints.map( point => point.x * videoMat.cols ) );
  const maxY = Math.max( ...clampedKnobPoints.map( point => point.y * videoMat.rows ) );
  return {
    x: minX, y: minY, width: maxX - minX, height: maxY - minY
  };
}

let projectPointToUnitSquarePreviousKnobPoints;
let projectPointToUnitSquarePreviousMatrix;

function projectPointToUnitSquare( point, videoMat, knobPoints ) {
  if (
    !projectPointToUnitSquarePreviousMatrix ||
    projectPointToUnitSquarePreviousKnobPoints !== knobPoints
  ) {
    projectPointToUnitSquarePreviousKnobPoints = knobPoints;
    projectPointToUnitSquarePreviousMatrix = forwardProjectionMatrixForPoints(
      knobPoints
    ).adjugate();
  }
  return projectPoint(
    div( point, { x: videoMat.cols, y: videoMat.rows } ),
    projectPointToUnitSquarePreviousMatrix
  );
}

// Depth-first search until a streak of `lengthLeft` has been found.
// Should be initialised with at least one item in `shapeToFill`.
function findShape( shapeToFill, neighborIndexes, lengthLeft ) {
  if ( lengthLeft === 0 ) {return true;}

  const lastIndex = shapeToFill[ shapeToFill.length - 1 ];
  for ( const index of neighborIndexes[ lastIndex ] ) {
    if ( shapeToFill.includes( index ) ) {continue;}
    shapeToFill.push( index );
    if ( findShape( shapeToFill, neighborIndexes, lengthLeft - 1 ) ) {return true;}
    shapeToFill.pop();
  }

  return false;
}

function colorIndexesForShape( shape, keyPoints, videoMat, colorsRGB ) {
  const shapeColors = shape.map(
    keyPointIndex => keyPointToAvgColor( keyPoints[ keyPointIndex ], videoMat ),
    colorsRGB
  );

  const closestColors = [];
  const remainingShapeColors = shapeColors.slice();
  colorsRGB.forEach( mainColor => {
    const closestColorIndex = colorIndexForColor( mainColor, remainingShapeColors );
    closestColors.push( remainingShapeColors[ closestColorIndex ] );
    remainingShapeColors.splice( closestColorIndex, 1 );
  } );

  return shapeColors.map( color => colorIndexForColor( color, closestColors ) );
}

export default function detectPrograms( {
                                          config,
                                          videoCapture,
                                          dataToRemember,
                                          displayMat,
                                          scaleFactor,
                                          allBlobsAreKeyPoints,
                                          debugPrograms = [],
                                          debugMarkers = []
                                        } ) {
  const startTime = Date.now();
  const paperDotSizes = config.paperDotSizes;
  const paperDotSizeVariance = // difference min/max size * 2
    Math.max( 1, Math.max.apply( null, paperDotSizes ) - Math.min.apply( null, paperDotSizes ) ) * 2;
  const avgPaperDotSize = paperDotSizes.reduce( ( sum, value ) => sum + value ) / paperDotSizes.length;
  const markerSizeThreshold = avgPaperDotSize + paperDotSizeVariance;

  const videoMat = new cv.Mat( videoCapture.video.height, videoCapture.video.width, cv.CV_8UC4 );

  // Read the video feed from the camera and set pixels to the videoMat if the camera is enabled. Otherwise
  // set the videoMat to just a black screen.
  if ( config.cameraEnabled ) {
    videoCapture.read( videoMat );
  }
  else {
    videoMat.setTo( new cv.Scalar( 0, 0, 0, 255 ) );
  }

  // Flipping the video feed here works for both the display and blob detector -
  // the video mat is copied to the displayMat and a ROI is taken from
  // the videoMat for the blob detector.
  if ( config.flipCameraFeedX ) {
    cv.flip( videoMat, videoMat, 1 );
  }
  if ( config.flipCameraFeedY ) {
    cv.flip( videoMat, videoMat, 0 );
  }

  const knobPointMatrix = forwardProjectionMatrixForPoints( config.knobPoints );
  const mapToKnobPointMatrix = point => {
    return mult( projectPoint( point, knobPointMatrix ), { x: videoMat.cols, y: videoMat.rows } );
  };

  // Draws whiskers onto the OpenCV displayMat.
  const drawWhiskers = ( normalizedPoints, displayMat, programNumber ) => {

    const normalizedWhiskerLines = PaperWhiskerManager.paperWhiskerMap.get( programNumber );
    if ( normalizedWhiskerLines ) {
      const whiskerLines = normalizedWhiskerLines.map( line => {
        return {
          start: mapToKnobPointMatrix( line.start ),
          end: mapToKnobPointMatrix( line.end )
        };
      } );

      cv.line( displayMat, whiskerLines[ 0 ].start, whiskerLines[ 0 ].end, WHISKER_COLOR );
      cv.line( displayMat, whiskerLines[ 1 ].start, whiskerLines[ 1 ].end, WHISKER_COLOR );
      cv.line( displayMat, whiskerLines[ 2 ].start, whiskerLines[ 2 ].end, WHISKER_COLOR );
      cv.line( displayMat, whiskerLines[ 3 ].start, whiskerLines[ 3 ].end, WHISKER_COLOR );
    }
  };

  if ( displayMat ) {
    videoMat.copyTo( displayMat );
    const knobPoints = [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 } ].map( mapToKnobPointMatrix );

    for ( let i = 0; i < 4; i++ ) {
      cv.line( displayMat, knobPoints[ i ], knobPoints[ ( i + 1 ) % 4 ], [ 255, 0, 0, 255 ] );
    }
  }

  const videoROI = knobPointsToROI( config.knobPoints, videoMat );
  const clippedVideoMat = videoMat.roi( videoROI );

  // The points detected by the blob detector using OpenCV
  let allPoints = [];

  // Points that are large enough to be considered markers
  let markers = [];

  // All detected points from the blob detector that are not markers
  let keyPoints = [];

  // The list of found programs to render
  const programsToRender = [];

  // The vectors between corners of the detected programs
  const vectorsBetweenCorners = { ...( dataToRemember.vectorsBetweenCorners || {} ) };

  // If the camera is enabled, run the blob detector, parse detected keypoints, and use them to find programs.
  // Otherwise skip to get better performance when using debug programs.
  if ( config.cameraEnabled ) {
    allPoints = simpleBlobDetector( clippedVideoMat, {
      filterByCircularity: true,
      minCircularity: 0.9,
      filterByInertia: false,

      // values that are controlled by the interface
      faster: config.faster,
      thresholdStep: config.thresholdStep,
      minThreshold: config.minThreshold,
      maxThreshold: config.maxThreshold,
      minArea: config.minArea,
      maxArea: config.maxArea,
      minDistBetweenBlobs: config.minDistBetweenBlobs,
      scaleFactor: scaleFactor
    } );

    allPoints.forEach( keyPoint => {
      keyPoint.matchedShape = false; // is true if point has been recognised as part of a shape
      keyPoint.pt.x += videoROI.x;
      keyPoint.pt.y += videoROI.y;

      // Give each `keyPoint` an `avgColor` and `colorIndex`.
      keyPoint.avgColor = keyPointToAvgColor( keyPoint, videoMat );
      keyPoint.colorIndex =
        keyPoint.colorIndex || colorIndexForColor( keyPoint.avgColor, config.colorsRGB );
    } );

    [ markers, keyPoints ] = allBlobsAreKeyPoints
                             ? [ [], allPoints ]
                             : partition( allPoints, ( { size } ) => size > markerSizeThreshold );

    // Sort by x position. We rely on this when scanning through the circles
    // to find connected components, and when calibrating.
    keyPoints = sortBy( keyPoints, keyPoint => keyPoint.pt.x );

    // Build connected components by scanning through the `keyPoints`, which
    // are sorted by x-position.
    const neighborIndexes = [];
    for ( let i = 0; i < keyPoints.length; i++ ) {
      neighborIndexes[ i ] = neighborIndexes[ i ] || [];
      for ( let j = i + 1; j < keyPoints.length; j++ ) {
        neighborIndexes[ j ] = neighborIndexes[ j ] || [];

        // Break early if we are too far on the right anyway.
        if ( keyPoints[ j ].pt.x - keyPoints[ i ].pt.x > keyPoints[ i ].size * 3 ) {break;}

        if (
          norm( diff( keyPoints[ i ].pt, keyPoints[ j ].pt ) ) <
          ( keyPoints[ i ].size + keyPoints[ j ].size ) * 0.9
        ) {
          neighborIndexes[ i ].push( j );
          neighborIndexes[ j ].push( i );

          if ( displayMat && config.showOverlayComponentLines ) {

            // Draw lines between components.
            cv.line( displayMat, keyPoints[ i ].pt, keyPoints[ j ].pt, [ 255, 255, 255, 255 ] );
          }
        }
      }
    }

    // Find acyclical shapes of 7, and put ids into `newDataToRemember`.
    const seenIndexes = new window.Set();
    const keyPointSizes = [];
    const pointsById = {};
    const directionVectorsById = {};
    for ( let i = 0; i < keyPoints.length; i++ ) {
      if ( neighborIndexes[ i ].length === 1 && !seenIndexes.has( i ) ) {
        const shape = [ i ]; // Initialise with the first index, then run findShape with 7-1.
        if ( findShape( shape, neighborIndexes, 7 - 1 ) ) {
          shape.forEach( index => seenIndexes.add( index ) );

          // Reverse the array if it's the wrong way around.
          const mag = cross(
            diff( keyPoints[ shape[ 0 ] ].pt, keyPoints[ shape[ 3 ] ].pt ),
            diff( keyPoints[ shape[ 6 ] ].pt, keyPoints[ shape[ 3 ] ].pt )
          );
          if ( mag > 100 ) {

            // Use 100 to avoid straight line. We already depend on sorting by x for that.
            shape.reverse();
          }

          const colorIndexes = colorIndexesForShape( shape, keyPoints, videoMat, config.colorsRGB );
          const id = shapeToId( colorIndexes );
          const cornerNum = shapeToCornerNum( colorIndexes );

          if ( cornerNum > -1 ) {

            // Store the colorIndexes so we can render them later for debugging.
            colorIndexes.forEach( ( colorIndex, shapePointIndex ) => {
              keyPoints[ shape[ shapePointIndex ] ].colorIndex = colorIndex;
            } );

            pointsById[ id ] = pointsById[ id ] || [];
            pointsById[ id ][ cornerNum ] = keyPoints[ shape[ 3 ] ].pt;
            directionVectorsById[ id ] = directionVectorsById[ id ] || [];
            directionVectorsById[ id ][ cornerNum ] = diff(
              keyPoints[ shape[ 6 ] ].pt,
              keyPoints[ shape[ 3 ] ].pt
            );

            shape.forEach( index => keyPointSizes.push( keyPoints[ index ].size ) );

            if ( displayMat && config.showOverlayShapeId ) {

              // Draw id and corner name.
              cv.putText(
                displayMat,
                `${id},${clientConstants.cornerNames[ cornerNum ]}`,
                div( add( keyPoints[ shape[ 0 ] ].pt, keyPoints[ shape[ 6 ] ].pt ), { x: 2, y: 2 } ),
                cv.FONT_HERSHEY_DUPLEX,
                0.5,
                [ 0, 0, 255, 255 ]
              );
            }
          }
        }
      }
    }
    const avgKeyPointSize =
      keyPointSizes.reduce( ( sum, value ) => sum + value, 0 ) / keyPointSizes.length;

    allPoints.forEach( keyPoint => {
      if ( displayMat ) {
        if ( config.showOverlayKeyPointCircles ) {

          // Draw circles around `keyPoints`.
          const color = config.colorsRGB[ keyPoint.colorIndex ];
          cv.circle( displayMat, keyPoint.pt, keyPoint.size / 2 + 3, color, 2 );
        }

        if ( config.showOverlayKeyPointText ) {

          // Draw text inside circles.
          cv.putText(
            displayMat,
            clientConstants.colorNames[ keyPoint.colorIndex ],
            add( keyPoint.pt, { x: -6, y: 6 } ),
            cv.FONT_HERSHEY_DUPLEX,
            0.6,
            [ 255, 255, 255, 255 ]
          );
        }
      }
    } );

    Object.keys( pointsById ).forEach( id => {
      const points = pointsById[ id ];
      const potentialPoints = [];
      vectorsBetweenCorners[ id ] = vectorsBetweenCorners[ id ] || {};
      const dirVecs = directionVectorsById[ id ];

      // Store/update the angles and magnitudes between known points.
      for ( let i = 0; i < 4; i++ ) {
        for ( let j = 0; j < 4; j++ ) {
          if ( i !== j && points[ i ] && points[ j ] ) {
            const diffVec = diff( points[ j ], points[ i ] );
            vectorsBetweenCorners[ id ][ `${i}->${j}` ] = {
              angle: Math.atan2( diffVec.y, diffVec.x ) - Math.atan2( dirVecs[ i ].y, dirVecs[ i ].x ),
              magnitude: norm( diffVec ),

              // Once we see two corners for real, mark them as not mirrored, so
              // we won't override this when mirroring angles/magnitudes.
              mirrored: false
            };
          }
        }
      }

      // Assuming the paper is rectangular, mirror angles/magnitudes.
      for ( let i = 0; i < 4; i++ ) {
        for ( let j = 0; j < 4; j++ ) {
          const thisSide = `${i}->${j}`;
          const otherSide = `${( i + 2 ) % 4}->${( j + 2 ) % 4}`;
          if (
            vectorsBetweenCorners[ id ][ thisSide ] &&
            ( !vectorsBetweenCorners[ id ][ otherSide ] || vectorsBetweenCorners[ id ][ otherSide ].mirrored )
          ) {
            vectorsBetweenCorners[ id ][ otherSide ] = {
              ...vectorsBetweenCorners[ id ][ thisSide ],
              mirrored: true
            };
          }
        }
      }

      // Find potential point for unknown points if we know the angle+magnitude with
      // another point.
      for ( let i = 0; i < 4; i++ ) {
        for ( let j = 0; j < 4; j++ ) {
          if ( points[ i ] && !points[ j ] && vectorsBetweenCorners[ id ][ `${i}->${j}` ] ) {
            const { angle, magnitude } = vectorsBetweenCorners[ id ][ `${i}->${j}` ];
            const newAngle = angle + Math.atan2( dirVecs[ i ].y, dirVecs[ i ].x );
            potentialPoints[ j ] = potentialPoints[ j ] || [];
            potentialPoints[ j ].push( {
              x: points[ i ].x + magnitude * Math.cos( newAngle ),
              y: points[ i ].y + magnitude * Math.sin( newAngle )
            } );
          }
        }
      }

      if ( !config.requireAllCorners ) {

        // Take the average of all potential points for each unknown point.
        for ( let i = 0; i < 4; i++ ) {
          if ( potentialPoints[ i ] ) {
            points[ i ] = { x: 0, y: 0 };
            potentialPoints[ i ].forEach( vec => {
              points[ i ].x += vec.x / potentialPoints[ i ].length;
              points[ i ].y += vec.y / potentialPoints[ i ].length;
            } );
          }
        }
      }

      if ( points[ 0 ] && points[ 1 ] && points[ 2 ] && points[ 3 ] ) {
        const scaledPoints = shrinkPoints( avgKeyPointSize * 0.75, points ).map( point =>
          projectPointToUnitSquare( point, videoMat, config.knobPoints )
        );

        const programToRender = {
          points: scaledPoints,
          number: id,
          projectionMatrix: forwardProjectionMatrixForPoints( scaledPoints ).adjugate()
        };
        programsToRender.push( programToRender );

        if ( displayMat ) {
          const reprojectedPoints = programToRender.points.map( mapToKnobPointMatrix );

          if ( config.showOverlayProgram ) {
            cv.line( displayMat, reprojectedPoints[ 0 ], reprojectedPoints[ 1 ], [ 0, 0, 255, 255 ] );
            cv.line( displayMat, reprojectedPoints[ 2 ], reprojectedPoints[ 1 ], [ 0, 0, 255, 255 ] );
            cv.line( displayMat, reprojectedPoints[ 2 ], reprojectedPoints[ 3 ], [ 0, 0, 255, 255 ] );
            cv.line( displayMat, reprojectedPoints[ 3 ], reprojectedPoints[ 0 ], [ 0, 0, 255, 255 ] );
            cv.line(
              displayMat,
              div( add( reprojectedPoints[ 2 ], reprojectedPoints[ 3 ] ), { x: 2, y: 2 } ),
              div( add( reprojectedPoints[ 0 ], reprojectedPoints[ 1 ] ), { x: 2, y: 2 } ),
              [ 0, 0, 255, 255 ]
            );
          }
          if ( config.showWhiskerLines ) {
            drawWhiskers( programToRender.points, displayMat, programToRender.number );
          }
        }
      }
    } );

    // Markers
    markers = markers.map( ( {
                               colorIndex, avgColor, pt, size
                             } ) => {
      const markerPosition = projectPointToUnitSquare( pt, videoMat, config.knobPoints );

      const colorName = {
        0: 'red',
        1: 'green',
        2: 'blue',
        3: 'black'
      }[ colorIndex ];

      // find out on which paper the marker is
      const matchingProgram = findProgramContainingMarker( markerPosition, programsToRender );

      // draw the marker to the camera video
      if ( displayMat ) {
        const color = config.colorsRGB[ colorIndex ];
        cv.circle( displayMat, pt, size / 2 + 3, color, cv.FILLED );
      }

      return {
        positionOnPaper:
          matchingProgram && projectPoint( markerPosition, matchingProgram.projectionMatrix ),
        paperNumber: matchingProgram && matchingProgram.number,
        size,
        position: markerPosition,
        color: avgColor,
        colorName
      };
    } );
  }

  // Debug programs
  debugPrograms.forEach( ( { points, number } ) => {
    const scaledPoints = points.map( point => {
      const absPoint = mult( point, { x: videoMat.cols, y: videoMat.rows } );
      return projectPointToUnitSquare( absPoint, videoMat, config.knobPoints );
    } );

    const debugProgram = {
      points: scaledPoints,
      number,
      projectionMatrix: forwardProjectionMatrixForPoints( scaledPoints ).adjugate()
    };
    programsToRender.push( debugProgram );

    if ( displayMat && config.showWhiskerLines ) {
      drawWhiskers( scaledPoints, displayMat, debugProgram.number );
    }
  } );

  // Debug markers
  debugMarkers.forEach( debugMarker => {
    const absPoint = mult( debugMarker.position, { x: videoMat.cols, y: videoMat.rows } );
    const markerPosition = projectPointToUnitSquare( absPoint, videoMat, config.knobPoints );

    const colorName = debugMarker.colorName;
    const colorData = debugMarker.color;

    const containingProgram = findProgramContainingMarker( markerPosition, programsToRender );

    markers.push( {
      position: markerPosition,
      color: colorData,
      colorName: colorName,
      size: debugMarker.size,

      // only available if the marker is inside of a program
      paperNumber: containingProgram && containingProgram.number,
      positionOnPaper: containingProgram && projectPoint( markerPosition, containingProgram.projectionMatrix )
    } );
  } );

  // memory management, Mats must be manually deleted
  videoMat.delete();
  clippedVideoMat.delete();

  return {
    keyPoints,
    programsToRender,
    markers,
    dataToRemember: { vectorsBetweenCorners },
    framerate: Math.round( 1000 / ( Date.now() - startTime ) )
  };
}