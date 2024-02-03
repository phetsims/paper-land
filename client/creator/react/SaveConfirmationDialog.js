import React, { useEffect, useState } from 'react';
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
      confirmString={'Send to Playground'}
    ></ConfirmationDialog>
  );
}