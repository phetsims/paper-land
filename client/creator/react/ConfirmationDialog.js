import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function ConfirmationDialog( props ) {
  if ( !props.onConfirm ) {
    throw new Error( 'ConfirmationDialog requires an onConfirm callback.' );
  }
  if ( !props.confirmationContent ) {
    throw new Error( 'ConfirmationDialog requires JSX for the confirmationContent' );
  }

  // Additional work to do when the action is cancelled, if any.
  const onCancel = props.onCancel || ( () => {} );

  // Customizable content for the dialog.
  const confirmString = props.confirmString || 'Confirm';
  const titleString = props.titleString || 'Are you sure?';

  // State for whether the dialog is shown.
  const [ show, setShow ] = useState( false );

  const handleCancel = () => {
    onCancel();
    setShow( false );
  };
  const handleConfirm = () => {
    props.onConfirm();
    setShow( false );
  };

  // Show the dialog when props.showing is true
  useEffect( () => {
    setShow( props.showing );
  }, [ props.showing ] );

  return (
    <>
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header className={styles.dialog}>
          <Modal.Title>{titleString}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.dialog}>{props.confirmationContent}</Modal.Body>
        <Modal.Footer className={styles.dialog}>
          <div className={styles.dialogFooterContent}>{props.footerContent}</div>
          <StyledButton variant='secondary' onClick={handleCancel} name={'Cancel'}></StyledButton>
          <StyledButton variant='primary' onClick={handleConfirm} name={confirmString}></StyledButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}