import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedBounds2Property from '../model/NamedBounds2Property.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreateBoundsForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      const invalidReasons = [];

      if ( componentData.defaultMinX === undefined || componentData.defaultMinY === undefined ||
           componentData.defaultMaxX === undefined || componentData.defaultMaxY === undefined ) {
        invalidReasons.push( 'Bounds min and max values are not defined.' );
      }
      else if ( componentData.defaultMinX >= componentData.defaultMaxX ) {
        invalidReasons.push( 'Min X is greater than or equal to max X.' );
      }
      else if ( componentData.defaultMinY >= componentData.defaultMaxY ) {
        invalidReasons.push( 'Min Y is greater than or equal to max Y.' );
      }

      return invalidReasons;
    },
    props.getFormData,
    NamedBounds2Property
  );

  return (
    <>
      <h4>Hint:</h4>
      <p>Try using values between 0 and 1 to easily work with controlled position components! (0,0) is at the top left of the screen and (1,1) is at the bottom right.</p>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Min X</Form.Label>
        <Form.Control value={formData.defaultMinX} type='number' onChange={event => {
          handleChange( { defaultMinX: event.target.value } );
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Min Y</Form.Label>
        <Form.Control value={formData.defaultMinY} type='number' onChange={event => {
          handleChange( { defaultMinY: event.target.value } );
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Max X</Form.Label>
        <Form.Control value={formData.defaultMaxX} type='number' onChange={event => {
          handleChange( { defaultMaxX: event.target.value } );
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Max Y</Form.Label>
        <Form.Control value={formData.defaultMaxY} type='number' onChange={event => {
          handleChange( { defaultMaxY: event.target.value } );
        }}/>
      </Form.Group>
    </>
  );
}