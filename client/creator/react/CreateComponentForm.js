/**
 * Controls to add a listener to a particular program event.
 */

import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../CreatorMain.css';
import ComponentNameControl from './ComponentNameControl.js';
import CreateModelControllerForm from './controller/CreateModelControllerForm.js';
import CreateModelComponentForm from './CreateModelComponentForm.js';
import CreateViewComponentForm from './CreateViewComponentForm.js';

export default function CreateComponentForm( props ) {

  // {CreatorModel}
  const model = props.model;

  const [ componentName, setComponentName ] = useState( '' );

  // The selected tab is part of state so that the tab pane is re-rendered accurately when it is displayed
  const [ selectedTab, setSelectedTab ] = useState( 'number' );

  // When the component is created, clear the component name so it is difficult to create multiple components with the
  // same name
  const onComponentCreated = () => {
    setComponentName( '' );
  };

  return (
    <div>
      <hr/>
      <ComponentNameControl componentName={componentName} setComponentName={setComponentName} model={model}></ComponentNameControl>
      <Tabs
        defaultActiveKey='model'
        className={styles.tabs}
        justify
        onSelect={( eventKey, event ) => {
          setSelectedTab( eventKey );

          // When the component type changes, its most convenient to clear the name
          setComponentName( '' );
        }}>
        <Tab eventKey='model' title='Model' tabClassName={styles.tab}>
          <CreateModelComponentForm
            componentName={componentName}
            activeProgram={props.activeProgram}
            allModelComponents={props.allModelComponents}
            model={model}
            onComponentCreated={onComponentCreated}
          ></CreateModelComponentForm>
        </Tab>
        <Tab eventKey='view' title='View' tabClassName={styles.tab}>
          <CreateViewComponentForm onComponentCreated={onComponentCreated}></CreateViewComponentForm>
        </Tab>
        <Tab eventKey='controller' title='Controller' tabClassName={styles.tab}>
          <CreateModelControllerForm
            componentName={componentName}
            activeProgram={props.activeProgram}
            allModelComponents={props.allModelComponents}
            onComponentCreated={onComponentCreated}
          >
          </CreateModelControllerForm>
        </Tab>
      </Tabs>
    </div>
  );
}