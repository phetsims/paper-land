import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import EnumerationPropertyController from '../../model/controllers/EnumerationPropertyController.js';
import useEditableForm from '../useEditableForm.js';

export default function CreateEnumerationControllerForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return !!componentData.controlType;
    },
    props.getFormData,
    EnumerationPropertyController
  );

  const controlTypes = EnumerationPropertyController.ControlType.enumeration.values;
  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how the paper events control the value:</Form.Label>
      {controlTypes.map( value => {
        const nameString = value === EnumerationPropertyController.ControlType.MARKERS ? 'Markers' :
                           'Rotation';

        const valueString = value.toString();
        return <Form.Check
          name={'enumerationPropertyController'}
          value={valueString}
          checked={valueString === formData.controlType}
          type={'radio'}
          id={`enum-${value}`}
          key={`enum-${value}`}
          label={nameString}
          onChange={() => {
            handleChange( { controlType: valueString } );
          }}
        />;
      } )}
    </div>
  );
}