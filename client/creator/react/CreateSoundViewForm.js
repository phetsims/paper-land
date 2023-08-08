import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import xhr from 'xhr';
import SoundViewComponent from '../model/views/SoundViewComponent.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateSoundViewForm( props ) {

  // State for the available sounds files from the server.
  const [ soundFiles, setSoundFiles ] = useState( [] );

  // State for the form data that will create and edit components.
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return componentData.modelComponentNames.length > 0 &&
             componentData.soundFileName.length > 0 &&
             componentData.controlFunctionString.length > 0;
    },
    props.getGeneralFormData,
    SoundViewComponent
  );

  // Load available sound files on mount (load)
  useEffect( () => {
    const soundFilesListUrl = new URL( 'api/creator/soundFiles', window.location.origin ).toString();
    xhr.get( soundFilesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( response.body && response.body.soundFiles ) {
          if ( Array.isArray( response.body.soundFiles ) ) {
            setSoundFiles( response.body.soundFiles );

            // set the first sound file as the default
            props.getSoundFormData( { soundFileName: response.body.soundFiles[ 0 ] } );
          }
        }
      }
    } );
  }, [] );

  // A select UI component to use a particular sound.
  const soundFileSelector = (
    <div>
      <Form.Label>Select sound file:</Form.Label>
      <Form.Select
        value={formData.soundFileName}
        onChange={event => {
          handleChange( { soundFileName: event.target.value } );
          props.getSoundFormData( { soundFileName: event.target.value } );
        }}
      >
        {
          soundFiles.map( ( soundFile, index ) => {
            return (
              <option
                key={`sound-file-${index}`}
                value={soundFile}
              >{soundFile}</option>
            );
          } )
        }
      </Form.Select>
    </div>
  );

  // Get form data from the child and forward it back to the parent form so we have data in one place to
  // create a component.
  const getFormData = providedData => {
    props.getGeneralFormData( providedData );
    props.getSoundFormData( providedData );
  };

  // A list of functions that can be used in the code string by the user.
  const soundFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>setPlaybackRate() - takes a value that must be larger than 0</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setOutputLevel() - takes a value between 0 and 1</ListGroup.Item>
      </ListGroup>
    </div>
  );

  return (
    <div>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={soundFileSelector}
        typeSpecificFunctions={soundFunctions}
        formData={formData}
        handleChange={handleChange}
        getFormData={getFormData}
        functionPrompt={'Use the available functions and variables to control the sound.'}
        componentsPrompt={'Function is called and sound is played whenever a component changes.'}
      ></ViewComponentControls>
    </div>
  );
}