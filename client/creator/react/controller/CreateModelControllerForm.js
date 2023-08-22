import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../../CreatorMain.css';
import AnimationControllerForm from './AnimationControllerForm.js';
import MultilinkControllerForm from './MultilinkControllerForm.js';
import PaperControllerForm from './PaperControllerForm.js';

export default function CreateModelControllerForm( props ) {

  const [ selectedTab, setSelectedTab ] = useState( 'paper' );

  // {phet.axon.ObservableArray<NamedProperty>} - All model components available.
  const allModelComponents = props.allModelComponents;
  const activeEdit = props.activeEdit;
  const componentName = props.componentName;
  const activeEditProperty = props.model.activeEditProperty;
  const model = props.model;

  if ( !props.onComponentCreated ) {
    throw new Error( 'CreateModelControllerForm requires an onComponentCreated callback' );
  }
  if ( !props.model ) {
    throw new Error( 'CreateModelControllerForm requires a model' );
  }

  return (
    <>
      <Tabs
        activeKey={selectedTab}
        className={styles.tabs}
        variant={'pill'}
        onSelect={( eventKey, event ) => {
          setSelectedTab( eventKey );
        }}
        justify={true}
      >
        <Tab eventKey='paper' title='Paper' tabClassName={styles.tab}>
          <PaperControllerForm
            activeEdit={activeEdit}
            allModelComponents={allModelComponents}
            componentName={componentName}
            activeEditProperty={activeEditProperty}
            onComponentCreated={props.onComponentCreated}
          />
        </Tab>
        <Tab eventKey='link' title='Link' tabClassName={styles.tab}>
          <MultilinkControllerForm
            activeEdit={activeEdit}

            // TODO: This is the function that forwards valid state to this component
            isFormValid={() => {}}

            // TODO: Gets the data and brings it into this component
            getFormData={() => {}}

            allModelComponents={allModelComponents}
            componentName={componentName}
            activeEditProperty={activeEditProperty}
            onComponentCreated={props.onComponentCreated}
            model={model}
          />
        </Tab>
        <Tab eventKey='animation' title='Animation' tabClassName={styles.tab}>
          <AnimationControllerForm
            activeEdit={activeEdit}
            isFormValid={() => {}}
            getFormData={() => {}}
            allModelComponents={allModelComponents}
            componentName={componentName}
            activeEditProperty={activeEditProperty}
            onComponentCreated={props.onComponentCreated}
            model={model}
          />
        </Tab>
      </Tabs>
    </>
  );
}