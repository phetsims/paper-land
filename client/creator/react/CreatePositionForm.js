import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedVector2Property from '../model/NamedVector2Property.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreatePositionForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      const invalidReasons = [];
      if ( componentData.defaultX === undefined || componentData.defaultY === undefined ) {
        invalidReasons.push( 'X or Y value is not defined.' );
      }
      return invalidReasons;
    },
    props.getFormData,
    NamedVector2Property
  );

  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial X</Form.Label>
        <Form.Control value={formData.defaultX} type='number' onChange={event => {
          handleChange( { defaultX: event.target.value, defaultY: formData.defaultY } );
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial Y</Form.Label>
        <Form.Control value={formData.defaultY} type='number' onChange={event => {
          handleChange( { defaultX: formData.defaultX, defaultY: event.target.value } );
        }}/>
      </Form.Group>
    </>
  );
}