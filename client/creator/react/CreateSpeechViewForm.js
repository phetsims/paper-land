import React from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { formatFunctionListForPrompt } from '../../utils.js';
import SpeechViewComponent from '../model/views/SpeechViewComponent.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

// Speech-specific functions available to the user to control the output.
const SPEECH_FUNCTIONS = [
  'speak( string ) - Speak the string.',
  'interruptSpeech() - Stop all speech and clear the speech queue.',
  'setMuted( boolean ) - Mute or unmute all speech (all speech components)',
  'setPriority( number ) - Set the priority for this speech. Higher priority speech will interrupt lower priority speech.',
  'setAlertStableDelay( number ) - A delay, in miliseconds, before the speech is spoken. If the string changes before the delay, the delay starts over. Useful for reducing alert frequency.',
  'setVoiceRate( number ) - Sets the voice rate for all speech components. 1 is normal rate.',
  'setVoicePitch( number ) - Sets the voice pitch for all speech components. 1 is normal pitch.'
];

export default function CreateSpeechViewForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      const invalidReasons = [];
      if ( componentData.modelComponentNames.length === 0 ) {
        invalidReasons.push( 'No model components selected.' );
      }
      if ( componentData.controlFunctionString.length === 0 ) {
        invalidReasons.push( 'Control function has no content.' );
      }
      return invalidReasons;
    },
    props.getGeneralFormData,
    SpeechViewComponent
  );

  // Speech components have a checkbox to lazily link to the model components - waiting to speak until
  // there is a model change so that speech doesn't happen when you add the program
  const typeSpecificControls = (
    <div className={styles.controlElement}>
      <Form.Check
        type={'checkbox'}
        id={'lazy-link-checkbox'}
        label={'Wait For Change - If checked, you will not hear speech when you add the program. Speech will wait until the model changes.'}
        checked={formData.lazyLink}
        onChange={event => {
          handleChange( { lazyLink: event.target.checked } );
        }}/>
    </div>
  );

  const speechFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        {
          SPEECH_FUNCTIONS.map( ( functionString, index ) => {
            return (
              <ListGroup.Item
                key={`desc-function-${index}`}
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
        typeSpecificControls={typeSpecificControls}
        typeSpecificFunctions={speechFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        additionalControlFunctions={`${formatFunctionListForPrompt( SPEECH_FUNCTIONS )}`}
        functionPrompt={'Write a function using the variables and functions below to control the Speech.'}
        componentsPrompt={'Speech can happen whenever a selected component changes.'}
      ></ViewComponentControls>
    </div>
  );
}