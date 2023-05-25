import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';
import ComponentNameControl from './ComponentNameControl.js';

export default function CreatePositionForm( props ) {
  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>X</Form.Label>
        <Form.Control defaultValue={0} type='number'/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Y</Form.Label>
        <Form.Control defaultValue={0} type='number'/>
      </Form.Group>
    </>
  );
}