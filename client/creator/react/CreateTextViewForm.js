import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import TextViewComponent from '../model/views/TextViewComponent.js';
import styles from './../CreatorMain.css';
import useEditableForm from './useEditableForm.js';
import ViewComponentControls from './ViewComponentControls.js';

export default function CreateTextViewForm( props ) {

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {
      return componentData.modelComponentNames.length > 0 &&
             componentData.controlFunctionString.length > 0;
    },
    props.getGeneralFormData,
    TextViewComponent
  );

  const typeSpecificFunctions = (
    <div className={styles.controlElement}>
      <p>Available functions:</p>
      <ListGroup>
        <ListGroup.Item className={styles.listGroupItem}>setString() - A string, sets the content of the text.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setCenterX() - A number, sets x position of the text.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setCenterY() - A number, sets y position of the text.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setFontSize() - A number, sets the font size of the text.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setTextColor() - A string, sets the font color of the text.</ListGroup.Item>
        <ListGroup.Item className={styles.listGroupItem}>setFontFamily() - A string, sets the font family of the text.</ListGroup.Item>
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
        componentsPrompt={'Function is called when selected components change.'}
      ></ViewComponentControls>
    </div>
  );
}