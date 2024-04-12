/**
 * Form for creating a BluetoothListenerComponent. Shown under the "Controller" section.
 */

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { isNameValid } from '../../../utils.js';
import Component from '../../model/Component.js';
import BluetoothListenerComponent from '../../model/controllers/BluetoothListenerComponent.js';
import AIHelperChat from '../AIHelperChat.js';
import ComponentSetterList from '../ComponentSetterList.js';
import CreateComponentButton from '../CreateComponentButton.js';
import CreatorMonacoEditor from '../CreatorMonacoEditor.js';
import FormInvalidReasons from '../FormInvalidReasons.js';
import ModelComponentSelector from '../ModelComponentSelector.js';
import useEditableForm from '../useEditableForm.js';
import VariableDocumentationList from '../VariableDocumentationList.js';
import styles from './../../CreatorMain.css';

/**
 * From the state of the active edit, determine which tab should be selected.
 */
const getTabForActiveEdit = activeEdit => {
  if ( activeEdit && activeEdit.component instanceof BluetoothListenerComponent && activeEdit.component.writeToCharacteristic ) {
    return 'write';
  }
  else {
    return 'read';
  }
};

export default function BluetoothControllerForm( props ) {

  // List of all possible model components.
  const allModelComponents = props.allModelComponents;

  // A description of the object that is currently being edited in Creator.
  const activeEditProperty = props.activeEditProperty;

  // The ActiveEdit being used by React forms.
  const activeEdit = props.activeEdit;

  // The name of this component.
  const componentName = props.componentName;

  // Reference ot the CreatorModel.
  const model = props.model;

  // State describing why the form is not valid yet.
  const [ formInvalidReasons, setFormInvalidReasons ] = useState( [] );

  // The function that determines if the form is valid, needs to be updated when formData and name
  // change
  const getIsFormValid = currentFormData => {
    const controlledGood = currentFormData.controlledPropertyNames.length > 0;
    const controlFunctionGood = currentFormData.controlFunctionString.length > 0;
    const serviceIdGood = currentFormData.serviceId.length > 0;
    const characteristicIdGood = currentFormData.characteristicId.length > 0;

    const invalidReasons = [];
    if ( !controlledGood ) {
      invalidReasons.push( 'Must select at least one model component.' );
    }
    if ( !controlFunctionGood ) {
      invalidReasons.push( 'The control function is required.' );
    }
    if ( !serviceIdGood ) {
      invalidReasons.push( 'The service UUID is required.' );
    }
    if ( !characteristicIdGood ) {
      invalidReasons.push( 'The characteristic UUID is required.' );
    }
    return invalidReasons;
  };

  const [ formData, handleChange ] = useEditableForm(
    props.activeEdit,
    valid => {
      setFormInvalidReasons( valid );
    },
    data => {
      return getIsFormValid( data );
    },
    props.getFormData,
    BluetoothListenerComponent
  );

  const [ selectedTab, setSelectedTab ] = useState( 'write' );

  useEffect( () => {
    setFormInvalidReasons( getIsFormValid( formData ) );
  }, [ componentName ] );

  // Set the selected tab when the active edit changes
  useEffect( () => {
    setSelectedTab( getTabForActiveEdit( activeEdit ) );
  }, [ activeEdit ] );

  // Get the references to the actual model components from selected form data (name strings)
  const selectedModelComponents = Component.findComponentsByName( allModelComponents, formData.controlledPropertyNames );

  // The Properties that you can control are all the Properties minus the selected model components
  const controllableComponents = allModelComponents.filter( component => {
    return !selectedModelComponents.includes( component );
  } );

  const createComponent = () => {
    if ( props.activeEdit && props.activeEdit.component instanceof BluetoothListenerComponent ) {
      const component = props.activeEdit.component;
      component.nameProperty.value = props.componentName;
      component.setControlledProperties( selectedModelComponents );
      component.controlFunctionString = formData.controlFunctionString;
      component.writeToCharacteristic = formData.writeToCharacteristic;
      component.serviceId = formData.serviceId;
      component.characteristicId = formData.characteristicId;
    }
    else {
      const bluetoothComponent = new BluetoothListenerComponent(
        props.componentName,
        selectedModelComponents,
        formData.controlFunctionString,
        formData.writeToCharacteristic,
        formData.serviceId,
        formData.characteristicId
      );
      props.activeEdit.program.listenerContainer.addBluetoothListener( bluetoothComponent );
    }

    props.onComponentCreated();
  };

  return (
    <div>

      {/* UUID Text Inputs */}
      <h3>UUID</h3>
      <Form.Label>Enter the UUID of the bluetooth service you want to use:</Form.Label>
      <Form.Control
        type='text'
        value={formData.serviceId}
        onChange={event => {
          handleChange( { serviceId: event.target.value } );
        }}
      ></Form.Control>

      <Form.Label>Enter the UUID of the bluetooth characteristic you want to use:</Form.Label>
      <Form.Control
        type='text'
        value={formData.characteristicId}
        onChange={event => {
          handleChange( { characteristicId: event.target.value } );
        }}
      ></Form.Control>

      <hr></hr>


      {/* Component selection and control function, different contents depending on read/write. */}
      <Tabs
        activeKey={selectedTab}
        className={styles.tabs}
        variant={'tabs'}
        onSelect={( eventKey ) => {

          // When the tab changes, update the write type on the component
          handleChange( { writeToCharacteristic: eventKey === 'write' } );
          setSelectedTab( eventKey );
        }}
        justify={true}
      >
        <Tab eventKey='read' title='Read' tabClassName={styles.tab}>
          <h3>Controlled Components</h3>
          <p>A value is read from the bluetooth device. Select components you want to be controlled by the device.</p>
          <Container>
            <ModelComponentSelector
              allModelComponents={controllableComponents}
              selectedModelComponents={selectedModelComponents}

              // All dependencies in this section are controlled - they are updated by the control function
              hideDependencyControl={true}

              handleChange={selectedComponents => {
                handleChange( {
                  controlledPropertyNames: selectedComponents.map( component => component.nameProperty.value )
                } );
              }}
            />
          </Container>
          <hr></hr>
          <ComponentSetterList
            components={selectedModelComponents}
            helperPrompt={'Use the following functions in your code to update model components.'}
          ></ComponentSetterList>
          <CreatorMonacoEditor
            controlFunctionString={formData.controlFunctionString}
            handleChange={newValue => {
              handleChange( { controlFunctionString: newValue } );
            }}>
          </CreatorMonacoEditor>
        </Tab>
        <Tab eventKey='write' title='Write' tabClassName={styles.tab}>
          <h3>Dependency Components</h3>
          <p>Select components that should control the device.</p>
          <Container>
            <ModelComponentSelector
              allModelComponents={allModelComponents}
              selectedModelComponents={selectedModelComponents}
              hideDependencyControl={true}
              handleChange={selectedComponents => {

                handleChange( {
                  controlledPropertyNames: selectedComponents.map( component => component.nameProperty.value )
                } );
              }}
            />
          </Container>
          <hr></hr>
          <VariableDocumentationList
            functionPrompt={'Use available variables to calculate a value. Set the value of the BLE characteristic with characteristic.writeValue( value ). Remember to convert the value to a Uint8Array.'}
            components={selectedModelComponents}
          ></VariableDocumentationList>
          <CreatorMonacoEditor
            controlFunctionString={formData.controlFunctionString}
            handleChange={newValue => {
              handleChange( { controlFunctionString: newValue } );
            }}>
          </CreatorMonacoEditor>
        </Tab>
      </Tabs>

      <hr></hr>

      <AIHelperChat
        settableComponents={selectedModelComponents}
        variableComponents={selectedModelComponents}
      ></AIHelperChat>
      <FormInvalidReasons invalidReasons={formInvalidReasons} componentNameValid={isNameValid( activeEditProperty.value, model, componentName )}></FormInvalidReasons>
      <CreateComponentButton
        createComponent={createComponent}
        selectedTabFormValid={formInvalidReasons.length === 0 && isNameValid( activeEditProperty.value, model, componentName )}
        activeEditProperty={activeEditProperty}
      ></CreateComponentButton>
    </div>
  );
}