import React from 'react';
import Form from 'react-bootstrap/Form';
import { stringToNumber } from '../../utils.js';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreateNumberForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    newData => {
      const invalidReasons = [];

      const allDefined = newData.min !== '' &&
                         newData.max !== '' &&
                         newData.defaultValue !== '';

      const rangesCorrect = stringToNumber( newData.min ) <= stringToNumber( newData.defaultValue ) &&
                            stringToNumber( newData.defaultValue ) <= stringToNumber( newData.max );

      if ( !allDefined ) {
        invalidReasons.push( 'All values must be defined.' );
      }
      if ( stringToNumber( newData.min ) > stringToNumber( newData.max ) ) {
        invalidReasons.push( 'Min value must be less than or equal to max value.' );
      }
      if ( stringToNumber( newData.min ) > stringToNumber( newData.defaultValue ) ) {
        invalidReasons.push( 'Min value must be less than or equal to default value.' );
      }
      if ( !rangesCorrect ) {
        invalidReasons.push( 'Default value must be between min and max values.' );
      }

      return invalidReasons;
    },
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