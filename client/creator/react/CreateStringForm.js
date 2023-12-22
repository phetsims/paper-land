/**
 * A form that supports creating a string component in the Creator model.
 */

import React from 'react';
import NamedStringProperty from '../model/NamedStringProperty.js';
import StyledTextInput from './StyledTextInput.js';
import useEditableForm from './useEditableForm.js';

export default function CreateStringForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {

      // Any string value in that field is valid (including empty values).
      return [];
    },
    props.getFormData,
    NamedStringProperty
  );

  const handleEdit = event => {
    handleChange( { defaultValue: event.target.value } );
  };

  return (
    <>
      <StyledTextInput label={'String Value'} value={formData.defaultValue} handleChange={handleEdit}/>
    </>
  );
}