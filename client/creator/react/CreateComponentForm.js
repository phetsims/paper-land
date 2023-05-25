/**
 * Controls to add a listener to a particular program event.
 */

import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../CreatorMain.css';
import CreateModelComponentForm from './CreateModelComponentForm.js';
import ComponentNameControl from './ComponentNameControl.js';

export default function CreateComponentForm( props ) {

  const [ componentName, setComponentName ] = useState( '' );

  return (
    <div>
      <hr/>
      <ComponentNameControl setComponentName={setComponentName}></ComponentNameControl>
      <Tabs
        defaultActiveKey='model'
        className={styles.tabs}
        justify
      >
        <Tab eventKey='model' title='Model' tabClassName={styles.tab}>
          <CreateModelComponentForm componentName={componentName} activeProgram={props.activeProgram}></CreateModelComponentForm>
        </Tab>
        <Tab eventKey='view' title='View' tabClassName={styles.tab}>
          Tab content for View
        </Tab>
        <Tab eventKey='controller' title='Controller' tabClassName={styles.tab}>
          Tab content for Controller
        </Tab>
      </Tabs>
    </div>
  );
}