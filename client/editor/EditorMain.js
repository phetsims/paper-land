import sortBy from 'lodash/sortBy';
import randomColor from 'randomcolor';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import xhr from 'xhr';
import SaveAlert from '../common/SaveAlert.js';
import CreateProgramsDialog from '../editor/CreateProgramsDialog.js';
import { codeToName, getApiUrl, getSaveString, programMatchesFilterString } from '../utils';
import ChangeSpaceDialog from './ChangeSpaceDialog.js';
import CodeSnippetsDialog from './CodeSnippetsDialog.js';
import styles from './EditorMain.css';

// constants
const PROGRAM_DELETE_WARNING = 'This will remove the program for all users of the database.\nAre you sure you want to delete this program?';

export default class EditorMain extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      programListFilterString: '',
      selectedProgramNumber: '',
      spaceData: { programs: [] },
      code: '',
      debugInfo: {},
      showSnippetsDialog: false,
      saveSuccess: true, // Did the save command succeed?
      showSaveModal: false,

      // The list of all spaces in the database
      availableSpaces: [],

      // True when the user has requested to create a new program
      showCreateProgramDialog: false,

      // True when the user has requested to change the space
      showSpaceDialog: false
    };

    // A reference to the timeout that will hide the save alert, so we can clear it early if we need to.
    this.saveAlertTimeout = null;
  }

  componentDidMount() {
    this._updateSpacesList();
    this._pollSpaceUrl();
    this._pollDebugUrl();
  }

  _pollSpaceUrl = () => {
    const targetTimeMs = 5000;
    const beginTimeMs = Date.now();
    xhr.get( getApiUrl( this.props.spaceName, '' ), { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        const state = { spaceData: response.body };
        this.setState( state );
      }

      const elapsedTimeMs = Date.now() - beginTimeMs;
      clearTimeout( this._pollSpaceUrlTimeout );
      this._pollSpaceUrlTimeout = setTimeout(
        this._pollSpaceUrl,
        Math.max( 0, targetTimeMs - elapsedTimeMs )
      );
    } );
  };

  _pollDebugUrl = () => {
    const targetTimeMs = 1000;
    const beginTimeMs = Date.now();

    const done = () => {
      const elapsedTimeMs = Date.now() - beginTimeMs;
      clearTimeout( this._pollDebugUrlTimeout );
      this._pollDebugUrlTimeout = setTimeout(
        this._pollDebugUrl,
        Math.max( 0, targetTimeMs - elapsedTimeMs )
      );
    };

    const program = this._selectedProgram( this.state.selectedProgramNumber );
    if ( program ) {
      const { editorId } = this.props.editorConfig;
      xhr.post( program.claimUrl, { json: { editorId } }, ( error, response ) => {
        if ( error ) {
          console.error( error );
        }
        else if ( response.statusCode === 400 ) {
          this.setState( {
            selectedProgramNumber: '',
            code: '',
            debugInfo: {}
          } );
        }
        else {
          this.setState( { debugInfo: response.body.debugInfo } );
        }
        done();
      } );
    }
    else {
      done();
    }
  };

  _save = () => {
    const { code, selectedProgramNumber } = this.state;
    xhr.put(
      getApiUrl( this.props.spaceName, `/programs/${selectedProgramNumber}` ),
      {
        json: { code }
      },
      error => {

        const state = { showSaveModal: true };
        if ( error ) {
          console.error( error );
          state.saveSuccess = false;
        }
        else {
          state.saveSuccess = true;
        }
        this.setState( state );

        // Clear previous timeout if one is still running
        window.clearTimeout( this.saveAlertTimeout );

        // Display the alert for a short time (setTimeout will remove itself after it is called)
        this.saveAlertTimeout = window.setTimeout( () => {
          this.setState( { showSaveModal: false } );
          this.saveAlertTimeout = null;
        }, 2000 );
      }
    );
  };

  /**
   * Delete the specified program.
   * @private
   */
  _deleteProgram() {

    const { selectedProgramNumber } = this.state;
    xhr.get(
      getApiUrl( this.props.spaceName, `/delete/${selectedProgramNumber}` ),
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
        else {

          // success - update code and displayed programs right away
          this._pollSpaceUrl();
        }
      }
    );
  }

  /**
   * Retrieve the list of spaces that are available to copy programs from and use it to
   * populate the spaces for the CreateProgramsDialog.
   * @private
   */
  _updateSpacesList = () => {
    const spacesListUrl = new URL( 'api/spaces-list', window.location.origin ).toString();
    xhr.get( spacesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( Array.isArray( response.body ) ) {
          this.setState( { availableSpaces: response.body } );
        }
      }
    } );
  };

  _print = () => {
    const { code } = this.state;
    xhr.post(
      getApiUrl( this.props.spaceName, '/programs' ),
      { json: { code } },
      ( error, response ) => {
        if ( error ) {
          console.error( error );
        }
        else {
          const { body } = response;
          this.setState( {
            code,
            selectedProgramNumber: body.number,
            spaceData: body.spaceData,
            debugInfo: {}
          } );
        }
      }
    );
  };

  _restore = () => {
    if ( window.confirm( 'This will remove any changes, continue?' ) ) {
      this.setState(
        {
          code: this._selectedProgram( this.state.selectedProgramNumber ).originalCode,
          debugInfo: {}
        },
        () => {
          this._save();
          this._pollDebugUrl();
        }
      );
    }
  };

  _onEditorDidMount = ( editor, monaco ) => {
    editor.focus();

    // eslint-disable-next-line no-bitwise
    editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, this._save );
  };

  _selectedProgram = selectedProgramNumber => {
    return this.state.spaceData.programs.find(
      program => program.number.toString() === selectedProgramNumber.toString()
    );
  };

  _editorColor = () => {
    return randomColor( { seed: this.props.editorConfig.editorId } );
  };

  /**
   * Get the heading that is shown above the editor.  This changes based on the selected program and whether the program
   * is available for editing.
   * @returns {string}
   * @private
   */
  _getEditorHeadingText() {
    let editorHeadingText = 'Select a program on the right to get started.';
    if ( this.state.selectedProgramNumber !== '' ) {
      editorHeadingText = `Space: ${this.props.spaceName} | Program ${this.state.selectedProgramNumber}`;
    }
    return editorHeadingText;
  }

  render() {
    const selectedProgram = this._selectedProgram( this.state.selectedProgramNumber );
    const okayToEditSelectedProgram = !!selectedProgram;
    const errors = this.state.debugInfo.errors || [];
    const logs = this.state.debugInfo.logs || [];
    const showSnippetsDialog = this.state.showSnippetsDialog;
    const showCreateProgramDialog = this.state.showCreateProgramDialog;
    const showSpaceDialog = this.state.showSpaceDialog;

    return (
      <div className={styles.root}>

        <div className={styles.container}>
          <div className={styles.headingRow}>
            <h1 className={styles.editorHeading}>{this._getEditorHeadingText()}</h1>
            <button
              className={styles.changeSpaceButton}
              onClick={() => {
                this.setState( { showSpaceDialog: true } );
              }}
            >Change Space
            </button>
          </div>
          {selectedProgram && (
            <div className={styles.editor}>
              <MonacoEditor
                language='javascript'
                theme='vs-dark'
                value={this.state.code}
                onChange={code => this.setState( { code } )}
                editorDidMount={this._onEditorDidMount}
                options={{
                  tabSize: 2,
                  fontSize: '20px',
                  automaticLayout: true,
                  readOnly: !okayToEditSelectedProgram
                }}
              />
            </div>
          )}
        </div>

        <SaveAlert
          success={this.state.saveSuccess}
          show={this.state.showSaveModal}
        ></SaveAlert>
        {showSnippetsDialog && (
          <CodeSnippetsDialog
            onClose={() => this.setState( { showSnippetsDialog: false } )}
          ></CodeSnippetsDialog>
        )}
        {showCreateProgramDialog && (
          <CreateProgramsDialog
            showCreateProgramDialog={showCreateProgramDialog}
            availableSpaces={this.state.availableSpaces}
            selectedSpaceName={this.props.spaceName}
            hideDialog={() => this.setState( { showCreateProgramDialog: false } )}
          />
        )}
        {showSpaceDialog && (
          <ChangeSpaceDialog
            contentClassName={styles.createProgramContent}
            showing={showSpaceDialog}
            availableSpaces={this.state.availableSpaces}
            changeSpace={newSpaceName => {
              if ( !newSpaceName ) {
                alert( 'Sorry, there was an error while changing spaces.' );
              }

              // This is where we switch to a difference space. For the editor page,
              // this is done by changing the URL to use a query parameter for the space name.
              const newUrl = new URL( window.location.href );
              newUrl.search = newSpaceName;
              window.location.href = newUrl.toString();
            }}
            hideDialog={() => this.setState( { showSpaceDialog: false } )}
          />
        )}
        <div className={styles.sidebar}>
          <label>
            {'Filter on: '}
            <input
              name='filterProgramsOn'
              style={{ marginBottom: '10px' }}
              onChange={e => this.setState( { programListFilterString: e.target.value } )}
            />
          </label>

          <div className={styles.sidebarSection}>
            <select
              className={styles.select}
              value={this.state.selectedProgramNumber}
              size={10}
              onChange={event => {
                if ( event.target.value !== '' ) {
                  const selectedProgramNumber = event.target.value;
                  const selectedProgram = this._selectedProgram( selectedProgramNumber );
                  this.setState(
                    {
                      selectedProgramNumber,
                      code: selectedProgram.currentCode,
                      programClaimedWhenSelected: selectedProgram.editorInfo.claimed,
                      debugInfo: {}
                    },
                    () => this._pollDebugUrl()
                  );
                }
                else {
                  this.setState( { selectedProgramNumber: '', code: '', debugInfo: {} } );
                }
              }}
            >
              <option value={''}>(none)</option>
              {sortBy( this.state.spaceData.programs, 'number' )
                .filter( program => programMatchesFilterString( program.currentCode, this.state.programListFilterString ) )
                .map( program => {

                  return (
                    <option
                      key={program.number}
                      value={program.number}
                    >
                      #{program.number} {codeToName( program.currentCode )}
                    </option>
                  );
                } )}
            </select>
          </div>

          <div className={styles.sidebarSection}>
            <button onClick={() => { this.setState( { showCreateProgramDialog: true } ); }}>Create New Program(s)</button>
          </div>

          {selectedProgram && (
            <div className={styles.sidebarSection}>
              <button onClick={this._save}>
                <span className={styles.iconButtonSpan}>
                  <img src={'media/images/upload-black.svg'} alt={'Save icon'}/>
                  {getSaveString()}
                </span>
              </button>
              {' '}
            </div>
          )}

          {selectedProgram && (
            <div className={styles.sidebarSection}>
              <button
                className={okayToEditSelectedProgram ? 'visible' : 'invisible'}
                onClick={() => {
                  if ( confirm( PROGRAM_DELETE_WARNING ) === true ) {
                    this._deleteProgram();
                  }
                }}>
                <span className={styles.iconButtonSpan}>
                  <img src={'media/images/trash3-black.svg'} alt={'Delete icon'}/>
                  Delete
                </span>
              </button>
              {' '}
            </div>
          )}

          {
            selectedProgram && errors.length > 0 &&
            (
              <div className={styles.sidebarSection}>
                errors:{' '}
                {errors.map( ( error, index ) => (
                  <div key={index} className={styles.logline}>
                    <strong>
                      error[{error.filename}:{error.lineNumber}:{error.columnNumber}]:
                    </strong>{' '}
                    {error.message}
                  </div>
                ) )}
              </div>
            )
          }

          {
            selectedProgram && logs.length > 0 &&
            (
              <div className={styles.sidebarSection}>
                {logs.map( ( logLine, index ) => (
                  <div key={index} className={styles.logline}>
                    <strong>
                      {logLine.name}[{logLine.filename}:{logLine.lineNumber}:{logLine.columnNumber}]:
                    </strong>{' '}
                    {logLine.args.join( ', ' )}
                  </div>
                ) )}
              </div>
            )
          }

          <div className={styles.sidebarSection}>
            <a
              href='https://github.com/janpaul123/paperprograms/blob/master/docs/api.md'
              target='_blank'
              className={styles.link} rel='noreferrer'
            >
              Paper API Reference
            </a>
          </div>

          <div className={styles.sidebarSection}>
            <a
              href='https://learnxinyminutes.com/docs/javascript/'
              target='_blank'
              className={styles.link} rel='noreferrer'
            >
              JavaScript Reference
            </a>
          </div>

          <div className={styles.sidebarSection}>
            <a
              href='https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md#source-code-and-dependencies'
              target='_blank'
              className={styles.link} rel='noreferrer'
            >
              PhET Library References
            </a>
          </div>

          <div className={styles.sidebarSection}>
            <button onClick={() => {this.setState( { showSnippetsDialog: true } );}}>Code Snippets</button>
            {' '}
          </div>

          <div className={styles.sidebarSection}>
            editor color{' '}
            <div className={styles.editorColor} style={{ background: this._editorColor() }}/>
          </div>

        </div>
      </div>
    );
  }
}