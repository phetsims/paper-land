import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreateNumberForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    () => {},
    props.getFormData,
    NamedNumberProperty
  );

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Min Value</Form.Label>
        <Form.Control
          type='number'
          value={formData.min}
          onChange={event => {
            handleChange( {
              min: event.target.value
            } );
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Max Value</Form.Label>
        <Form.Control
          type='number'
          value={formData.max}
          onChange={event => {
            handleChange( {
              max: event.target.value
            } );
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Control
          type='number'
          value={formData.defaultValue}
          onChange={event => {
            handleChange( {
              defaultValue: event.target.value
            } );
          }}
        />
      </Form.Group></div>
  );
}