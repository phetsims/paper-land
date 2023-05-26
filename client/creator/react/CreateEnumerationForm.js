import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function CreateEnumerationForm( props ) {
  const [ values, setValues ] = useState( [] );

  const valuesRef = useRef( [] );

  // Content is valid if every input has content
  const handleChange = nullableEvent => {

    // update entries from the input element
    if ( nullableEvent ) {
      const results = nullableEvent.target.id.match( /(\d+)(?!.*\d)/g );
      if ( results === null || results.length !== 1 ) {
        throw new Error( 'Something went wrong with the regex/index?' );
      }
      const indexOfChange = parseInt( results[ 0 ], 10 );
      valuesRef.current[ indexOfChange ] = nullableEvent.target.value;
    }

    // Update valid state of this form for the parent element
    const allUnique = new Set( valuesRef.current ).size === valuesRef.current.length;
    const valid = nullableEvent !== null && valuesRef.current.every( value => value.length > 0 ) && allUnique;
    props.isFormValid( valid );

    props.getFormData( { values: valuesRef.current } );
  };

  const handleClick = event => {
    setValues( oldValues => [ ...oldValues, '' ] );
    valuesRef.current.push( '' );

    // Click means event target is a button - there is no event target with content
    // to forward to the change validation listener, so pass null and indicate that
    // form is no longer valid
    handleChange( null );
  };

  const handleDelete = event => {
    valuesRef.current.pop();

    setValues( oldValues => {
      const copy = oldValues.slice();
      copy.pop();
      return copy;
    } );
  };

  return (
    <>
      <div>
        <StyledButton name={'Create Value'} onClick={handleClick}></StyledButton>
        <StyledButton name={'Remove Value'} onClick={handleDelete}></StyledButton>
        {
          values.map( ( value, index ) =>
            <div key={`${value}-${index}`}>
              <Form.Group className={styles.controlElement}>
                <Form.Label>Value String</Form.Label>
                <Form.Control id={`enum-input-${index}`} type='text' onChange={handleChange}/>
              </Form.Group>
            </div>
          )
        }
      </div>
    </>
  );
}