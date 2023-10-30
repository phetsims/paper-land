import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import BoundsPropertyController from '../../model/controllers/BoundsPropertyController.js';
import useEditableForm from '../useEditableForm.js';

export default function CreateBounds2ControllerForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      if ( !componentData.controlType ) {
        return [ 'No control type selected.' ];
      }
      else {
        return [];
      }
    },
    props.getFormData,
    BoundsPropertyController
  );

  const controlTypes = BoundsPropertyController.ControlType.enumeration.values;
  return (
    <div className={styles.controlElement}>
      <Form.Label>Choose how the paper controls the bounds:</Form.Label>
      {controlTypes.map( value => {

        // This is the only control type for now, so just hard code it
        const nameString = 'Bounds will match paper size and location.';
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