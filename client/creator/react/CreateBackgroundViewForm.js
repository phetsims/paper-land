import React from 'react';
import Form from 'react-bootstrap/Form';
import BackgroundViewComponent from '../model/views/BackgroundViewComponent.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateBackgroundViewForm( props ) {

  // Forwards relevant data to the parent component for creation
  const getFormData = providedData => {
    props.getGeneralFormData( providedData );
    props.getBackgroundFormData( providedData );
  };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {

      const invalidReasons = [];
      if ( componentData.controlFunctionString.length === 0 && componentData.fillColor.length === 0 ) {
        invalidReasons.push( 'Must provide a default fill color or add a control function.' );
      }

      return invalidReasons;
    },
    getFormData,
    BackgroundViewComponent
  );

  // A UI component to select a static fill color
  const staticColorSelector = (
    <div className={styles.controlElement}>
      <Form.Label>Shape fill:</Form.Label>
      <Form.Control
        type='text'
        value={formData.fillColor}
        onChange={event => {
          handleChange( {
            fillColor: event.target.value
          } );
        }}
      ></Form.Control>
    </div>
  );

  return (
    <div>
      <ViewComponentControls

        allModelComponents={props.allModelComponents}
        typeSpecificControls={staticColorSelector}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt={'Write a JavaScript function with the provided variables that returns a color string.'}
        componentsPrompt={'Background color will change when any of the selected components change.'}
        additionalPromptContent={'I need a function that returns a string representing the background color.'}
      ></ViewComponentControls>
    </div>
  );
}