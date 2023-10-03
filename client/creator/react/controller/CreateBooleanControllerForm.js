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
      if ( !componentData.controlType ) {
        return [ 'No control type selected.' ];
      }
      else {
        return [];
      }
    },
    props.getFormData,
    BooleanPropertyController
  );

  const controlTypes = BooleanPropertyController.ControlType.enumeration.values;

  return (
    <>
      <div className={styles.controlElement}>
        <Form.Label>Choose how paper events control the value:</Form.Label>
        {controlTypes.map( value => {
          const nameString = value === BooleanPropertyController.ControlType.MARKER ? 'Marker - true when marker is on paper' :
                             value === BooleanPropertyController.ControlType.WHISKER ? 'Whisker - true when paper is close to another' :
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
      <div
        className={styles.controlElement}
        hidden={formData.controlType !== BooleanPropertyController.ControlType.WHISKER.toString()}
      >
        <Form.Label>Other paper number - only this paper will trigger events. Leave empty for all papers.</Form.Label>
        <Form.Control
          type={'number'}
          value={formData.whiskerConfiguration.otherPaperNumber}
          onChange={event => {
            handleChange( { whiskerConfiguration: { otherPaperNumber: event.target.value } } );
          }}
        />

        <Form.Label>Top whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={formData.whiskerConfiguration.topLength}
          onChange={event => {
            handleChange( { whiskerConfiguration: { topLength: event.target.value } } );
          } }
        />

        <Form.Label>Right whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={formData.whiskerConfiguration.rightLength}
          onChange={event => {
            handleChange( { whiskerConfiguration: { rightLength: event.target.value } } );
          } }
        />

        <Form.Label>Bottom whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={formData.whiskerConfiguration.bottomLength}
          onChange={event => {
            handleChange( { whiskerConfiguration: { bottomLength: event.target.value } } );
          } }
        />

        <Form.Label>Left whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={formData.whiskerConfiguration.leftLength}
          onChange={event => {
            handleChange( { whiskerConfiguration: { leftLength: event.target.value } } );
          } }
        />
      </div>
    </>
  );
}