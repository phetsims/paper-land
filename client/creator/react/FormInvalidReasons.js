import React from 'react';

export default function FormInvalidReasons( props ) {
  const invalidReasons = props.invalidReasons;
  const componentNameValid = props.componentNameValid;
  return (
    <div hidden={invalidReasons.length === 0 && componentNameValid}>
      <hr></hr>
      <h4>️ ⚠ </h4>
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