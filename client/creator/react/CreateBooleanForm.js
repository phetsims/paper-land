import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedBooleanProperty from '../model/NamedBooleanProperty.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreateBooleanForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    () => {

      // Always valid.
      return [];
    },
    props.getFormData,
    NamedBooleanProperty
  );

  return (
    <>
      <div className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Check
          type={'radio'}
          checked={formData.defaultValue}
          value={true}
          label={'True'}
          name={'boolean-radio-group'}
          onChange={() => handleChange( { defaultValue: true } )}
          id={'boolean-radio-true'}
        />
        <Form.Check
          type={'radio'}
          label={'False'}
          checked={!formData.defaultValue}
          value={false}
          name={'boolean-radio-group'}
          onChange={() => handleChange( { defaultValue: false } )}
          id={'boolean-radio-false'}
        />
      </div>
    </>
  );
}