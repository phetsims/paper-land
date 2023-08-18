import React from 'react';
import { Accordion } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import ComponentFunctionsList from '../../react/ComponentFunctionsList.js';

import NodeComponentFunctionsList from '../../react/NodeComponentFunctionsList.js';
import StyledButton from '../../react/StyledButton.js';
import useEditableForm from '../../react/useEditableForm.js';
import ViewComponentControls from '../../react/ViewComponentControls.js';
import styles from './../../CreatorMain.css';
import ShapeViewComponent from './ShapeViewComponent.js';

const SHAPE_COMPONENT_FUNCTIONS = [
  'setFill() - A CSS color string. Sets the fill color. Like "red" or "#ff0000".',
  'setStroke() - A CSS color string. Sets the stroke color. Like "black" or "#000000".',
  'setLineWidth() - A number. Sets the width of the stroke line.'
];

const RECTANGLE_COMPONENT_FUNCTIONS = [
  'setRectWidth() - A number. Sets the width of the rectangle.',
  'setRectHeight() - A number. Sets the height of the rectangle.'
];

const CIRCLE_COMPONENT_FUNCTIONS = [
  'setRadius() - A number. Sets the radius of the circle.'
];

const ELLIPSE_COMPONENT_FUNCTIONS = [
  'setRadiusX() - A number. Sets the x radius of the ellipse.',
  'setRadiusY() - A number. Sets the y radius of the ellipse.'
];

const LINE_COMPONENT_FUNCTIONS = [
  'setX1() - A number. Sets the x coordinate of the first point of the line.',
  'setY1() - A number. Sets the y coordinate of the first point of the line.',
  'setX2() - A number. Sets the x coordinate of the second point of the line.',
  'setY2() - A number. Sets the y coordinate of the second point of the line.'
];

const TRIANGLE_COMPONENT_FUNCTIONS = [
  'setBaseWidth() - A number. Sets the width of the triangle\'s base.',
  'setHeight() - A number. Sets the height of the triangle.'
];

