import React from 'react';
import Form from 'react-bootstrap/Form';
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

  // Description components have a checkbox to lazily link to the model components - waiting to speak until
  // there is a model change so that speech doesn't happen when you add the program
  const typeSpecificControls = (
    <div className={styles.controlElement}>
      <Form.Check
        type={'checkbox'}
        id={'lazy-link-checkbox'}
        label={'Wait for change to speak'}
        checked={formData.lazyLink}
        onChange={event => {
          handleChange( { lazyLink: event.target.checked } );
        }}/>
    </div>
  );

  const descriptionFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>TODO: Add functions here to control the output.</ListGroup.Item>
      </ListGroup>
    </div>
  );

  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={typeSpecificControls}
        typeSpecificFunctions={descriptionFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt={'Write a function using the variables to return a string.'}
        componentsPrompt={'Function is called and the string is spoken when selected components change.'}
        additionalPromptContent={'Please warn the user that there isnt enough prompt information for description yet.'}
      ></ViewComponentControls>
    </div>
  );
}