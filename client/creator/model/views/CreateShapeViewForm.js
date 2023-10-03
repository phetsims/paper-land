/**
 * Main form for creating a shape. Can select shape type and then options for each.
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import useEditableForm from '../../react/useEditableForm.js';
import ViewComponentControls from '../../react/ViewComponentControls.js';
import styles from './../../CreatorMain.css';
import ShapeFunctionsList from './ShapeFunctionsList.js';
import ShapeOptionsForm from './ShapeOptionsForm.js';
import ShapeViewComponent from './ShapeViewComponent.js';
import ViewUnitsSelector from './ViewUnitsSelector.js';

export default function CreateShapeViewForm( props ) {

  // passes the form data back go the parent components for creation
  const getFormData = providedData => {
    props.getGeneralFormData( providedData );
    props.getShapeFormData( providedData );
  };

  // Manages form state and validation
  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {

      // TODO: How should validation work for this component?
      return [];
    },
    getFormData,
    ShapeViewComponent
  );

  // A UI component that lets you select the type of shape you want to draw
  const shapeTypeSelector = (
    <>
      <div className={styles.controlElement}>
        <Form.Label><h4>Select shape type:</h4></Form.Label>
        <Form.Select
          value={formData.defaultShapeOptions.shapeType}
          onChange={event => {

            // update only the shape option for this control
            const shapeOptions = formData.defaultShapeOptions;
            shapeOptions.shapeType = event.target.value;
            handleChange( { defaultShapeOptions: shapeOptions } );
          }}
        >
          {ShapeViewComponent.SHAPE_TYPES.map( ( shapeType, index ) => {
            return (
              <option key={index} value={shapeType}>{shapeType}</option>
            );
          } )}
        </Form.Select>
      </div>
      <ViewUnitsSelector formData={formData} handleChange={handleChange}></ViewUnitsSelector>
      <div className={styles.controlElement}>
        <ShapeOptionsForm
          formData={formData}
          handleChange={handleChange}
        ></ShapeOptionsForm>
      </div>
    </>
  );

  return (
    <>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={shapeTypeSelector}
        typeSpecificFunctions={( <ShapeFunctionsList formData={formData}/> )}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt='Use the available functions and variables to control the shape.'
        componentsPrompt='Select the model components that will control the shape.'
      ></ViewComponentControls>
    </>
  );
}