/**
 * Controls to add a listener to a particular program event.
 */

import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import NamedProperty from '../model/NamedProperty.js';
import ViewComponent from '../model/views/ViewComponent.js';
import styles from './../CreatorMain.css';
import ComponentNameControl from './ComponentNameControl.js';
import CreateModelControllerForm from './controller/CreateModelControllerForm.js';
import CreateModelComponentForm from './CreateModelComponentForm.js';
import CreateViewComponentForm from './CreateViewComponentForm.js';

export default function CreateComponentForm( props ) {

  // {CreatorModel}
  const model = props.model;

  const [ componentName, setComponentName ] = useState( '' );

  // React state for the ActiveEdit object - when present, the form supports changing and saving
  // the existing data instead of creating a new Component.
  const [ activeEditComponent, setActiveEditComponent ] = useState( null );

  // The selected tab is part of state so that the tab pane is re-rendered accurately when it is displayed
  const [ selectedTab, setSelectedTab ] = useState( 'model' );

  // When the component is created, clear the component name so it is difficult to create multiple components with the
  // same name
  const onComponentCreated = () => {
    setComponentName( '' );
  };

  // see https://legacy.reactjs.org/docs/hooks-effect.html for example of register and cleanup
  useEffect( () => {
    const selectedProgramListener = activeEditComponent => {
      if ( activeEditComponent && activeEditComponent.component ) {
        setActiveEditComponent( activeEditComponent );
      }
    };
    model.activeEditProperty.link( selectedProgramListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      model.activeEditProperty.unlink( selectedProgramListener );
    };
  } );

  /**
   * Returns the Tab key from the current state of activeEditComponent
   */
  const getTabFromActiveEdit = () => {
    return activeEditComponent.component instanceof NamedProperty ? 'model' :
           activeEditComponent.component instanceof ViewComponent ? 'view' :
           'controller';
  };

  return (
    <div>
      <hr/>
      <ComponentNameControl activeEditComponent={activeEditComponent} componentName={componentName} setComponentName={setComponentName} model={model}></ComponentNameControl>
      <Tabs
        defaultActiveKey='model'
        activeKey={activeEditComponent ? getTabFromActiveEdit() : selectedTab}
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
          <CreateViewComponentForm
            model={model}
            componentName={componentName}
            activeProgram={props.activeProgram}
            allModelComponents={props.allModelComponents}
            onComponentCreated={onComponentCreated}>
          </CreateViewComponentForm>
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