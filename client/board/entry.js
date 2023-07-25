/**
 * Entry-point file for the Sim Design Board, which is a scene graph based on the PhET libraries that uses PhET
 * components that can be manipulated using the paper programs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Liam Mulhall (PhET Interactive Simulations)
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import PaperWhiskerManager from '../common/PaperWhiskerManager.js';
import boardConsole from './boardConsole.js';
import styles from './BoardMain.css';
import BoardMain from './BoardMain.js';
import boardModel from './boardModel.js';

// Import components so they are available in the namespace
import './boardUtils.js';
import './connections/ConnectionElement.js';
import './connections/SingleChildConnectionElement.js';

import { markersAddedEmitter, markersChangedPositionEmitter, markersRemovedEmitter } from './markerEmitters.js';

// constants
const DISPLAY_SIZE = new phet.dot.Dimension2(
  parseInt( styles.displayWidth, 10 ),
  parseInt( styles.displayHeight, 10 )
);

// Create the root element for React.
const simDisplayDiv = document.getElementById( 'board-root-element' );
document.body.appendChild( simDisplayDiv );

// Create the root of the scene graph.
const scene = new phet.scenery.Node();

// The object in localStorage on page load
const storedBoardConfig = JSON.parse( localStorage.boardConfig || '{}' );

// The position and length information from localStorage, but parsed and ready for use in this app.
const localWhiskerMap = new Map();

// Defaults for the board configuration, if values are not saved to local storage
const defaultBoardConfig = {
  positionInterval: 0
};

// Combined config with localStorage overriding defaults. This will change during runtime as new values
// are set.
const boardConfigObject = {
  ...defaultBoardConfig,
  ...storedBoardConfig
};

// Populate with defaults.
localStorage.boardConfig = JSON.stringify( boardConfigObject );

// The amount of movement required for a program to be considered "moved" and trigger events
// related to changing positions. Value is normalized, so a value of 0.2 means it has to move
// 20% of the screen in either X or Y dimensions.
const updatePositionInterval = newValue => {
  saveValueToBoardConfig( 'positionInterval', newValue );
};

// Sets the new value to the runtime config object and local storage for next page load.
const saveValueToBoardConfig = ( nameString, value ) => {
  boardConfigObject[ nameString ] = value;
  localStorage.boardConfig = JSON.stringify( boardConfigObject );
};

// Render the scene graph.  Once this is done it updates itself, so there is no other React-based rendering of this
// component.
ReactDOM.render(
  <BoardMain
    scene={scene}
    boardConfigObject={boardConfigObject}
    updatePositionInterval={updatePositionInterval}
  ></BoardMain>,
  simDisplayDiv
);

// Initialize sound production.
const TRUE_PROPERTY = new phet.axon.BooleanProperty( true );
const FALSE_PROPERTY = new phet.axon.BooleanProperty( false );
phet.tambo.soundManager.enabledProperty.value = true;
phet.tambo.soundManager.initialize( TRUE_PROPERTY, TRUE_PROPERTY, TRUE_PROPERTY, TRUE_PROPERTY, FALSE_PROPERTY );

// timestamp of the last update of paper program information
let lastUpdateTime = 0;

// {Map<number,Object>} - Event handlers from the paper programs, stored as strings.  These are evaluated when the
// programs are added, moved, or removed, see the usage below for details.
const mapOfProgramNumbersToEventHandlers = new Map();

// {Map<number,Object>} - Temporary data that can be set and used by the paper program code when they are in the
// detection window.  This data is generally set when a paper program comes into the field of view, used while it is
// there, and cleared when it goes out of the field of view.
const mapOfProgramNumbersToScratchpadObjects = new Map();

// {Map<number,Object>} - map of paper program numbers that are present in the detection window to their position points
const mapOfPaperProgramNumbersToPreviousPoints = new Map();

// A map of paper number to the papers that overlap with another paper in a given direction.
// { (paperNumber: number) : { top: number[], right: number[], bottom: number[], left: number[] } }
const whiskerStateMap = new Map();

// {Map<number,MarkerInfo>} - Map of numeric values that act as IDs to marker info objects.
const markerMap = new Map();
let nextMarkerId = 0;
const MAX_MARKER_ID = Number.MAX_SAFE_INTEGER;
const getIdForMarker = markerInfo => Array.from( markerMap.keys() ).find(
  id => _.isEqual( markerMap.get( id ), markerInfo )
);

// Reusable reference to an array containing all collected markers, accessed through sharedData
const allMarkers = [];

const mapOfPaperProgramNumbersToPreviousMarkers = new Map();

// {Object} - This object contains the data that is passed into the handlers for the paper programs and can be used to
// share information between them.  The data can be referenced and sometimes updated.
const sharedData = {
  model: boardModel,
  scene: scene,
  displaySize: DISPLAY_SIZE,
  allMarkers: allMarkers
};

// Returns true when both x and y of the provided points are equal within threshold.
const arePointsEqual = ( firstPoint, secondPoint, threshold ) => {
  return phet.dot.Utils.equalsEpsilon( firstPoint.x, secondPoint.x, threshold ) &&
         phet.dot.Utils.equalsEpsilon( firstPoint.y, secondPoint.y, threshold );
};

const getInterPointDistance = ( point1, point2 ) => {
  return Math.sqrt( Math.pow( point1.x - point2.x, 2 ) + Math.pow( point1.y - point2.y, 2 ) );
};

// Helper function to compare two sets of paper program position points. Points can differ within threshold and
// still be considered equal. Point values are normalized, so a threshold of 0.05 means "5% in both x and y".
const areAllPointsEqual = ( points1, points2, threshold ) => {
  return arePointsEqual( points1[ 0 ], points2[ 0 ], threshold ) &&
         arePointsEqual( points1[ 1 ], points2[ 1 ], threshold ) &&
         arePointsEqual( points1[ 2 ], points2[ 2 ], threshold ) &&
         arePointsEqual( points1[ 3 ], points2[ 3 ], threshold );
};

/**
 * Create an instance of WrappedAudioBuffer and return it, and start the process of decoding the audio file from the
 * provided path and load it into the buffer when complete.  Instances of WrappedAudioBuffer are often needed for
 * creating sounds using the tambo library.
 * TODO: Move this into a namespace like window.paperLand or window.phet.paperLand if retained.
 * @param {string} pathToAudioFile
 */
