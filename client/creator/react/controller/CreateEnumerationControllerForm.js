import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import EnumerationPropertyController from '../../model/controllers/EnumerationPropertyController.js';

export default function CreateEnumerationControllerForm( props ) {

  // Reference to the current value (not state because we don't need a re-render)
  const controlTypeValue = useRef( true );

  const controlTypes = EnumerationPropertyController.ControlType.enumeration.values;

  const handleChange = event => {
    controlTypeValue.current = event.target.value;

    props.isFormValid( true );
    props.getFormData( { controlType: controlTypeValue.current } );
  };

  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how the paper events control the value:</Form.Label>
      {controlTypes.map( value => {
        const nameString = value === EnumerationPropertyController.ControlType.MARKERS ? 'Markers' :
                           'Rotation';
        return <Form.Check
          name={'enumerationPropertyController'}
          value={value}
          type={'radio'}
          id={`enum-${value}`}
          key={`enum-${value}`}
          label={nameString}
          onChange={handleChange}
        />;
      } )}
    </div>
  );
}