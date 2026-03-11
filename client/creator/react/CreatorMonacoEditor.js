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

  // Configure Monaco editor with paper-land type definitions
  const handleEditorDidMount = ( editor, monaco ) => {
    // Add type definitions for paper-land API

    //Check if the type definitions are already added to avoid duplicates
    if ( !monaco.languages.typescript.javascriptDefaults.getExtraLibs()['paper-land-api.d.ts'] ) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(`
        // Paper-land API type definitions
        
        // Point type for paper corners and marker positions
        declare interface Point {
          x: number;
          y: number;
        }
        
        // Array of points for paper corners (left top, right top, right bottom, left bottom)
        declare type points = Point[];
        
        // Scratchpad object - unique to each program, shared between event listeners, currently generated from the inspector tools
        declare interface Scratchpad {
          outputViewPath: {
          _disposeEmitter: any;
            _isDisposed: any;
            tandem: any;
            phetioID: any;
            phetioObjectInitialized: any;
            _tagName: any;
            _containerTagName: any;
            _labelTagName: any;
            _descriptionTagName: any;
            _inputType: any;
            _inputValue: any;
            _pdomChecked: any;
            _appendLabel: any;
            _appendDescription: any;
            _pdomAttributes: any;
            _pdomClasses: any;
            _labelContent: any;
            _innerContentProperty: any;
            _descriptionContent: any;
            _pdomNamespace: any;
            _ariaLabel: any;
            _ariaRole: any;
            _containerAriaRole: any;
            _ariaValueText: any;
            _ariaLabelledbyAssociations: any;
            _nodesThatAreAriaLabelledbyThisNode: any;
            _ariaDescribedbyAssociations: any;
            _nodesThatAreAriaDescribedbyThisNode: any;
            _activeDescendantAssociations: any;
            _nodesThatAreActiveDescendantToThisNode: any;
            _focusableOverride: any;
            _focusHighlight: any;
            _focusHighlightLayerable: any;
            _groupFocusHighlight: any;
            _pdomVisible: any;
            _pdomOrder: any;
            _pdomParent: any;
            _pdomTransformSourceNode: any;
            _pdomDisplaysInfo: any;
            _pdomInstances: any;
            _positionInPDOM: any;
            excludeLabelSiblingFromInput: any;
            _accessibleName: any;
            _accessibleNameBehavior: any;
            _helpText: any;
            _helpTextBehavior: any;
            _pdomHeading: any;
            _headingLevel: any;
            _pdomHeadingBehavior: any;
            focusHighlightChangedEmitter: any;
            pdomDisplaysEmitter: any;
            pdomBoundInputEnabledListener: any;
            parentAddedEmitter: any;
            parentRemovedEmitter: any;
            _activeParentLayoutConstraint: any;
            _id: any;
            _instances: any;
            _rootedDisplays: any;
            _drawables: any;
            _visibleProperty: any;
            opacityProperty: any;
            disabledOpacityProperty: any;
            _pickableProperty: any;
            _enabledProperty: any;
            _inputEnabledProperty: any;
            clipAreaProperty: any;
            voicingVisibleProperty: any;
            _mouseArea: any;
            _touchArea: any;
            _cursor: any;
            _children: any;
            _parents: any;
            _transformBounds: any;
            _transform: any;
            _transformListener: any;
            _maxWidth: any;
            _maxHeight: any;
            _appliedScaleFactor: any;
            _inputListeners: any;
            boundsProperty: any;
            localBoundsProperty: any;
            childBoundsProperty: any;
            selfBoundsProperty: any;
            _localBoundsOverridden: any;
            _excludeInvisibleChildrenFromBounds: any;
            _layoutOptions: any;
            _boundsDirty: any;
            _localBoundsDirty: any;
            _selfBoundsDirty: any;
            _childBoundsDirty: any;
            _filters: any;
            _hints: any;
            childrenChangedEmitter: any;
            childInsertedEmitter: any;
            childRemovedEmitter: any;
            childrenReorderedEmitter: any;
            transformEmitter: any;
            instanceRefreshEmitter: any;
            rendererSummaryRefreshEmitter: any;
            filterChangeEmitter: any;
            changedInstanceEmitter: any;
            layoutOptionsChangedEmitter: any;
            _rendererBitmask: any;
            _rendererSummary: any;
            _boundsEventCount: any;
            _boundsEventSelfCount: any;
            _picker: any;
            _isGettingRemovedFromParent: any;
            _fill: any;
            _fillPickable: any;
            _stroke: any;
            _strokePickable: any;
            _cachedPaints: any;
            _lineDrawingStyles: any;
            _shape: any;
            _strokedShape: any;
            _boundsMethod: any;
            _invalidShapeListener: any;
            _invalidShapeListenerAttached: any;
            _mutatorKeys: any;
            drawableMarkFlags: any;
          }; // Path to the output view, used for displaying results
          outputViewPathMultilinkId: number;
        }
        
        // Marker object with position and color information
        declare interface Marker {
          position: Point;
          positionOnPaper?: Point;
          paperNumber?: number;
          color: number[];
          colorName: string;
          size: number;
        }
        
        // Shared data object with global paper-land variables, currently generated from the inspector tools
        declare interface SharedData {
          scene: any; // Scenery Node
          displaySize: { width: number; height: number };
          model: {
          _disposeEmitter: any;
          _isDisposed: any;
          tandem: any;
          phetioID: any;
          phetioObjectInitialized: any;
          _tagName: any;
          _containerTagName: any;
          _labelTagName: any;
          _descriptionTagName: any;
          _inputType: any;
          _inputValue: any;
          _pdomChecked: any;
          _appendLabel: any;
          _appendDescription: any;
          _pdomAttributes: any;
          _pdomClasses: any;
          _labelContent: any;
          _innerContentProperty: any;
          _descriptionContent: any;
          _pdomNamespace: any;
          _ariaLabel: any;
          _ariaRole: any;
          _containerAriaRole: any;
          _ariaValueText: any;
          _ariaLabelledbyAssociations: any;
          _nodesThatAreAriaLabelledbyThisNode: any;
          _ariaDescribedbyAssociations: any;
          _nodesThatAreAriaDescribedbyThisNode: any;
          _activeDescendantAssociations: any;
          _nodesThatAreActiveDescendantToThisNode: any;
          _focusableOverride: any;
          _focusHighlight: any;
          _focusHighlightLayerable: any;
          _groupFocusHighlight: any;
          _pdomVisible: any;
          _pdomOrder: any;
          _pdomParent: any;
          _pdomTransformSourceNode: any;
          _pdomDisplaysInfo: any;
          _pdomInstances: any;
          _positionInPDOM: any;
          excludeLabelSiblingFromInput: any;
          _accessibleName: any;
          _accessibleNameBehavior: any;
          _helpText: any;
          _helpTextBehavior: any;
          _pdomHeading: any;
          _headingLevel: any;
          _pdomHeadingBehavior: any;
          focusHighlightChangedEmitter: any;
          pdomDisplaysEmitter: any;
          pdomBoundInputEnabledListener: any;
          parentAddedEmitter: any;
          parentRemovedEmitter: any;
          _activeParentLayoutConstraint: any;
          _id: any;
          _instances: any;
          _rootedDisplays: any;
          _drawables: any;
          _visibleProperty: any;
          opacityProperty: any;
          disabledOpacityProperty: any;
          _pickableProperty: any;
          _enabledProperty: any;
          _inputEnabledProperty: any;
          clipAreaProperty: any;
          voicingVisibleProperty: any;
          _mouseArea: any;
          _touchArea: any;
          _cursor: any;
          _children: any;
          _parents: any;
          _transformBounds: any;
          _transform: any;
          _transformListener: any;
          _maxWidth: any;
          _maxHeight: any;
          _appliedScaleFactor: any;
          _inputListeners: any;
          boundsProperty: any;
          localBoundsProperty: any;
          childBoundsProperty: any;
          selfBoundsProperty: any;
          _localBoundsOverridden: any;
          _excludeInvisibleChildrenFromBounds: any;
          _layoutOptions: any;
          _boundsDirty: any;
          _localBoundsDirty: any;
          _selfBoundsDirty: any;
          _childBoundsDirty: any;
          _filters: any;
          _hints: any;
          childrenChangedEmitter: any;
          childInsertedEmitter: any;
          childRemovedEmitter: any;
          childrenReorderedEmitter: any;
          transformEmitter: any;
          instanceRefreshEmitter: any;
          rendererSummaryRefreshEmitter: any;
          filterChangeEmitter: any;
          changedInstanceEmitter: any;
          layoutOptionsChangedEmitter: any;
          _rendererBitmask: any;
          _rendererSummary: any;
          _boundsEventCount: any;
          _boundsEventSelfCount: any;
          _picker: any;
          _isGettingRemovedFromParent: any;
          _mutatorKeys: any;
          drawableMarkFlags: any;
          }; // Display model
          allMarkers: Marker[];
        }
        
        // Paper event function signatures
        declare function onProgramAdded(paperProgramNumber: number, scratchpad: Scratchpad, sharedData: SharedData): void;
        declare function onProgramRemoved(paperProgramNumber: number, scratchpad: Scratchpad, sharedData: SharedData): void;
        declare function onProgramChangedPosition(paperProgramNumber: number, paperPoints: PaperPoints, scratchpad: Scratchpad, sharedData: SharedData): void;
        declare function onProgramMarkersAdded(paperProgramNumber: number, paperPoints: PaperPoints, scratchpad: Scratchpad, sharedData: SharedData, markersOnProgram: Marker[]): void;
        declare function onProgramMarkersRemoved(paperProgramNumber: number, paperPoints: PaperPoints, scratchpad: Scratchpad, sharedData: SharedData, markersOnProgram: Marker[]): void;
        declare function onProgramMarkersChangedPosition(paperProgramNumber: number, paperPoints: PaperPoints, scratchpad: Scratchpad, sharedData: SharedData, markersOnProgram: Marker[]): void;
        declare function onProgramAdjacent(paperProgramNumber: number, otherPaperNumber: number, direction: string, scratchpad: Scratchpad, sharedData: SharedData): void;
        declare function onProgramSeparated(paperProgramNumber: number, otherPaperNumber: number, direction: string, scratchpad: Scratchpad, sharedData: SharedData): void;
        
        // Common paper-land API variables available in scope
        declare const paperProgramNumber: number;
        declare const scratchpad: Scratchpad;
        declare const sharedData: SharedData;
        declare const paperPoints: PaperPoints;
        declare const markersOnProgram: Marker[];
        declare const otherPaperNumber: number;
        declare const direction: string;
      `, 'paper-land-api.d.ts');
      }
  };


  return (
    <div>
      <div className={`${styles.editor} ${styles.controlElement}`}>
        <MonacoEditor
          value={props.controlFunctionString}
          language='javascript'
          theme='vs-dark'
          editorDidMount={handleEditorDidMount}
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
      {hasError && (
        <div className={styles.validation}>
          <h4>{`⚠ Your code has a syntax error: ${errorMessage}`}</h4>
        </div>
      )}
    </div>
  );
}