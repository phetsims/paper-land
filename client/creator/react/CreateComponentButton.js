import React from 'react';
import StyledButton from './StyledButton.js';

export default function CreateComponentButton( props ) {
  const formValid = props.selectedTabFormValid;
  const activeEdit = props.activeEdit;
  const createComponent = props.createComponent;

  const editingComponent = activeEdit && activeEdit.component;

  return (
    <StyledButton
      disabled={!formValid}
      name={editingComponent ? 'Edit Component' : 'Create Component'}
      onClick={createComponent}>
    </StyledButton>
  );
}