import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function CreateProgramFromTemplateForm( props ) {

  const [ availableTemplates, setAvailableTemplates ] = useState( [] );
  const [ selectedTemplate, setSelectedTemplate ] = useState( '' );

  // Get the available templates from the database
  useEffect( () => {
    const getTemplates = async () => {
      try {
        const templates = await props.sendGetTemplatesRequest( props.selectedSpaceName );

        const templatesJSON = JSON.parse( templates );
        setAvailableTemplates( templatesJSON.templates );
        setSelectedTemplate( templatesJSON.templates[ 0 ] );
      }
      catch( e ) {
        console.log( e );
      }
    };

    getTemplates();
  }, [] );

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
            const optionName = template.name + ( template.spaceName ? ' (custom)' : '' );
            return <option key={index} value={template.name}>
              {optionName}
            </option>;
          } )}
        </Form.Select>
      </Form.Group>
      {selectedTemplate ?
       <div className={styles.extraPadding}>
         <h3>Description:</h3>
         <div className='card'>
           <pre className={styles.wrappingPre}>{selectedTemplate.description}</pre>
         </div>
         <StyledButton name='Create' onClick={() => {
           props.createFromTemplate( selectedTemplate.projectData );
         }}></StyledButton>
       </div> : ''}
    </>
  );
}