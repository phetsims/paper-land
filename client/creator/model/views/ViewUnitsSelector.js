/**
 * A react component that wil select between normalized and pixel coordinates.
 *
 * I could not figure out how to get this component to work with state like the other radio
 * button groups. The current implementation works OK to control the value but does not reflect
 * the loaded/initial selection. I was never able to figure out why. I have a theory it is due to
 * nested state objects.
 */

import React from 'react';
import { Accordion } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import styles from './../../CreatorMain.css';

export default function ViewUnitsSelector( props ) {
  if ( !props.formData ) {
    throw new Error( 'ViewUnitsSelector requires a formData prop to control state.' );
  }
  if ( !props.formData.defaultViewOptions ) {
    throw new Error( 'ViewUnitsSelector requires a formData.defaultViewOptions prop to control state.' );
  }
  if ( !props.handleChange ) {
    throw new Error( 'ViewUnitsSelector requires a handleChange prop to control state.' );
  }

  const handleOptionChange = event => {

    // Update the specific option for view units without overriding the entire options
    const newUnits = event.target.value === 'model' ? 'model' : 'pixels';

    // attempting to get a new object to update the state - but it doesn't seem to work
    const viewOptions = { ...props.formData.defaultViewOptions };
    viewOptions.viewUnits = newUnits;
    props.handleChange( {
      defaultViewOptions: viewOptions
    } );
  };

  // TODO: This component does not reflect the initial selection. I could not figure out why.
  //  To continue with that, try adding back checked and defaultChecked attributes.

  return (
    <div className={styles.controlElement}>
      <Accordion defaultActiveKey={null}>
        <Accordion.Item eventKey='0'>
          <Accordion.Header className={styles.cardHeader}>View Units</Accordion.Header>
          <Accordion.Body>
            <div className={styles.controlElement}>
              <Form.Label>Default Value</Form.Label>
              <Form.Check
                type={'radio'}
                value={'model'}
                label={'Normalized units (recommended) - Normalized units will work for any display size and make custom code simpler! All values between 0-1. (0,0) at the top left and (1,1) at the bottom right.'}
                name={'view-units-group'}
                onChange={event => handleOptionChange( event )}
                id={'boolean-radio-true'}
              />
              <Form.Check
                type={'radio'}
                label={'Pixels'}
                value={'pixels'}
                name={'view-units-group'}
                onChange={event => handleOptionChange( event )}
                id={'boolean-radio-false'}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}