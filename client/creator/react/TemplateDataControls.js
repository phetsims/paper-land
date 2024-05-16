import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import xhr from 'xhr';
import styles from './../CreatorMain.css';
import StyledButton from './StyledButton.js';

export default function TemplateDataControls( props ) {

  const [ templateName, setTemplateName ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ keyWords, setKeyWords ] = useState( '' );
  const [ canAccessRestrictedFiles, setCanAccessRestrictedFiles ] = useState( false );
  const [ canAccessSpace, setCanAccessSpace ] = useState( false );

  // Populate fields with the selected template data
  useEffect( () => {
    if ( props.selectedTemplate ) {
      setTemplateName( props.selectedTemplate.name );
      setDescription( props.selectedTemplate.description );
      setKeyWords( props.selectedTemplate.keyWords );
    }
    else {
      setTemplateName( '' );
      setDescription( '' );
      setKeyWords( '' );
    }
  }, [ props.selectedTemplate ] );

  // Make sure that the user can only delete or add templates to spaces that they have access to
  useEffect( () => {
    if ( props.selectedSpaceName ) {
      const url = new URL( `api/creator/can-access-space/${props.selectedSpaceName}`, window.location.origin ).toString();
      xhr.get( url, { json: true }, ( error, response ) => {
        if ( error ) {
          console.error( error );
        }
        else {
          setCanAccessSpace( response.body.canAccess );
        }
      } );
    }
  }, [ props.selectedSpaceName ] );

  // on mount, determine if we have access to restricted files, which allows us to save to all spaces
  useEffect( () => {
    const url = new URL( 'api/creator/can-access-restricted-files', window.location.origin ).toString();
    xhr.get( url, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        setCanAccessRestrictedFiles( response.body.canAccess );
      }
    } );
  }, [] );

  return (
    <>
      <div className={styles.controlElement}>
        <label>
          Name:&nbsp;
          <input
            type='text'
            value={templateName}
            onChange={event => { setTemplateName( event.target.value ); }}
          />
        </label>
      </div>
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
      <Container>
        <Row>
          <Col>
            <StyledButton
              disabled={
                ( !props.selectedSpaceName || templateName === '' ) ||
                !canAccessSpace
              }
              name={props.selectedTemplate ? 'Save Changes' : 'Add Template to Space'}
              onClick={async () => {
                try {
                  if ( props.selectedTemplate ) {
                    const id = props.selectedTemplate.id;
                    await props.model.sendUpdateTemplateRequest( id, templateName, description, keyWords );
                  }
                  else {

                    // no selected template, save a new one
                    await props.model.sendSaveTemplateRequest( templateName, description, keyWords, true );
                  }

                  // update the templates data after updating the database
                  await props.updateAvailableTemplates();

                  props.model.successOccurredEmitter.emit( 'Template saved.' );
                }
                catch( e ) {
                  console.log( e );
                }
              }}
            ></StyledButton>
          </Col>
          <Col>
            <StyledButton
              name='Delete Template'
              disabled={!props.selectedTemplate || !canAccessSpace}
              onClick={async () => {
                try {
                  await props.model.sendDeleteTemplateRequest( templateName, description, keyWords );

                  // after the delete, clear the programs and template name so the action is clear
                  props.model.clear();
                  setTemplateName( '' );
                  props.clearSelectedTemplate();

                  props.model.successOccurredEmitter.emit( 'Template deleted.' );
                }
                catch( e ) {
                  console.log( e );
                }
              }}
            ></StyledButton>
          </Col>
        </Row>
        <Row>
          <Col>
            <StyledButton
              hidden={!canAccessRestrictedFiles}
              name='Add Template to all Spaces'
              disabled={templateName === ''}
              onClick={async () => {
                try {
                  await props.model.sendSaveTemplateRequest( templateName, description, keyWords, false );
                  await props.updateAvailableTemplates();

                  props.model.successOccurredEmitter.emit( 'Template added.' );
                }
                catch( e ) {
                  console.log( e );
                }
              }}
            ></StyledButton>
          </Col>
          <Col>
            <StyledButton
              name='Download Template'
              disabled={!props.selectedTemplate}
              onClick={async () => {
                try {
                  const data = props.selectedTemplate;

                  // Parse 'projectData' back into an object. Then, the entire object can be stringified.
                  // Then the resultant file can easily be loaded directly into the templates directory or shared.
                  data.projectData = JSON.parse( data.projectData );
                  const dataString = JSON.stringify( data );

                  const blob = new Blob( [ dataString ], { type: 'application/json' } );
                  const url = URL.createObjectURL( blob );
                  const a = document.createElement( 'a' );
                  a.href = url;
                  a.download = `${props.selectedTemplate.name}.json`;
                  a.click();
                  URL.revokeObjectURL( url );
                }
                catch( e ) {
                  console.log( e );
                }
              }}
            ></StyledButton>
          </Col>
        </Row>
      </Container>
    </>
  );
}