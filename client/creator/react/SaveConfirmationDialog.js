import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ConfirmationDialog from './ConfirmationDialog.js';

export default function SaveConfirmationDialog( props ) {
  if ( !props.creatorModel ) {
    throw new Error( 'SaveConfirmationDialog requires a reference to the creatorModel.' );
  }
  const creatorModel = props.creatorModel;

  // State for whether the dialog is shown - custom state for this component because it is controlled
  // by the CreatorModel.
  const [ show, setShow ] = useState( false );

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

  // Lets the user disable the send confirmation dialog after this request. Once this is checked,
  // the dialog will not show again for this session.
  const skipConfirmationCheckbox = (
    <div>
      <Form.Check
        type='checkbox'
        label={'Don\'t show this again.'}
        onChange={event => {
          creatorModel.skipSendRequestWarningProperty.value = event.target.checked;
        }}
        id={'skipConfirmationCheckbox'}
      />
    </div>
  );

  return (
    <ConfirmationDialog
      showing={show}
      onConfirm={handleSave}
      onCancel={handleCancel}
      titleString={'Send to playground?'}
      confirmationContent={
        <div>
          <p>{`⚠ Warning! This will delete all existing programs in ${activeSpaceName}.`}</p>
          <p>This project will also be saved.</p>
        </div>
      }
      footerContent={skipConfirmationCheckbox}
      confirmString={'Send to Playground'}
    ></ConfirmationDialog>
  );
}