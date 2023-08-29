/**
 * A form that displays controls for editing various shape parameters.
 */

import React from 'react';
import { Accordion } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import StyledButton from '../../react/StyledButton.js';
import styles from './../../CreatorMain.css';

export default function ShapeOptionsForm( props ) {
  const formData = props.formData;
  const handleChange = props.handleChange;

  if ( !formData || !handleChange ) {
    throw new Error( 'ShapeOptionsForm requires formData and handleChange props from a useEditableForm hook.' );
  }

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

  return (
    <>
      <Accordion defaultActiveKey={[ '0' ]} alwaysOpen>
        <GeneralAccordionItem
          formData={formData}
          handleChange={handleChange}
        ></GeneralAccordionItem>
        <ShapeOptionsAccordionItem
          formData={formData}
          handleChange={handleChange}
          setShapeOption={setShapeOption}></ShapeOptionsAccordionItem>
        <GeometryOptionsAccordionItem
          formData={formData}
          handleChange={handleChange}
          setShapeOption={setShapeOption}></GeometryOptionsAccordionItem>
      </Accordion>
    </>
  );
}

const GeneralAccordionItem = ( { formData, handleChange } ) => {

  /**
   * Sets a particular view component option without clearing out all the others.
   * @param optionName
   * @param optionValue
   */
  const setViewOption = ( optionName, optionValue ) => {
    const viewOptions = formData.defaultViewOptions;
    viewOptions[ optionName ] = optionValue;
    handleChange( { defaultViewOptions: viewOptions } );
  };

  return (
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
  );
};

/**
 * The form specifically for editing the look of the shape (stroke, fill, line width, etc.)
 */
const ShapeOptionsAccordionItem = ( { formData, handleChange, setShapeOption } ) => {
  return (
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
  );
};

/**
 * A form that lets the user select particular aspects of the shape geometry, for example rectangle
 * width/height or individual polygon points.
 */
const GeometryOptionsAccordionItem = ( { formData, handleChange, setShapeOption } ) => {
  const selectedShapeType = formData.defaultShapeOptions.shapeType;
  return (
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
                                                 setShapeOption( 'circleRadius', event.target.value );
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
  );
};