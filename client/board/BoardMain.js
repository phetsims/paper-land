/**
 * Main react component for the Board page.
 */

import React, { useState } from 'react';
import styles from './BoardMain.css';
import PaperLandConsole from './PaperLandConsole.js';
import PaperLandControls from './PaperLandControls.js';
import SceneryDisplay from './SceneryDisplay.js';

export default function BoardMain( props ) {

  const scene = props.scene;
  const boardConfigObject = props.boardConfigObject;
  const updatePositionInterval = props.updatePositionInterval;

  const [ consoleVisible, setConsoleVisible ] = useState( true );

  // a reference to the Display object, so it can be handed to various components
  const [ sceneryDisplay, setSceneryDisplay ] = useState( null );

  // Get the scenery display once it is created so it can be passed to various other components
  const modifySceneryDisplay = display => {
    setSceneryDisplay( display );
  };

  return (
    <div>
      <div className={styles.titleContainer}>
        <h1>Interactive Board</h1>
        <p>Add paper programs to Camera to add elements.</p>
      </div>
      <div className={styles.rowContainer}>
        <div className={styles.rowSpacer}>
        </div>
        <div className={styles.displayWithLog}>
          <SceneryDisplay scene={scene} modifyDisplay={modifySceneryDisplay}/>
          <PaperLandConsole consoleVisible={consoleVisible}></PaperLandConsole>
        </div>
        <div className={styles.controls}>
          <div className={styles.paperLandControlsPanel}>
            <PaperLandControls
              initialPositionInterval={boardConfigObject.positionInterval}
              updatePositionInterval={updatePositionInterval}
              updateConsoleVisibility={setConsoleVisible}
              sceneryDisplay={sceneryDisplay}
            ></PaperLandControls>
          </div>
        </div>
      </div>
    </div>
  );
}