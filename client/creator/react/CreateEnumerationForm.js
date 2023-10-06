import React from 'react';
import Form from 'react-bootstrap/Form';
import NamedEnumerationProperty from '../model/NamedEnumerationProperty.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';
import useEditableForm from './useEditableForm.js';

export default function CreateEnumerationForm( props ) {
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    proposedData => {

      const invalidReasons = [];
      if ( proposedData.values.length === 0 ) {
        invalidReasons.push( 'No values defined.' );
      }
      else if ( new Set( proposedData.values ).size !== proposedData.values.length ) {

        // don't show this one unless there are some values defined
        invalidReasons.push( 'Values are not unique.' );
      }

      if ( proposedData.values.some( value => value === '' ) ) {
        invalidReasons.push( 'Values cannot be empty.' );
      }

      // values con only contain letters, numbers, and underscores
      if ( proposedData.values.some( value => value.match( /[^a-zA-Z0-9_]/ ) ) ) {
        invalidReasons.push( 'Values can only contain letters, numbers, and underscores.' );
      }
      return invalidReasons;
    },
    props.getFormData,
    NamedEnumerationProperty
  );

  const handleClick = event => {
    handleChange( { values: [ ...formData.values, '' ] } );
  };

  const handleDelete = event => {
    formData.values.pop();
    handleChange( { values: formData.values } );
  };

  // Handle edit to an individual text input for the enumeration - getting the value of that input and inserting it
  // into the form data
  const handleEdit = ( event, index ) => {
    const newValues = formData.values.slice();
    newValues[ index ] = event.target.value;
    handleChange( { values: newValues } );
  };

  return (
    <>
      <div>
        <StyledButton name={'Create Value'} onClick={handleClick} otherClassNames={styles.horizontalPadding}></StyledButton>
        <StyledButton name={'Remove Value'} onClick={handleDelete} otherClassNames={styles.horizontalPadding}></StyledButton>
        {
          formData.values.map( ( value, index ) =>
            <div key={`${index}-enum-input-parent`}>
              <TextInput value={value} index={index} handleEdit={handleEdit}/>
            </div>
          )
        }
      </div>
    </>
  );
}

function TextInput( props ) {
  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>Value String</Form.Label>
        <Form.Control type='text' onChange={event => {
          props.handleEdit( event, props.index );
        }} value={props.value}/>
      </Form.Group>
    </>
  );
}