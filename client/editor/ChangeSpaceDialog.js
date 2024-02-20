/**
 * A dialog for the Editor page with controls for changing and creating a new space.
 *
 * @author Jesse Greenberg
 */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import xhr from 'xhr';
import { getApiUrl } from '../utils.js';
import styles from './EditorMain.css';
import helloWorld from './helloWorld.js';

/**
 * Returns true if a potential space name is valid.
 * @param spaceName - proposed name
 * @param availableSpaces - list of existing names
 * @param showErrors - whether to alert on errors
 * @return {boolean}
 */
const isValidSpaceName = ( spaceName, availableSpaces, showErrors = false ) => {
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
  if ( isValid && availableSpaces.includes( spaceName ) ) {
    isValid = false;
    errorMessage = `Space ${spaceName} already exists.`;
  }

  if ( showErrors && errorMessage.length ) {
    window.alert( `Error: ${errorMessage}` );
  }

  return isValid;
};

/**
 * Add a new space to the DB.  Since the DB doesn't REALLY have separate spaces, this is done be adding an initial
 * program with this new space name as the space value.
 * @param {string} spaceName
 * @private
 */
const addNewSpace = spaceName => {
  xhr.post(
    getApiUrl( spaceName, '/programs' ),
    { json: { code: helloWorld } },
    error => {
      if ( error ) {
        console.error( error );
      }
      else {

        // success!
      }
    }
  );

  // TODO: This was pulled from the camera page when proting space controls to the editor...but
  //    I don't think it does anything?
  const addSpaceUrl = new URL( 'api/add-space', window.location.origin ).toString();
  const addRequestedSpaceUrl = `${addSpaceUrl}/${spaceName}`;
  xhr.get( addRequestedSpaceUrl, { json: true }, error => {
    if ( error ) {
      console.error( `error adding space: ${error}` );
    }
  } );
};

/**
 * Handles the submission of a new space name, creating a new space in the database if the proposed
 * name is valid.
 * @param newSpaceName - proposed name
 * @param availableSpaces - list of existing names
 * @return {boolean} - whether the submission succeeded
 */
const handleNewSpaceSubmit = ( newSpaceName, availableSpaces ) => {
  let succeeded = false;
  if ( isValidSpaceName( newSpaceName, availableSpaces, true ) ) {
    addNewSpace( newSpaceName );
    succeeded = true;
  }

  return succeeded;
};

export default function ChangeSpaceDialog( props ) {

  // Whether the dialog is showing
  const showing = props.showing;

  // A callback from the parent to hide the dialog
  const hideDialog = props.hideDialog;

  // List of all available spaces
  const availableSpaces = props.availableSpaces;

  // A callback from the parent to switch to a difference space
  // ( spaceName: string ) => void
  const changeSpace = props.changeSpace;

  const [ newSpaceName, setNewSpaceName ] = useState( '' );
  const [ selectedSpace, setSelectedSpace ] = useState( availableSpaces[ 0 ] );

  const closeDialog = () => {
    hideDialog();
  };

  return (
    <>
      <Modal
        show={showing}

        // Called when the background pane is clicked
        onHide={() => {
          closeDialog();
        }}
        className={styles.dialog}
        dialogClassName={styles.createProgramDialog}
        contentClassName={styles.createProgramContent}
      >
        <Modal.Header>
          <Modal.Title>Change Space</Modal.Title>
          <CloseButton variant='white' onClick={closeDialog}/>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.changeSpaceDialogBodyContainer}>
            <div>
              <h4>Switch to another space:</h4>
              <Form.Select
                id='spaces-select'
                value={selectedSpace}
                onChange={event => {
                  setSelectedSpace( event.target.value );
                }}

                // Disable the dropdown if the user has typed a new space name to make it clear that
                // they can't do both
                disabled={newSpaceName.length > 0}
              >
                {availableSpaces.map( spaceName => {
                  return <option
                    key={spaceName}
                    value={spaceName}
                  >{spaceName}
                  </option>;
                } )
                }
              </Form.Select>
            </div>

            <div>
              <h4>OR:</h4>
            </div>

            <div>
              <h4>Create a new space name:</h4>
              <Form.Control
                value={newSpaceName}
                onChange={event => {
                  setNewSpaceName( event.target.value );
                }}
                type='text'
                id='new-space-text-input'
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='submit'
            variant='light'
            onClick={async () => {
              let success = true;
              let nextSpace = selectedSpace;

              // If there is an entry in the new space name field, try to create a new space
              if ( newSpaceName.length > 0 ) {
                success = handleNewSpaceSubmit( newSpaceName, availableSpaces );
                nextSpace = newSpaceName;
              }

              if ( success ) {
                changeSpace( nextSpace );
                closeDialog();
              }
            }}
          >
            Confirm
          </Button>
          <Button
            variant='secondary'
            onClick={closeDialog}
          >
            Cancel
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}