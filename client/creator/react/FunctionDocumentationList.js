import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from './../CreatorMain.css';

export default function FunctionDocumentationList( props ) {

  // An extra string that describes how the displayed functions can be used.
  const helperPrompt = props.helperPrompt || '';

  // A collection of objects that look like {name: 'functionName', documentation: 'functionDocumentation'}
  const functionObjects = props.functionObjects || [];

  return (
    <>
      <p className={styles.controlElement}>{helperPrompt}</p>
      <p>Available Functions:</p>
      <ListGroup>
        {
          functionObjects.map( ( functionObject, index ) => {
            return (
              <ListGroup.Item
                key={`function-documentation-${index}`}
                className={styles.listGroupItem}
              >{`${functionObject.name} - ${functionObject.documentation}`}</ListGroup.Item>
            );
          } )
        }
      </ListGroup>
    </>
  );
}