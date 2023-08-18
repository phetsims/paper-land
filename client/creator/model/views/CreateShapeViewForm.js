import React from 'react';
import Form from 'react-bootstrap/Form';
import useEditableForm from '../../react/useEditableForm.js';
import ViewComponentControls from '../../react/ViewComponentControls.js';
import styles from './../../CreatorMain.css';
import ShapeFunctionsList from './ShapeFunctionsList.js';
import ShapeOptionsForm from './ShapeOptionsForm.js';
import ShapeViewComponent from './ShapeViewComponent.js';

export default function CreateShapeViewForm( props ) {

  const getFormData = providedData => {
    props.getGeneralFormData( providedData );
    props.getShapeFormData( providedData );
  };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    props.isFormValid,
    componentData => {

      // TODO: More conditions here?
      return componentData.modelComponentNames.length;
    },
    getFormData,
    ShapeViewComponent
  );

  const shapeTypeSelector = (
    <>
      <div className={styles.controlElement}>
        <Form.Label><h4>Select shape type:</h4></Form.Label>
        <Form.Select
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
      <div className={styles.controlElement}>
        <ShapeOptionsForm
          formData={formData}
          handleChange={handleChange}
        ></ShapeOptionsForm>
      </div>
    </>
  );

  const typeSpecificFunctions = (
    <ShapeFunctionsList formData={formData}/>
  );

  return (
    <>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={shapeTypeSelector}
        typeSpecificFunctions={typeSpecificFunctions}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt='Use the available functions and variables to control the shape.'
        componentsPrompt='Select the model components that will control the shape.'
      ></ViewComponentControls>
    </>
  );
}