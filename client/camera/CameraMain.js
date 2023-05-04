import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MonacoEditor from 'react-monaco-editor';
import xhr from 'xhr';
import clientConstants from '../clientConstants.js';
import SaveAlert from '../common/SaveAlert.js';
import { codeToName, getApiUrl, programMatchesFilterString } from '../utils';
import styles from './CameraMain.css';
import CameraSelector from './CameraSelector.js';
import CameraVideo from './CameraVideo.js';
import ColorListItem from './ColorListItem.js';
import CreateProgramsDialog from './CreateProgramsDialog.js';
import helloWorld from './helloWorld';
import { printCalibrationPage, printPage } from './printPdf';

// constants
const SPACE_DATA_POLLING_PERIOD = 1; // in seconds
const CAMERA_DATA_POLLING_PERIOD = 2; // in seconds
const PROGRAM_DELETE_WARNING = 'This will remove the program for all users of the database.\nAre you sure you want to delete this program?';
const OPEN_SIDEBAR_WIDTH = parseInt( styles.cameraMainSidebarWidth, 10 );

// Produces a unique ID for each debug marker component, important for React to
// render a list of components.
let markerCount = 0;

export default class CameraMain extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      pageWidth: 1,
      framerate: 0,
      selectedColorIndex: -1,
      spaceData: { programs: [] },
      isEditingSpaceUrl: false,
      selectedSpaceName: props.config.selectedSpaceName,
      availableSpaces: [],
      isAddingNewSpace: false,
      newSpaceName: '',
      debugPrograms: [],
      debugMarkers: [],
      programListFilterString: '',
      copyProgramListFilterString: '',
      showCreateProgramDialog: false,
      sidebarOpen: true,
      showSaveModal: false,
      saveSuccess: false,

      // {InputDeviceInfo[]} - a list of the cameras that are available on the current system
      availableCameras: [],

      // {string} - the deviceId of the currently selected camera
      selectedCameraDeviceId: '',

      // {Object|null} - The program currently selected and being displayed in the editor, null for none.
      programInEditor: null,

      // {string|null} - The program code currently being edited.  When a program is first selected, this is set to
      // the current value of that program's code.  It diverges from that code as the user makes edits.
      codeInEditor: null
    };

    // @private {Object|null} - local reference to the editor, initialized when the editor component mounts
    this._editor = null;

    // @private {number} - time of the last update of the space data in epoch time
    this._timeOfLastSpaceDataUpdate = Number.NEGATIVE_INFINITY;

    // @private {boolean} - whether there is currently an update of the space data in progress
    this._spaceDataUpdateInProgress = false;

    // @private {number} - time of the last update of the available camera information in epoch time
    this._timeOfLastCameraDataUpdate = Number.NEGATIVE_INFINITY;

    // A reference to the timeout that will hide the save alert, so we can clear it early if we need to.
    this.saveAlertTimeout = null;

    // Process query parameters.
    const urlSearchParams = new URLSearchParams( window.location.search );
    const params = Object.fromEntries( urlSearchParams.entries() );
    this.showTestButton = params.showTestButton !== undefined;
  }

  componentDidMount() {
    window.addEventListener( 'resize', this._updatePageWidth.bind( this ) );
    this._updatePageWidth();
    this._updateSpacesList();

    // Set up a periodic update of this component's state using animation frames.
    const animationFrameHandler = () => {

      // Update space data if it is time to do so.
      if ( !this._spaceDataUpdateInProgress &&
           Date.now() > this._timeOfLastSpaceDataUpdate + SPACE_DATA_POLLING_PERIOD * 1000 ) {
        this._updateSpaceData();
      }

      // Update the list of available cameras if it is time to do so.
      if ( Date.now() > this._timeOfLastCameraDataUpdate + CAMERA_DATA_POLLING_PERIOD * 1000 ) {
        this._updateAvailableCameraData();
      }

      // Request the next update.
      requestAnimationFrame( animationFrameHandler );
    };
    requestAnimationFrame( animationFrameHandler );
  }

  /**
   * Update the list of spaces that are available by getting them from the server.
   * @private
   */
  _updateSpacesList() {
    const spacesListUrl = new URL( 'api/spaces-list', window.location.origin ).toString();
    xhr.get( spacesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( Array.isArray( response.body ) ) {
          this.setState( { availableSpaces: response.body } );

          // If the currently selected space name is not on the list of available spaces, use the first available space.
          if ( this.state.availableSpaces.length > 0 &&
               !this.state.availableSpaces.includes( this.state.selectedSpaceName ) ) {
            this.setState( { selectedSpaceName: this.state.availableSpaces[ 0 ] } );

            // Since the space was changed, we need to update the information associated with it.
            this._updateSpaceData();
          }
        }
      }
    } );
  }

  /**
   * Update the space data, which is the data that contains the programs for the currently selected space and which is
   * stored by the server.
   * @private
   */
  _updateSpaceData() {

    // If there is already an update in progress, log a warning and bail.  This isn't necessarily incorrect program
    // behavior because this can occur if a user happens to switch spaces while an update is in progress.  But, if
    // this warning is occurring frequently, there may be a problem with the code that should be investigated.
    if ( this._spaceDataUpdateInProgress ) {
      console.warn( 'Skipping space data update because one is already in progress.' );
      return;
    }

    this._spaceDataUpdateInProgress = true;

    // Request the space data from the server.
    const spaceUrl = getApiUrl( this.state.selectedSpaceName );
    xhr.get( spaceUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( `Error retrieving space data: ${error.message}` );
      }
      else {
        if ( !_.isEqual( this.state.spaceData, response.body ) ) {
          this.setState( { spaceData: response.body }, () => {
            this._programsChange( this.props.paperProgramsProgramsToRender );

            // Determine whether the program that is currently selected in the editor is in the selected space.
            const selectedProgramInSpace = !!this.state.programInEditor && this.state.spaceData.programs.find(
              program => program.number === this.state.programInEditor.number
            ) !== undefined;
            if ( !selectedProgramInSpace ) {

              // The selected space does not contain the currently selected program, probably because the user changed
              // which space was selected.  Load a default program from the currently selected space into the editor.
              this._loadEditorWithDefault();
            }
          } );
        }

        // Mark the time of the last successful update.
        this._timeOfLastSpaceDataUpdate = Date.now();
      }
      this._spaceDataUpdateInProgress = false;
    } );
  }

  /**
   * Add a new space to the DB.  Since the DB doesn't REALLY have separate spaces, this is done be adding an initial
   * program with this new space name as the space value.
   * @param {string} spaceName
   * @private
   */
  _addNewSpace( spaceName ) {

    xhr.post(
      getApiUrl( spaceName, '/programs' ),
      { json: { code: helloWorld } },
      error => {
        if ( error ) {
          console.error( error );
        }
        else {

          // The request to add a new space succeeded, so add this to the list of available spaces.
          this.setState( { availableSpaces: [ ...this.state.availableSpaces, spaceName ] } );

          // Select this space.
          this.setState( { selectedSpaceName: spaceName } );

          // Update the space data.
          this._updateSpaceData();
        }
      }
    );

    const addSpaceUrl = new URL( 'api/add-space', window.location.origin ).toString();
    const addRequestedSpaceUrl = `${addSpaceUrl}/${spaceName}`;
    xhr.get( addRequestedSpaceUrl, { json: true }, error => {
      if ( error ) {
        console.error( `error adding space: ${error}` );
      }
    } );
  }

  _updatePageWidth() {
    this.setState( { pageWidth: window.innerWidth } );
  }

  /**
   * Update the state information with the list of available cameras.  This can be called periodically to detect whether
   * devices have been added or removed.
   *
   * @private
   */
  _updateAvailableCameraData() {
    navigator.mediaDevices.enumerateDevices()
      .then( devices => {

        // Get a list of just the cameras from the list of all available devices.
        const availableCameras = devices.filter( device => device.kind === 'videoinput' );

        // Update component state.
        this.setState( { availableCameras } );

        // If no camera was selected, or if the previously selected camera has disappeared, use the first listed camera
        // as the selected device.
        const availableCameraDeviceIds = availableCameras.map( availableCamera => availableCamera.deviceId );
        if ( availableCameraDeviceIds.length > 0 ) {
          if ( !availableCameraDeviceIds.includes( this.state.selectedCameraDeviceId ) ) {
            this.setState( { selectedCameraDeviceId: availableCameraDeviceIds[ 0 ] } );

            // This change must also be stored in the configuration, since the projector needs it.
            this.props.onConfigChange( {
              ...this.props.config,
              selectedCameraDeviceId: availableCameraDeviceIds[ 0 ]
            } );
          }
        }
        else {
          console.warn( 'No cameras detected on this system.' );
        }
      } );

    this._timeOfLastCameraDataUpdate = Date.now();
  }

  /**
   * Get the label associated with the provided camera device ID.
   * @param {string} cameraDeviceId
   * @returns {string}
   * @private
   */
  _getCameraLabelFromDeviceId( cameraDeviceId ) {
    const camera = this.state.availableCameras.find( cameraInfo => cameraInfo.deviceId === cameraDeviceId );
    return camera ? camera.label : 'Camera not found';
  }

  _print( program ) {
    printPage(
      program.number,
      codeToName( program.currentCode ),
      this.props.config.paperSize
    );
    this._markPrinted( program, true );
  }

  _printCalibration() {
    printCalibrationPage( this.props.config.paperSize );
  }

  _markPrinted( program, printed ) {
    xhr.post(
      getApiUrl( this.state.spaceData.spaceName, `/programs/${program.number}/markPrinted` ),
      { json: { printed } },
      ( error, response ) => {
        if ( error ) {
          console.error( error );
        }
        else {
          this.setState( { spaceData: response.body } );
        }
      }
    );
  }

  _createDebugProgram( number, programName ) {
    const paperSize = clientConstants.paperSizes[ this.props.config.paperSize ];
    const widthToHeightRatio = paperSize[ 0 ] / paperSize[ 1 ];
    const height = 0.2;
    const width = height * widthToHeightRatio;

    const debugPrograms = this.state.debugPrograms;
    const newProgram = {
      number,
      programName,
      points: [
        { x: 0.0, y: 0.0 },
        { x: width, y: 0.0 },
        { x: width, y: height },
        { x: 0.0, y: height }
      ]
    };
    debugPrograms.push( newProgram );
    this.setState( { debugPrograms } );
  }

  /**
   * Creates a debug marker with the provided color. It will be rendered in the camera view and the code
   * will run as if a marker of this color is detected by the camera.
   * @private
   */
  _createDebugMarker( colorIndex ) {
    markerCount++;

    const colorsRGB = this.props.config.colorsRGB.slice();

    const debugMarkers = this.state.debugMarkers;
    const newMarker = {

      // further from the origin so it is easier to grab initially
      position: { x: 0.3, y: 0.3 },
      color: colorsRGB[ colorIndex ],
      colorData: colorsRGB[ colorIndex ],
      colorName: clientConstants.englishColorNames[ colorIndex ],
      count: markerCount
    };
    debugMarkers.push( newMarker );
    this.setState( { debugMarkers } );
  }

  _programsChange( programsToRender ) {
    this.props.onProgramsChange(
      programsToRender.map( program => {
        const programWithData = this.state.spaceData.programs.find(
          program2 => program2.number.toString() === program.number.toString()
        );
        if ( !programWithData ) {
          return null;
        }
        return {
          ...program,
          currentCodeUrl: programWithData.currentCodeUrl,
          currentCodeHash: programWithData.currentCodeHash,
          debugUrl: programWithData.debugUrl,
          claimUrl: programWithData.claimUrl,
          editorInfo: programWithData.editorInfo,
          codeHasChanged: programWithData.codeHasChanged
        };
      } ).filter( Boolean )
    );
  }

  _handleNewSpaceNameChange( event ) {
    this.setState( { newSpaceName: event.target.value } );
  }

  /**
   * Validate a potential space name.  This optionally puts up alert dialogs for invalid values.
   * @param {string} spaceName
   * @param {boolean} [showErrors]
   * @returns {boolean}
   * @private
   */
  _isValidSpaceName( spaceName, showErrors = false ) {
    let isValid = true;
    let errorMessage = '';
    if ( isValid && spaceName.length === 0 ) {
      isValid = false;
      errorMessage = 'Space name too short.';
    }
    if ( isValid && spaceName.match( /[^A-Za-z0-9\-_]+/ ) !== null ) {
      isValid = false;
      errorMessage = 'Invalid characters in space name.';
      errorMessage += '\n\nNames can contain upper- and lower-case letters, numbers, dashes, and/or underscores.';
    }
    if ( isValid && this.state.availableSpaces.includes( spaceName ) ) {
      isValid = false;
      errorMessage = `Space ${spaceName} already exists.`;
    }

    if ( showErrors && errorMessage.length ) {
      window.alert( `Error: ${errorMessage}` );
    }

    return isValid;
  }

  /**
   * Handler for when the user submits a new space name.
   * @param {Event} event
   * @returns boolean - true if name is valid and space creation request was successfully submitted
   * @private
   */
  _handleNewSpaceNameSubmit( event ) {
    let succeeded = false;
    const newSpaceName = this.state.newSpaceName;
    if ( this._isValidSpaceName( newSpaceName, true ) ) {
      this._addNewSpace( newSpaceName );
      succeeded = true;
    }
    event.preventDefault();
    return succeeded;
  }

  _saveProgram() {
    const { programInEditor, codeInEditor } = this.state;
    if ( !programInEditor ) {
      alert( 'Error: No program selected, save operation not possible.' );
    }
    else if ( programInEditor.currentCode === codeInEditor ) {
      console.warn( 'Save attempted with unsaved code, ignoring.' );
    }
    else {

      // Save this program by sending it to the server.
      xhr.put(
        getApiUrl( this.state.selectedSpaceName, `/programs/${programInEditor.number}` ),
        {
          json: { code: codeInEditor }
        },
        error => {
          if ( error ) {
            this.setState( { saveSuccess: false } );
          }
          else {

            // The save succeeded.  Update the code associated with the editor.
            const programInEditor = this.state.programInEditor;
            programInEditor.currentCode = codeInEditor;
            this.setState( { programInEditor } );

            // Initiate an immediate update of the space data, since this should update the program code too and keep
            // it in sync with what is in the editor.
            this._updateSpaceData();

            this.setState( { saveSuccess: true } );
          }

          // Show the save alert element.
          this.setState( { showSaveModal: true } );

          // Clear previous timeout for the save alert if one is still running.
          window.clearTimeout( this.saveAlertTimeout );

          // Remove the save alert notification after a brief time.
          this.saveAlertTimeout = window.setTimeout( () => {
            this.setState( { showSaveModal: false } );
            this.saveAlertTimeout = null;
          }, 2000 );
        }
      );
    }
  }

  /**
   * Delete the specified program.
   * @param {string} spaceName
   * @param {string|number} programNumber
   * @private
   */
  _deleteProgram( spaceName, programNumber ) {
    xhr.get(
      getApiUrl( spaceName, `/delete/${programNumber}` ),
      {
        json: {}
      },
      ( error, response ) => {
        if ( error ) {
          alert( `Error deleting program: ${error}` );
        }
        else if ( response.body.numberOfProgramsDeleted !== 1 ) {
          if ( response.body.numberOfProgramsDeleted === 0 ) {
            alert( 'Delete failed - program not found in database.' );
          }
          else {
            alert( `Unexpected number of programs deleted: ${response.body.numberOfProgramsDeleted}` );
          }
        }
      }
    );
  }

  /**
   * Load the editor with the default program, which is the program with the lowest number if there are some, or a
   * default string if not.
   * @private
   */
  _loadEditorWithDefault() {

    // Set the editor to display the first program on the program list.
    if ( this.state.spaceData.programs.length > 0 ) {
      const programsSortedByIdNumber = this.state.spaceData.programs.sort(
        ( programA, programB ) => programA.number - programB.number
      );
      const autoSelectedProgram = programsSortedByIdNumber[ 0 ];
      this.setState( {
        programInEditor: autoSelectedProgram,
        codeInEditor: autoSelectedProgram.currentCode.slice()
      } );
    }
    else {
      this.setState( {
        programInEditor: null,
        codeInEditor: '// No programs available.'
      } );
    }
  }

  /**
   * Handler function for when the editor mounts, adds the keycode for saving a program.
   * @param editor
   * @param monaco
   * @private
   */
  _onEditorDidMount( editor, monaco ) {

    this._loadEditorWithDefault();

    // Add the hot key for saving changes in the editor.
    // eslint-disable-next-line no-bitwise
    editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, this._saveProgram.bind( this ) );

    // Save a reference to the editor so that its configuration can be changed if necessary.
    this._editor = editor;
  }

  /**
   * Get a boolean value indicating whether the code in the editor has changed since the last time the program was
   * saved.
   * @returns {boolean}
   * @private
   */
  _isCodeChanged() {
    return !!this.state.programInEditor && this.state.programInEditor.currentCode !== this.state.codeInEditor;
  }

  /**
   * Get the text that should be used as the label for the editor component.  This varies based on the state of the
   * program, which is why there is a method for getting it.
   * @returns {string}
   * @private
   */
  _getEditorLabelText() {
    let editorLabelText = 'No program selected.';
    if ( this.state.programInEditor ) {
      const program = this.state.programInEditor;
      if ( this.state.programInEditor.editorInfo.readOnly ||
           this.state.programInEditor.editorInfo.claimed ) {

        // The text should indicate that the file is only available for viewing, not editing.
        editorLabelText = `Viewing (read-only): Program #${program.number}`;
      }
      else {

        // The program is in a state where the user should be able to edit it.
        editorLabelText = `Editing: Program #${program.number}`;
      }
    }
    return editorLabelText;
  }

  /**
   * A method to print debug information during rendering.  Feel free to alter as needed for debugging purposes.
   * @param message
   * @param retVal
   * @private
   */
  _printDebugMessage( message, retVal ) {
    if ( this.lastDebugMessage === undefined || message !== this.lastDebugMessage ) {
      console.log( message );
      this.lastDebugMessage = message;
    }
    return retVal;
  }

  render() {
    const commonMargin = parseInt( styles.commonMargin, 10 );
    const editorUrl = new URL(
      `editor.html?${this.state.spaceData.spaceName}`,
      window.location.origin
    ).toString();
    const sidebarWidth = this.state.sidebarOpen ? OPEN_SIDEBAR_WIDTH : 0;
    const videoAndEditorWidth = this.state.pageWidth - sidebarWidth - commonMargin * 6;

    // Determine whether it is okay for the user to make changes to the program that is currently shown in the editor.
    const okayToEditSelectedProgram = !!this.state.programInEditor &&
                                      !this.state.programInEditor.editorInfo.readOnly &&
                                      !this.state.programInEditor.editorInfo.claimed;

    // Update the readOnly state of the editor if necessary.
    if ( this._editor && this._editor.getConfiguration().readOnly !== !okayToEditSelectedProgram ) {
      this._editor.updateOptions( { readOnly: !okayToEditSelectedProgram } );
    }

    // Return the JSX that defines this component.
    return (
      <div className={styles.root}>
        <div className={styles.appRoot}>

          {/* The modal dialog used to create a new program by copying an existing program. */}
          <CreateProgramsDialog
            data={this.state}
            hideDialog={() => this.setState( { showCreateProgramDialog: false } )}
            setSearchString={str => this.setState( { copyProgramListFilterString: str } )}
          />

          {/*The "save alert" element, which is briefly shown after a program is successfully saved to the server.*/}
          <SaveAlert
            success={this.state.saveSuccess}
            show={this.state.showSaveModal}
          ></SaveAlert>

          {/* Title bar and sidebar control button that goes across the top */}
          <div className={styles.pageTitle}>
            <h4>Camera & Editor View</h4>
            <Button
              onClick={() => this.setState( { sidebarOpen: !this.state.sidebarOpen } )}
            >
              {this.state.sidebarOpen ? '☰ Close Sidebar' : '☰ Open Sidebar'}
            </Button>
          </div>

          <div className={styles.mainView}>
            <div
              className={styles.videoAndEditorContainer}
            >

              {/* video */}
              <div
                className={styles.containerWithBackground}
                style={{ marginBottom: '15px' }}
              >
                <div className={styles.video}>
                  <CameraVideo
                    width={videoAndEditorWidth}
                    cameraDeviceId={this.state.selectedCameraDeviceId}
                    config={this.props.config}
                    onConfigChange={this.props.onConfigChange}
                    onProcessVideo={( { programsToRender, markers, framerate } ) => {
                      this.setState( { framerate } );
                      this._programsChange( programsToRender );
                      this.props.onMarkersChange( markers );
                    }}
                    allowSelectingDetectedPoints={this.state.selectedColorIndex !== -1}
                    onSelectPoint={( { color, size } ) => {
                      if ( this.state.selectedColorIndex === -1 ) {
                        return;
                      }

                      const colorsRGB = this.props.config.colorsRGB.slice();
                      colorsRGB[ this.state.selectedColorIndex ] = color.map( value => Math.round( value ) );

                      const paperDotSizes = this.props.config.paperDotSizes.slice();
                      paperDotSizes[ this.state.selectedColorIndex ] = size;

                      this.props.onConfigChange( { ...this.props.config, colorsRGB, paperDotSizes } );
                      this.setState( { selectedColorIndex: -1 } );
                    }}
                    debugPrograms={this.state.debugPrograms}
                    removeDebugProgram={program => {
                      const debugPrograms = this.state.debugPrograms.filter( p => p !== program );
                      this.setState( { debugPrograms } );
                    }}
                    debugMarkers={this.state.debugMarkers}
                    removeDebugMarker={marker => {
                      const debugMarkers = this.state.debugMarkers.slice();
                      const index = debugMarkers.indexOf( marker );
                      debugMarkers.splice( index, 1 );
                      this.setState( { debugMarkers } );
                    }}
                  />
                </div>
              </div>

              {/* editor with title/control bar */}
              <div className={styles.containerWithBackground}>
                <div className={styles.editorTitleBar}>
                  <h5>{this._getEditorLabelText()}</h5>
                  <>
                    <Button
                      className={okayToEditSelectedProgram ? 'visible' : 'invisible'}
                      disabled={!this._isCodeChanged()}
                      onClick={this._saveProgram.bind( this )}
                    >
                      <span className={styles.iconButtonSpan}>
                        <img src={'media/images/upload.svg'} alt={'Save icon'}/>
                        Save to DB
                      </span>
                    </Button>
                    <Button
                      className={okayToEditSelectedProgram ? 'visible' : 'invisible'}
                      onClick={() => {
                        if ( confirm( PROGRAM_DELETE_WARNING ) === true ) {
                          this._deleteProgram( this.state.selectedSpaceName, this.state.programInEditor.number );
                        }
                      }}
                    >
                      <span className={styles.iconButtonSpan}>
                        <img src={'media/images/trash3.svg'} alt={'Delete icon'}/>
                        Delete
                      </span>
                    </Button>
                  </>
                </div>

                <div className={styles.editor}>
                  <MonacoEditor
                    language='javascript'
                    theme='vs-dark'
                    value={this.state.codeInEditor || '// Select Program'}
                    onChange={code => this.setState( { codeInEditor: code } )}
                    editorDidMount={this._onEditorDidMount.bind( this )}
                    width={videoAndEditorWidth}
                    options={{
                      tabSize: 2,
                      fontSize: '16px',
                      minimap: { enabled: false },
                      automaticLayout: true
                    }}
                  />
                </div>
              </div>
            </div>

            {/* sidebar */}
            <div
              className={styles.sidebar}
              style={{
                visibility: this.state.sidebarOpen ? 'visible' : 'hidden',
                opacity: this.state.sidebarOpen ? 1 : 0
              }}
            >
              {this.showTestButton ? (
                <Button
                  onClick={() => {

                    // Get a list of the supported constraints for the devices available from this browser.
                    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
                    console.log( '===== Supported Constraints =====' );
                    console.log( `${JSON.stringify( supportedConstraints, null, 2 )}` );

                    // Get a list of all media devices and log some of the information to the console.
                    navigator.mediaDevices
                      .enumerateDevices()
                      .then( devices => {
                        console.log( '===== Device List =====' );
                        devices.forEach( device => {
                          console.log( `${device.kind}: ${device.label} id = ${device.deviceId}` );
                        } );
                      } )
                      .catch( err => {
                        console.error( `${err.name}: ${err.message}` );
                      } );

                    // Get the video track.
                    navigator.mediaDevices.getUserMedia( { video: true } )
                      .then( mediaStream => {
                        const track = mediaStream.getVideoTracks()[ 0 ];
                        if ( track ) {

                          // Log information about the video track to the console.
                          console.log( `===== found track = ${track.label}, capabilities below =====` );
                          console.log( `${JSON.stringify( track.getCapabilities(), null, 2 )}` );

                          console.log( '===== track settings =====' );
                          console.log( `${JSON.stringify( track.getSettings(), null, 1 )}` );

                          console.log( '===== track constraints =====' );
                          console.log( `${JSON.stringify( track.getConstraints(), null, 1 )}` );
                        }
                      } )
                      .catch( e => {
                        console.log( `Error getting video track = ${e}` );
                      } );
                  }
                  }
                >
                  Test Button
                </Button>
              ) : ( '' )}

              <Accordion defaultActiveKey='0'>
                <Accordion.Item eventKey='0'>
                  <Accordion.Header className={`${styles.accordionHeader}`}>Spaces & Programs</Accordion.Header>
                  <Accordion.Body className={`${styles.sidebarSection2} ${styles.create}`}>
                    <div>
                      <div>
                        <h5>Space</h5>
                        <label htmlFor='spaces'>Select:</label>
                        <Form.Select
                          name='spaces'
                          id='spaces'
                          value={this.state.selectedSpaceName}
                          onChange={event => {
                            this.setState( { selectedSpaceName: event.target.value } );
                            this.props.onConfigChange( {
                              ...this.props.config,
                              selectedSpaceName: event.target.value
                            } );
                          }}
                        >
                          {this.state.availableSpaces.map( ( option, index ) => {
                            return <option key={index}>
                              {option}
                            </option>;
                          } )}
                        </Form.Select>
                      </div>
                      <div>
                        {this.state.isAddingNewSpace ? (
                          <div>
                            <Form onSubmit={event => {
                              if ( this._handleNewSpaceNameSubmit( event ) ) {
                                this.setState( { isAddingNewSpace: false } );
                              }
                            }}>
                              <label>
                                Name:&nbsp;
                                <input
                                  type='text'
                                  onChange={this._handleNewSpaceNameChange.bind( this )}
                                />
                              </label>
                              <br/>
                              <Button
                                type='submit'
                                style={{ marginRight: '20px' }}
                              >
                                Confirm
                              </Button>
                              <Button type='button' onClick={() => this.setState( { isAddingNewSpace: false } )}>
                                Cancel
                              </Button>
                            </Form>
                          </div>
                        ) : (
                           <div
                             className={styles.horizontalRow}
                             style={{ marginTop: '15px' }}
                           >
                             <Button
                               style={{ marginRight: '15px' }}
                               onClick={() => {
                                 this.setState( { isAddingNewSpace: true } );
                                 this.setState( { newSpaceName: '' } );
                               }}
                             >
                               Add New Space
                             </Button>
                             <a
                               href={editorUrl}
                               target='_blank'
                               className={styles.editorAnchor}
                               rel='noreferrer'
                             >
                               Open Code Editor<br/>for this Space
                             </a>
                           </div>
                         )}
                      </div>
                    </div>
                    <br/>
                    <h5>Programs</h5>

                    <label>Filter on:
                      <input
                        name='filterProgramsOn'
                        style={{ marginBottom: '10px' }}
                        onChange={e => this.setState( { programListFilterString: e.target.value } )}
                      />
                    </label>
                    <div className={`${styles.programList}`}>
                      <div>
                        {this.state.spaceData.programs
                          .filter( program => programMatchesFilterString( program.currentCode, this.state.programListFilterString ) )
                          .sort( ( programA, programB ) => programA.number - programB.number )
                          .map( program => (
                            <div
                              key={program.number}
                              className={[
                                this.state.programInEditor && program.number === this.state.programInEditor.number ?
                                styles.selectedProgramListItem :
                                styles.programListItem
                              ].join( ' ' )}
                            >
                              <span
                                className={styles.programListItemContent}
                                onClick={event => {
                                  event.stopPropagation();
                                  this.setState( {
                                    programInEditor: program,
                                    codeInEditor: program.currentCode.slice()
                                  } );
                                }}
                              >
                                <span
                                  className={styles.programListItemName}
                                >
                                  <strong>#{program.number}</strong> {codeToName( program.currentCode )}{' '}
                                </span>
                              </span>
                              <span
                                className={styles.programListIcon}
                                onClick={event => {
                                  event.stopPropagation();
                                  this._print( program );
                                }}
                              >
                                <img src={'media/images/printer.svg'} alt={'Printer icon'}/>
                              </span>
                              {this.state.debugPrograms.find( p => p.number === program.number ) === undefined ? (
                                <span
                                  className={styles.programListIcon}
                                  onClick={event => {
                                    event.stopPropagation();
                                    this._createDebugProgram( program.number, codeToName( program.currentCode ) );
                                  }}
                                >
                                  <img src={'media/images/eye.svg'} alt={'Preview icon'}/>
                                </span>
                              ) : (
                                 ''
                               )}
                            </div>
                          ) )}
                      </div>
                    </div>

                    <Button onClick={() => { this.setState( { showCreateProgramDialog: true } ); }}>Create New Program(s)</Button>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='1'>
                  <Accordion.Header>Preview Markers</Accordion.Header>
                  <Accordion.Body>
                    Click on the preview icon next to the markers below to add virtual markers to the camera view.
                    <div className={styles.markerList}>
                      {this.props.config.colorsRGB.map( ( color, colorIndex ) => (
                        <span key={colorIndex} className={styles.markerListItem}>
                          <ColorListItem
                            colorIndex={colorIndex}
                            color={color}
                            size={50}
                          />
                          <img
                            className={styles.markerPreviewIcon}
                            src={'media/images/eye.svg'}
                            alt={'Preview icon'}
                            onClick={this._createDebugMarker.bind( this, colorIndex )}
                          />
                        </span>
                      ) )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='2'>
                  <Accordion.Header>Calibration</Accordion.Header>
                  <Accordion.Body>
                    Click on a colored circle below, then click on a circle of that color on a printed paper program in
                    the camera view. Repeat for all colors to complete the calibration.
                    <div className={styles.sidebarSection}>
                      <div className={styles.calibrationColorList}>
                        {this.props.config.colorsRGB.map( ( color, colorIndex ) => (
                          <ColorListItem
                            colorIndex={colorIndex}
                            color={color}
                            key={colorIndex}
                            selected={colorIndex === this.state.selectedColorIndex}
                            onClick={indexOfColor => this.setState(
                              { selectedColorIndex: this.state.selectedColorIndex === indexOfColor ? -1 : indexOfColor }
                            )}
                          />
                        ) )}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='3'>
                  <Accordion.Header>Printing</Accordion.Header>
                  <Accordion.Body>
                    <div className={styles.sidebarSection}>
                      To print a program, click the print icon (
                      <img src={'media/images/printer.svg'} alt={'Printer icon'}/>
                      ) next to that program in the "Spaces & Programs" area.
                      <br/><br/>
                      <div className={styles.sidebarSubSection}>
                        <span>Paper Size: </span>
                        <Form.Select
                          value={this.props.config.paperSize}
                          onChange={event => {
                            const paperSize = event.target.value;
                            this.props.onConfigChange( { ...this.props.config, paperSize } );
                          }}
                        >
                          <optgroup label='Common'>
                            {clientConstants.commonPaperSizeNames.map( name => {
                              return (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              );
                            } )}
                          </optgroup>
                          <optgroup label='Other'>
                            {clientConstants.otherPaperSizeNames.map( name => {
                              return (
                                <option key={name} value={name}>
                                  {name}
                                </option>
                              );
                            } )}
                          </optgroup>
                        </Form.Select>
                      </div>
                      <div>
                        <Button onClick={this._printCalibration.bind( this )}>Print Calibration Page</Button>
                        {' '}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey='4'>
                  <Accordion.Header>Detection</Accordion.Header>
                  <Accordion.Body>
                    <div className={styles.sidebarSection}>
                      <h3 className={styles.headerWithOption}>Detection</h3>
                      <div className={styles.optionWithHeader}>
                        <input
                          type='checkbox'
                          name='freezeDetection'
                          checked={this.props.config.freezeDetection}
                          onChange={() =>
                            this.props.onConfigChange( {
                              ...this.props.config,
                              freezeDetection: !this.props.config.freezeDetection
                            } )
                          }
                        />
                        <label htmlFor='freezeDetection'>pause</label>
                      </div>

                      <div className={styles.sidebarSubSection}>
                        <span>Accuracy</span>
                        <input
                          name='scaleFactor'
                          type='range'
                          min='1'
                          max='10'
                          step='1'
                          value={this.props.config.scaleFactor}
                          onChange={event => {
                            this.props.onConfigChange( {
                              ...this.props.config,
                              scaleFactor: event.target.valueAsNumber
                            } );
                          }}
                        />
                        <span>Performance</span>
                      </div>
                      <div className={styles.sidebarSubSection}>
                        Framerate <strong>{this.state.framerate}</strong>
                      </div>

                      <h4>Overlays</h4>
                      <div className={styles.sidebarSubSection}>
                        <input
                          type='checkbox'
                          checked={this.props.config.showOverlayKeyPointCircles}
                          onChange={() =>
                            this.props.onConfigChange( {
                              ...this.props.config,
                              showOverlayKeyPointCircles: !this.props.config.showOverlayKeyPointCircles
                            } )
                          }
                        />{' '}
                        keypoint circles
                      </div>

                      <div className={styles.sidebarSubSection}>
                        <input
                          type='checkbox'
                          checked={this.props.config.showOverlayKeyPointText}
                          onChange={() =>
                            this.props.onConfigChange( {
                              ...this.props.config,
                              showOverlayKeyPointText: !this.props.config.showOverlayKeyPointText
                            } )
                          }
                        />{' '}
                        keypoint text
                      </div>

                      <div className={styles.sidebarSubSection}>
                        <input
                          type='checkbox'
                          checked={this.props.config.showOverlayComponentLines}
                          onChange={() =>
                            this.props.onConfigChange( {
                              ...this.props.config,
                              showOverlayComponentLines: !this.props.config.showOverlayComponentLines
                            } )
                          }
                        />{' '}
                        component lines
                      </div>

                      <div className={styles.sidebarSubSection}>
                        <input
                          type='checkbox'
                          checked={this.props.config.showOverlayShapeId}
                          onChange={() =>
                            this.props.onConfigChange( {
                              ...this.props.config,
                              showOverlayShapeId: !this.props.config.showOverlayShapeId
                            } )
                          }
                        />{' '}
                        shape ids
                      </div>

                      <div className={styles.sidebarSubSection}>
                        <input
                          type='checkbox'
                          checked={this.props.config.showOverlayProgram}
                          onChange={() =>
                            this.props.onConfigChange( {
                              ...this.props.config,
                              showOverlayProgram: !this.props.config.showOverlayProgram
                            } )
                          }
                        />{' '}
                        programs
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/*camera selection section of accordion box, only included if multiple cameras are available*/}
                {this.state.availableCameras.length > 1 ? (
                  <Accordion.Item eventKey='5'>
                    <Accordion.Header>Camera</Accordion.Header>
                    <Accordion.Body>
                      <CameraSelector
                        selectedCameraDeviceId={this.state.selectedCameraDeviceId}
                        availableCameras={this.state.availableCameras}
                        onSelectionChanged={event => {
                          const selectedCamera = this.state.availableCameras.find(
                            cam => cam.label === event.target.value
                          );
                          this.setState( { selectedCameraDeviceId: selectedCamera.deviceId } );
                          this.props.onConfigChange( {
                            ...this.props.config,
                            selectedCameraDeviceId: selectedCamera.deviceId
                          } );
                        }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                ) : ( '' )}

              </Accordion>

            </div>
          </div>
        </div>
      </div>
    );
  }
}