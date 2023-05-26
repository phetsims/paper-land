import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function CreatePositionForm( props ) {
  const initialPosition = useRef( { x: 0, y: 0 } );
  props.getFormData( initialPosition.current );

  const handleChange = event => {
    const x = initialPosition.current.x;
    const y = initialPosition.current.y;
    const defined = [ x, y ].every( val => val !== '' );
    props.isFormValid( defined );

    props.getFormData( initialPosition.current );
  };

  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial X</Form.Label>
        <Form.Control defaultValue={0} type='number' onChange={ event => {
          initialPosition.current.x = event.target.value;
          handleChange();
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial Y</Form.Label>
        <Form.Control defaultValue={0} type='number' onChange={ event => {
          initialPosition.current.y = event.target.value;
          handleChange();
        }}/>
      </Form.Group>
    </>
  );
}