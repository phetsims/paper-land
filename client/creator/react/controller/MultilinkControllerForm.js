import React, { useEffect, useState } from 'react';
import { isNameValid } from '../../../utils.js';
import Component from '../../model/Component.js';
import MultilinkListenerComponent from '../../model/controllers/MultilinkListenerComponent.js';
import AIHelperChat from '../AIHelperChat.js';
import ComponentSetterList from '../ComponentSetterList.js';
import CreateComponentButton from '../CreateComponentButton.js';
import CreatorMonacoEditor from '../CreatorMonacoEditor.js';
import FormInvalidReasons from '../FormInvalidReasons.js';
import ModelComponentSelector from '../ModelComponentSelector.js';
import useEditableForm from '../useEditableForm.js';
import VariableDocumentationList from '../VariableDocumentationList.js';

export default function MultilinkControllerForm( props ) {
  const allModelComponents = props.allModelComponents;
  const activeEditProperty = props.activeEditProperty;
  const componentName = props.componentName;
  const model = props.model;

  // validity state for the form
  const [ formInvalidReasons, setFormInvalidReasons ] = useState( [] );

  // The function that determines if the form is valid, needs to be updated when formData and name
  // change
  const getIsFormValid = currentFormData => {
    const dependenciesGood = currentFormData.dependencyNames.length > 0;
    const controlledGood = currentFormData.controlledPropertyNames.length > 0;
    const controlFunctionGood = currentFormData.controlFunctionString.length > 0;

    const invalidReasons = [];
    if ( !dependenciesGood ) {
      invalidReasons.push( 'Must use at least one dependency component.' );
    }
    if ( !controlledGood ) {
      invalidReasons.push( 'Must select some controlled components.' );
    }
    if ( !controlFunctionGood ) {
      invalidReasons.push( 'The control function is required.' );
    }
    return invalidReasons;
  };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,

    // only the name controls validity for now
    valid => {
      setFormInvalidReasons( valid );
    },
    data => {
      return getIsFormValid( data );
    },
    props.getFormData,
    MultilinkListenerComponent
  );

  useEffect( () => {
    setFormInvalidReasons( getIsFormValid( formData ) );
  }, [ componentName ] );

  // Get the references to the actual model components from selected form data (name strings)
  const selectedModelComponents = Component.findComponentsByName( props.allModelComponents, formData.dependencyNames );
  const selectedControlledComponents = Component.findComponentsByName( props.allModelComponents, formData.controlledPropertyNames );

  // The Properties that you can control are all the Properties minus the selected model components
  const controllableComponents = allModelComponents.filter( component => {
    return !selectedModelComponents.includes( component );
  } );

  const createComponent = () => {
    if ( props.activeEdit && props.activeEdit.component instanceof MultilinkListenerComponent ) {
      const component = props.activeEdit.component;
      component.nameProperty.value = props.componentName;
      component.setDependencies( selectedModelComponents );
      component.setControlledProperties( selectedControlledComponents );
      component.controlFunctionString = formData.controlFunctionString;
    }
    else {
      const multilinkController = new MultilinkListenerComponent(
        props.componentName,
        selectedModelComponents,
        selectedControlledComponents,
        formData.controlFunctionString
      );
      props.activeEdit.program.listenerContainer.addLinkListener( multilinkController );
    }

    props.onComponentCreated();
  };

  // In the custom code block, the user has access to all dependency and controlled components
  const allSelectedComponents = selectedModelComponents.concat( selectedControlledComponents )

  return (
    <div>
      <hr></hr>
      <h4>Dependency Properties</h4>
      <ModelComponentSelector
        allModelComponents={allModelComponents}
        selectedModelComponents={selectedModelComponents}

        handleChange={selectedComponents => {

          handleChange( {
            dependencyNames: selectedComponents.map( component => component.nameProperty.value ),

            // if the selectedComponents contanins a controlled component, that component is no longer controllable
            controlledPropertyNames: selectedControlledComponents.filter( component => !selectedComponents.includes( component ) ).map( component => component.nameProperty.value )
          } );
        }}
      />
      <hr></hr>
      <h4>Controlled Components</h4>
      <ModelComponentSelector
        allModelComponents={controllableComponents}
        selectedModelComponents={selectedControlledComponents}

        handleChange={selectedComponents => {
          handleChange( { controlledPropertyNames: selectedComponents.map( component => component.nameProperty.value ) } );
        }}
      />
      <VariableDocumentationList
        components={allSelectedComponents}
      ></VariableDocumentationList>
      <hr></hr>
      <ComponentSetterList
        components={selectedControlledComponents}
        helperPrompt={'Use the following functions in your code to update model components.'}
      ></ComponentSetterList>
      <CreatorMonacoEditor
        controlFunctionString={formData.controlFunctionString}
        handleChange={newValue => {
          handleChange( { controlFunctionString: newValue } );
        }}></CreatorMonacoEditor>
      <AIHelperChat
        settableComponents={selectedControlledComponents}
        variableComponents={allSelectedComponents}
      ></AIHelperChat>
      <FormInvalidReasons invalidReasons={formInvalidReasons} componentNameValid={isNameValid( activeEditProperty.value, model, componentName )}></FormInvalidReasons>
      <CreateComponentButton
        createComponent={createComponent}
        selectedTabFormValid={formInvalidReasons.length === 0 && isNameValid( activeEditProperty.value, model, componentName )}
        activeEditProperty={activeEditProperty}
      ></CreateComponentButton>
    </div>
  );
}