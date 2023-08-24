import React, { useEffect, useState } from 'react';
import CreatorMonacoEditor from './CreatorMonacoEditor.js';

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
      <p>Write custom code for functionality that is not supported by the Creator interface. These will be called <b>after</b> any other generated code for this program.</p>


      <div>
        <CustomCodeEditor
          title='onProgramAdded'
          codeStringProperty={program.customCodeContainer.onProgramAddedCodeProperty}
          codeStateString={onProgramAddedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramRemoved'
          codeStringProperty={program.customCodeContainer.onProgramRemovedCodeProperty}
          codeStateString={onProgramRemovedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramChangedPosition'
          codeStringProperty={program.customCodeContainer.onProgramChangedPositionCodeProperty}
          codeStateString={onProgramChangedPositionCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramMarkersAdded'
          codeStringProperty={program.customCodeContainer.onProgramMarkersAddedCodeProperty}
          codeStateString={onProgramMarkersAddedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramMarkersRemoved'
          codeStringProperty={program.customCodeContainer.onProgramMarkersRemovedCodeProperty}
          codeStateString={onProgramMarkersRemovedCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramMarkersChangedPosition'
          codeStringProperty={program.customCodeContainer.onProgramMarkersChangedPositionCodeProperty}
          codeStateString={onProgramMarkersChangedPositionCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramAdjacent'
          codeStringProperty={program.customCodeContainer.onProgramAdjacentCodeProperty}
          codeStateString={onProgramAdjacentCode}>
        </CustomCodeEditor>
      </div>

      <div>
        <CustomCodeEditor
          title='onProgramSeparated'
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

  return (
    <>
      <hr></hr>
      <h4>{title}:</h4>
      <CreatorMonacoEditor
        controlFunctionString={codeStateString}
        handleChange={newCode => {codeStringProperty.value = newCode;}}>
      </CreatorMonacoEditor>
    </>
  );
};