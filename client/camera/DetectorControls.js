/**
 * A component that lets you control critical parameters for blob detection. See
 * https://github.com/phetsims/paper-land/issues/127 for notes.
 */

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './CameraMain.css';

export default function DetectorControls( props ) {

  if ( !props.config ) {
    throw new Error( 'DetectorControls requires a config object' );
  }
  if ( !props.onConfigChange ) {
    throw new Error( 'DetectorControls requires a onConfigChange callback' );
  }

  // state for 'faster' in the config, which controls 'averaging dot centers'
  const [ faster, setFaster ] = useState( props.config.faster );

  // For the rest of the sliders state is managed by the inner component SliderWithLabel.
  return (
    <div>
      <div className={styles.detectionControlInput}>
        <Form.Check
          type='checkbox'
          id='faster'
          name='faster'
          label='Average Dot Centers'
          checked={faster}
          onChange={event => {
            const checked = event.target.checked;
            setFaster( checked );
            props.onConfigChange( {
              ...props.config,
              faster: checked
            } );
          }}
        ></Form.Check>
      </div>
      <div>
        <SliderWithLabel
          min={1}
          max={25}
          defaultValue={props.config.thresholdStep || 10}
          label='Pixel Value Step Size'
          handleChange={value => {
            props.onConfigChange( {
              ...props.config,
              thresholdStep: value
            } );
          }}
        />
      </div>
      <div>
        <SliderWithLabel
          min={0}
          max={254}
          step={1}
          defaultValue={props.config.minThreshold || 50}
          label='Minimum Pixel Value'
          handleChange={value => {
            props.onConfigChange( {
              ...props.config,
              minThreshold: value
            } );
          }}
        />
      </div>
      <div>
        <SliderWithLabel
          min={1}
          max={255}
          step={1}
          defaultValue={props.config.maxThreshold || 50}
          label='Maximum Pixel Value'
          handleChange={value => {
            props.onConfigChange( {
              ...props.config,
              maxThreshold: value
            } );
          }}
        />
      </div>
      <div>
        <SliderWithLabel
          min={5}
          max={100}
          step={5}
          defaultValue={props.config.minArea || 25}
          label='Minimum Dot Area (pixels)'
          handleChange={value => {
            props.onConfigChange( {
              ...props.config,
              minArea: value
            } );
          }}
        />
      </div>
      <div>
        <SliderWithLabel
          min={10}
          max={1000}
          step={5}
          defaultValue={props.config.maxArea || 500}
          label='Maximum Dot Area (pixels)'
          handleChange={value => {
            props.onConfigChange( {
              ...props.config,
              maxArea: value
            } );
          }}
        />
      </div>
      <div>
        <SliderWithLabel
          min={1}
          max={50}
          step={1}
          defaultValue={props.config.minDistBetweenBlobs || 10}
          label='Minimum Dot Separation (pixels)'
          handleChange={value => {
            props.onConfigChange( {
              ...props.config,
              minDistBetweenBlobs: value
            } );
          }}
        />
      </div>
    </div>
  );
}

function SliderWithLabel( props ) {

  const label = props.label || 'Slider Value';
  const min = props.min || 0;
  const max = props.max || 100;
  const step = props.step || 1;
  const defaultValue = props.defaultValue || props.min;

  // A function that gives the new slider value as an argument.
  const handleChange = props.handleChange || ( () => {} );

  const [ sliderValue, setSliderValue ] = useState( defaultValue );

  const handleSliderChange = event => {

    const sliderNumber = parseInt( event.target.value, 10 );

    // Both get the new slider value because state might be async
    setSliderValue( sliderNumber );
    handleChange( sliderNumber );
  };

  return (
    <div className={styles.detectionControlInput}>
      <Form.Label>{label}: {sliderValue}</Form.Label>
      <Form.Range
        value={sliderValue}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}