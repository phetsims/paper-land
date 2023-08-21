import React from 'react';
import PaperControllerForm from './PaperControllerForm.js';

export default function CreateModelControllerForm( props ) {

  // {phet.axon.ObservableArray<NamedProperty>} - All model components available.
  const allModelComponents = props.allModelComponents;
  const activeEdit = props.activeEdit;
  const componentName = props.componentName;
  const activeEditProperty = props.model.activeEditProperty;

  if ( !props.onComponentCreated ) {
    throw new Error( 'CreateModelControllerForm requires an onComponentCreated callback' );
  }
  if ( !props.model ) {
    throw new Error( 'CreateModelControllerForm requires a model' );
  }

  return (
    <>
      <PaperControllerForm
        activeEdit={activeEdit}
        allModelComponents={allModelComponents}
        componentName={componentName}
        activeEditProperty={activeEditProperty}
        onComponentCreated={props.onComponentCreated}
      />
    </>
  );
}