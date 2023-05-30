import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import Vector2PropertyController from '../../model/controllers/Vector2PropertyController.js';

export default function CreateVector2ControllerForm( props ) {

  // Reference to the current value (not state because we don't need a re-render)
  const controlTypeValue = useRef( true );

  const controlTypes = Vector2PropertyController.ControlType.enumeration.values;

  const handleChange = event => {
    controlTypeValue.current = event.target.value;

    props.isFormValid( true );
    props.getFormData( { controlType: controlTypeValue.current } );
  };
  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how the paper position controls the value:</Form.Label>
      {controlTypes.map( value => {
        const nameString = value === Vector2PropertyController.ControlType.MATCH_CENTER ? 'Match Center' :
                           value === Vector2PropertyController.ControlType.MATCH_X ? 'Match X' :
                           'Match Y';

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