/**
 * The form to create a NamedObservableArray component. There are no values to fill in for the array,
 * you simply create one and have it available for custom code and other components.
 */

import React from 'react';
import NamedBooleanProperty from '../model/NamedBooleanProperty.js';
import useEditableForm from './useEditableForm.js';

export default function CreateArrayForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    () => {

      // Always valid (just requires a name)
      return [];
    },
    props.getFormData,
    NamedBooleanProperty
  );

  return (
    <>
      <hr></hr>
      <p>Create a new array component. Add components to the array from a particular program or control the array in custom code.</p>
    </>
  );
}