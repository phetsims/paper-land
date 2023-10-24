import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import TemplateModel from '../model/TemplateModel.js';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function CreateProgramFromTemplateForm( props ) {

  const [ availableTemplates, setAvailableTemplates ] = useState( [] );
  const [ selectedTemplate, setSelectedTemplate ] = useState( '' );

  const testTemplates = [
    new TemplateModel( 'Movable Image', 'This is the first template.', 'template1', jsonString ),
    new TemplateModel( 'Movable Rectangle', 'This is the second template.', 'template2', jsonString ),
    new TemplateModel( 'Movable Square', 'This is the second template.', 'template2', jsonString ),
    new TemplateModel( 'Movable Text', 'This is the second template.', 'template2', jsonString )
  ];

  useEffect( () => {
    setAvailableTemplates( testTemplates );
    setSelectedTemplate( testTemplates[ 0 ] );
  }, [] );

  // The form is going to have
  // description
  // number of programs
  // 4) A final Create button

  return (
    <>
      <hr></hr>
      <Form.Group controlId='templateSelect'>
        <h3>Select Template:</h3>
        <Form.Select
          name='spaces'
          id='spaces'
          size='lg'
          value={selectedTemplate.name}
          onChange={event => {
            const selectedTemplate = availableTemplates.find( template => template.name === event.target.value );
            setSelectedTemplate( selectedTemplate );
          }}
        >
          {availableTemplates.map( ( template, index ) => {
            return <option key={index}>
              {template.name}
            </option>;
          } )}
        </Form.Select>
      </Form.Group>
      {selectedTemplate ?
       <div className={styles.extraPadding}>
         <h3>Description:</h3>
         <div className='card'>
           <pre className='card-body'>{selectedTemplate.description}</pre>
         </div>
         <StyledButton name='Create' onClick={() => {
           props.createFromTemplate( selectedTemplate.programJSONString );
         }}></StyledButton>
       </div> : ''}
    </>
  );
}