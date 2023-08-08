import React, { useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
import ViewComponent from '../model/views/ViewComponent.js';
import styles from './../CreatorMain.css';
import CreatorMonacoEditor from './CreatorMonacoEditor.js';
import ModelComponentSelector from './ModelComponentSelector.js';

export default function ViewComponentControls( props ) {

  // required props
  if ( !props.functionPrompt ) {
    throw new Error( 'ViewComponentControls requires a functionPrompt prop.' );
  }
  if ( !props.componentsPrompt ) {
    throw new Error( 'ViewComponentControls requires a componentsPrompt prop.' );
  }
  if ( !props.formData ) {
    throw new Error( 'ViewComponentControls requires a formData prop to control state.' );
  }
  if ( !props.handleChange ) {
    throw new Error( 'ViewComponentControls requires a handleChange prop to control state.' );
  }

  // Get the references to the actual model components from selected form data (name strings)
  const selectedModelComponents = ViewComponent.findDependenciesByName( props.allModelComponents, props.formData.modelComponentNames );

  return (
    <>
      {props.typeSpecificControls ? props.typeSpecificControls : ''}
      <hr/>
      <div className={styles.controlElement}>
        <h4>Model dependencies</h4>
        <p className={styles.controlElement}>{props.componentsPrompt}</p>
        <ModelComponentSelector
          allModelComponents={props.allModelComponents}
          selectedModelComponents={selectedModelComponents}
          handleChange={selectedComponents => {
            props.handleChange( { modelComponentNames: selectedComponents.map( component => component.nameProperty.value ) } );
          }}
        ></ModelComponentSelector>
      </div>
      <hr/>
      <div hidden={props.allModelComponents.length === 0}>
        <h4>Function body</h4>
        <p className={styles.controlElement}>{props.functionPrompt}</p>
        <p>Available variables:</p>
        <ListGroup>
          {
            selectedModelComponents.map( ( selectedComponent, index ) => {
              return (
                <ListGroup.Item
                  key={`component-documentation-${index}`}
                  className={styles.listGroupItem}
                >{getComponentDocumentation( selectedComponent )}</ListGroup.Item>
              );
            } )
          }
        </ListGroup>
        {props.typeSpecificFunctions ? props.typeSpecificFunctions : ''}
        <CreatorMonacoEditor
          formData={props.formData}
          handleChange={newValue => {
            props.handleChange( { controlFunctionString: newValue } );
          }}></CreatorMonacoEditor>
      </div>
    </>
  );
}