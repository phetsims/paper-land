/**
 * Controls the state of the board, adding a listener to local storage to update it when programs, markers,
 * or other Paper Playground data is changed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import clientConstants from '../clientConstants.js';
import PaperWhiskerManager from '../common/PaperWhiskerManager.js';
import boardConsole from './boardConsole.js';
import boardModel from './boardModel.js';
import { markersAddedEmitter, markersChangedPositionEmitter, markersRemovedEmitter } from './markerEmitters.js';

// constants
const MAX_MARKER_ID = Number.MAX_SAFE_INTEGER;

// The object in localStorage on page load
const storedBoardConfig = JSON.parse( localStorage.boardConfig || '{}' );

// Defaults for the board configuration, if values are not saved to local storage
const defaultBoardConfig = {
  positionInterval: 0,
  removalDelay: 0
};

export default class LocalStorageBoardController {
  constructor( scene ) {

    // The current paper programs and markers in local storage, with information needed to interact with them.
    this.paperProgramsInfo = [];
    this.currentMarkersInfo = [];

    // Maps paper programs to the markers that were detected on them in the last update. Used to observe changes
    // to markers on programs, and necessary because markers are not uniquely identifiable in Paper Playground.
    this.mapOfPaperProgramNumbersToPreviousMarkers = new Map();

    // Timestamp of the last update of paper program information
    this.lastUpdateTime = 0;

    // Reusable reference to an array containing all collected markers, accessed through sharedData
    this.allMarkers = [];

    // {Map<number,Object>} - map of paper program numbers that are present in the detection window to their position points
    this.mapOfPaperProgramNumbersToPreviousPoints = new Map();

    // {Map<number,axon.TimerListener>} - map of paper program numbers to the timeout that will trigger the removal of
    // the program - if the program is added back before the timeout, the removal and timeout is cancelled.
    this.mapOfProgramNumbersToRemovalTimeouts = new Map();

    // {Map<number,MarkerInfo>} - Map of numeric values that act as IDs to marker info objects.
    this.markerMap = new Map();

    // The position and length information from localStorage, but parsed and ready for use in this app.
    this.localWhiskerMap = new Map();

    // A map of paper number to the papers that overlap with another paper in a given direction.
    // { (paperNumber: number) : { top: number[], right: number[], bottom: number[], left: number[] } }
    this.whiskerStateMap = new Map();

    // {Map<number,Object>} - Event handlers from the paper programs, stored as strings.  These are evaluated when the
    // programs are added, moved, or removed, see the usage below for details.
    this.mapOfProgramNumbersToEventHandlers = new Map();

    // {Map<number,Object>} - Temporary data that can be set and used by the paper program code when they are in the
    // detection window.  This data is generally set when a paper program comes into the field of view, used while it is
    // there, and cleared when it goes out of the field of view.
    this.mapOfProgramNumbersToScratchpadObjects = new Map();

    // The next available ID that will be used to uniquely identify a marker.
    this.nextMarkerId = 0;

    // The root level Node of the scene graph for the board page.
    this.scene = scene;

    // Combined config with localStorage overriding defaults. This will change during runtime as new values
    // are set.
    this.boardConfigObject = {
      ...defaultBoardConfig,
      ...storedBoardConfig
    };

    // Populate with defaults.
    localStorage.boardConfig = JSON.stringify( this.boardConfigObject );

    // {Object} - This object contains the data that is passed into the handlers for the paper programs and can be used to
    // share information between them.  The data can be referenced and sometimes updated.
    this.sharedData = {
      model: boardModel,
      scene: scene,
      get displaySize() {
        return phet.paperLand.displaySizeProperty.value;
      },
      allMarkers: this.allMarkers
    };

    // Update the model when changes are made to local storage (how paper playground communicates the state
    // of programs/markers to other pages).
    this.boundHandleStorageEvent = this.handleStorageEvent.bind( this );
    window.addEventListener( 'storage', this.boundHandleStorageEvent );
  }

  /**
   * Detach window listeners that will update the board model from events.
   */
  dispose() {
    window.removeEventListener( 'storage', this.boundHandleStorageEvent );
  }

  /**
   * The amount of movement required for a program to be considered "moved" and trigger events
   * related to changing positions. Value is normalized, so a value of 0.2 means it has to move
   * 20% of the screen in either X or Y dimensions.
   */
  updatePositionInterval( newValue ) {
    this.saveValueToBoardConfig( 'positionInterval', newValue );
  }

  /**
   * Update the amount of time that a program must be missing from the detection window before it is considered
   * removed. Value is in seconds.
   */
  updateRemovalDelay( newValue ) {
    this.saveValueToBoardConfig( 'removalDelay', newValue );
  }

  /**
   * Sets the new value to the runtime config object and local storage for next page load.
   */
  saveValueToBoardConfig( nameString, value ) {
    this.boardConfigObject[ nameString ] = value;
    localStorage.boardConfig = JSON.stringify( this.boardConfigObject );
  }

  /**
   * Returns an ID for the provided marker.
   */
  getIdForMarker( markerInfo ) {
    return Array.from( this.markerMap.keys() ).find(
      id => _.isEqual( this.markerMap.get( id ), markerInfo )
    );
  }

  /**
   * Helper function to compare two paper program position points. Returns true when x and y of
   * the provided points are equal within the threshold.
   */
  arePointsEqual( firstPoint, secondPoint, threshold ) {
    return phet.dot.Utils.equalsEpsilon( firstPoint.x, secondPoint.x, threshold ) &&
           phet.dot.Utils.equalsEpsilon( firstPoint.y, secondPoint.y, threshold );
  }

  /**
   * Helper function to compare two sets of paper program position points. Points can differ within threshold and
   * still be considered equal. Point values are normalized, so a threshold of 0.05 means "5% in both x and y".
   */
  areAllPointsEqual( points1, points2, threshold ) {
    return this.arePointsEqual( points1[ 0 ], points2[ 0 ], threshold ) &&
           this.arePointsEqual( points1[ 1 ], points2[ 1 ], threshold ) &&
           this.arePointsEqual( points1[ 2 ], points2[ 2 ], threshold ) &&
           this.arePointsEqual( points1[ 3 ], points2[ 3 ], threshold );
  }

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
  getMarkerMatchingInfo( currentMarkers ) {

    const markerMatchingInfoArray = [];

    // For each of the markers currently detected by the camera, try to match them to the ones that we have been tracking.
    for ( let i = 0; i < currentMarkers.length; i++ ) {

      // convenience variable
      const currentMarker = currentMarkers[ i ];

      // Create an instance of an object that maps between current and previous markers.
      const markerMatchingInfo = { currentMarkerIndex: i, previousMarkerId: null };
      markerMatchingInfoArray.push( markerMatchingInfo );

      // Make a list of the previous markers whose color matches that of the current marker.
      let prevMarkersOfSameColor = Array.from( this.markerMap.values() ).filter(
        marker => marker.colorName === currentMarker.colorName
      );

      // Sort the list of same-color previous markers by proximity to the current marker.
      prevMarkersOfSameColor = prevMarkersOfSameColor.sort(
        ( marker1, marker2 ) => LocalStorageBoardController.getInterPointDistance( currentMarker.position, marker1.position ) -
                                LocalStorageBoardController.getInterPointDistance( currentMarker.position, marker2.position )
      );

      // Match the current marker to the closest previous marker to which NO OTHER CURRENT MARKER IS CLOSER.
      for ( let i = 0; i < prevMarkersOfSameColor.length; i++ ) {
        const prevMarkerOfSameColor = prevMarkersOfSameColor[ i ];
        const distance = LocalStorageBoardController.getInterPointDistance( currentMarker.position, prevMarkerOfSameColor.position );
        const smallestDistanceToOtherCurrentMarkers = currentMarkers.reduce(
          ( smallestDistanceSoFar, marker ) => {
            if ( marker === currentMarker || marker.colorName !== currentMarker.colorName ) {

              // Skip current marker and ones that don't match the color.
              return smallestDistanceSoFar;
            }
            else {
              const distanceToPreviousMarker = LocalStorageBoardController.getInterPointDistance(
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
          markerMatchingInfo.previousMarkerId = this.getIdForMarker( prevMarkerOfSameColor );
          break;
        }
      }
    }

    // For each of the markers that had been previously identified, make sure it was matched to one of the currently
    // detected ones and, if not, add an entry to the matching info for it.
    for ( const [ key ] of this.markerMap ) {
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
  }

  /**
   * For a given paper, check for intersections of whiskers with another detected paper.
   * @param paperInfo - data about the current paper (from Jan's Paper API)
   * @param otherPaperInfo - data about the other paper
   */
  checkWhiskersForPaper( paperInfo, otherPaperInfo ) {

    // local storage might bring this in as a string
    const paperNumber = parseInt( paperInfo.number, 10 );
    const currentWhiskerState = this.whiskerStateMap.get( paperNumber ) || {};

    // Create whisker lines - for new, new lines are created every request.
    const directedLines = this.getWhiskerKiteLines( paperNumber );
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
          const eventHandlers = this.mapOfProgramNumbersToEventHandlers.get( paperNumber );
          if ( eventHandlers && eventHandlers.onProgramAdjacent ) {
            LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramAdjacent, [
              paperNumber,
              otherPaperNumber,
              directedLine.direction,
              this.mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
              this.sharedData
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
          const eventHandlers = this.mapOfProgramNumbersToEventHandlers.get( paperNumber );
          if ( eventHandlers && eventHandlers.onProgramSeparated ) {
            LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramSeparated, [
              paperNumber,
              otherPaperNumber,
              directedLine.direction,
              this.mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
              this.sharedData
            ], 'onProgramSeparated' );
          }
        }
      }

      // set the new state of for this direction
      currentWhiskerState[ directedLine.direction ] = intersectingNumbersAtDirection;
    } );

    // set the new state for this paper
    this.whiskerStateMap.set( paperNumber, currentWhiskerState );
  }

  /**
   * Create a set of "whiskers" for a paper. From the paper center, create a set of lines that extend in the
   * cardinal directions. These will be used to detect intersections with other papers.
   *
   * @param {number} paperNumber - number for this paper
   *
   * @return {{direction: string, line: kite.Line}[]}
   */
  getWhiskerKiteLines( paperNumber ) {
    const whiskerPoints = this.localWhiskerMap.get( paperNumber );

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
  }

  /**
   * Update whisker relationships for a paper. This is called when the paper is moved or added.
   * @param paperProgramInfo
   * @param currentPaperProgramsInfo
   */
  updateWhiskerIntersections( paperProgramInfo, currentPaperProgramsInfo ) {
    currentPaperProgramsInfo.forEach( otherProgramInfo => {
      if ( otherProgramInfo.number !== paperProgramInfo.number ) {

        // check whiskers of this paper against the other paper
        this.checkWhiskersForPaper( paperProgramInfo, otherProgramInfo );

        // check whiskers of the other paper against this paper
        this.checkWhiskersForPaper( otherProgramInfo, paperProgramInfo );
      }
    } );
  }

  /**
   * Detaches all whisker connections for a program.
   */
  detachWhiskersForProgram( paperNumber ) {

    // Detach all programs that are attached to whiskers on this program
    const whiskersOnThisProgram = this.whiskerStateMap.get( paperNumber ) || {};
    if ( whiskersOnThisProgram ) {
      const whiskerDirections = Object.keys( whiskersOnThisProgram );
      whiskerDirections.forEach( whiskerDirection => {
        const attachedPapers = whiskersOnThisProgram[ whiskerDirection ] || [];
        attachedPapers.forEach( attachedPaperNumber => {
          const listenersForThisPaper = this.mapOfProgramNumbersToEventHandlers.get( paperNumber );
          if ( listenersForThisPaper && listenersForThisPaper.onProgramSeparated ) {
            LocalStorageBoardController.evalProgramFunction( listenersForThisPaper.onProgramSeparated, [
              paperNumber,
              attachedPaperNumber,
              whiskerDirection,
              this.mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
              this.sharedData
            ], 'onProgramSeparated' );
          }
        } );

        // Clear the list of attached papers for this direction
        whiskersOnThisProgram[ whiskerDirection ] = [];
      } );
    }

    // loop through all other programs and detach this program from their whiskers
    this.whiskerStateMap.forEach( ( attachedPrograms, otherPaperNumber ) => {
      const whiskerDirections = Object.keys( attachedPrograms );
      whiskerDirections.forEach( whiskerDirection => {

        // the programs that were attached
        const attachedProgramsAtDirection = attachedPrograms[ whiskerDirection ] || [];

        attachedProgramsAtDirection.forEach( attachedProgramNumber => {

          if ( attachedProgramNumber === paperNumber ) {

            // Get the listeners on the paper number watching detachment for the removed program
            const listenersForAttachedProgram = this.mapOfProgramNumbersToEventHandlers.get( paperNumber );
            if ( listenersForAttachedProgram && listenersForAttachedProgram.onProgramSeparated ) {
              LocalStorageBoardController.evalProgramFunction( listenersForAttachedProgram.onProgramSeparated, [
                otherPaperNumber,
                attachedProgramNumber,
                whiskerDirection,
                this.mapOfProgramNumbersToScratchpadObjects.get( paperNumber ),
                this.sharedData
              ], 'onProgramSeparated' );
            }
          }
        } );

        // Remove this program from the list of attached programs for this direction
        attachedProgramsAtDirection.splice( attachedProgramsAtDirection.indexOf( paperNumber ), 1 );
      } );
    } );
  }

  /**
   * Updates the board with the latest paper program and marker information.
   *
   * @param presentPaperProgramInfo - Information about the current programs that are detected (in local storage)
   * @param currentMarkersInfo - Information about the current markers that are detected (in local storage)
   */
  updateBoard( presentPaperProgramInfo, currentMarkersInfo ) {

    const dataByProgramNumber = JSON.parse( localStorage.paperProgramsDataByProgramNumber || '{}' );

    // put all detected markers in the sharedData so that they are available for callbacks (keeping reference to
    // array provided to sharedData)
    this.allMarkers.length = 0;
    this.currentMarkersInfo.forEach( marker => this.allMarkers.push( marker ) );

    // Process the data associated with each of the paper programs that are currently present in the detection window.
    presentPaperProgramInfo.forEach( paperProgramInstanceInfo => {

      const paperProgramNumber = Number( paperProgramInstanceInfo.number );
      const previousPaperProgramPoints = this.mapOfPaperProgramNumbersToPreviousPoints.get( paperProgramNumber );
      const currentPaperProgramPoints = paperProgramInstanceInfo.points;
      let paperProgramHasMoved = previousPaperProgramPoints === undefined ||
                                 !this.areAllPointsEqual( previousPaperProgramPoints, currentPaperProgramPoints, this.boardConfigObject.positionInterval );
      const programSpecificData = dataByProgramNumber[ paperProgramNumber ];

      // If this paper program contains data that is intended for use by the sim design board, and that data has changed
      // since the last time through this function, process the changes.
      if ( programSpecificData &&
           programSpecificData.paperPlaygroundData &&
           programSpecificData.paperPlaygroundData.updateTime > this.lastUpdateTime ) {

        this.lastUpdateTime = programSpecificData.paperPlaygroundData.updateTime;

        // If there are no handlers for this program, it means that it just appeared in the detection window.
        const paperProgramJustAppeared = !this.mapOfProgramNumbersToEventHandlers.has( paperProgramNumber );

        // If the paper program is in the removal map, detection was just lost - do not want to call removal/addition
        // callbacks if we are in this case.
        const inRemovalMap = this.mapOfProgramNumbersToRemovalTimeouts.has( paperProgramNumber );

        if ( !inRemovalMap ) {
          if ( !paperProgramJustAppeared ) {

            // Since the paper didn't just appear in the detection window, it indicates that its program probably changed.
            // Since pretty much anything could have changed about the program, we treat this as a removal and re-appearance
            // of the program.
            // NOTE: There is no delay in this case, we assume program attribute change should be reflected right away.
            const eventHandlers = this.mapOfProgramNumbersToEventHandlers.get( paperProgramNumber );

            // first detach any whiskers for this program and others
            this.detachWhiskersForProgram( paperProgramNumber );

            // then trigger events for program removal
            if ( eventHandlers.onProgramRemoved ) {
              LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramRemoved, [
                paperProgramNumber,
                this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
                this.sharedData
              ], 'onProgramRemoved' );
            }
          }

          // Extract the event handlers from the program, since they are either new or potentially changed.
          this.mapOfProgramNumbersToEventHandlers.set( paperProgramNumber, programSpecificData.paperPlaygroundData.eventHandlers || {} );

          // Set the scratchpad data to an empty object.
          this.mapOfProgramNumbersToScratchpadObjects.set( paperProgramNumber, {} );

          // Run this program's "added" handler, if present (and generally it should be).
          const eventHandlers = this.mapOfProgramNumbersToEventHandlers.get( paperProgramNumber );
          if ( eventHandlers.onProgramAdded ) {
            LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramAdded, [
              paperProgramNumber,
              this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
              this.sharedData
            ], 'onProgramAdded' );

            // DO NOT update adjacent papers here because the position change will be detected right after this
            // and it will be done there. If we do it here too, adjacent paper callbacks will be called twice

            // Make sure that the position change handler gets called.
            paperProgramHasMoved = true;
          }
        }
        else {

          // The program was just detected, but it was in the removal map because detection was just momentarily lost.
          // Clear the timeout and remove it from the map now that it has been re-detected.
          phet.axon.stepTimer.clearTimeout( this.mapOfProgramNumbersToRemovalTimeouts.get( paperProgramNumber ) );
          this.mapOfProgramNumbersToRemovalTimeouts.delete( paperProgramNumber );
        }
      }

      // If the paper has moved and there is a move handler, call it.
      const eventHandlers = this.mapOfProgramNumbersToEventHandlers.get( paperProgramNumber );
      if ( paperProgramHasMoved && eventHandlers && eventHandlers.onProgramChangedPosition ) {
        LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramChangedPosition, [
          paperProgramNumber,
          currentPaperProgramPoints,
          this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
          this.sharedData
        ], 'onProgramChangedPosition' );
      }
      if ( paperProgramHasMoved ) {
        this.updateWhiskerIntersections( paperProgramInstanceInfo, presentPaperProgramInfo );
      }

      // Update the paper program points for the next time through this loop. Only saved if there is sufficient
      // movement to trigger the next movement event.
      if ( paperProgramHasMoved ) {
        this.mapOfPaperProgramNumbersToPreviousPoints.set( paperProgramNumber, currentPaperProgramPoints );
      }

      // Handle any changing markers - addition/removal/or position change
      const currentMarkersForProgram = _.filter( currentMarkersInfo, marker => parseInt( marker.paperNumber, 10 ) === paperProgramNumber );
      const previousMarkersForProgram = this.mapOfPaperProgramNumbersToPreviousMarkers.get( paperProgramNumber ) || [];
      let markersMoved = false;

      if ( currentMarkersForProgram.length > previousMarkersForProgram.length ) {
        if ( eventHandlers && eventHandlers.onProgramMarkersAdded ) {
          LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramMarkersAdded, [
            paperProgramNumber,
            currentPaperProgramPoints,
            this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
            this.sharedData,
            currentMarkersForProgram
          ], 'onProgramMarkersAdded' );
        }

        // a marker was just added, we want to eagerly call the markers moved callback (if it exists)
        markersMoved = true;
      }
      else if ( currentMarkersForProgram.length < previousMarkersForProgram.length ) {
        if ( eventHandlers && eventHandlers.onProgramMarkersRemoved ) {
          LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramMarkersRemoved, [
            paperProgramNumber,
            currentPaperProgramPoints,
            this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
            this.sharedData,
            currentMarkersForProgram
          ], 'onProgramMarkersRemoved' );
        }

        // A marker was just removed, update the map ()
        this.mapOfPaperProgramNumbersToPreviousMarkers.set( paperProgramNumber, currentMarkersForProgram );
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
          return ( a && b ) ? !this.arePointsEqual( a, b, this.boardConfigObject.positionInterval ) : true;
        } );
        markersMoved = _.some( zippedPointsDifferent );
      }

      if ( markersMoved ) {

        // At least one marker moved! Use program callback and save markers for next comparison.
        if ( eventHandlers && eventHandlers.onProgramMarkersChangedPosition ) {
          LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramMarkersChangedPosition, [
            paperProgramNumber,
            currentPaperProgramPoints,
            this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
            this.sharedData,
            currentMarkersForProgram
          ], 'onProgramMarkersChangedPosition' );
        }
        this.mapOfPaperProgramNumbersToPreviousMarkers.set( paperProgramNumber, currentMarkersForProgram );
      }
    } );

    // Run removal handlers for any paper programs that have disappeared.
    const presentPaperProgramNumbers = presentPaperProgramInfo.map( info => Number( info.number ) );

    this.mapOfProgramNumbersToEventHandlers.forEach( ( eventHandlers, paperProgramNumber ) => {
      if ( !presentPaperProgramNumbers.includes( paperProgramNumber ) ) {

        // This paper program has disappeared. Queue it up for removal. If it is still gone after the removal delay,
        // we run the removal handler and remove it from the state. Marker removal is also done first.
        //
        // NOTE: The program is removed from mapOfProgramNumbersToEventHandlers when the timeout occurs. It is
        // possible that we call updateBoard before the timeout completes. In that case, the program number will STILL
        // be in mapOfProgramNumbersToEventHandlers even though we already have a removal queued up. So we simply
        // let the original timeout complete without adding another removal timeout.
        const alreadyHasRemovalTimeout = this.mapOfProgramNumbersToRemovalTimeouts.has( paperProgramNumber );
        if ( !alreadyHasRemovalTimeout ) {
          this.mapOfProgramNumbersToRemovalTimeouts.set( paperProgramNumber, phet.axon.stepTimer.setTimeout( () => {

            // First call any marker removal handlers before removing this program
            if ( eventHandlers && eventHandlers.onProgramMarkersRemoved ) {
              LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramMarkersRemoved, [
                paperProgramNumber,
                this.mapOfPaperProgramNumbersToPreviousPoints.get( paperProgramNumber ),
                this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
                this.sharedData,
                [] // empty markers - none since paper is being removed
              ], 'onProgramMarkersRemoved' );
            }
            this.mapOfPaperProgramNumbersToPreviousMarkers.delete( paperProgramNumber );

            // remove any whiskers on this program, and any whiskers connecting this program to others
            this.detachWhiskersForProgram( paperProgramNumber );

            // Finally call the program removal handler
            if ( eventHandlers.onProgramRemoved ) {
              LocalStorageBoardController.evalProgramFunction( eventHandlers.onProgramRemoved, [
                paperProgramNumber,
                this.mapOfProgramNumbersToScratchpadObjects.get( paperProgramNumber ),
                this.sharedData
              ], 'onProgramRemoved' );
            }

            // cleanup state maps
            this.mapOfProgramNumbersToEventHandlers.delete( paperProgramNumber );
            this.mapOfProgramNumbersToScratchpadObjects.delete( paperProgramNumber );

            // clear the timeout from the map now that it has ocurred
            this.mapOfProgramNumbersToRemovalTimeouts.delete( paperProgramNumber );
          }, this.boardConfigObject.removalDelay * 1000 ) ); // Convert to milliseconds
        }
      }
    } );

    const markerMatchingInfo = this.getMarkerMatchingInfo( currentMarkersInfo );

    const addedMarkers = [];
    const removedMarkers = [];
    const changedMarkers = [];

    markerMatchingInfo.forEach( info => {

      // NOTE: If these are maps, it might be OK if the indices are undefined (map value will then be undefined)
      const currentMarker = currentMarkersInfo[ info.currentMarkerIndex ];
      const previousMarker = this.markerMap.get( info.previousMarkerId );

      if ( currentMarker && previousMarker ) {

        // It found that the same marker was detected before/after update -- look for changing positions
        const newPosition = currentMarkersInfo[ info.currentMarkerIndex ].position;
        const previousPosition = this.markerMap.get( info.previousMarkerId ).position;

        if ( !this.arePointsEqual( newPosition, previousPosition, this.boardConfigObject.positionInterval ) ) {

          // update the position of that marker
          changedMarkers.push( currentMarkersInfo[ info.currentMarkerIndex ] );

          // save the new state to the marker
          this.markerMap.get( info.previousMarkerId ).position = newPosition;
        }
      }
      else if ( currentMarker && !previousMarker ) {

        // a new marker was added
        addedMarkers.push( currentMarker );

        // Marker was added, add it to the state
        this.markerMap.set( this.nextMarkerId, currentMarker );

        // NOTE: If you run for a *really* long time, this could make it so markers get overwritten!
        this.nextMarkerId = ( this.nextMarkerId + 1 ) % MAX_MARKER_ID;
      }
      else if ( previousMarker && !currentMarker ) {
        removedMarkers.push( previousMarker );
        this.markerMap.delete( info.previousMarkerId );
      }
      else {
        console.error( 'How can we have a change in markers where there is no addition/removal or change in position?' );
      }
    } );

    removedMarkers.length > 0 && markersRemovedEmitter.emit( removedMarkers );
    addedMarkers.length > 0 && markersAddedEmitter.emit( addedMarkers );
    changedMarkers.length > 0 && markersChangedPositionEmitter.emit( changedMarkers );
  }

  /**
   * Handles the local storage event, which is triggered when there are paper events from paper playground. This
   * includes programs added, removed, markers added, removed, and whisker connections occurring, and possibly
   * others.
   */
  handleStorageEvent( event ) {
    const currentPaperProgramsInfo = JSON.parse( localStorage.paperProgramsProgramsToRender );

    // Log information about changes to the available data.
    const currentProgramNumbers = currentPaperProgramsInfo.map( entry => Number( entry.number ) );
    const previousProgramNumbers = this.paperProgramsInfo.map( entry => Number( entry.number ) );
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
    this.paperProgramsInfo = currentPaperProgramsInfo;

    // get all info about detected markers
    this.currentMarkersInfo = JSON.parse( localStorage.paperProgramsMarkers );

    // update state of all whiskers from camera detection
    const whiskerData = PaperWhiskerManager.loadWhiskerDataFromLocalStorage();

    // clear the whisker state map and copy the storage data into it
    whiskerData.forEach( ( whiskerState, paperNumber ) => {

      // Ensure that the paper number is a number, it might have been converted to string in local storage
      this.localWhiskerMap.set( parseInt( paperNumber, 10 ), whiskerState );
    } );

    // Update the sim design board.
    this.updateBoard( currentPaperProgramsInfo, this.currentMarkersInfo );
  }

  /**
   * Attempts to use eval on a program function with the provided arguments. If there is some error in the function,
   * that will be reported to the board console.
   * @param functionString - the function to run as a string for eval
   * @param {[*]} args - Array of args to pass to the function.
   * @param {string} functionName - name of the function, just for printing to the board console.
   */
  static evalProgramFunction( functionString, args, functionName ) {
    try {
      eval( functionString )( ...args );
    }
    catch( error ) {
      boardConsole.error( `Error while running ${functionName}`, error );
    }
  }

  /**
   * Get the distance between two points.
   */
  static getInterPointDistance( point1, point2 ) {
    return Math.sqrt( Math.pow( point1.x - point2.x, 2 ) + Math.pow( point1.y - point2.y, 2 ) );
  }
}