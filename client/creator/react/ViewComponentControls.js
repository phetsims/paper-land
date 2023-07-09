import React, { useRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
import styles from './../CreatorMain.css';
import CreatorMonacoEditor from './CreatorMonacoEditor.js';
import ModelComponentSelector from './ModelComponentSelector.js';

export default function ViewComponentControls( props ) {

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
        <p>Select dependency model components. The sound will play whenever a dependency model component changes.</p>
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
        <p className={styles.controlElement}>Write the body of a function that can change sound attributes.</p>
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