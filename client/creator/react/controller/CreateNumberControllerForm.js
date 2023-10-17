import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import NumberPropertyController from '../../model/controllers/NumberPropertyController.js';
import useEditableForm from '../useEditableForm.js';

export default function CreateNumberControllerForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {

      const invalidReasons = [];

      // For paper control, the relationship control type is required
      if ( componentData.controlTypeFamily === 'PAPER_MOVEMENT' ) {
        if ( !componentData.controlType || !componentData.relationshipControlType ) {
          invalidReasons.push( 'No control type selected.' );
        }
      }
      else {
        if ( !componentData.controlType ) {
          invalidReasons.push( 'No control type selected.' );
        }
      }

      return invalidReasons;
    },
    props.getFormData,
    NumberPropertyController
  );

  return (
    <div className={styles.controlElement}>
      <FamilyTypeSelect controlTypeFamily={formData.controlTypeFamily} handleChange={handleChange}/>
      <div hidden={formData.controlTypeFamily !== 'PAPER_MOVEMENT'}>
        <NumberPropertyControlTypeForm controlType={formData.controlType} relationshipControlType={formData.relationshipControlType} handleChange={handleChange}/>
      </div>
      <div hidden={formData.controlTypeFamily !== 'MARKERS'}>
        <MarkerControlTypeForm controlType={formData.controlType} handleChange={handleChange}/>
      </div>
    </div>
  );
}

/**
 * A form that lets you select the family of control type for a number. Selection will reveal more options.
 */
const FamilyTypeSelect = function( props ) {
  const controlTypeFamily = props.controlTypeFamily;
  const handleChange = props.handleChange;

  const familyKeys = Object.keys( NumberPropertyController.FAMILY_TO_CONTROL_TYPE_MAP );

  return (
    <div className={styles.controlElement}>
      <Form.Label>Select a controller type for the number:</Form.Label>
      <Form.Select
        value={controlTypeFamily}
        onChange={event => {
          handleChange( {
            controlTypeFamily: event.target.value,

            // when changing the family, we need to clear related selections so they don't appear as entries during
            // validation
            controlType: '',
            relationshipControlType: ''
          } );
        }}
      >
        {familyKeys.map( controlTypeFamily => {
          return <option value={controlTypeFamily} key={controlTypeFamily}>{
            controlTypeFamily === 'PAPER_MOVEMENT' ? 'Paper Movement' : 'Markers'
          }</option>;
        } )}
      </Form.Select>
    </div>
  );
};

/**
 * A component that lets you select the attributes of a paper movement controller for a number Property.
 */
const NumberPropertyControlTypeForm = function( props ) {

  const controlType = props.controlType;
  const relationshipControlType = props.relationshipControlType;
  const handleChange = props.handleChange;

  const directionControlTypes = NumberPropertyController.FAMILY_TO_CONTROL_TYPE_MAP.PAPER_MOVEMENT;
  const relationshipControlTypes = NumberPropertyController.RelationshipControlType.enumeration.values;

  return (
    <>
      <Form.Label>Paper movement:</Form.Label>
      {directionControlTypes.map( value => {
        const nameString = value === NumberPropertyController.NumberPropertyControlType.HORIZONTAL ? 'Horizontal' :
                           value === NumberPropertyController.NumberPropertyControlType.VERTICAL ? 'Vertical' :
                           'Rotation';

        const valueString = value.toString();
        return <Form.Check
          name={'direction-options'}
          value={valueString}
          checked={valueString === controlType}
          type={'radio'}
          id={`number-direction-${valueString}`}
          key={`number-direction-${valueString}`}
          label={nameString}
          onChange={() => {
            handleChange( { controlType: valueString } );
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
          checked={valueString === relationshipControlType}
          type={'radio'}
          id={`number-relationship-${valueString}`}
          key={`number-relationship-${valueString}`}
          label={nameString}
          onChange={() => {
            handleChange( { relationshipControlType: valueString } );
          }}
        />;
      } )}
    </>
  );
};

/**
 * A form that lets you select the attributes of a marker controller for a number Property.
 */
const MarkerControlTypeForm = function( props ) {
  const handleChange = props.handleChange;
  const controlType = props.controlType;

  const markerControlTypes = NumberPropertyController.FAMILY_TO_CONTROL_TYPE_MAP.MARKERS;

  return (
    <>
      <Form.Label>Marker control type:</Form.Label>
      {markerControlTypes.map( value => {
        const nameString = value === NumberPropertyController.NumberPropertyControlType.MARKER_COUNT ? 'Marker Count - Number of markers on the paper sets the value.' :
                           'Marker Location - Location of a marker on the paper sets the value like a slider.';

        const valueString = value.toString();
        return <Form.Check
          name={'marker-controls'}
          value={valueString}
          checked={valueString === controlType}
          type={'radio'}
          id={`number-marker-${valueString}`}
          key={`number-marker-${valueString}`}
          label={nameString}
          onChange={() => {
            handleChange( { controlType: valueString } );
          }}
        />;
      } )}
    </>
  );
};