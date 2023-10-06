import React from 'react';
import styles from './../CreatorMain.css';

export default function FormInvalidReasons( props ) {
  const invalidReasons = props.invalidReasons;
  const componentNameValid = props.componentNameValid;
  return (
    <div hidden={invalidReasons.length === 0 && componentNameValid} className={styles.validation}>
      <hr></hr>
      <h4>️⚠ To Create Component:</h4>
      <ul>
        {
          componentNameValid ? null :
          <li>Name is too short or is not unique.</li>
        }
        {
          invalidReasons.map( reason => {
            return <li key={reason}>{reason}</li>;
          } )
        }
      </ul>
    </div>
  );
}