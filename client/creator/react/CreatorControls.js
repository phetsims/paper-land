/**
 * The bar on the right of the Creator page that controls selected programs
 * or component data.
 */

import React, { forwardRef, useEffect, useState } from 'react';
import styles from '../CreatorMain.css';
import EditType from '../model/EditType.js';
import CreateComponentForm from './CreateComponentForm.js';
import CreateCustomCodeForm from './CreateCustomCodeForm.js';
import CreateProgramFromTemplateForm from './CreateProgramFromTemplateForm.js';
import ProgramMetadataForm from './ProgramMetadataForm.js';
import ProgramNumberForm from './ProgramNumberForm.js';
import SpaceSelectControls from './SpaceSelectControls.js';

// eslint-disable-next-line react/display-name
const CreatorControls = forwardRef( ( props, ref ) => {
  const model = props.creatorModel;

  // state variables
  const [ activeEdit, setActiveEdit ] = useState( null );
  const [ enableEdit, setEnableEdit ] = useState( false );
  const [ creatingFromTemplate, setCreatingFromTemplate ] = useState( false );

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {

    // Update the activeEdit state from the axon Property
    const selectedProgramListener = selectedProgram => {
      setActiveEdit( selectedProgram );
    };
    model.activeEditProperty.link( selectedProgramListener );

    // Update whether editing is enabled from the axon Property
    const restrictedListener = restricted => {
      setEnableEdit( !restricted );
    };
    model.spaceRestrictedProperty.link( restrictedListener );

    // update the creatingFromTemplate state from the axon Property
    const creatingFromTemplateListener = axonCreatingFromTemplate => {
      setCreatingFromTemplate( axonCreatingFromTemplate );
    };
    model.creatingFromTemplateProperty.link( creatingFromTemplateListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      model.activeEditProperty.unlink( selectedProgramListener );
      model.spaceRestrictedProperty.unlink( restrictedListener );
      model.creatingFromTemplateProperty.unlink( creatingFromTemplateListener );
    };
  } );

  return (
    <div className={styles.scrollable} ref={ref}>
      <SpaceSelectControls creatorModel={model} enableEdit={enableEdit}></SpaceSelectControls>
      {activeEdit ? <ProgramNumberForm activeEdit={activeEdit} creatorModel={model}></ProgramNumberForm> : ''}
      <form
        onSubmit={event => {

          // This is a form so that we can easily disable everything within. But there is no submission,
          // and we wnat to be sure to prevent the browser from doing anything with submit.
          event.preventDefault();
        }}
      >
        <fieldset disabled={!enableEdit}>
          {creatingFromTemplate ?
           <CreateProgramFromTemplateForm createFromTemplate={
             programTemplateJSON => {
               model.createFromTemplate( programTemplateJSON );
               model.creatingFromTemplateProperty.value = false;
             }
           }></CreateProgramFromTemplateForm> : ''}
          {activeEdit && activeEdit.editType === EditType.METADATA ?
           <ProgramMetadataForm
             activeEdit={activeEdit}
           ></ProgramMetadataForm> : ''}
          {activeEdit && activeEdit.editType === EditType.COMPONENT ?
           <CreateComponentForm
             activeEdit={activeEdit}
             allModelComponents={model.allModelComponents}
             model={model}
           ></CreateComponentForm> : ''}
          {activeEdit && activeEdit.editType === EditType.CUSTOM_CODE ?
           <CreateCustomCodeForm
             activeEdit={activeEdit}
           ></CreateCustomCodeForm> : ''}
        </fieldset>
      </form>
      {

        // So that the floating 'create' button can be seen at the bottom of the screen without occluding
        // other components
      }
      <div className={styles.htmlSpacer}></div>
    </div>
  );
} );

export default CreatorControls;