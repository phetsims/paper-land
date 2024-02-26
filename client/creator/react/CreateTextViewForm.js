import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { formatFunctionListForPrompt } from '../../utils.js';
import TextViewComponent from '../model/views/TextViewComponent.js';
import styles from './../CreatorMain.css';
import NodeComponentFunctionsList, { NODE_COMPONENT_FUNCTIONS } from './NodeComponentFunctionsList.js';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

const TEXT_FUNCTIONS = [
  'setString() - A string, sets the content of the text.',
  'setFontSize() - A number, sets the font size of the text.',
  'setTextColor() - A string, sets the font color of the text.',
  'setFontFamily() - A string, sets the font family of the text.'
];

export default function CreateTextViewForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      const invalidReasons = [];

      if ( componentData.modelComponentNames.length === 0 ) {
        invalidReasons.push( 'No model components selected.' );
      }
      else if ( componentData.controlFunctionString.length === 0 ) {
        invalidReasons.push( 'Control function has no content.' );
      }
      return invalidReasons;
    },
    props.getGeneralFormData,
    TextViewComponent
  );

  const typeSpecificFunctions = (
    <div className={styles.controlElement}>
      <hr/>
      <NodeComponentFunctionsList></NodeComponentFunctionsList>
      <hr/>
      <p>Text functions:</p>
      <ListGroup>
        {
          TEXT_FUNCTIONS.map( ( functionString, index ) => {
            return (
              <ListGroup.Item className={styles.listGroupItem} key={index}>{functionString}</ListGroup.Item>
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
        typeSpecificFunctions={typeSpecificFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt={'Write a function using the variables to control the Text. All view coordinates in pixels.'}
        componentsPrompt={'Add model components that will control the Text.'}
        additionalControlFunctions={`${formatFunctionListForPrompt( NODE_COMPONENT_FUNCTIONS )}\n${formatFunctionListForPrompt( TEXT_FUNCTIONS )}`}
      ></ViewComponentControls>
    </div>
  );
}