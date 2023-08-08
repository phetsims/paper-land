import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function ModelComponentSelector( props ) {
  const allModelComponents = props.allModelComponents;
  const selectedModelComponents = props.selectedModelComponents;

  // A function to be called whenever any checkbox changes.
  const handleChange = props.handleChange || ( () => {} );

  // Event listener for every individual checkbox. Will add or remove the component from the state of selected
  // components.
  const handleCheckboxChange = ( event, namedProperty ) => {
    if ( event.target.checked ) {
      handleChange( [ ...selectedModelComponents, namedProperty ] );
    }
    else {
      handleChange( selectedModelComponents.filter( component => component !== namedProperty ) );
    }
  };

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
                           checked={selectedModelComponents.includes( innerComponent )}
                           type={'checkbox'}
                           id={`dependency-checkbox-${innerIndex}`}
                           label={innerComponent.nameProperty.value}
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