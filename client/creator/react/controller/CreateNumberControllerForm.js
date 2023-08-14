import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import NumberPropertyController from '../../model/controllers/NumberPropertyController.js';
import useEditableForm from '../useEditableForm.js';

export default function CreateNumberControllerForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return !!componentData.controlType && !!componentData.relationshipControlType;
    },
    props.getFormData,
    NumberPropertyController
  );

  const directionControlTypes = NumberPropertyController.DirectionControlType.enumeration.values;
  const relationshipControlTypes = NumberPropertyController.RelationshipControlType.enumeration.values;

  return (
    <div className={styles.controlElement}>
      <Form.Label>Paper movement:</Form.Label>
      {directionControlTypes.map( value => {
        const nameString = value === NumberPropertyController.DirectionControlType.HORIZONTAL ? 'Horizontal' :
                           value === NumberPropertyController.DirectionControlType.VERTICAL ? 'Vertical' :
                           'Rotation';

        const valueString = value.toString();
        return <Form.Check
          name={'direction-options'}
          value={valueString}
          checked={valueString === formData.controlType}
          type={'radio'}
          id={`number-direction-${valueString}`}
          key={`number-direction-${valueString}`}
          label={nameString}
          onChange={() => {
            handleChange( { directionControlType: valueString } );
          }}
        />;
      } )}
      <Form.Label>Value relationship:</Form.Label>
      {relationshipControlTypes.map( value => {
        const nameString = value === NumberPropertyController.RelationshipControlType.LINEAR ? 'Linear' :
                           value === NumberPropertyController.RelationshipControlType.EXPONENTIAL ? 'Exponential' :
                           'Logarithmic';

        const valueString = value.toString();
        return <Form.Check
          name={'relationship-controls'}
          value={valueString}
          checked={valueString === formData.relationshipControlType}
          type={'radio'}
          id={`number-relationship-${valueString}`}
          key={`number-relationship-${valueString}`}
          label={nameString}
          onChange={() => {
            handleChange( { relationshipControlType: valueString } );
          }}
        />;
      } )}
    </div>
  );
}