const POLYGON_COMPONENT_FUNCTIONS = [
  'setPoints() - An array of points. Each point is a { x, y } pair. For example, [{x: 0, y:0}, {x: 100, y:0}, {x: 50, y: 100}] would be a triangle with vertices at (0, 0), (100, 0), and (50, 100).'
];

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

  const selectedShapeType = formData.defaultShapeOptions.shapeType;
  if ( !ShapeViewComponent.SHAPE_TYPES.includes( selectedShapeType ) ) {
    throw new Error( 'Invalid shape type.' );
  }

  const shapeComponentList = (
    <div>
      <NodeComponentFunctionsList/>
      <ComponentFunctionsList
        functionsTitle='Shape functions'
        componentFunctions={SHAPE_COMPONENT_FUNCTIONS}
      ></ComponentFunctionsList>
      {
        selectedShapeType === 'rectangle' ? (
          <ComponentFunctionsList
            functionsTitle='Rectangle functions'
            componentFunctions={RECTANGLE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'circle' ? (
          <ComponentFunctionsList
            functionsTitle='Circle functions'
            componentFunctions={CIRCLE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'ellipse' ? (
          <ComponentFunctionsList
            functionsTitle='Ellipse functions'
            componentFunctions={ELLIPSE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'line' ? (
          <ComponentFunctionsList
            functionsTitle='Line functions'
            componentFunctions={LINE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'triangle' ? (
          <ComponentFunctionsList
            functionsTitle='Triangle functions'
            componentFunctions={TRIANGLE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'polygon' ? (
          <ComponentFunctionsList
            functionsTitle='Polygon functions'
            componentFunctions={POLYGON_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : <h3>Unsupported shape type</h3>
      }
    </div>
  );

  return (
    <>
      <ViewComponentControls
        allModelComponents={props.allModelComponents}
        typeSpecificControls={shapeTypeSelector}
        typeSpecificFunctions={shapeComponentList}
        isFormValid={props.isFormValid}
        formData={formData}
        handleChange={handleChange}
        functionPrompt='Use the available functions and variables to control the shape.'
        componentsPrompt='Select the model components that will control the shape.'
      ></ViewComponentControls>
    </>
  );
}

// A form component that lets you set the default values of various shape types
const ShapeOptionsForm = props => {
  const formData = props.formData;
  const handleChange = props.handleChange;

  const selectedShapeType = formData.defaultShapeOptions.shapeType;

  /**
   * Set a particular shape option without overriding the other options.
   * @param optionName
   * @param optionValue
   */
  const setShapeOption = ( optionName, optionValue ) => {
    const shapeOptions = formData.defaultShapeOptions;
    shapeOptions[ optionName ] = optionValue;
    handleChange( { defaultShapeOptions: shapeOptions } );
  };

  const setViewOption = ( optionName, optionValue ) => {
    const viewOptions = formData.defaultViewOptions;
    viewOptions[ optionName ] = optionValue;
    handleChange( { defaultViewOptions: viewOptions } );
  };

  return (
    <>
      <Accordion defaultActiveKey={[ '0' ]} alwaysOpen>
        <Accordion.Item eventKey='0'>
          <Accordion.Header className={styles.cardHeader}>General Options</Accordion.Header>
          <Accordion.Body className={styles.cardBody}>
            <div className={styles.controlElement}>
              <Form.Label>Center X:</Form.Label>
              <Form.Control
                type='number'
                value={formData.defaultViewOptions.centerX}
                onChange={event => {
                  setViewOption( 'centerX', event.target.value );
                }}
              ></Form.Control>
            </div>
            <div className={styles.controlElement}>
              <Form.Label>Center Y:</Form.Label>
              <Form.Control
                type='number'
                value={formData.defaultViewOptions.centerY}
                onChange={event => {
                  setViewOption( 'centerY', event.target.value );
                }}
              ></Form.Control>
            </div>
            <div className={styles.controlElement}>
              <Form.Label>Scale:</Form.Label>
              <Form.Control
                type='number'
                value={formData.defaultViewOptions.scale}
                onChange={event => {
                  setViewOption( 'scale', event.target.value );
                }}
              ></Form.Control>
            </div>
            <div className={styles.controlElement}>
              <Form.Label>Rotation:</Form.Label>
              <Form.Control
                type='number'
                value={formData.defaultViewOptions.rotation}
                onChange={event => {
                  setViewOption( 'rotation', event.target.value );
                }}
              ></Form.Control>
            </div>
            <div className={styles.controlElement}>
              <Form.Label>Opacity:</Form.Label>
              <Form.Control
                type='number'
                value={formData.defaultViewOptions.opacity}
                onChange={event => {
                  setViewOption( 'opacity', event.target.value );
                }}
              ></Form.Control>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey='1'>
          <Accordion.Header>Shape Options</Accordion.Header>
          <Accordion.Body>
            <div className={styles.controlElement}>
              <Form.Label>Shape fill:</Form.Label>
              <Form.Control
                type='text'
                value={formData.defaultShapeOptions.fill}
                onChange={event => {
                  setShapeOption( 'fill', event.target.value );
                }}
              ></Form.Control>
            </div>
            <div className={styles.controlElement}>
              <Form.Label>Shape stroke:</Form.Label>
              <Form.Control
                type='text'
                value={formData.defaultShapeOptions.stroke}
                onChange={event => {
                  setShapeOption( 'stroke', event.target.value );
                }}
              ></Form.Control>
            </div>
            <div className={styles.controlElement}>
              <Form.Label>Shape line width:</Form.Label>
              <Form.Control
                type='number'
                value={formData.defaultShapeOptions.lineWidth}
                onChange={event => {
                  setShapeOption( 'lineWidth', event.target.value );
                }}
              ></Form.Control>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey='2'>
          <Accordion.Header>Geometry Specific Options</Accordion.Header>
          <Accordion.Body>
            {

              // Rectangle defaults
              selectedShapeType === 'rectangle' ? (
                                                  <div className={styles.controlElement}>
                                                    <Form.Label>Rectangle width:</Form.Label>
                                                    <Form.Control
                                                      type='number'
                                                      value={formData.defaultShapeOptions.rectWidth}
                                                      onChange={event => {
                                                        setShapeOption( 'rectWidth', event.target.value );
                                                      }}
                                                    ></Form.Control>
                                                    <Form.Label>Rectangle height:</Form.Label>
                                                    <Form.Control
                                                      type='number'
                                                      value={formData.defaultShapeOptions.rectHeight}
                                                      onChange={event => {
                                                        setShapeOption( 'rectHeight', event.target.value );
                                                      }}
                                                    ></Form.Control>
                                                  </div>
                                                ) :

                // Circle defaults
              selectedShapeType === 'circle' ? (
                                               <div className={styles.controlElement}>
                                                 <Form.Label>Circle radius:</Form.Label>
                                                 <Form.Control
                                                   type='number'
                                                   value={formData.defaultShapeOptions.radius}
                                                   onChange={event => {
                                                     setShapeOption( 'radius', event.target.value );
                                                   }}
                                                 ></Form.Control>
                                               </div>
                                             ) :

                // Line defaults
              selectedShapeType === 'line' ? (
                                             <div className={styles.conttrolElement}>
                                               <Form.Label>Line start X:</Form.Label>
                                               <Form.Control
                                                 type='number'
                                                 value={formData.defaultShapeOptions.lineStartX}
                                                 onChange={event => {
                                                   setShapeOption( 'lineStartX', event.target.value );
                                                 }}
                                               ></Form.Control>
                                               <Form.Label>Line start Y:</Form.Label>
                                               <Form.Control
                                                 type='number'
                                                 value={formData.defaultShapeOptions.lineStartY}
                                                 onChange={event => {
                                                   setShapeOption( 'lineStartY', event.target.value );
                                                 }}
                                               ></Form.Control>
                                               <Form.Label>Line end X:</Form.Label>
                                               <Form.Control
                                                 type='number'
                                                 value={formData.defaultShapeOptions.lineEndX}
                                                 onChange={event => {
                                                   setShapeOption( 'lineEndX', event.target.value );
                                                 }}
                                               ></Form.Control>
                                               <Form.Label>Line end Y:</Form.Label>
                                               <Form.Control
                                                 type='number'
                                                 value={formData.defaultShapeOptions.lineEndY}
                                                 onChange={event => {
                                                   setShapeOption( 'lineEndY', event.target.value );
                                                 }}
                                               ></Form.Control>
                                             </div>
                                           ) :
              selectedShapeType === 'triangle' ? (
                                                 <div className={styles.controlElement}>
                                                   <Form.Label>Triangle base width:</Form.Label>
                                                   <Form.Control
                                                     type='number'
                                                     value={formData.defaultShapeOptions.triangleBaseWidth}
                                                     onChange={event => {
                                                       setShapeOption( 'triangleBaseWidth', event.target.value );
                                                     }}
                                                   ></Form.Control>
                                                   <Form.Label>Triangle height:</Form.Label>
                                                   <Form.Control
                                                     type='number'
                                                     value={formData.defaultShapeOptions.triangleHeight}
                                                     onChange={event => {
                                                       setShapeOption( 'triangleHeight', event.target.value );
                                                     }}
                                                   ></Form.Control>
                                                 </div>
                                               ) :
              selectedShapeType === 'ellipse' ? (
                                                <div className={styles.controlElement}>
                                                  <Form.Label>Ellipse radius X:</Form.Label>
                                                  <Form.Control
                                                    type='number'
                                                    value={formData.defaultShapeOptions.ellipseRadiusX}
                                                    onChange={event => {
                                                      setShapeOption( 'ellipseRadiusX', event.target.value );
                                                    }}
                                                  ></Form.Control>
                                                  <Form.Label>Ellipse radius Y:</Form.Label>
                                                  <Form.Control
                                                    type='number'
                                                    value={formData.defaultShapeOptions.ellipseRadiusY}
                                                    onChange={event => {
                                                      setShapeOption( 'ellipseRadiusY', event.target.value );
                                                    }}
                                                  ></Form.Control>
                                                </div>
                                              ) :
              selectedShapeType === 'polygon' ? (
                <div className={styles.controlElement}>
                  <Form.Label>Polygon points:</Form.Label>
                  <div>
                    <StyledButton
                      name={'Add Point'}
                      otherClassNames={styles.horizontalPadding}
                      onClick={() => {

                        // add a new point to the formData.defaultShapeOptions.polygonPoints array
                        const currentPoints = formData.defaultShapeOptions.polygonPoints;
                        currentPoints.push( [ 0, 0 ] );

                        // handleChange will update state correctly for react to reflect this change
                        handleChange( { defaultShapeOptions: formData.defaultShapeOptions } );
                      }}
                    ></StyledButton>
                    <StyledButton
                      name={'Remove Point'}
                      otherClassNames={styles.horizontalPadding}
                      onClick={() => {

                        // remove the last point from the formData.defaultShapeOptions.polygonPoints array
                        const currentPoints = formData.defaultShapeOptions.polygonPoints;
                        currentPoints.pop();

                        console.log( currentPoints );

                        // handleChange will update state correctly for react to reflect this change
                        handleChange( { defaultShapeOptions: formData.defaultShapeOptions } );
                      }}
                    ></StyledButton>
                  </div>
                  {
                    formData.defaultShapeOptions.polygonPoints.map( ( point, index ) => {
                      const [ x, y ] = point; // [x,y]
                      return (
                        <div key={`point-control-${index}`}>
                          <div className={styles.controlElement}>
                            <Form.Label>Point {index + 1} X:</Form.Label>
                            <Form.Control
                              type='number'
                              value={x}
                              onChange={event => {

                                // change the value in the formData.defaultShapeOptions.polygonPoints array
                                const currentPoints = formData.defaultShapeOptions.polygonPoints;
                                currentPoints[ index ] = [ event.target.value, y ];

                                // handleChange will update state correctly for react to reflect this change
                                handleChange( { defaultShapeOptions: formData.defaultShapeOptions } );
                              }}
                            ></Form.Control>
                          </div>
                          <div className={styles.controlElement}>
                            <Form.Label>Point {index + 1} Y:</Form.Label>
                            <Form.Control
                              type='number'
                              value={y}
                              onChange={event => {

                                // change the value in the formData.defaultShapeOptions.polygonPoints array
                                const currentPoints = formData.defaultShapeOptions.polygonPoints;
                                currentPoints[ index ] = [ x, event.target.value ];

                                // handleChange will update state correctly for react to reflect this change
                                handleChange( { defaultShapeOptions: formData.defaultShapeOptions } );
                              }}
                            ></Form.Control>
                          </div>
                        </div>
                      );
                    } )
                  }
                </div>
              ) : null
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};