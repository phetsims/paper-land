import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import StyledButton from './StyledButton.js';

export default function SaveTemplateControl( props ) {

  const [ templateName, setTemplateName ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ keyWords, setKeyWords ] = useState( '' );

  return (
    <>
      <label>
        Name:&nbsp;
        <input
          type='text'
          value={templateName}
          onChange={event => { setTemplateName( event.target.value ); }}
        />
      </label>
      <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
        <Form.Label>Template Description:</Form.Label>
        <Form.Control as='textarea' rows={10} value={description} onChange={
          event => { setDescription( event.target.value ); }
        }/>
      </Form.Group>
      <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
        <Form.Label>Template Keywords:</Form.Label>
        <Form.Control as='textarea' rows={3} value={keyWords} onChange={
          event => { setKeyWords( event.target.value ); }
        }/>
      </Form.Group>
      <StyledButton
        name='Save Template'
        onClick={async () => {
          try {
            await props.model.sendSaveTemplateRequest( templateName, description, keyWords );
          }
          catch( e ) {
            console.log( e );
          }
        }}
      ></StyledButton>
      <StyledButton
        name='Delete Template'
        onClick={async () => {
          try {
            await props.model.sendDeleteTemplateRequest( templateName, description, keyWords );
          }
          catch( e ) {
            console.log( e );
          }
        }}
      ></StyledButton>
    </>
  );
}