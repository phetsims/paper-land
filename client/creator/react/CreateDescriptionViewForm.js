import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import DescriptionViewComponent from '../model/views/DescriptionViewComponent.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateDescriptionViewForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      const invalidReasons = [];
      if ( componentData.modelComponentNames.length === 0 ) {
        invalidReasons.push( 'No model components selected.' );
      }
      if ( componentData.controlFunctionString.length === 0 ) {
        invalidReasons.push( 'Control function has no content.' );
      }
      return invalidReasons;
    },
    props.getGeneralFormData,
    DescriptionViewComponent
  );


  const descriptionFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>clearUtteranceQueue() - Interrupt and cancel anything that hasn't finished speaking.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setPriorityLevel() - A number greater than zero. How important 'this' speech is relative to others. Higher priority speech cancels lower priority speech.</ListGroup.Item>
      </ListGroup>
    </div>
  );

  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificFunctions={descriptionFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt={'Write a function using the variables to return a string.'}
        componentsPrompt={'Function is called and the string is spoken when selected components change.'}
      ></ViewComponentControls>
    </div>
  );
}