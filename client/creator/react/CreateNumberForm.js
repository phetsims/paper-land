import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function CreateNumberForm( props ) {

  // {ActiveEdit|null}
  const activeEdit = props.activeEdit;

  const editingComponent = activeEdit.component;

  // value as state - default values come from the editing component
  const [ value, setValue ] = useState( editingComponent?.defaultValue || '' );
  const [ min, setMin ] = useState( editingComponent?.min || '' );
  const [ max, setMax ] = useState( editingComponent?.max || '' );

  // Validate and get data whenever state changes
  useEffect( () => {
    handleChange();
  }, [ value, min, max ] );

  const handleChange = () => {
    const allDefined = [ value, min, max ].every( val => val !== '' );
    const numbers = [ value, min, max ].map( val => parseInt( val, 10 ) );

    const defaultNumber = numbers[ 0 ];
    const minNumber = numbers[ 1 ];
    const maxNumber = numbers[ 2 ];
    const inRange = minNumber < defaultNumber && defaultNumber < maxNumber;
    props.isFormValid( allDefined && inRange );
    props.getFormData( { min: min, max: max, default: defaultNumber } );
  };

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Min Value</Form.Label>
        <Form.Control
          type='number'
          value={min}
          onChange={event => {
            setMin( event.target.value );
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Max Value</Form.Label>
        <Form.Control
          type='number'
          value={max}
          onChange={event => {
            setMax( event.target.value );
          }}
        />
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Control
          type='number'
          value={value}
          onChange={event => {
            setValue( event.target.value );
          }}
        />
      </Form.Group></div>
  );
}