const createAndLoadWrappedAudioBuffer = pathToAudioFile => {
  const wrappedAudioBuffer = new phet.tambo.WrappedAudioBuffer();

  window.fetch( pathToAudioFile )
    .then( response => response.arrayBuffer() )
    .then( arrayBuffer => phet.tambo.phetAudioContext.decodeAudioData( arrayBuffer ) )
    .then( audioBuffer => {
      wrappedAudioBuffer.audioBufferProperty.value = audioBuffer;
    } );

  return wrappedAudioBuffer;
};

// This is here to prevent the IDE from marking the function as unused.  We need this, because the function is only
// used by the paper programs.
if ( !createAndLoadWrappedAudioBuffer ) {
  console.warn( 'createAndLoadWrappedAudioBuffer not defined' );
}

/**
 * Attempts to use eval on a program function with the provided arguments. If there is some error in the function,
 * that will be reported to the board console.
 * @param functionString - the function to run as a string for eval
 * @param {[*]} args - Array of args to pass to the function.
 * @param {string} functionName - name of the function, just for printing to the board console.
 */
const evalProgramFunction = ( functionString, args, functionName ) => {
  try {
    eval( functionString )( ...args );
  }
  catch( error ) {
    boardConsole.error( `Error while running ${functionName}`, error );
  }
};

