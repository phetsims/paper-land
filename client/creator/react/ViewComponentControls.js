import React, { useRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
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

  // The selected model components
  const [ selectedComponents, setSelectedComponents ] = useState( [] );

  // Reference to the current code in the editor
  const currentCode = useRef( '' );

  const handleAnyChange = () => {
    const valid = selectedComponents.length > 0 && currentCode.current.length > 0;
    props.isFormValid( valid );

    props.getFormData( {
      dependencies: selectedComponents,
      code: currentCode.current
    } );
  };

  return (
    <>
      {props.typeSpecificControls ? props.typeSpecificControls : ''}
      <hr/>
      <div className={styles.controlElement}>
        <h4>Model dependencies</h4>
        <p className={styles.controlElement}>{props.componentsPrompt}</p>
        <ModelComponentSelector
          allModelComponents={props.allModelComponents}
          handleChange={selectedComponents => {
            setSelectedComponents( selectedComponents );
            handleAnyChange();
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
            selectedComponents.map( ( selectedComponent, index ) => {
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
          handleChange={newValue => {
            currentCode.current = newValue;
            handleAnyChange();
          }}></CreatorMonacoEditor>
      </div>
    </>
  );
}