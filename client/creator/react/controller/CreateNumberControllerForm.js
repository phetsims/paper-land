import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import NumberPropertyController from '../../model/controllers/NumberPropertyController.js';

export default function CreateNumberControllerForm( props ) {

  // Reference to the current value (not state because we don't need a re-render)
  const directionControlType = useRef( null );
  const relationshipControlType = useRef( null );

  const directionControlTypes = NumberPropertyController.DirectionControlType.enumeration.values;
  const relationshipControlTypes = NumberPropertyController.RelationshipControlType.enumeration.values;

  const handleChange = event => {
    props.isFormValid( true );
    props.getFormData( {
      directionControlType: directionControlType.current,
      relationshipControlType: relationshipControlType.current
    } );
  };
  return (
    <div className={styles.controlElement}>
      <Form.Label>Paper movement:</Form.Label>
      {directionControlTypes.map( value => {
        const nameString = value === NumberPropertyController.DirectionControlType.HORIZONTAL ? 'Horizontal' :
                           value === NumberPropertyController.DirectionControlType.VERTICAL ? 'Vertical' :
                           'Rotation';

        return <Form.Check
          name={'direction-options'}
          value={value}
          type={'radio'}
          id={`number-direction-${value}`}
          key={`number-direction-${value}`}
          label={nameString}
          onChange={event => {
            directionControlType.current = event.target.value;
            handleChange( event );
          }}
        />;
      } )}
      <Form.Label>Value relationship:</Form.Label>
      {relationshipControlTypes.map( value => {
        const nameString = value === NumberPropertyController.RelationshipControlType.LINEAR ? 'Linear' :
                           value === NumberPropertyController.RelationshipControlType.EXPONENTIAL ? 'Exponential' :
                           'Logarithmic';

        return <Form.Check
          name={'relationship-controls'}
          value={value}
          type={'radio'}
          id={`number-relationship-${value}`}
          key={`number-relationship-${value}`}
          label={nameString}
          onChange={event => {
            relationshipControlType.current = event.target.value;
            handleChange( event );
          }}
        />;
      } )}
    </div>
  );
}