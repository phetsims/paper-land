import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import xhr from 'xhr';
import SoundViewComponent from '../model/views/SoundViewComponent.js';
import styles from './../CreatorMain.css';
import FileUploader from './FileUploader.js';
import StyledButton from './StyledButton.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

// For documentation displayed to the user and to provide to the AI assistant.
const SOUND_FUNCTIONS = [
  'setPlaybackRate() - takes a value that must be larger than 0',
  'setOutputLevel() - takes a value between 0 and 1',
  'play() - play the selected sound'
];

// A reference to an Audio element that is currently playing the selected sound, outside of the component so that
// it can be stopped if another sound is played, and is not cleared when the component is re-rendered.
let playingAudio = null;

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
      const invalidReasons = [];
      if ( componentData.soundFileName.length === 0 ) {
        invalidReasons.push( 'No sound file selected.' );
      }
      if ( componentData.modelComponentNames.length === 0 ) {
        invalidReasons.push( 'No model components selected.' );
      }
      if ( !componentData.autoplay && componentData.controlFunctionString === '' ) {
        invalidReasons.push( 'Control function is required without autoplay.' );
      }
      return invalidReasons;
    },
    getFormData,
    SoundViewComponent
  );

  const refreshSoundFiles = selectedFileName => {
    const soundFilesListUrl = new URL( 'api/creator/soundFiles', window.location.origin ).toString();
    xhr.get( soundFilesListUrl, { json: true }, ( error, response ) => {
      if ( error ) {
        console.error( error );
      }
      else {
        if ( response.body && response.body.soundFiles ) {
          if ( Array.isArray( response.body.soundFiles ) ) {
            setSoundFiles( response.body.soundFiles );

            // If there is already a value for the sound file name, or the active edit has one, don't overwrite it
            if ( formData.soundFileName === '' && props.activeEdit.component === null ) {
              handleChange( { soundFileName: selectedFileName || response.body.soundFiles[ 0 ] } );
            }
          }
        }
      }
    } );
  };

  // Load available sound files on mount (load)
  useEffect( () => {
    refreshSoundFiles( formData.soundFileName );
  }, [] );

  // A select UI component to use a particular sound.
  const soundFileSelector = (
    <div>
      <Form.Label>Select from available files:</Form.Label>
      <Container>
        <Row>
          <Col xs={9}>
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
          </Col>
          <Col xs={3}>
            <StyledButton
              name={'Test Sound'}
              onClick={() => {
                if ( playingAudio ) {
                  playingAudio.pause();
                  playingAudio = null;
                }
                else {
                  const fullPath = `media/sounds/${formData.soundFileName}`;
                  playingAudio = new Audio( fullPath );
                  playingAudio.play().catch( error => {
                    console.error( error );
                    playingAudio = null;
                  } );

                  playingAudio.onended = () => {
                    playingAudio = null;
                  };
                }
              }}
              overrideClassName={styles.noVerticalPadding}
            ></StyledButton>
          </Col>
        </Row>
      </Container>

      <div className={`${styles.controlElement}`}>
        <FileUploader
          fileType='sound'
          handleNewUpload={fileName => {
            refreshSoundFiles( fileName );
            handleChange( { soundFileName: fileName } );
          }}
        ></FileUploader>
      </div>
    </div>
  );

  const additionalControls = (
    <>
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
      <div className={styles.controlElement}>
        <Form.Check
          type='checkbox'
          label='Autoplay sounds - When checked, sounds play every component change. Uncheck for more custom control over when sounds play.'
          checked={formData.autoplay}
          onChange={event => {
            handleChange( { autoplay: event.target.checked } );
          }}
        />
      </div>
    </>
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
        typeSpecificEndControls={additionalControls}
        typeSpecificFunctions={soundFunctions}
        formData={formData}
        handleChange={handleChange}
        functionPrompt={'Use the available functions and variables to control the sound.'}
        componentsPrompt={'Function is called and sound is played whenever a component changes.'}
        additionalControlFunctions={SOUND_FUNCTIONS}
      ></ViewComponentControls>
    </div>
  );
}