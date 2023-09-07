import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import xhr from 'xhr';
import SoundViewComponent from '../model/views/SoundViewComponent.js';
import styles from './../CreatorMain.css';
import FileUploader from './FileUploader.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

// For documentation displayed to the user and to provide to the AI assistant.
const SOUND_FUNCTIONS = [
  'setPlaybackRate() - takes a value that must be larger than 0',
  'setOutputLevel() - takes a value between 0 and 1',
  'play() - play the selected sound'
];

export default function CreateSoundViewForm( props ) {

  // State for the available sounds files from the server.
  const [ soundFiles, setSoundFiles ] = useState( [] );

  // Get form data from the child and forward it back to the parent form so we have data in one place to
  // create a component.
  const getFormData = providedData => {
    props.getGeneralFormData( providedData );
    props.getSoundFormData( providedData );
  };

  // State for the form data that will create and edit components.
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return componentData.modelComponentNames.length > 0 &&
             componentData.soundFileName.length > 0 &&
             componentData.controlFunctionString.length > 0;
    },
    getFormData,
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
      <Tabs className={styles.tabs} justify>
        <Tab eventKey='built-in' title='Paper Playground Sounds'>
          <div className={styles.controlElement}>
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
        </Tab>
        <Tab eventKey='upload' title='Upload Sound'>
          <div className={`${styles.controlElement}`}>
            <FileUploader
              fileType='sound'
              handleChange={fileName => {
                handleChange( { soundFileName: fileName } );
              }}
            ></FileUploader>
            <p className={styles.controlElement}>{`Currently using sound: ${formData.soundFileName}`}</p>
          </div>
        </Tab>
      </Tabs>
      <div className={styles.controlElement}>
        <Form.Check
          type='checkbox'
          label='Loop sound'
          checked={formData.loop}
          onChange={event => {
            handleChange( { loop: event.target.checked } );
          }}
        />
      </div>
    </div>
  );

  // A list of functions that can be used in the code string by the user.
  const soundFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        {
          SOUND_FUNCTIONS.map( ( functionString, index ) => {
            return (
              <ListGroup.Item
                key={`function-${index}`}
                className={styles.listGroupItem}
              >{functionString}</ListGroup.Item>
            );
          } )
        }
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
        functionPrompt={'Use the available functions and variables to control the sound.'}
        componentsPrompt={'Function is called and sound is played whenever a component changes.'}
        additionalPromptContent={SOUND_FUNCTIONS.join( '\n' )}
      ></ViewComponentControls>
    </div>
  );
}