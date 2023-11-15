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
import { getComponentDocumentation } from '../../utils.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import styles from './../CreatorMain.css';
import AIHelperChat from './AIHelperChat.js';
import CreatorMonacoEditor from './CreatorMonacoEditor.js';
import useEditableForm from './useEditableForm.js';

export default function CreateDerivedForm( props ) {
  const allModelComponents = props.allModelComponents;

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    proposedData => {

      // valid as long as at least one dependency is selected
      if ( proposedData.dependencyNames.length === 0 ) {
        return [ 'No model components selected.' ];
      }
      else {
        return [];
      }
    },
    props.getFormData,
    NamedDerivedProperty
  );

  // The Derived component can observe changes to all model components except for itself (the active edit if there is one)
  const usableModelComponents = allModelComponents.filter( component => {
    return component !== props.activeEdit.component;
  } );

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

  return (
    <>
      <div className={styles.controlElement}>
        <p>Select dependency model components. This component will compute a new value whenever any dependency changes.</p>
        <Container>
          {
            usableModelComponents.map( ( component, index ) => {
              if ( index % 3 === 0 ) {
                const nextThreeComponents = usableModelComponents.slice( index, index + 3 );

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
      <div hidden={usableModelComponents.length === 0}>
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
        <CreatorMonacoEditor
          controlFunctionString={formData.derivation}
          handleChange={newValue => {
            handleChange( { derivation: newValue } );
          }}></CreatorMonacoEditor>
        <AIHelperChat
          variableComponents={formData.dependencyNames.map( name => findDependency( name ) )}
          additionalPromptContent={'My function will compute a new value whenever any of my variables change. Can you please write a return statement for the function?'}
        ></AIHelperChat>
      </div>
    </>
  );
}