// Update the sim design board based on changes to the paper programs.
const updateBoard = ( presentPaperProgramInfo, currentMarkersInfo ) => {

  const dataByProgramNumber = JSON.parse( localStorage.paperProgramsDataByProgramNumber || '{}' );

  // put all detected markers in the sharedData so that they are available for callbacks (keeping reference to
  // array provided to sharedData)
  allMarkers.length = 0;
  currentMarkersInfo.forEach( marker => allMarkers.push( marker ) );

  // Process the data associated with each of the paper programs that are currently present in the detection window.
  presentPaperProgramInfo.forEach( paperProgramInstanceInfo => {

    const paperProgramNumber = Number( paperProgramInstanceInfo.number );
    const previousPaperProgramPoints = mapOfPaperProgramNumbersToPreviousPoints.get( paperProgramNumber );
    const currentPaperProgramPoints = paperProgramInstanceInfo.points;
    let paperProgramHasMoved = previousPaperProgramPoints === undefined ||
                               !areAllPointsEqual( previousPaperProgramPoints, currentPaperProgramPoints, boardConfigObject.positionInterval );
    const programSpecificData = dataByProgramNumber[ paperProgramNumber ];

    // If this paper program contains data that is intended for use by the sim design board, and that data has changed
    // since the last time through this function, process the changes.
    if ( programSpecificData &&
         programSpecificData.paperPlaygroundData &&
         programSpecificData.paperPlaygroundData.updateTime > lastUpdateTime ) {

      lastUpdateTime = programSpecificData.paperPlaygroundData.updateTime;

      // If there are no handlers for this program, it means that it just appeared in the detection window.
      const paperProgramJustAppeared = !mapOfProgramNumbersToEventHandlers.has( paperProgramNumber );

      if ( !paperProgramJustAppeared ) {

        // Since the paper didn't just appear in the detection window, it indicates that its program probably changed.
        // Since pretty much anything could have changed about the program, we treat this as a removal and re-appearance
        // of the program.
        const eventHandlers = mapOfProgramNumbersToEventHandlers.get( paperProgramNumber );

        // first detach any whiskers for this program and others
        detachWhiskersForProgram( paperProgramNumber );

        // then trigger events for program removal
        if ( eventHandlers.onProgramRemoved ) {
          evalProgramFunction( eventHandlers.onProgramRemoved, [
            paperProgramNumber,
            mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
            sharedData
          ], 'onProgramRemoved' );
        }
      }

      // Extract the event handlers from the program, since they are either new or potentially changed.
      mapOfProgramNumbersToEventHandlers.set( paperProgramNumber, programSpecificData.paperPlaygroundData.eventHandlers || {} );

      // Set the scratchpad data to an empty object.
      mapOfProgramNumbersToScratchpadObjects.set( paperProgramNumber, {} );

      // Run this program's "added" handler, if present (and generally it should be).
      const eventHandlers = mapOfProgramNumbersToEventHandlers.get( paperProgramNumber );
      if ( eventHandlers.onProgramAdded ) {
        evalProgramFunction( eventHandlers.onProgramAdded, [
          paperProgramNumber,
          mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          sharedData
        ], 'onProgramAdded' );

        // DO NOT update adjacent papers here because the position change will be detected right after this
        // and it will be done there. If we do it here too, adjacent paper callbacks will be called twice

        // Make sure that the position change handler gets called.
        paperProgramHasMoved = true;
      }
    }

    // If the paper has moved and there is a move handler, call it.
    const eventHandlers = mapOfProgramNumbersToEventHandlers.get( paperProgramNumber );
    if ( paperProgramHasMoved && eventHandlers && eventHandlers.onProgramChangedPosition ) {
      evalProgramFunction( eventHandlers.onProgramChangedPosition, [
        paperProgramNumber,
        currentPaperProgramPoints,
        mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
        sharedData
      ], 'onProgramChangedPosition' );
    }
    if ( paperProgramHasMoved ) {
      updateWhiskerIntersections( paperProgramInstanceInfo, presentPaperProgramInfo );
    }

    // Update the paper program points for the next time through this loop. Only saved if there is sufficient
    // movement to trigger the next movement event.
    if ( paperProgramHasMoved ) {
      mapOfPaperProgramNumbersToPreviousPoints.set( paperProgramNumber, currentPaperProgramPoints );
    }

    // Handle any changing markers - addition/removal/or position change
    const currentMarkersForProgram = _.filter( currentMarkersInfo, marker => parseInt( marker.paperNumber, 10 ) === paperProgramNumber );
    const previousMarkersForProgram = mapOfPaperProgramNumbersToPreviousMarkers.get( paperProgramNumber ) || [];
    let markersMoved = false;

    if ( currentMarkersForProgram.length > previousMarkersForProgram.length ) {
      if ( eventHandlers && eventHandlers.onProgramMarkersAdded ) {
        evalProgramFunction( eventHandlers.onProgramMarkersAdded, [
          paperProgramNumber,
          currentPaperProgramPoints,
          mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          sharedData,
          currentMarkersForProgram
        ], 'onProgramMarkersAdded' );
      }

      // a marker was just added, we want to eagerly call the markers moved callback (if it exists)
      markersMoved = true;
    }
    else if ( currentMarkersForProgram.length < previousMarkersForProgram.length ) {
      if ( eventHandlers && eventHandlers.onProgramMarkersRemoved ) {
        evalProgramFunction( eventHandlers.onProgramMarkersRemoved, [
          paperProgramNumber,
          currentPaperProgramPoints,
          mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          sharedData,
          currentMarkersForProgram
        ], 'onProgramMarkersRemoved' );
      }

      // A marker was just removed, update the map ()
      mapOfPaperProgramNumbersToPreviousMarkers.set( paperProgramNumber, currentMarkersForProgram );
    }
    else if ( currentMarkersForProgram.length > 0 ) {

      // The number of markers stayed the same and there is at least one on the program - detect if it has moved since
      // the last update
      const currentPositions = currentMarkersForProgram.map( marker => marker.position );
      const previousPositions = previousMarkersForProgram.map( marker => marker.position );

      // The markers are not identifiable, and order in storage is not guaranteed. Sorting the before/after positions
      // with the same comparator should allow us to compare positions to detect a change. If the positions are
      // equal, sort should apply to both the same way.
      const sortX = position => position.x;
      const sortY = position => position.y;
      const sortedCurrent = _.sortBy( currentPositions, [ sortX, sortY ] );
      const sortedPrevious = _.sortBy( previousPositions, [ sortX, sortY ] );

      // Produces an array of booleans where `true` means the current position is different from the previous
      // position within the tolerance interval
      const zippedPointsDifferent = _.zipWith( sortedCurrent, sortedPrevious, ( a, b ) => {

        // graceful when arrays are different length
        return ( a && b ) ? !arePointsEqual( a, b, boardConfigObject.positionInterval ) : true;
      } );
      markersMoved = _.some( zippedPointsDifferent );
    }

    if ( markersMoved ) {

      // At least one marker moved! Use program callback and save markers for next comparison.
      if ( eventHandlers && eventHandlers.onProgramMarkersChangedPosition ) {
        evalProgramFunction( eventHandlers.onProgramMarkersChangedPosition, [
          paperProgramNumber,
          currentPaperProgramPoints,
          mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          sharedData,
          currentMarkersForProgram
        ], 'onProgramMarkersChangedPosition' );
      }
      mapOfPaperProgramNumbersToPreviousMarkers.set( paperProgramNumber, currentMarkersForProgram );
    }
  } );

  // Run removal handlers for any paper programs that have disappeared.
  const presentPaperProgramNumbers = presentPaperProgramInfo.map( info => Number( info.number ) );

  mapOfProgramNumbersToEventHandlers.forEach( ( eventHandlers, paperProgramNumber ) => {
    if ( !presentPaperProgramNumbers.includes( paperProgramNumber ) ) {

      // This paper program has disappeared.  Run its removal method and clear its data. Markers have
      // also been removed from this program.
      if ( eventHandlers && eventHandlers.onProgramMarkersRemoved ) {
        evalProgramFunction( eventHandlers.onProgramMarkersRemoved, [
          paperProgramNumber,
          mapOfPaperProgramNumbersToPreviousPoints.get( paperProgramNumber ),
          mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          sharedData,
          [] // empty markers - none since paper is being removed
        ], 'onProgramMarkersRemoved' );
      }
      mapOfPaperProgramNumbersToPreviousMarkers.delete( paperProgramNumber );

      // remove any whiskers on this program, and any whiskers connecting this program to others
      detachWhiskersForProgram( paperProgramNumber );

      if ( eventHandlers.onProgramRemoved ) {
        evalProgramFunction( eventHandlers.onProgramRemoved, [
          paperProgramNumber,
          mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          sharedData
        ], 'onProgramRemoved' );
      }
      mapOfProgramNumbersToEventHandlers.delete( paperProgramNumber );
      mapOfProgramNumbersToScratchpadObjects.delete( paperProgramNumber );
    }
  } );

  const markerMatchingInfo = getMarkerMatchingInfo( currentMarkersInfo );

  const addedMarkers = [];
  const removedMarkers = [];
  const changedMarkers = [];

  markerMatchingInfo.forEach( info => {

    // NOTE: If these are maps, it might be OK if the indices are undefined (map value will then be undefined)
    const currentMarker = currentMarkersInfo[ info.currentMarkerIndex ];
    const previousMarker = markerMap.get( info.previousMarkerId );

    if ( currentMarker && previousMarker ) {

      // It found that the same marker was detected before/after update -- look for changing positions
      const newPosition = currentMarkersInfo[ info.currentMarkerIndex ].position;
      const previousPosition = markerMap.get( info.previousMarkerId ).position;

      if ( !arePointsEqual( newPosition, previousPosition, boardConfigObject.positionInterval ) ) {

        // update the position of that marker
        changedMarkers.push( currentMarkersInfo[ info.currentMarkerIndex ] );

        // save the new state to the marker
        markerMap.get( info.previousMarkerId ).position = newPosition;
      }
    }
    else if ( currentMarker && !previousMarker ) {

      // a new marker was added
      addedMarkers.push( currentMarker );

      // Marker was added, add it to the state
      markerMap.set( nextMarkerId, currentMarker );

      // NOTE: If you run for a *really* long time, this could make it so markers get overwritten!
      nextMarkerId = ( nextMarkerId + 1 ) % MAX_MARKER_ID;
    }
    else if ( previousMarker && !currentMarker ) {
      removedMarkers.push( previousMarker );
      markerMap.delete( info.previousMarkerId );
    }
    else {
      console.error( 'How can we have a change in markers where there is no addition/removal or change in position?' );
    }
  } );

  removedMarkers.length > 0 && markersRemovedEmitter.emit( removedMarkers );
  addedMarkers.length > 0 && markersAddedEmitter.emit( addedMarkers );
  changedMarkers.length > 0 && markersChangedPositionEmitter.emit( changedMarkers );
};

