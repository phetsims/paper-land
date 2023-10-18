import { parse } from 'acorn';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './../CreatorMain.css';

export default function CreatorMonacoEditor( props ) {

  // require props
  if ( typeof props.controlFunctionString !== 'string' ) {
    throw new Error( 'The controlFunctionString prop is required for form state, and must be a string.' );
  }

  const handleChange = props.handleChange || ( () => {} );

  const [ hasError, setHasError ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState( '' );

  // Ref to the current value of code (shouldn't trigger re-render)
  const codeString = useRef( '' );

  // Handles changes to the Monaco editor, saving the code value and passing to parent whenever there is an edit.
  const handleCodeChange = ( newValue, event ) => {
    codeString.current = newValue;
  };

  // Debounce the code change so that we don't report syntax errors on every keystroke - wrapped
  // in useCallback so we don't create a new function on every render and so the correct reference
  // to the debounce is used for cleanup.
  const debouncedHandleCodeChange = useCallback( _.debounce( ( newValue, event ) => {
    codeString.current = newValue;

    // Use acorn to report when there is a syntax error in the current code
    try {
      parse( newValue, { ecmaVersion: 'latest' } );
      setHasError( false );
    }
    catch( error ) {
      setHasError( true );

      if ( error.message ) {
        setErrorMessage( error.message );
      }
    }
  }, 2000 ), [] );

  // Clean up the debounced function when the component unmounts so we don't set state after
  // removal
  useEffect( () => {
    return () => {
      debouncedHandleCodeChange.cancel();
    };
  }, [] );

  return (
    <div>
      <div className={`${styles.editor} ${styles.controlElement}`}>
        <MonacoEditor
          value={props.controlFunctionString}
          language='javascript'
          theme='vs-dark'
          onChange={( newValue, event ) => {

            // an empty string in case of undefined
            const codeValue = newValue || '';

            handleCodeChange( codeValue, event );

            // Call the debounced function instead of handleCodeChange
            debouncedHandleCodeChange( codeValue, event );

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
      {hasError && (
        <div className={styles.validation}>
          <h4>{`⚠ Your code has a syntax error: ${errorMessage}`}</h4>
        </div>
      )}
    </div>
  );
}