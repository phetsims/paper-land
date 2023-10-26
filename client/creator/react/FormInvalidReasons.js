import React from 'react';
import styles from './../CreatorMain.css';

export default function FormInvalidReasons( props ) {
  const invalidReasons = props.invalidReasons;
  const componentNameValid = props.componentNameValid;
  return (
    <div hidden={invalidReasons.length === 0 && componentNameValid} className={styles.validation}>
      <hr></hr>
      <h4>️⚠ Required for component:</h4>
      <ul>
        {
          componentNameValid ? null :
          <li>Name is invalid. Must be unique, start with a letter, and contain only letters, numbers, and underscores. Cannot be a reserved JavaScript keyword.</li>
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