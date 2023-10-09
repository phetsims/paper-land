import React from 'react';
import BackgroundViewComponent from '../model/views/BackgroundViewComponent.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateBackgroundViewForm( props ) {
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
    BackgroundViewComponent
  );

  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
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