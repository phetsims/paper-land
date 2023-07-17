/**
 * Controls for the program metadata, things like title, keywords, and program description.
 */

import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

export default function ProgramMetadataForm( props ) {
  const program = props.activeEdit.program;
  const [ title, setTitle ] = useState( '' );
  const [ keywords, setKeywords ] = useState( '' );
  const [ description, setDescription ] = useState( '' );

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {

    // The way this works is important. Axon drives the state. Change events on the
    // DOM elements update the axon Properties. useEffect adds listeners to axon
    // and updates state to re-render from changes. This flow got rendering
    // working well and well synchronized with axon.
    const titleChangeListener = titleString => setTitle( titleString );
    const keywordsChangeListener = keywordsString => setKeywords( keywordsString );
    const descriptionChangeListener = descriptionString => setDescription( descriptionString );
    program.titleProperty.link( titleChangeListener );
    program.keywordsProperty.link( keywordsChangeListener );
    program.descriptionProperty.link( descriptionChangeListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      program.titleProperty.unlink( titleChangeListener );
      program.keywordsProperty.unlink( keywordsChangeListener );
      program.descriptionProperty.unlink( descriptionChangeListener );
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
    </div>
  );
}