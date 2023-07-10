import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function ModelComponentSelector( props ) {
  const allModelComponents = props.allModelComponents;

  // A function to be called whenever any checkbox changes.
  const handleChange = props.handleChange || ( () => {} );

  // state for selected components
  const [ selectedComponents, setSelectedComponents ] = useState( [] );

  const handleCheckboxChange = ( event, namedProperty ) => {
    if ( event.target.checked ) {
      const copy = selectedComponents.slice();
      copy.push( namedProperty );
      setSelectedComponents( copy );
    }
    else {

      // Remove the unchecked component from the list
      const copy = selectedComponents.slice();
      copy.splice( selectedComponents.indexOf( namedProperty ), 1 );
      setSelectedComponents( copy );
    }
  };

  // Call the handleChange function whenever the selected components change
  useEffect( () => {
    handleChange( selectedComponents );
  }, [ selectedComponents ] );

  return (
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
  );
}