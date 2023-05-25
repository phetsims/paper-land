import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function CreateBooleanForm( props ) {

  const handleChange = event => {
    props.isFormValid( true );
  };
  return (
    <>
      <div className={styles.controlElement}>
        <Form.Label>Default Value</Form.Label>
        <Form.Check
          type={'radio'}
          value={true}
          label={'True'}
          checked
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