/**
 * Helper function that compares the latest marker data to the previously stored information to determine which ones
 * match up.
 *
 * This was created and tested initially in late April 2023.  It could almost certainly be way more efficient than it
 * is - it was written more for clarity than optimal performance.  Feel free to improve as needed.
 *
 * @param {Object[]} currentMarkers - the most recent data represent marker colors, positions, etc.
 * @returns {{ currentMarkerIndex: Number|null, previousMarkerId: Number|null}[]}}
 */
const getMarkerMatchingInfo = currentMarkers => {

  const markerMatchingInfoArray = [];

  // For each of the markers currently detected by the camera, try to match them to the ones that we have been tracking.
  for ( let i = 0; i < currentMarkers.length; i++ ) {

    // convenience variable
    const currentMarker = currentMarkers[ i ];

    // Create an instance of an object that maps between current and previous markers.
    const markerMatchingInfo = { currentMarkerIndex: i, previousMarkerId: null };
    markerMatchingInfoArray.push( markerMatchingInfo );

    // Make a list of the previous markers whose color matches that of the current marker.
    let prevMarkersOfSameColor = Array.from( markerMap.values() ).filter(
      marker => marker.colorName === currentMarker.colorName
    );

    // Sort the list of same-color previous markers by proximity to the current marker.
    prevMarkersOfSameColor = prevMarkersOfSameColor.sort(
      ( marker1, marker2 ) => getInterPointDistance( currentMarker.position, marker1.position ) -
                              getInterPointDistance( currentMarker.position, marker2.position )
    );

    // Match the current marker to the closest previous marker to which NO OTHER CURRENT MARKER IS CLOSER.
    for ( let i = 0; i < prevMarkersOfSameColor.length; i++ ) {
      const prevMarkerOfSameColor = prevMarkersOfSameColor[ i ];
      const distance = getInterPointDistance( currentMarker.position, prevMarkerOfSameColor.position );
      const smallestDistanceToOtherCurrentMarkers = currentMarkers.reduce(
        ( smallestDistanceSoFar, marker ) => {
          if ( marker === currentMarker || marker.colorName !== currentMarker.colorName ) {

            // Skip current marker and ones that don't match the color.
            return smallestDistanceSoFar;
          }
          else {
            const distanceToPreviousMarker = getInterPointDistance(
              prevMarkerOfSameColor.position,
              marker.position
            );
            return distanceToPreviousMarker < smallestDistanceSoFar ? distanceToPreviousMarker : smallestDistanceSoFar;
          }
        },
        Number.POSITIVE_INFINITY
      );
      if ( distance < smallestDistanceToOtherCurrentMarkers ) {

        // We have a match!  Yay!
        markerMatchingInfo.previousMarkerId = getIdForMarker( prevMarkerOfSameColor );
        break;
      }
    }
  }

  // For each of the markers that had been previously identified, make sure it was matched to one of the currently
  // detected ones and, if not, add an entry to the matching info for it.
  for ( const [ key ] of markerMap ) {
    const previousMarkerMatched = !!markerMatchingInfoArray.find( match => match.previousMarkerId === key );
    if ( !previousMarkerMatched ) {

      // This previously tracked marker was not matched to a currently detected marker.  The mostly likely case for this
      // is when a marker is removed.  Add an entry to the match list that indicates this.
      markerMatchingInfoArray.push( {
        currentMarkerIndex: null,
        previousMarkerId: key
      } );
    }
  }

  return markerMatchingInfoArray;
};

