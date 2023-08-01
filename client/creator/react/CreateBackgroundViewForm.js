import React from 'react';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateBackgroundViewForm( props ) {
  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        isFormValid={props.isFormValid}
        getFormData={props.getGeneralFormData}
        functionPrompt={'Write a function with the provided variables to return a color string. Can be any CSS color.'}
        componentsPrompt={'Background color will change when any of the selected components change.'}
      ></ViewComponentControls>
    </div>
  );
}