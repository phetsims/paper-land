import React, { useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './../CreatorMain.css';

export default function CreatorMonacoEditor( props ) {

  // require props
  if ( !props.formData ) {
    throw new Error( 'The formData prop is required for form state.' );
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
        value={props.formData.controlFunctionString}
        language='javascript'
        theme='vs-dark'
        onChange={( newValue, event ) => {
          handleCodeChange( newValue, event );
          handleChange( newValue );
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