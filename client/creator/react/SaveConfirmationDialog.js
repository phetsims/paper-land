import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function SaveConfirmationDialog( props ) {
  if ( !props.creatorModel ) {
    throw new Error( 'SaveConfirmationDialog requires a reference to the creatorModel.' );
  }
  const creatorModel = props.creatorModel;

  // State for whether the dialog is shown.
  const [ show, setShow ] = useState( false );

  const handleShow = () => setShow( true );
  const handleCancel = () => {
    setShow( false );
  };
  const handleSave = () => {
    creatorModel.sendConfirmedEmitter.emit();
    setShow( false );
  };

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {
    const sendRequestedListener = newValue => {
      setShow( true );
    };
    creatorModel.sendRequestedEmitter.addListener( sendRequestedListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      creatorModel.sendRequestedEmitter.removeListener( sendRequestedListener );
    };
  } );

  const activeSpaceName = creatorModel.spaceNameProperty.value;

  return (
    <>
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header className={styles.dialog}>
          <Modal.Title>Send to playground?</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.dialog}>{
          <div>
            <p>{`Warning! This will delete all existing programs in ${activeSpaceName}.`}</p>
            <p>This project will also be saved.</p>
          </div>
        }</Modal.Body>
        <Modal.Footer className={styles.dialog}>
          <StyledButton variant='secondary' onClick={handleCancel} name={'Cancel'}></StyledButton>
          <StyledButton variant='primary' onClick={handleSave} name={'Send to Playground'}></StyledButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}