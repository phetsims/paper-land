import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import BooleanPropertyController from '../../model/controllers/BooleanPropertyController.js';

export default function CreateBooleanControllerForm( props ) {

  // Reference to the current value (not state because we don't need a re-render)
  const controlTypeValue = useRef( true );

  const controlTypes = BooleanPropertyController.ControlType.enumeration.values;

  const handleChange = event => {
    controlTypeValue.current = event.target.value;

    props.isFormValid( true );
    props.getFormData( { controlType: controlTypeValue.current } );
  };
  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how paper events control the value:</Form.Label>
      {controlTypes.map( value => {
        const nameString = value === BooleanPropertyController.ControlType.MARKER ? 'Marker - true when marker is on paper' :
                           'Rotation - true when paper is rotated 90 degrees';

        return <Form.Check
          name={'vector2ControllerType'}
          value={value}
          type={'radio'}
          id={`vector2-${value}`}
          key={`vector2-${value}`}
          label={nameString}
          onChange={handleChange}
        />;
      } )}
    </div>
  );
}