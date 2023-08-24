import React, { useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './../CreatorMain.css';

export default function CreatorMonacoEditor( props ) {

  // require props
  if ( typeof props.controlFunctionString !== 'string' ) {
    throw new Error( 'The controlFunctionString prop is required for form state, and must be a string.' );
  }

  const handleChange = props.handleChange || ( () => {} );

  // Ref to the current value of code (shouldn't trigger re-render)
  const codeString = useRef( '' );

  // Handles changes to the Monaco editor, saving the code value and passing to parent whenever there is an edit.
  const handleCodeChange = ( newValue, event ) => {
    codeString.current = newValue;
  };

  return (
    <div className={`${styles.editor} ${styles.controlElement}`}>
      <MonacoEditor
        value={props.controlFunctionString}
        language='javascript'
        theme='vs-dark'
        onChange={( newValue, event ) => {

          // an empty string in case of undefined
          const codeValue = newValue || '';

          handleCodeChange( codeValue, event );
          handleChange( codeValue );
        }}
        options={{
          tabSize: 2,
          fontSize: '16px',
          minimap: { enabled: false },
          automaticLayout: true
        }}
      />
    </div>
  );
}