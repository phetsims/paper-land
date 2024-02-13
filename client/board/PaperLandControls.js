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

// A delay in seconds that controls how long a program must be out of detection before calling
// any removal callbacks (onProgramRemoved, onProgramMarkersRemoved).
const MIN_REMOVAL_DELAY = 0;
const MAX_REMOVAL_DELAY = 5;
const REMOVAL_INTERVAL_STEP = 0.5;

export default function PaperLandControls( props ) {
  const [ positionInterval, setPositionInterval ] = useState( props.initialPositionInterval );
  const [ removalDelay, setRemovalDelay ] = useState( props.initialRemovalDelay );
  const [ consoleVisible, setConsoleVisible ] = useState( true );
  const [ printSpeechSynthesis, setPrintSpeechSynthesis ] = useState( false );

  useEffect( () => {
    const fullScreenListener = fullScreen => {
      if ( props.sceneryDisplay ) {
        if ( fullScreen ) {

          // remove the styling that positions the board for development
          props.sceneryDisplay.domElement.classList.remove( styles.simDisplayPanel );
          props.sceneryDisplay.domElement.classList.remove( styles.boardPanel );

          // There is a delay between when the resize happens and when the values for window dimensions are updated.
          // Waiting until the resize event confirms that we will set the scenery display and paper-land display
          // size to accurate values.
          const resizeObserver = new ResizeObserver( entries => {
            for ( const entry of entries ) {

              // Assuming we are observing the full-screen element
              const { width, height } = entry.contentRect;
              props.sceneryDisplay.setWidthHeight( width, height );
              phet.paperLand.displaySizeProperty.value = new phet.dot.Dimension2( width, height );

              // // take up the full window
              // props.sceneryDisplay.setWidthHeight( window.innerWidth, window.innerHeight );
              // phet.paperLand.displaySizeProperty.value = new phet.dot.Dimension2( window.innerWidth, window.innerHeight );

              // remove the observer right away, this should only be done the first time we enter full screen
              resizeObserver.disconnect();
            }
          } );

          // Start observing a target element at some point in your code
          resizeObserver.observe( props.sceneryDisplay.domElement ); // Or another target element
        }
        else {
          const smallWidth = 640;
          const smallHeight = 480;

          // re-apply styling for development
          props.sceneryDisplay.domElement.classList.add( styles.simDisplayPanel );
          props.sceneryDisplay.domElement.classList.add( styles.boardPanel );
          props.sceneryDisplay.setWidthHeight( smallWidth, smallHeight );
          phet.paperLand.displaySizeProperty.value = new phet.dot.Dimension2( smallWidth, smallHeight );
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
    <div className={`${styles.boardPanel}`}>
      <>
        <>
          <div>
            <Form.Label>Position Interval (%):</Form.Label>
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
        <div>
          <Form.Label>Removal Delay (seconds):</Form.Label>
          <p className={styles.inlineValue}>{removalDelay}</p>
          <Form.Range
            min={MIN_REMOVAL_DELAY}
            max={MAX_REMOVAL_DELAY}
            step={REMOVAL_INTERVAL_STEP}
            value={removalDelay}
            onChange={event => {
              const newValue = event.target.value;
              setRemovalDelay( newValue );
              props.updateRemovalDelay( newValue );
            }}
          />
        </div>
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