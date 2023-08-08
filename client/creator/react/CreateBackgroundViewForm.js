import React from 'react';
import BackgroundViewComponent from '../model/views/BackgroundViewComponent.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateBackgroundViewForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return componentData.modelComponentNames.length > 0 &&
             componentData.controlFunctionString.length > 0;
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
        functionPrompt={'Write a function with the provided variables to return a color string. Can be any CSS color.'}
        componentsPrompt={'Background color will change when any of the selected components change.'}
      ></ViewComponentControls>
    </div>
  );
}