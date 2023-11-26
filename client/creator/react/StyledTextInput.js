/**
 * A reusable text input with styling for Creator.
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function StyledTextInput( props ) {

  // props args:
  //  handleChange: function
  //  index: number
  //  value: string
  //  label: string
  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          type='text'
          value={props.value}
          onChange={event => {
            props.handleChange( event, props.index );
          }}/>
      </Form.Group>
    </>
  );
}