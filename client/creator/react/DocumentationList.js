import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from './../CreatorMain.css';

export default function DocumentationList( props ) {

  // An extra string that describes how the displayed functions or variables can be used.
  const helperPrompt = props.helperPrompt || '';

  const label = props.label || 'Available Functions:';

  // A collection of objects that look like {name: 'name', documentation: 'elementDocumentation'}
  const items = props.items || [];

  return (
    <>
      <p className={styles.controlElement}>{helperPrompt}</p>
      <p>{label}</p>
      <ListGroup>
        {
          items.map( ( item, index ) => {
            return (
              <ListGroup.Item
                key={`item-documentation-${index}`}
                className={styles.listGroupItem}
              >{`${item.name} - ${item.documentation}`}</ListGroup.Item>
            );
          } )
        }
      </ListGroup>
    </>
  );
}