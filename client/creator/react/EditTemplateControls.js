/**
 * A group of controls that are used to edit data for Creator templates.
 */

import React, { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import AccordionButton from 'react-bootstrap/AccordionButton';
import Form from 'react-bootstrap/Form';
import TemplateDataControls from './TemplateDataControls.js';

export default function EditTemplateControls( props ) {
  if ( !props.model ) {
    throw new Error( 'EditTemplateControls must be provided with a Creator`Model' );
  }

  const [ selectedTemplate, setSelectedTemplate ] = useState( '' );
  const [ availableTemplates, setAvailableTemplates ] = useState( [] );
  const [ editingTemplatesEnabled, setEditingTemplatesEnabled ] = useState( false );
  const [ selectedSpaceName, setSelectedSpaceName ] = useState( '' );

  const getTemplates = async () => {
    try {

      // the react state updates asynchronously, so we need to use the space name from the model -
      // this will be correct because the model updates the react state
      const currentSelectedSpaceName = props.model.spaceNameProperty.value;

      if ( currentSelectedSpaceName ) {
        const templates = await props.model.sendGetTemplatesForEditRequest( currentSelectedSpaceName );
        const templatesJSON = JSON.parse( templates );
        setAvailableTemplates( templatesJSON.templates );
      }
      else {

        // If the space name is empty, we can't get templates
        setAvailableTemplates( [] );
      }
    }
    catch( e ) {
      console.log( e );
    }
  };

  // Update the list of available templates, in a closure so that subcomponents can do this work.
  const updateAvailableTemplates = async () => {
    await getTemplates();
  };

  // Clear the selected template and update the list of available templates, in a closure so that child components
  // can do this.
  const clearSelectedTemplate = async () => {
    setSelectedTemplate( '' );
    await updateAvailableTemplates();
  };

  useEffect( () => {

    // Update the list of available templates whenever the space name changes
    const spaceListener = async space => {
      setSelectedSpaceName( space );
      await getTemplates();

      // When the space name changes, go back to creating a new template
      setSelectedTemplate( '' );
    };
    props.model.spaceNameProperty.link( spaceListener );

    // Editing existing templates will only be allowed when there are no programs in the project
    // because loading a template will replace all programs with template programs.
    const programCountListener = count => {
      setEditingTemplatesEnabled( count === 0 );
    };
    props.model.programs.lengthProperty.link( programCountListener );

    return function cleanup() {
      props.model.spaceNameProperty.unlink( spaceListener );
      props.model.programs.lengthProperty.unlink( programCountListener );
    };
  }, [] );

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey='0'>
          <AccordionButton>Edit Templates</AccordionButton>
          <Accordion.Body>
            <p hidden={editingTemplatesEnabled}>{'\u26A0 To edit a different template, delete all programs or create a new project. Project needs to be empty to load template programs. \u26A0'}</p>
            <Form.Select
              hidden={!editingTemplatesEnabled}
              value={selectedTemplate ? selectedTemplate.name : ''}
              onChange={async event => {
                const newSelectedTemplate = availableTemplates.find( template => template.name === event.target.value );
                setSelectedTemplate( newSelectedTemplate );

                if ( newSelectedTemplate ) {
                  try {
                    const projectData = JSON.parse( newSelectedTemplate.projectData );
                    await props.model.load( projectData );
                  }
                  catch( e ) {
                    console.log( e );
                  }
                }
              }}
            >
              <option value=''>New Template</option>
              {
                availableTemplates.map( ( template, index ) => {
                  const optionName = template.name + ( template.spaceName ? ' (custom)' : '' );
                  return <option key={index} value={template.name}>{optionName}</option>;
                } )
              }
            </Form.Select>
            <TemplateDataControls
              model={props.model}
              selectedTemplate={selectedTemplate}
              selectedSpaceName={selectedSpaceName}
              clearSelectedTemplate={clearSelectedTemplate}
              updateAvailableTemplates={updateAvailableTemplates}
            ></TemplateDataControls>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}