/**
 * Controls that impact the behavior of the board in paper-land.
 */

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './BoardMain.css';

// Program positions are normalized from 0-1 in both dimensions. So a value of 0.05 means that the program
// must move 5% of the distance in X or Y to be considered a change and trigger events.
const MIN_POSITION_INTERVAL = 0;
const MAX_POSITION_INTERVAL = 0.5;
const POSITION_INTERVAL_STEP = 0.01;

export default function PaperLandControls( props ) {
  const [ positionInterval, setPositionInterval ] = useState( props.initialPositionInterval );
  const [ consoleVisible, setConsoleVisible ] = useState( true );

  return (
    <div className={`${styles.paperLandControlsContent} ${styles.boardPanel}`}>
      <>
        <>
          <div>
            <Form.Label>Position Interval</Form.Label>
            <p className={styles.inlineValue}>{positionInterval}</p>
            <Form.Range
              min={MIN_POSITION_INTERVAL}
              max={MAX_POSITION_INTERVAL}
              step={POSITION_INTERVAL_STEP}
              value={positionInterval}
              onChange={event => {
                const newValue = event.target.value;
                setPositionInterval( newValue );
                props.updatePositionInterval( newValue );
              }}
            />
          </div>
        </>
      </>
      <>
        <Form.Check
          type='checkbox'
          label='Show Console'
          checked={consoleVisible}
          onChange={event => {
            const newValue = event.target.checked;
            setConsoleVisible( newValue );
            props.updateConsoleVisibility( newValue );
          }}
        />
      </>
      <>
        <Button
          onClick={() => {
            if ( props.sceneryDisplay ) {
              phet.scenery.FullScreen.enterFullScreen( props.sceneryDisplay );
            }
          }}
        >Projector Mode</Button>
      </>
    </div>
  );
}