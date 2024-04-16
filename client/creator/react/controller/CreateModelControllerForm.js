import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AnimationListenerComponent from '../../model/controllers/AnimationListenerComponent.js';
import BluetoothListenerComponent from '../../model/controllers/BluetoothListenerComponent.js';
import ListenerComponent from '../../model/controllers/ListenerComponent.js';
import MultilinkListenerComponent from '../../model/controllers/MultilinkListenerComponent.js';
import PropertyController from '../../model/controllers/PropertyController.js';
import styles from './../../CreatorMain.css';
import AnimationControllerForm from './AnimationControllerForm.js';
import BluetoothControllerForm from './BluetoothControllerForm.js';
import MultilinkControllerForm from './MultilinkControllerForm.js';
import PaperControllerForm from './PaperControllerForm.js';

/**
 * Gets the tab value key for the active edit.
 */
const getTabForActiveEdit = activeEdit => {
  if ( activeEdit && activeEdit.component instanceof PropertyController || activeEdit.component instanceof ListenerComponent ) {
    const component = activeEdit.component;

    if ( component instanceof PropertyController ) {
      return 'paper';
    }
    else if ( component instanceof BluetoothListenerComponent ) {

      // more specific type so this must come first
      return 'bluetooth'
    }
    else if ( component instanceof MultilinkListenerComponent ) {
      return 'link';
    }
    else if ( component instanceof AnimationListenerComponent ) {
      return 'animation';
    }
    else {
      throw new Error( 'Unknown controller type for tabs' );
    }
  }
  else {
    return null;
  }
};

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

  // Set the selected tab when the active edit changes
  useEffect( () => {
    setSelectedTab( getTabForActiveEdit( activeEdit ) );
  }, [ activeEdit ] );

  // If there is an active edit, you cannot change tabs
  const tabDisabled = !!( activeEdit && activeEdit.component );

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
        <Tab eventKey='paper' title='Paper' tabClassName={styles.tab} disabled={tabDisabled}>
          <PaperControllerForm
            activeEdit={activeEdit}
            allModelComponents={allModelComponents}
            componentName={componentName}
            activeEditProperty={activeEditProperty}
            onComponentCreated={props.onComponentCreated}
            model={model}
          />
        </Tab>
        <Tab eventKey='link' title='Link' tabClassName={styles.tab} disabled={tabDisabled}>
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
        <Tab eventKey='animation' title='Animation' tabClassName={styles.tab} disabled={tabDisabled}>
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
        <Tab eventKey='bluetooth' title='Bluetooth' tabClassName={styles.tab} disabled={tabDisabled}>
          <BluetoothControllerForm
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