/**
 * Create a set of "whiskers" for a paper. From the paper center, create a set of lines that extend in the
 * cardinal directions. These will be used to detect intersections with other papers.
 *
 * @param {number} paperNumber - number for this paper
 *
 * @return {{direction: string, line: kite.Line}[]}
 */
const getWhiskerKiteLines = paperNumber => {
  const whiskerPoints = localWhiskerMap.get( paperNumber );

  if ( whiskerPoints ) {

    // Convert to dot.Vector2 for use with Line
    const whiskerVectors = whiskerPoints.map( linePoints => {
      return {
        start: new phet.dot.Vector2( linePoints.start.x, linePoints.start.y ),
        end: new phet.dot.Vector2( linePoints.end.x, linePoints.end.y )
      };
    } );

    return [
      { direction: 'top', line: new phet.kite.Line( whiskerVectors[ 0 ].start, whiskerVectors[ 0 ].end ) },
      { direction: 'right', line: new phet.kite.Line( whiskerVectors[ 1 ].start, whiskerVectors[ 1 ].end ) },
      { direction: 'bottom', line: new phet.kite.Line( whiskerVectors[ 2 ].start, whiskerVectors[ 2 ].end ) },
      { direction: 'left', line: new phet.kite.Line( whiskerVectors[ 3 ].start, whiskerVectors[ 3 ].end ) }
    ];
  }
  else {

    // This paper has no whiskers in the map yet, so return an empty array.
    return [];
  }
};

