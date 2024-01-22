/**
 * CameraControls is a React component that provides a UI and underlying functional code for adjusting parameters of the
 * camera.
 *
 * As of 1/22/24, only the camera flip controls are implmented. We looked into adding other device controls, but
 * encountered too many problems to proceed. See
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import React from 'react';
import styles from './CameraMain.css';

export default function CameraControls( props ) {

  return (
    <>
      <h3 className={styles.headerWithOption}>Camera Settings</h3>

      {/*Camera flip controls*/}
      <label className={styles.detectionControlLabel}>Flip Camera Feed:</label>
      <div className={styles.detectionControlInput}>
        <input id='flip-x-checkbox' type='checkbox' checked={props.flipCameraFeedX} onChange={event => {
          props.onCameraFlipChanged( event.target.checked, props.flipCameraFeedY );
        }}/><label htmlFor='flip-x-checkbox'>X</label><br/>
        <input id='flip-y-checkbox' type='checkbox' checked={props.flipCameraFeedY} onChange={event => {
          props.onCameraFlipChanged( props.flipCameraFeedX, event.target.checked );
        }}/><label htmlFor='flip-y-checkbox'>Y</label><br/>
      </div>
    </>
  );
}