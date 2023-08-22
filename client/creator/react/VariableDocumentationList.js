import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
import styles from './../CreatorMain.css';

export default function VariableDocumentationList( props ) {
  const functionPrompt = props.functionPrompt || '';
  const components = props.components;

  return (
    <>
      <p className={styles.controlElement}>{functionPrompt}</p>
      <p>Available variables:</p>
      <ListGroup>
        {
          components.map( ( selectedComponent, index ) => {
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
  );
}