/**
 * For a given paper, check for intersections of whiskers with another detected paper.
 * @param paperInfo - data about the current paper (from Jan's Paper API)
 * @param otherPaperInfo - data about the other paper
 */
const checkWhiskersForPaper = ( paperInfo, otherPaperInfo ) => {

  // local storage might bring this in as a string
  const paperNumber = parseInt( paperInfo.number, 10 );
  const currentWhiskerState = whiskerStateMap.get( paperNumber ) || {};

  // Create whisker lines - for new, new lines are created every request.
  const directedLines = getWhiskerKiteLines( paperNumber );
  const otherPaperShape = phet.kite.Shape.polygon( otherPaperInfo.points.map( point => phet.paperLand.utils.pointToVector2( point ) ) );

  // Look for intersections with the other paper
  directedLines.forEach( directedLine => {
    const line = directedLine.line;

    // Get the list of numbers that are currently intersecting at this direction.
    const intersectingNumbersAtDirection = currentWhiskerState[ directedLine.direction ] || [];

    const intersection = otherPaperShape.interiorIntersectsLineSegment( line.start, line.end );
    if ( intersection ) {
      const otherPaperNumber = parseInt( otherPaperInfo.number, 10 );

      // Only do something about the  intersection if it is new
      if ( !intersectingNumbersAtDirection.includes( otherPaperNumber ) ) {
        intersectingNumbersAtDirection.push( otherPaperNumber );
        const eventHandlers = mapOfProgramNumbersToEventHandlers.get( paperNumber );
        if ( eventHandlers && eventHandlers.onProgramAdjacent ) {
          evalProgramFunction( eventHandlers.onProgramAdjacent, [
            paperNumber,
            otherPaperNumber,
            directedLine.direction,
            mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
            sharedData
          ], 'onProgramAdjacent' );
        }
      }
    }
    else {

      // There is no intersection - if there was one previously, then it has been removed and we need to fire the event
      const otherPaperNumber = parseInt( otherPaperInfo.number, 10 );
      const index = intersectingNumbersAtDirection.indexOf( otherPaperNumber );
      if ( index >= 0 ) {
        intersectingNumbersAtDirection.splice( index, 1 );
        const eventHandlers = mapOfProgramNumbersToEventHandlers.get( paperNumber );
        if ( eventHandlers && eventHandlers.onProgramSeparated ) {
          evalProgramFunction( eventHandlers.onProgramSeparated, [
            paperNumber,
            otherPaperNumber,
            directedLine.direction,
            mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
            sharedData
          ], 'onProgramSeparated' );
        }
      }
    }

    // set the new state of for this direction
    currentWhiskerState[ directedLine.direction ] = intersectingNumbersAtDirection;
  } );

  // set the new state for this paper
  whiskerStateMap.set( paperNumber, currentWhiskerState );
};

