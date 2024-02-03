import React, { useEffect, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog.js';

export default function ConfirmActionDialog( props ) {
  if ( !props.creatorModel ) {
    throw new Error( 'DeleteConfirmationDialog requires a reference to the creatorModel.' );
  }
  const creatorModel = props.creatorModel;

  // State for whether the dialog is shown - custom state for this component because it is controlled
  // by the CreatorModel.
  const [ show, setShow ] = useState( false );

  const [ confirmationRequest, setCurrentConfirmationRequest ] = useState( null );

  const handleCancel = () => {
    setShow( false );
    setCurrentConfirmationRequest( null );
  };
  const handleConfirm = () => {
    if ( confirmationRequest ) {
      const confirmationAction = confirmationRequest.action;
      if ( confirmationAction && typeof confirmationAction === 'function' ) {
        confirmationAction();
      }
    }
    setCurrentConfirmationRequest( null );
    setShow( false );
  };

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {
    const sendRequestedListener = newConfirmationRequest => {
      assert && assert( confirmationRequest === null, 'We are about to override a confirmation request that has not been handled yet.' );

      setCurrentConfirmationRequest( newConfirmationRequest );
      setShow( true );
    };
    creatorModel.confirmRequestEmitter.addListener( sendRequestedListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      creatorModel.confirmRequestEmitter.removeListener( sendRequestedListener );
    };
  } );

  return (
    <ConfirmationDialog
      showing={show}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      titleString={'Confirm Action'}
      confirmationContent={
        <div>
          <p>{confirmationRequest?.message}</p>
        </div>
      }
      confirmString={'Confirm'}
    ></ConfirmationDialog>
  );
}