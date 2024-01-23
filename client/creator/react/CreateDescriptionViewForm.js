import React from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { formatFunctionListForPrompt } from '../../utils.js';
import DescriptionViewComponent from '../model/views/DescriptionViewComponent.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

// Description-specific functions available to the user to control the output.
const DESCRIPTION_FUNCTIONS = [
  'interruptSpeech() - Stop all speech and clear the speech queue.',
  'setMuted( boolean ) - Mute or unmute all speech (all description components)',
  'setPriority( number ) - Set the priority for this speech. Higher priority speech will interrupt lower priority speech.',
  'setAlertStableDelay( number ) - A delay, in miliseconds, before the speech is spoken. If the string changes before the delay, the delay starts over. Useful for reducing alert frequency.',
  'setVoiceRate( number ) - Sets the voice rate for all description components. 1 is normal rate.',
  'setVoicePitch( number ) - Sets the voice pitch for all description components. 1 is normal pitch.'
];

export default function CreateDescriptionViewForm( props ) {

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
    DescriptionViewComponent
  );

  // Description components have a checkbox to lazily link to the model components - waiting to speak until
  // there is a model change so that speech doesn't happen when you add the program
  const typeSpecificControls = (
    <div className={styles.controlElement}>
      <Form.Check
        type={'checkbox'}
        id={'lazy-link-checkbox'}
        label={'Wait for change to speak'}
        checked={formData.lazyLink}
        onChange={event => {
          handleChange( { lazyLink: event.target.checked } );
        }}/>
    </div>
  );

  const descriptionFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        {
          DESCRIPTION_FUNCTIONS.map( ( functionString, index ) => {
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
        typeSpecificFunctions={descriptionFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        additionalControlFunctions={`${formatFunctionListForPrompt( DESCRIPTION_FUNCTIONS )}`}
        functionPrompt={'Write a function using the variables to return a string.'}
        componentsPrompt={'Function is called and the string is spoken when selected components change.'}
      ></ViewComponentControls>
    </div>
  );
}