/**
 * Update whisker relationships for a paper. This is called when the paper is moved or added.
 * @param paperProgramInfo
 * @param currentPaperProgramsInfo
 */
const updateWhiskerIntersections = ( paperProgramInfo, currentPaperProgramsInfo ) => {
  currentPaperProgramsInfo.forEach( otherProgramInfo => {
    if ( otherProgramInfo.number !== paperProgramInfo.number ) {

      // check whiskers of this paper against the other paper
      checkWhiskersForPaper( paperProgramInfo, otherProgramInfo );

      // check whiskers of the other paper against this paper
      checkWhiskersForPaper( otherProgramInfo, paperProgramInfo );
    }
  } );
};

const detachWhiskersForProgram = paperNumber => {

  // Detach all programs that are attached to whiskers on this program
  const whiskersOnThisProgram = whiskerStateMap.get( paperNumber ) || {};
  if ( whiskersOnThisProgram ) {
    const whiskerDirections = Object.keys( whiskersOnThisProgram );
    whiskerDirections.forEach( whiskerDirection => {
      const attachedPapers = whiskersOnThisProgram[ whiskerDirection ] || [];
      attachedPapers.forEach( attachedPaperNumber => {
        const listenersForThisPaper = mapOfProgramNumbersToEventHandlers.get( paperNumber );
        if ( listenersForThisPaper && listenersForThisPaper.onProgramSeparated ) {
          evalProgramFunction( listenersForThisPaper.onProgramSeparated, [
            paperNumber,
            attachedPaperNumber,
            whiskerDirection,
            mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
            sharedData
          ], 'onProgramSeparated' );
        }
      } );

      // Clear the list of attached papers for this direction
      whiskersOnThisProgram[ whiskerDirection ] = [];
    } );
  }

  // loop through all other programs and detach this program from their whiskers
  whiskerStateMap.forEach( ( attachedPrograms, otherPaperNumber ) => {
    const whiskerDirections = Object.keys( attachedPrograms );
    whiskerDirections.forEach( whiskerDirection => {

      // the programs that were attached
      const attachedProgramsAtDirection = attachedPrograms[ whiskerDirection ] || [];

      attachedProgramsAtDirection.forEach( attachedProgramNumber => {

        if ( attachedProgramNumber === paperNumber ) {

          // Get the listeners on the paper number watching detachment for the removed program
          const listenersForAttachedProgram = mapOfProgramNumbersToEventHandlers.get( paperNumber );
          if ( listenersForAttachedProgram && listenersForAttachedProgram.onProgramSeparated ) {
            evalProgramFunction( listenersForAttachedProgram.onProgramSeparated, [
              otherPaperNumber,
              attachedProgramNumber,
              whiskerDirection,
              mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
              sharedData
            ], 'onProgramSeparated' );
          }
        }
      } );

      // Remove this program from the list of attached programs for this direction
      attachedProgramsAtDirection.splice( attachedProgramsAtDirection.indexOf( paperNumber ), 1 );
    } );
  } );
};

