import React from 'react';
import StyledButton from './StyledButton.js';

export default function CreateComponentButton( props ) {
  const formValid = props.selectedTabFormValid;
  const createComponent = props.createComponent;
  const activeEditProperty = props.activeEditProperty;

  const activeEdit = activeEditProperty.value;

  const editingComponent = activeEdit && activeEdit.component;

  const handleClick = () => {
    createComponent();

    // After edit, set the value to null to clear the interface
    activeEditProperty.value = null;
  };

  return (
    <StyledButton
      disabled={!formValid}
      name={editingComponent ? 'Edit Component' : 'Create Component'}
      onClick={handleClick}>
    </StyledButton>
  );
}