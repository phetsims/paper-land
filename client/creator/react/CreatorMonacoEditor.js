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

    // The code will actually be wrapped in a function. Wrap the proposed code in a test function
    // for more accurate syntax error reporting (e.g. 'return' statements are OK (and expected!) without the user
    // writing their own function).
    const testFunctionString = `function testFunction() { ${newValue} }`;

    // Use acorn to report when there is a syntax error in the current code
    try {
      parse( testFunctionString, { ecmaVersion: 'latest' } );
      setHasError( false );
    }
    catch( error ) {
      setHasError( true );

      if ( error.message ) {
        setErrorMessage( error.message );
      }
    }
  }, 2000 ), [] );

  useEffect( () => {
    debouncedHandleCodeChange( props.controlFunctionString );
  }, [ props.controlFunctionString ] );

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

            handleChange( codeValue );
          }}
          editorDidMount={( editor, monaco ) => {
            // Add Paper Land TypeScript definitions for better IntelliSense
            addPaperLandTypesToMonaco( monaco );
            
            // Call any additional editorDidMount callback passed as prop
            if ( props.editorDidMount ) {
              props.editorDidMount( editor, monaco );
            }
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

/**
 * Adds Paper Land TypeScript definitions to Monaco Editor for better IntelliSense support.
 * @param monaco - The monaco editor instance
 */
function addPaperLandTypesToMonaco( monaco ) {
  const paperLandTypes = `
/**
 * TypeScript definitions for Paper Land API objects.
 * These definitions provide IntelliSense and autocomplete for the main Paper Land objects.
 */

interface Point {
  x: number;
  y: number;
}

type PaperPoints = [Point, Point, Point, Point];

interface Marker {
  /** Unique ID for this marker */
  id: number;
  /** Color name of the marker (e.g., 'red', 'blue', 'green', etc.) */
  colorName: string;
  /** Position of the marker in camera coordinates */
  position: Point;
  /** Position of the marker relative to the paper it's on (if any) */
  positionOnPaper?: Point;
  /** The paper program number this marker is on (if any) */
  paperNumber?: number;
}

interface DisplaySize {
  width: number;
  height: number;
}

interface DisplayModel {
  /** Get a model component by name */
  get(componentName: string): any;
  /** Set a model component with a name */
  set(componentName: string, component: any): void;
  /** Check if a model component exists */
  has(componentName: string): boolean;
  /** Remove a model component */
  delete(componentName: string): boolean;
  /** Get all component names */
  keys(): IterableIterator<string>;
  /** Get all component values */
  values(): IterableIterator<any>;
  /** Get all entries */
  entries(): IterableIterator<[string, any]>;
  /** Size of the model */
  size: number;
}

interface Scene {
  /** Add a child node to the scene */
  addChild(node: any): void;
  /** Remove a child node from the scene */
  removeChild(node: any): void;
  /** Remove all children */
  removeAllChildren(): void;
  /** Get children */
  children: any[];
}

interface SharedData {
  /** Reference to the display model containing all model components */
  model: DisplayModel;
  /** Reference to the root scene node for adding visual elements */
  scene: Scene;
  /** The size of the display in view coordinates */
  displaySize: DisplaySize;
  /** All markers currently detected by the camera */
  allMarkers: Marker[];
}

interface Scratchpad {
  /** Store any data specific to this program */
  [key: string]: any;
}

declare namespace phet {
  namespace paperLand {
    /** Console for logging (appears in sidebar) */
    const console: {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
    };

    /** Add a model component to the display model */
    function addModelComponent(name: string, component: any): void;
    
    /** Remove a model component from the display model */
    function removeModelComponent(name: string): void;
    
    /** Set program-specific data */
    function setProgramData(paperNumber: number, dataName: string, data: any): void;
    
    /** Get program-specific data */
    function getProgramData(paperNumber: number, dataName: string): any;
    
    /** Remove program-specific data */
    function removeProgramData(paperNumber: number, dataName: string): void;

    /** Emitter for when markers are added anywhere in the camera view */
    const markersAddedEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };

    /** Emitter for when markers are removed anywhere in the camera view */
    const markersRemovedEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };

    /** Emitter for when markers change position anywhere in the camera view */
    const markersChangedPositionEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };

    /** Utility functions for working with paper programs */
    const utils: {
      /** Get the rotation of a program in radians (0 to 2π) */
      getProgramRotation(points: PaperPoints): number;
      
      /** Get normalized rotation (0 to 1) */
      getNormalizedProgramRotation(points: PaperPoints): number;
      
      /** Get enumeration value based on program rotation */
      getEnumerationValueFromProgramRotation(points: PaperPoints, enumerationValues: string[]): string;
      
      /** Get the center point of a program */
      getProgramCenter(points: PaperPoints): Point;
      
      /** Get normalized position of a marker on a paper (0 to 1) */
      getMarkerPositionNormalized(markers: Marker[], colorName: string): number | null;
    };
  }
}

// Global variables available in all Paper Land programs
declare const sharedData: SharedData;
declare const scratchpad: Scratchpad;
declare const points: PaperPoints;
declare const paperNumber: number;
declare const otherPaperNumber: number;
declare const direction: 'left' | 'right' | 'up' | 'down';
declare const markersOnProgram: Marker[];
`;

  // Add the Paper Land type definitions as an extra library
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    paperLandTypes,
    'paper-land-types.d.ts'
  );

  // Configure TypeScript compiler options for better JavaScript IntelliSense
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: false, // Don't show TypeScript errors in JavaScript code
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs
  });

  // Set diagnostics options to reduce noise while keeping helpful suggestions
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true, // Disable semantic validation to avoid TS errors in JS
    noSyntaxValidation: false,  // Keep syntax validation
    noSuggestionDiagnostics: false // Keep suggestions
  });
}