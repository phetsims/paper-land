/**
 * A reusable select input with styling for Creator.
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import styles from './../CreatorMain.css';

export default function StyledSelectInput( props ) {

  // props args:
  //  handleChange: function
  //  index: number - Optional, An index for this select item if created in map
  //  value: string - The default value for this select input
  //  label: string - The label for this select input

  const emptyValueLabel = props.emptyValueLabel || 'Select...';

  return (
    <>
      <Form.Group className={styles.controlElement}>
        <Form.Label>{props.label}</Form.Label>
        <Form.Select
          value={props.value}
          onChange={event => {
            props.handleChange( event, props.index );
          }}
        >
          <option value={''}>{emptyValueLabel}</option>
          {props.options.map( ( option, index ) => {
            return (
              <option key={index} value={option.value}>{option.label}</option>
            );
          } )}
        </Form.Select>
      </Form.Group>
    </>
  );
}