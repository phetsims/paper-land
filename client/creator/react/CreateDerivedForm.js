/**
 * A form that will create a DerivedProperty. Select from multiple model components
 * and create a derivation function that defines the Propery's value.
 */

import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import styles from './../CreatorMain.css';
import AIHelperChat from './AIHelperChat.js';
import CreatorMonacoEditor from './CreatorMonacoEditor.js';
import ModelComponentSelector from './ModelComponentSelector.js';
import useEditableForm from './useEditableForm.js';

export default function CreateDerivedForm( props ) {
  const allModelComponents = props.allModelComponents;

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    proposedData => {

      // valid as long as at least one dependency is selected
      if ( proposedData.dependencyNames.length === 0 ) {
        return [ 'No model components selected.' ];
      }
      else {
        return [];
      }
    },
    props.getFormData,
    NamedDerivedProperty
  );

  // The Derived component can observe changes to all model components except for itself (the ActiveEdit)
  // and ArrayItem components.
  const usableModelComponents = allModelComponents.filter( component => {
    return component !== props.activeEdit.component && component.propertyType !== 'ArrayItem';
  } );

  /**
   * Finds a component by name from all model components.
   */
  const findDependency = name => {
    const component = allModelComponents.find( component => component.nameProperty.value === name );
    if ( !component ) {
      throw new Error( 'Could not find component with name ' + name );
    }
    return component;
  };

  // Update list of selected dependencies
  const handleCheckboxChange = ( event, componentName ) => {
    if ( event.target.checked ) {
      handleChange( { dependencyNames: [ ...formData.dependencyNames, componentName ] } );
    }
    else {
      handleChange( { dependencyNames: formData.dependencyNames.filter( name => name !== componentName ) } );
    }
  };

  return (
    <>
      <div className={styles.controlElement}>
        <ModelComponentSelector
          allModelComponents={usableModelComponents}
          componentsPrompt={'Select dependency model components. This component will compute a new value whenever any dependency changes.'}
          selectedModelComponents={formData.dependencyNames.map( name => findDependency( name ) )}
          handleChange={selectedComponents => {
            handleChange( { dependencyNames: selectedComponents.map( component => component.nameProperty.value ) } );
          }}

          // For the DerivedProperty, we assume that all components are dependencies.
          hideDependencyControl={true}
        ></ModelComponentSelector>
      </div>
      <div hidden={usableModelComponents.length === 0}>
        <p className={styles.controlElement}>Write the body of a function that returns the desired value.</p>
        <p>Available variables:</p>
        <ListGroup>
          {
            formData.dependencyNames.map( ( dependencyName, index ) => {
              return (
                <ListGroup.Item
                  key={`component-documentation-${index}`}
                  className={styles.listGroupItem}
                >{getComponentDocumentation( findDependency( dependencyName ) )}</ListGroup.Item>
              );
            } )
          }
        </ListGroup>
        <CreatorMonacoEditor
          controlFunctionString={formData.derivation}
          handleChange={newValue => {
            handleChange( { derivation: newValue } );
          }}></CreatorMonacoEditor>
        <AIHelperChat
          variableComponents={formData.dependencyNames.map( name => findDependency( name ) )}
          additionalPromptContent={'My function will compute a new value whenever any of my variables change. Can you please write a return statement for the function?'}
        ></AIHelperChat>
      </div>
    </>
  );
}