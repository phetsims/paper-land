import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function ComponentNameControl( props ) {

  const setComponentName = props.setComponentName || ( () => {} );

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Component Name</Form.Label>
        <Form.Control
          type='text'
          value={props.componentName}
          onChange={event => {
            setComponentName( event.target.value );
          }}
        />
      </Form.Group>
    </div>
  );
}