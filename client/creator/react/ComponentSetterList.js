import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from './../CreatorMain.css';

const createSetterFunctionString = componentName => {
  const capitalizedComponentName = componentName.charAt( 0 ).toUpperCase() + componentName.slice( 1 );
  return `set${capitalizedComponentName}( value )`;
};

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
            return (
              <ListGroup.Item
                key={`component-documentation-${index}`}
                className={styles.listGroupItem}
              >{createSetterFunctionString( selectedComponent.nameProperty.value )}</ListGroup.Item>
            );
          } )
        }
      </ListGroup>
    </>
  );
}