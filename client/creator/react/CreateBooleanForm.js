import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function CreateBooleanForm( props ) {

  // Reference to the current value (not state because we don't need a re-render)
  const defaultValue = useRef( true );

  // Updates reference to selected value, validates form and sends data to the parent
  const handleChange = event => {
    defaultValue.current = event.target.value;
    props.isFormValid( true );
    props.getFormData( { defaultValue: defaultValue.current } );
  };

  return (
    <>
      <div className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Check
          type={'radio'}
          defaultChecked={true}
          value={true}
          label={'True'}
          name={'boolean-radio-group'}
          onChange={handleChange}
          id={'boolean-radio-true'}
        />
        <Form.Check
          type={'radio'}
          label={'False'}
          value={false}
          name={'boolean-radio-group'}
          onChange={handleChange}
          id={'boolean-radio-false'}
        />
      </div>
    </>
  );
}