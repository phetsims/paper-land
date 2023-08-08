/**
 * A form that will create a DerivedProperty. Select from multiple model components
 * and create a derivation function that defines the Propery's value.
 */

import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import MonacoEditor from 'react-monaco-editor';
import { getComponentDocumentation } from '../../utils.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';

export default function CreateDerivedForm( props ) {
  const allModelComponents = props.allModelComponents;

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    () => {},
    props.getFormData,
    NamedDerivedProperty
  );

  /**
   * Finds a component by name from all model components.
   */
  const findDependency = name => {
    const component = allModelComponents.find( component => component.nameProperty.value === name );
    if ( !component ) {
      throw new Error( 'Could not find component with name ' + name );
    }
    return component;
  };

  // Update list of selected dependencies
  const handleCheckboxChange = ( event, componentName ) => {
    if ( event.target.checked ) {
      handleChange( { dependencyNames: [ ...formData.dependencyNames, componentName ] } );
    }
    else {
      handleChange( { dependencyNames: formData.dependencyNames.filter( name => name !== componentName ) } );
    }
  };

  // Handle a change to the code editor, saving state for the form
  const handleCodeChange = newValue => {
    handleChange( { derivation: newValue } );
  };

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
                               checked={formData.dependencyNames.includes( innerComponent.nameProperty.value )}
                               type={'checkbox'}
                               id={`dependency-checkbox-${innerIndex}`}
                               label={innerComponent.nameProperty.value}
                               onChange={event => {
                                 handleCheckboxChange( event, innerComponent.nameProperty.value );
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
            formData.dependencyNames.map( ( dependencyName, index ) => {
              return (
                <ListGroup.Item
                  key={`component-documentation-${index}`}
                  className={styles.listGroupItem}
                >{getComponentDocumentation( findDependency( dependencyName ) )}</ListGroup.Item>
              );
            } )
          }
        </ListGroup>
        <div className={`${styles.editor} ${styles.controlElement}`}>
          <MonacoEditor
            language='javascript'
            theme='vs-dark'
            value={formData.derivation}
            onChange={( newValue, event ) => {
              handleCodeChange( newValue, event );
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