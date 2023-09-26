/**
 * A form control for setting a program number. Will let you know if the proposed number is out of range or already
 * taken.
 */

import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import ViewConstants from '../view/ViewConstants.js';

export default function ProgramNumberForm( props ) {
  const activeEdit = props.activeEdit;
  const creatorModel = props.creatorModel;

  const [ programNumber, setProgramNumber ] = useState( activeEdit.program.numberProperty.value );
  const [ numberAvailable, setNumberAvailable ] = useState( true );
  const [ numberInRange, setNumberInRange ] = useState( true );
  const [ numberValid, setNumberValid ] = useState( true );

  const minValue = 1;
  const maxValue = ViewConstants.MAX_PROGRAM_NUMBER;

  useEffect( () => {

    // If the activeEdit changes to a program, update the field to display the selected value right away
    if ( activeEdit && activeEdit.program ) {
      setProgramNumber( activeEdit.program.numberProperty.value );
    }
  }, [ activeEdit ] );

  const handleChange = event => {

    // make sure that the proposed value is not already used by another program
    const proposedNumber = parseInt( event.target.value, 10 );
    const inRange = proposedNumber >= minValue && proposedNumber <= maxValue;
    const numberAvailable = creatorModel.isNumberAvailable( proposedNumber );
    const numberValid = !isNaN( proposedNumber );

    setNumberInRange( inRange );
    setNumberAvailable( numberAvailable );
    setNumberValid( numberValid );

    // always update the input value, but we only update the model value if it is valid
    const displayedValue = numberValid ? proposedNumber : '';
    setProgramNumber( displayedValue );

    if ( numberValid && numberAvailable && inRange ) {

      // use the calculated value (not programNumberState) because it will update asynchronously!
      activeEdit.program.numberProperty.value = proposedNumber;
    }
  };

  return (
    <div>
      <Form.Label>Program Number: {programNumber}</Form.Label>
      <Form.Control
        type='number'
        value={programNumber}
        onChange={handleChange}
      />
      <div>
        {!numberAvailable ? <div><Form.Text className='text-danger'>This number is already used by another program.</Form.Text></div> : ''}
        {!numberInRange ? <div><Form.Text className='text-danger'>The number must be between {minValue} and {maxValue}.</Form.Text></div> : ''}
        {!numberValid ? <div><Form.Text className='text-danger'>The number must be defined.</Form.Text></div> : ''}
      </div>
    </div>
  );
}