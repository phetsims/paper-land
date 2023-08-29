import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import Vector2PropertyController from '../../model/controllers/Vector2PropertyController.js';
import useEditableForm from '../useEditableForm.js';

export default function CreateVector2ControllerForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return componentData.controlType;
    },
    props.getFormData,
    Vector2PropertyController
  );

  const controlTypes = Vector2PropertyController.ControlType.enumeration.values;
  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how the paper position controls the value:</Form.Label>
      {controlTypes.map( value => {
        const nameString = value === Vector2PropertyController.ControlType.MATCH_CENTER ? 'Match Center - (x,y) will patch paper center' :
                           value === Vector2PropertyController.ControlType.MATCH_X ? 'Match X - x will match paper center, y will use default value' :
                           'Match Y - y will match paper center, x will use default value';


        const valueString = value.toString();
        return <Form.Check
          name={'vector2ControllerType'}
          checked={valueString === formData.controlType}
          value={value}
          type={'radio'}
          id={`vector2-${value}`}
          key={`vector2-${value}`}
          label={nameString}
          onChange={ () => {
            handleChange( { controlType: valueString } );
          }}
        />;
      } )}
    </div>
  );
}