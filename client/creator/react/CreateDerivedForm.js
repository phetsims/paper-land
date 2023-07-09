/**
 * A form that will create a DerivedProperty. Select from multiple model components
 * and create a derivation function that defines the Propery's value.
 */

import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import MonacoEditor from 'react-monaco-editor';
import { getComponentDocumentation } from '../../utils.js';
import styles from './../CreatorMain.css';

export default function CreateDerivedForm( props ) {
  const allModelComponents = props.allModelComponents;

  // Components selected for the dependencies
  const [ selectedComponents, setSelectedComponents ] = useState( [] );

  // Current string value of the monaco editor
  const codeString = useRef( '' );

  const handleCheckboxChange = ( event, namedProperty ) => {
    if ( event.target.checked ) {
      setSelectedComponents( oldValues => [ ...oldValues, namedProperty ] );
    }
    else {

      // Remove the unchecked component from the list
      const copy = selectedComponents.slice();
      copy.splice( selectedComponents.indexOf( namedProperty ), 1 );
      setSelectedComponents( copy );
    }
  };

  // Handles changes to the Monaco editor, saving the code value and passing to parent whenever there is an edit.
  const handleCodeChange = ( newValue, event ) => {
    codeString.current = newValue;
  };

  // Validate and send data to parent forms whenever there is any sort of change
  const handleAnyChange = () => {
    const valid = selectedComponents.length > 0 && codeString.current.length > 0;
    props.isFormValid( valid );

    props.getFormData( {
      dependencies: selectedComponents,
      derivation: codeString.current
    } );
  };

  useEffect( () => {
    console.log( 'update' );
  }, props.allModelComponents );

  return (
    <>
      <div className={styles.controlElement}>
        <p>Select dependency model components. This component will compute a new value whenever any dependency changes.</p>
        <Container>
          {
            allModelComponents.map( ( component, index ) => {
              if ( index % 3 === 0 ) {
                const nextThreeComponents = allModelComponents.slice( index, index + 3 );

                // We will fill the array with entries for layout so that the row is full, even
                // if there isn't a component to render in that column
                while ( nextThreeComponents.length < 3 ) {
                  nextThreeComponents.push( undefined );
                }

                return (
                  <Row key={`component-checkbox-row-${index}`}>
                    {
                      nextThreeComponents.map( ( innerComponent, innerIndex ) => {
                        return (
                          <Col key={`inner-row-${innerIndex}`}>
                            {innerComponent ?
                             <Form.Check
                               type={'checkbox'}
                               id={`dependency-checkbox-${innerIndex}`}
                               label={innerComponent.name}
                               onChange={event => {
                                 handleCheckboxChange( event, innerComponent );
                                 handleAnyChange();
                               }}
                             /> : ''
                            }
                          </Col>
                        );
                      } )
                    }
                  </Row>
                );
              }
              else {
                return '';
              }
            } )
          }
        </Container>
      </div>
      <div hidden={allModelComponents.length === 0}>
        <p className={styles.controlElement}>Write the body of a function that returns the desired value.</p>
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
        <div className={`${styles.editor} ${styles.controlElement}`}>
          <MonacoEditor
            language='javascript'
            theme='vs-dark'
            onChange={( newValue, event ) => {
              handleCodeChange( newValue, event );
              handleAnyChange();
            }}
            options={{
              tabSize: 2,
              fontSize: '16px',
              minimap: { enabled: false },
              automaticLayout: true
            }}
          />
        </div>
      </div>
    </>
  );
}