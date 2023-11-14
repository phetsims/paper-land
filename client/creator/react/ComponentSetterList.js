import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { createSetterFunctionString } from '../../utils.js';
import styles from './../CreatorMain.css';

export default function ComponentSetterList( props ) {

  // An extra string that describes how the displayed functions can be used.
  const helperPrompt = props.helperPrompt || '';
  const components = props.components;

  return (
    <>
      <p className={styles.controlElement}>{helperPrompt}</p>
      <p>Setter functions:</p>
      <ListGroup>
        {
          components.map( ( selectedComponent, index ) => {
            const documentationString = createSetterFunctionString( selectedComponent );
            return documentationString ? (
              <ListGroup.Item
                key={`component-documentation-${index}`}
                className={styles.listGroupItem}
              >{documentationString}</ListGroup.Item>
            ) : null;
          } )
        }
      </ListGroup>
    </>
  );
}