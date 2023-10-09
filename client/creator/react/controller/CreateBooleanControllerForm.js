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
        hidden={formData.controlType !== BooleanPropertyController.ControlType.MARKER.toString()}
      >
        <Form.Label>Marker color - only this color will trigger events.</Form.Label>
        <Form.Select
          value={formData.markerColor}
          onChange={event => {
            handleChange( { markerColor: event.target.value } );

          }}
        >
          <option value={''}>All colors</option>
          <option value={'red'}>Red</option>
          <option value={'green'}>Green</option>
          <option value={'blue'}>Blue</option>
          <option value={'black'}>Black</option>
        </Form.Select>
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
      </div>
    </>
  );
}