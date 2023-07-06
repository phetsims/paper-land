/**
 * The bar on the right of the Creator page that controls selected programs
 * or component data.
 */

import React, { forwardRef, useEffect, useState } from 'react';
import styles from '../CreatorMain.css';
import EditType from '../model/EditType.js';
import CreateComponentForm from './CreateComponentForm.js';
import ProgramMetadataForm from './ProgramMetadataForm.js';
import SpaceSelectControls from './SpaceSelectControls.js';

// eslint-disable-next-line react/display-name
const CreatorControls = forwardRef( ( props, ref ) => {
  const model = props.creatorModel;

  // state variables
  const [ activeEdit, setActiveEdit ] = useState( null );

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {

    const selectedProgramListener = selectedProgram => {
      setActiveEdit( selectedProgram );
    };
    model.activeEditProperty.link( selectedProgramListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      model.activeEditProperty.unlink( selectedProgramListener );
    };
  } );

  return (
    <div className={styles.scrollable} ref={ref}>
      <SpaceSelectControls creatorModel={model}></SpaceSelectControls>
      <h3>{activeEdit ? activeEdit.program.number : ''}</h3>
      {activeEdit && activeEdit.editType === EditType.METADATA ?
       <ProgramMetadataForm
         activeProgram={activeEdit.program}
       ></ProgramMetadataForm> : ''}
      {activeEdit && activeEdit.editType === EditType.COMPONENT ?
       <CreateComponentForm
         activeProgram={activeEdit.program}
         allModelComponents={model.allModelComponents}
       ></CreateComponentForm> : ''}
    </div>
  );
} );

export default CreatorControls;