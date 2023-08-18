import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from './../CreatorMain.css';

export default function ComponentFunctionsList( props ) {

  const componentFunctions = props.componentFunctions;
  if ( !componentFunctions ) {
    throw new Error( 'Failed to provided component functions.' );
  }

  const functionsTitle = props.functionsTitle || 'Available functions';

  return (
    <div className={styles.controlElement}>
      <p>{`${functionsTitle}:`}</p>
      <ListGroup>
        {
          componentFunctions.map( ( functionString, index ) => {
            return (
              <ListGroup.Item
                key={`function-${index}`}
                className={styles.listGroupItem}
              >{functionString}</ListGroup.Item>
            );
          } )
        }
      </ListGroup>
    </div>
  );
}