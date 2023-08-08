import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { isNameValid } from '../../utils.js';
import styles from './../CreatorMain.css';

export default function ComponentNameControl( props ) {

  // {CreatorModel}
  const model = props.model;

  const setComponentName = props.setComponentName || ( () => {} );

  useEffect( () => {
    if ( props.activeEditObject && props.activeEditObject.component ) {
      setComponentName( props.activeEditObject.component.nameProperty.value );
    }
    else {
      setComponentName( '' );
    }
  }, [ props.activeEditObject ] );

  const nameValid = isNameValid( props.activeEditObject, model, props.componentName );

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Component Name:</Form.Label>
        <Form.Control
          type='text'
          value={props.componentName}
          required
          isInvalid={!nameValid && props.componentName !== ''}
          onChange={event => {
            setComponentName( event.target.value );
          }}
        />
        <Form.Control.Feedback type='invalid' className={styles.feedbackElement}>
          That component name is already being used.
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  );
}