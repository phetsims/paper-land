import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function SaveFailureDialog( props ) {
  if ( !props.creatorModel ) {
    throw new Error( 'SaveFailureDialog requires a reference to the creatorModel.' );
  }
  const creatorModel = props.creatorModel;

  // State for whether the dialog is shown.
  const [ show, setShow ] = useState( false );

  const [ errorMessage, setErrorMessage ] = useState( '' );

  const handleShow = () => setShow( true );
  const handleClose = () => {
    setShow( false );
  };

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {
    const sendRequestedListener = value => {
      setErrorMessage( value );
      setShow( true );
    };
    creatorModel.sendFailedEmitter.addListener( sendRequestedListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      creatorModel.sendFailedEmitter.removeListener( sendRequestedListener );
    };
  } );

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={styles.dialog}>
          <Modal.Title>{'\u26A0 Error sending to playground'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.dialog}>{errorMessage}</Modal.Body>
        <Modal.Footer className={styles.dialog}>
          <StyledButton variant='primary' onClick={handleClose} name={'OK'}></StyledButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}