// Handle changes to local storage.  This is how paper programs communicate with the sim design board.
// Note: Through experimentation, we (PhET devs) found that this is called every second even if nothing changes as long
// as there is at least one paper program in the detection window.
let paperProgramsInfo = [];
let currentMarkersInfo = [];
addEventListener( 'storage', () => {
  const currentPaperProgramsInfo = JSON.parse( localStorage.paperProgramsProgramsToRender );

  // Log information about changes to the available data.
  const currentProgramNumbers = currentPaperProgramsInfo.map( entry => Number( entry.number ) );
  const previousProgramNumbers = paperProgramsInfo.map( entry => Number( entry.number ) );
  currentProgramNumbers.forEach( currentProgramNumber => {
    if ( !previousProgramNumbers.includes( currentProgramNumber ) ) {
      boardConsole.log( `New program detected: ${currentProgramNumber}` );
    }
  } );
  previousProgramNumbers.forEach( previousProgramNumber => {
    if ( !currentProgramNumbers.includes( previousProgramNumber ) ) {
      boardConsole.log( `Program disappeared: ${previousProgramNumber}` );
    }
  } );

  // Update our local copy of the paper programs information.
  paperProgramsInfo = currentPaperProgramsInfo;

  // get all info about detected markers
  currentMarkersInfo = JSON.parse( localStorage.paperProgramsMarkers );

  // update state of all whiskers from camera detection
  const whiskerData = PaperWhiskerManager.loadWhiskerDataFromLocalStorage();

  // clear the whisker state map and copy the storage data into it
  whiskerData.forEach( ( whiskerState, paperNumber ) => {

    // Ensure that the paper number is a number, it might have been converted to string in local storage
    localWhiskerMap.set( parseInt( paperNumber, 10 ), whiskerState );
  } );

  // Update the sim design board.
  updateBoard( currentPaperProgramsInfo, currentMarkersInfo );
} );