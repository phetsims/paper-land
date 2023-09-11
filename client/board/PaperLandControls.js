/**
 * Controls that impact the behavior of the board in paper-land.
 */

import React, { useEffect, useState } from 'react';
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
  const [ printSpeechSynthesis, setPrintSpeechSynthesis ] = useState( false );

  useEffect( () => {
    const fullScreenListener = fullScreen => {
      if ( props.sceneryDisplay ) {
        if ( fullScreen ) {

          // remove the styling that positions the board for development
          props.sceneryDisplay.domElement.classList.remove( styles.simDisplayPanel );
          props.sceneryDisplay.domElement.classList.remove( styles.boardPanel );

          // take up the full window
          props.sceneryDisplay.setWidthHeight( window.innerWidth, window.innerHeight );
        }
        else {

          // re-apply styling for development
          props.sceneryDisplay.domElement.classList.add( styles.simDisplayPanel );
          props.sceneryDisplay.domElement.classList.add( styles.boardPanel );

          // TODO: Why do we have to add the pading values here?
          props.sceneryDisplay.setWidthHeight( 640, 480 );
        }
      }
    };
    phet.scenery.FullScreen.isFullScreenProperty.link( fullScreenListener );


    // cleanup, removing the listener before re-render
    return () => {
      phet.scenery.FullScreen.isFullScreenProperty.unlink( fullScreenListener );
    };
  }, [ props.sceneryDisplay ] );

  // Print speech synthesis to the console
  useEffect( () => {
    const printListener = response => {
      if ( printSpeechSynthesis ) {
        phet.paperLand.console.log( 'Speech', `"${response}"` );
      }
    };
    phet.scenery.voicingManager.startSpeakingEmitter.addListener( printListener );

    return () => {
      phet.scenery.voicingManager.startSpeakingEmitter.removeListener( printListener );
    };
  }, [ printSpeechSynthesis ] );

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
        <Form.Check
          type='checkbox'
          label='Print Speech'
          checked={printSpeechSynthesis}
          onChange={event => {
            setPrintSpeechSynthesis( event.target.checked );
          }}
        ></Form.Check>
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