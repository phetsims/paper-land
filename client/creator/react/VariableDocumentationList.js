import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { getComponentDocumentation } from '../../utils.js';
import styles from './../CreatorMain.css';

export default function VariableDocumentationList( props ) {
  const functionPrompt = props.functionPrompt || '';
  const components = props.components;

  // A list of strings, any additional varaibles that will be available for a context that are in addition
  // to the list of components.
  const additionalVariables = props.additionalVariables || [];

  return (
    <>
      <p className={styles.controlElement}>{functionPrompt}</p>
      <p>Available variables:</p>
      <ListGroup>

        { /* List of additional variables */ }
        {
          additionalVariables.map( ( variable, index ) => {
            return (
              <ListGroup.Item
                key={`additional-variable-${index}`}
                className={styles.listGroupItem}
              >{variable}</ListGroup.Item>
            );
          } )
        }

        { /* List of documentation for selected components */ }
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