import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function ComponentNameControl( props ) {

  // {CreatorModel}
  const model = props.model;

  const setComponentName = props.setComponentName || ( () => {} );

  useEffect( () => {
    if ( props.activeEditComponent ) {
      setComponentName( props.activeEditComponent.component.name );
    }
  }, [ props.activeEditComponent ] );

  // If editing a component, you can use the same name as the component you are editing or any new name
  const nameValid = props.activeEditComponent ? ( model.isNameAvailable( props.componentName ) || props.componentName === props.activeEditComponent.component.name ) :
                    model.isNameAvailable( props.componentName );

  return (
    <div>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Component Name:</Form.Label>
        <Form.Control
          type='text'
          value={props.componentName}
          required
          isInvalid={!nameValid}
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