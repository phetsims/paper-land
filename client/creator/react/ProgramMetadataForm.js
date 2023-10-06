/**
 * Controls for the program metadata, things like title, keywords, and program description.
 */

import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

export default function ProgramMetadataForm( props ) {
  const program = props.activeEdit.program;
  const [ title, setTitle ] = useState( '' );
  const [ keywords, setKeywords ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ topWhiskerLength, setTopWhiskerLength ] = useState( 0.2 );
  const [ rightWhiskerLength, setRightWhiskerLength ] = useState( 0.2 );
  const [ bottomWhiskerLength, setBottomWhiskerLength ] = useState( 0.2 );
  const [ leftWhiskerLength, setLeftWhiskerLength ] = useState( 0.2 );

  const inputToWhiskerLength = ( inputValue, currentWhiskerValue ) => {
    const inputNumber = Number( inputValue );

    console.log( inputValue, inputNumber );
    if ( !isNaN( inputNumber ) && inputNumber >= 0 && inputNumber <= 1 ) {
      return inputNumber;
    }
    else {
      return currentWhiskerValue;
    }
  };

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {

    // The way this works is important. Axon drives the state. Change events on the
    // DOM elements update the axon Properties. useEffect adds listeners to axon
    // and updates state to re-render from changes. This flow got rendering
    // working well and well synchronized with axon.
    const titleChangeListener = titleString => setTitle( titleString );
    const keywordsChangeListener = keywordsString => setKeywords( keywordsString );
    const descriptionChangeListener = descriptionString => setDescription( descriptionString );
    const topWhiskerChangeListener = newLength => setTopWhiskerLength( newLength );
    const rightWhiskerChangeListener = newLength => setRightWhiskerLength( newLength );
    const bottomWhiskerChangeListener = newLength => setBottomWhiskerLength( newLength );
    const leftWhiskerChangeListener = newLength => setLeftWhiskerLength( newLength );
    program.titleProperty.link( titleChangeListener );
    program.keywordsProperty.link( keywordsChangeListener );
    program.descriptionProperty.link( descriptionChangeListener );
    program.topWhiskerLengthProperty.link( topWhiskerChangeListener );
    program.rightWhiskerLengthProperty.link( rightWhiskerChangeListener );
    program.bottomWhiskerLengthProperty.link( bottomWhiskerChangeListener );
    program.leftWhiskerLengthProperty.link( leftWhiskerChangeListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      program.titleProperty.unlink( titleChangeListener );
      program.keywordsProperty.unlink( keywordsChangeListener );
      program.descriptionProperty.unlink( descriptionChangeListener );
      program.topWhiskerLengthProperty.unlink( topWhiskerChangeListener );
      program.rightWhiskerLengthProperty.unlink( rightWhiskerChangeListener );
      program.bottomWhiskerLengthProperty.unlink( bottomWhiskerChangeListener );
      program.leftWhiskerLengthProperty.unlink( leftWhiskerChangeListener );
    };
  } );

  return (
    <div>
      <hr/>
      <Form.Group className='mb-3' controlId='title.input'>
        <Form.Label>Program Title</Form.Label>
        <Form.Control
          type='text'
          value={title}
          onChange={event => { program.titleProperty.value = event.target.value; }}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='keywords.input'>
        <Form.Label>Program Keywords</Form.Label>
        <Form.Control
          type='text'
          value={keywords}
          onChange={event => { program.keywordsProperty.value = event.target.value; }}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='description.input'>
        <Form.Label>Program Description</Form.Label>
        <Form.Control
          as='textarea'
          type='text'
          value={description}
          onChange={event => { program.descriptionProperty.value = event.target.value; }}
        />
      </Form.Group>
      <hr/>
      <Form.Group>
        <h4>Whisker Lengths</h4>
        <p>Lengths are a percentage of the display size.</p>
        <Form.Label>Top whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={topWhiskerLength}
          onChange={event => {
            program.topWhiskerLengthProperty.value = inputToWhiskerLength( event.target.value, program.topWhiskerLengthProperty.value );
          }}
        />

        <Form.Label>Right whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={rightWhiskerLength}
          onChange={event => {
            program.rightWhiskerLengthProperty.value = inputToWhiskerLength( event.target.value, program.rightWhiskerLengthProperty.value );
          }}
        />

        <Form.Label>Bottom whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={bottomWhiskerLength}
          onChange={event => {
            program.bottomWhiskerLengthProperty.value = inputToWhiskerLength( event.target.value, program.bottomWhiskerLengthProperty.value );
          }}
        />

        <Form.Label>Left whisker length</Form.Label>
        <Form.Control
          type={'number'}
          min={0}
          max={1}
          step={0.1}
          value={leftWhiskerLength}
          onChange={event => {
            program.leftWhiskerLengthProperty.value = inputToWhiskerLength( event.target.value, program.leftWhiskerLengthProperty.value );
          }}
        />
      </Form.Group>
    </div>
  );
}