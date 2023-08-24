import React, { useEffect, useState } from 'react';
import { isNameValid } from '../../../utils.js';
import Component from '../../model/Component.js';
import AnimationListenerComponent from '../../model/controllers/AnimationListenerComponent.js';
import ComponentSetterList from '../ComponentSetterList.js';
import CreateComponentButton from '../CreateComponentButton.js';
import CreatorMonacoEditor from '../CreatorMonacoEditor.js';
import ModelComponentSelector from '../ModelComponentSelector.js';
import useEditableForm from '../useEditableForm.js';

export default function AnimationControllerForm( props ) {
  const allModelComponents = props.allModelComponents;
  const activeEditProperty = props.activeEditProperty;
  const componentName = props.componentName;
  const model = props.model;

  // validity state for the form
  const [ formValid, setFormValid ] = useState( false );

  // The function that determines if the form is valid, needs to be updated when formData and name
  // change
  const getIsFormValid = currentFormData => {
    const nameGood = isNameValid( activeEditProperty.value, model, componentName );
    const controlledGood = currentFormData.controlledPropertyNames.length > 0;
    const controlFunctionGood = currentFormData.controlFunctionString.length > 0;
    return nameGood && controlledGood && controlFunctionGood;
  };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,

    // only the name controls validity for now
    valid => {
      setFormValid( valid );
    },
    data => {
      return getIsFormValid( data );
    },
    props.getFormData,
    AnimationListenerComponent
  );

  useEffect( () => {
    setFormValid( getIsFormValid( formData ) );
  }, [ componentName ] );

  const selectedControlledComponents = Component.findComponentsByName( props.allModelComponents, formData.controlledPropertyNames );

  const createComponent = () => {
    if ( props.activeEdit && props.activeEdit.component instanceof AnimationListenerComponent ) {

      // Update values for the existing component if we are editing
      const component = props.activeEdit.component;
      component.nameProperty.value = props.componentName;
      component.setControlledProperties( selectedControlledComponents );
      component.controlFunctionString = formData.controlFunctionString;
    }
    else {
      const animationListener = new AnimationListenerComponent(
        props.componentName,
        selectedControlledComponents,
        formData.controlFunctionString
      );
      props.activeEdit.program.listenerContainer.addAnimationListener( animationListener );
    }

    props.onComponentCreated();
  };

  return (
    <>
      <hr></hr>
      <h4>Controlled Properties</h4>
      <ModelComponentSelector
        allModelComponents={allModelComponents}
        selectedModelComponents={selectedControlledComponents}

        handleChange={selectedComponents => {
          handleChange( { controlledPropertyNames: selectedComponents.map( component => component.nameProperty.value ) } );
        }}
      />
      <ComponentSetterList
        helperPrompt={'Use "dt" and "elapsedTime" in milliseconds to update values with the following functions.'}
        components={selectedControlledComponents}
      ></ComponentSetterList>
      <CreatorMonacoEditor
        controlFunctionString={formData.controlFunctionString}
        handleChange={newValue => {
          handleChange( { controlFunctionString: newValue } );
        }}></CreatorMonacoEditor>
      <CreateComponentButton
        createComponent={createComponent}
        selectedTabFormValid={formValid}
        activeEditProperty={activeEditProperty}
      ></CreateComponentButton>
    </>
  );
}