import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function CreatePositionForm( props ) {

  // {ActiveEdit|null}
  const activeEdit = props.activeEdit;
  const editingComponent = activeEdit.component;

  const initialPosition = useRef( {
    x: editingComponent?.defaultX || 0,
    y: editingComponent?.defaultY || 0
  } );
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
        <Form.Control defaultValue={initialPosition.current.x} type='number' onChange={ event => {
          initialPosition.current.x = event.target.value;
          handleChange();
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial Y</Form.Label>
        <Form.Control defaultValue={initialPosition.current.y} type='number' onChange={ event => {
          initialPosition.current.y = event.target.value;
          handleChange();
        }}/>
      </Form.Group>
    </>
  );
}