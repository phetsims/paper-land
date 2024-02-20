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
import { addNewSpace } from '../utils.js';
import styles from './EditorMain.css';

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
                success = addNewSpace( newSpaceName, availableSpaces );
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