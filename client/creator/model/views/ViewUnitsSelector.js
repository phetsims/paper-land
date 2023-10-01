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

  const selectedUnits = props.formData.defaultViewOptions.viewUnits;
  return (
    <div className={styles.controlElement}>
      <Accordion defaultActiveKey={null}>
        <Accordion.Item eventKey='0'>
          <Accordion.Header className={styles.cardHeader}>View Units</Accordion.Header>
          <Accordion.Body>
            <Form.Group className={styles.controlElement}>
              <Form.Check
                type='radio'
                name={'viewUnits'}
                label={'Model units (recommended) - Model units will work for any display size and make custom code simpler! All values between 0-1. (0,0) at the top left and (1,1) at the bottom right.'}
                checked={selectedUnits === 'model'}
                onChange={event => {

                  // Update the specific option for view units without overriding the entire options
                  const newUnits = event.target.checked ? 'model' : 'pixels';
                  const viewOptions = props.formData.defaultViewOptions;
                  viewOptions.viewUnits = newUnits;
                  props.handleChange( {
                    defaultViewOptions: viewOptions
                  } );
                }}/>
              <Form.Check
                name={'viewUnits'}
                type='radio'
                label={'Pixels'}
                checked={selectedUnits === 'pixels'}
                onChange={event => {

                  // Update the specific option for view units without overriding the entire options
                  const newUnits = event.target.checked ? 'pixels' : 'model';
                  const viewOptions = props.formData.defaultViewOptions;
                  viewOptions.viewUnits = newUnits;
                  props.handleChange( {
                    defaultViewOptions: viewOptions
                  } );
                }}/>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}