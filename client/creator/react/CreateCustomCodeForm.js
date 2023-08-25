import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import CreatorMonacoEditor from './CreatorMonacoEditor.js';
import styles from './../CreatorMain.css';

const PAPER_NUMBER_DOCUMENTATION = '`paperProgramNumber` - The number of the paper program.';
const OTHER_PAPER_NUMBER_DOCUMENTATION = '`otherPaperProgramNumber` - The number of the other paper program.';
const DIRECTION_DOCUMENTATION = '`direction` - - The direction of the adjacency. One of `left`, `right`, `up`, `down`.';
const SCRATCHPAD_DOCUMENTATION = '`scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.';
const SHARED_DATA_DOCUMENTATION = 'sharedData` - A JavaScript object with global variables of paper-land.';

export default function CreateCustomCodeForm( props ) {
  const program = props.activeEdit.program;

  const [ onProgramAddedCode, setOnProgramAddedCode ] = useState( '' );
  const [ onProgramRemovedCode, setOnProgramRemovedCode ] = useState( '' );
  const [ onProgramChangedPositionCode, setOnProgramChangedPositionCode ] = useState( '' );
  const [ onProgramMarkersAddedCode, setOnProgramMarkersAddedCode ] = useState( '' );
  const [ onProgramMarkersRemovedCode, setOnProgramMarkersRemovedCode ] = useState( '' );
  const [ onProgramMarkersChangedPositionCode, setOnProgramMarkersChangedPositionCode ] = useState( '' );
  const [ onProgramAdjacentCode, setOnProgramAdjacentCode ] = useState( '' );
  const [ onProgramSeparatedCode, setOnProgramSeparatedCode ] = useState( '' );

  // Axon manages the state and directly controls the react state for rendering.
  useEffect( () => {

    // Listeners for each Property to update the react state.
    const onProgramAddedCodeListener = newCode => setOnProgramAddedCode( newCode );
    const onProgramRemovedCodeListener = newCode => setOnProgramRemovedCode( newCode );
    const onProgramChangedPositionCodeListener = newCode => setOnProgramChangedPositionCode( newCode );
    const onProgramMarkersAddedCodeListener = newCode => setOnProgramMarkersAddedCode( newCode );
    const onProgramMarkersRemovedCodeListener = newCode => setOnProgramMarkersRemovedCode( newCode );
    const onProgramMarkersChangedPositionCodeListener = newCode => setOnProgramMarkersChangedPositionCode( newCode );
    const onProgramAdjacentCodeListener = newCode => setOnProgramAdjacentCode( newCode );
    const onProgramSeparatedCodeListener = newCode => setOnProgramSeparatedCode( newCode );

    program.customCodeContainer.onProgramAddedCodeProperty.link( onProgramAddedCodeListener );
    program.customCodeContainer.onProgramRemovedCodeProperty.link( onProgramRemovedCodeListener );
    program.customCodeContainer.onProgramChangedPositionCodeProperty.link( onProgramChangedPositionCodeListener );
    program.customCodeContainer.onProgramMarkersAddedCodeProperty.link( onProgramMarkersAddedCodeListener );
    program.customCodeContainer.onProgramMarkersRemovedCodeProperty.link( onProgramMarkersRemovedCodeListener );
    program.customCodeContainer.onProgramMarkersChangedPositionCodeProperty.link( onProgramMarkersChangedPositionCodeListener );
    program.customCodeContainer.onProgramAdjacentCodeProperty.link( onProgramAdjacentCodeListener );
    program.customCodeContainer.onProgramSeparatedCodeProperty.link( onProgramSeparatedCodeListener );

    // Returning a function tells useEffect to do this disposal work at the right time.
    return () => {
      program.customCodeContainer.onProgramAddedCodeProperty.unlink( onProgramAddedCodeListener );
      program.customCodeContainer.onProgramRemovedCodeProperty.unlink( onProgramRemovedCodeListener );
      program.customCodeContainer.onProgramChangedPositionCodeProperty.unlink( onProgramChangedPositionCodeListener );
      program.customCodeContainer.onProgramMarkersAddedCodeProperty.unlink( onProgramMarkersAddedCodeListener );
      program.customCodeContainer.onProgramMarkersRemovedCodeProperty.unlink( onProgramMarkersRemovedCodeListener );
      program.customCodeContainer.onProgramMarkersChangedPositionCodeProperty.unlink( onProgramMarkersChangedPositionCodeListener );
      program.customCodeContainer.onProgramAdjacentCodeProperty.unlink( onProgramAdjacentCodeListener );
      program.customCodeContainer.onProgramSeparatedCodeProperty.unlink( onProgramSeparatedCodeListener );
    };
  } );


  return (
    <>
      <hr></hr>
      <h3>Custom Code</h3>
      <p>Write custom code for functionality that is not supported by the Creator interface. Your code will be run <b>after</b> any other generated code for that event.</p>
      <p>Refer to <a href='https://github.com/phetsims/paper-land/blob/main/docs/use/board-api.md'>Paper Land documentation</a> for more detailed information.</p>

      <div>
        <CustomCodeEditor
          title='onProgramAdded'
          functionDocumentationString='The function called when your program is detected by the camera.'
          codeStringProperty={program.customCodeContainer.onProgramAddedCodeProperty}
          codeStateString={onProgramAddedCode}
          functionParameterStrings={[
            PAPER_NUMBER_DOCUMENTATION,
            SCRATCHPAD_DOCUMENTATION,
            SHARED_DATA_DOCUMENTATION
          ]}
        >
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramRemoved'
          functionDocumentationString='The function called when your program is no longer detected by the camera.'
          codeStringProperty={program.customCodeContainer.onProgramRemovedCodeProperty}
          codeStateString={onProgramRemovedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramChangedPosition'
          functionDocumentationString='The function called when your program changes position (move or rotate).'
          codeStringProperty={program.customCodeContainer.onProgramChangedPositionCodeProperty}
          codeStateString={onProgramChangedPositionCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramMarkersAdded'
          functionDocumentationString='The function called when one or more markers are placed inside the program.'
          codeStringProperty={program.customCodeContainer.onProgramMarkersAddedCodeProperty}
          codeStateString={onProgramMarkersAddedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramMarkersRemoved'
          functionDocumentationString='The function called when one or more markers are removed from a program.'
          codeStringProperty={program.customCodeContainer.onProgramMarkersRemovedCodeProperty}
          codeStateString={onProgramMarkersRemovedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramMarkersChangedPosition'
          functionDocumentationString='The function called when one or more markers change their position inside this program.'
          codeStringProperty={program.customCodeContainer.onProgramMarkersChangedPositionCodeProperty}
          codeStateString={onProgramMarkersChangedPositionCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramAdjacent'
          functionDocumentationString='Called when a program becomes adjacent to another program in one of the cardinal directions.'
          codeStringProperty={program.customCodeContainer.onProgramAdjacentCodeProperty}
          codeStateString={onProgramAdjacentCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramSeparated'
          functionDocumentationString='Called when a program becomes separated from another program.'
          codeStringProperty={program.customCodeContainer.onProgramSeparatedCodeProperty}
          codeStateString={onProgramSeparatedCode}>
        </CustomCodeEditor>
      </div>
    </>
  );
}


const CustomCodeEditor = props => {
  const title = props.title;
  const codeStringProperty = props.codeStringProperty;
  const codeStateString = props.codeStateString;

  // a string that describes the overall function
  const functionDocumentationString = props.functionDocumentationString || '';

  // an array of strings that will describe each parameter available in the function call
  const functionParametersStrings = props.functionParameterStrings || [];

  return (
    <>
      <hr></hr>
      <h4>{title}:</h4>
      <p>{functionDocumentationString}</p>
      <p>You can use the following variables.</p>
      <ListGroup>
        {functionParametersStrings.map( ( parameterString, index ) => {
          return (
            <ListGroup.Item className={styles.listGroupItem} key={index}>{parameterString}</ListGroup.Item>
          );
        } )}
      </ListGroup>
      <CreatorMonacoEditor
        controlFunctionString={codeStateString}
        handleChange={newCode => {codeStringProperty.value = newCode;}}>
      </CreatorMonacoEditor>
    </>
  );
};