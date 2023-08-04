import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import NamedVector2Property from '../model/NamedVector2Property.js';
import styles from './../CreatorMain.css';

export default function CreatePositionForm( props ) {
  const [ xValue, setXValue ] = useState( 0 );
  const [ yValue, setYValue ] = useState( 0 );

  props.getFormData( { x: xValue, y: yValue } );

  // Populate the form with the values of the component that is being edited
  useEffect( () => {
    if ( props.activeEdit && props.activeEdit.component && props.activeEdit.component instanceof NamedVector2Property ) {
      setXValue( props.activeEdit.component.defaultX );
      setYValue( props.activeEdit.component.defaultY );
    }
  }, [ props.activeEdit ] );

  const handleChange = ( newX, newY ) => {

    // Update state
    setXValue( newX );
    setYValue( newY );

    // Continue to use function arguments because state is updated asynchronously
    const defined = [ newX, newY ].every( val => val !== '' );
    props.isFormValid( defined );

    props.getFormData( { x: newX, y: newY } );
  };

  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial X</Form.Label>
        <Form.Control value={xValue} type='number' onChange={event => {
          handleChange( event.target.value, yValue );
        }}/>
      </Form.Group>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Initial Y</Form.Label>
        <Form.Control value={yValue} type='number' onChange={event => {
          setYValue( event.target.value );
          handleChange( xValue, event.target.value );
        }}/>
      </Form.Group>
    </>
  );
}