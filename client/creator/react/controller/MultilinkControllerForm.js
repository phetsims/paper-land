import React, { useEffect, useState } from 'react';
import { isNameValid } from '../../../utils.js';
import Component from '../../model/Component.js';
import MultilinkListenerComponent from '../../model/controllers/MultilinkListenerComponent.js';
import CreateComponentButton from '../CreateComponentButton.js';
import CreatorMonacoEditor from '../CreatorMonacoEditor.js';
import ModelComponentSelector from '../ModelComponentSelector.js';
import useEditableForm from '../useEditableForm.js';
import VariableDocumentationList from '../VariableDocumentationList.js';

export default function MultilinkControllerForm( props ) {
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
    const dependenciesGood = currentFormData.dependencyNames.length > 0;
    const controlledGood = currentFormData.controlledPropertyNames.length > 0;
    const controlFunctionGood = currentFormData.controlFunctionString.length > 0;
    return nameGood && dependenciesGood && controlledGood && controlFunctionGood;
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
    MultilinkListenerComponent
  );

  useEffect( () => {
    setFormValid( getIsFormValid( formData ) );
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
      throw new Error( 'Edit of MultilinkController not yet implemented.' );
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
      <VariableDocumentationList
        components={selectedModelComponents}
      ></VariableDocumentationList>
      <hr></hr>
      <h4>Controlled Properties</h4>
      <ModelComponentSelector
        allModelComponents={controllableComponents}
        selectedModelComponents={selectedControlledComponents}

        handleChange={selectedComponents => {
          handleChange( { controlledPropertyNames: selectedComponents.map( component => component.nameProperty.value ) } );
        }}
      />
      <CreatorMonacoEditor
        formData={formData}
        handleChange={newValue => {
          handleChange( { controlFunctionString: newValue } );
        }}></CreatorMonacoEditor>
      <CreateComponentButton
        createComponent={createComponent}
        selectedTabFormValid={formValid}
        activeEditProperty={activeEditProperty}
      ></CreateComponentButton>
    </div>
  );
}