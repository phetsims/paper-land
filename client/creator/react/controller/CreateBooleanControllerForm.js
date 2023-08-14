import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import BooleanPropertyController from '../../model/controllers/BooleanPropertyController.js';
import useEditableForm from '../useEditableForm.js';

export default function CreateBooleanControllerForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return !!componentData.controlType;
    },
    props.getFormData,
    BooleanPropertyController
  );

  const controlTypes = BooleanPropertyController.ControlType.enumeration.values;

  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how paper events control the value:</Form.Label>
      {controlTypes.map( value => {
        const nameString = value === BooleanPropertyController.ControlType.MARKER ? 'Marker - true when marker is on paper' :
                           'Rotation - true when paper is rotated 90 degrees';

        const valueString = value.toString();
        return <Form.Check
          name={'vector2ControllerType'}
          checked={valueString === formData.controlType}
          value={valueString}
          type={'radio'}
          id={`vector2-${value}`}
          key={`vector2-${value}`}
          label={nameString}
          onChange={() => {
            handleChange( { controlType: valueString } );
          }}
        />;
      } )}
    </div>
  );
}