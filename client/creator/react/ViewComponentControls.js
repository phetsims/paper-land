import React from 'react';
import { Accordion } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
import Component from '../model/Component.js';
import styles from './../CreatorMain.css';
import AIHelperChat from './AIHelperChat.js';
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
  const selectedModelComponents = Component.findComponentsByName( props.allModelComponents, props.formData.modelComponentNames );

  return (
    <>
      {props.typeSpecificControls && (
        <>
          <hr/>
          {props.typeSpecificControls}
        </>
      )}
      <hr/>
      <Accordion hidden={props.allModelComponents.length === 0} defaultActiveKey={'0'}>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>Control Function</Accordion.Header>
          <Accordion.Body>
            <div>
              <ModelComponentSelector
                allModelComponents={props.allModelComponents}
                componentsPrompt={props.componentsPrompt}
                referenceComponentNames={props.formData.referenceComponentNames}
                selectedModelComponents={selectedModelComponents}
                handleChange={( selectedComponents, referenceComponentNames ) => {

                  const newObject = {
                    modelComponentNames: selectedComponents.map( component => component.nameProperty.value )
                  };

                  // If the second argument is null, this means a change (likely adding) to the model components but
                  // no change to the reference components.
                  if ( referenceComponentNames ) {
                    newObject.referenceComponentNames = referenceComponentNames;
                  }

                  props.handleChange( newObject );
                }}
              ></ModelComponentSelector>
            </div>
            <hr/>
            <div>
              <p className={`${styles.controlElement} ${styles.largerText}`}>{props.functionPrompt}</p>
              {
                selectedModelComponents.length === 0 ? (
                  <p className={styles.controlElement}>No components selected.</p>
                ) : (
                  <>
                    <p>Available variables: </p>
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
                  </>
                )
              }
              {props.typeSpecificFunctions ? props.typeSpecificFunctions : ''}
              <CreatorMonacoEditor
                controlFunctionString={props.formData.controlFunctionString}
                handleChange={newValue => {
                  props.handleChange( { controlFunctionString: newValue } );
                }}></CreatorMonacoEditor>
              <AIHelperChat
                settableComponents={props.settableComponents}
                additionalControlFunctions={props.additionalControlFunctions}
                variableComponents={selectedModelComponents}
                additionalPromptContent={props.additionalPromptContent || ''}
              ></AIHelperChat>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/*Controls that are specific to this view component that you want to layout after the function editor.*/}
      {props.typeSpecificEndControls && (
        <>
          <hr/>
          {props.typeSpecificEndControls}
        </>
      )}
    </>
  );
}