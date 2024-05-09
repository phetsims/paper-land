/**
 * Form for creating a BluetoothListenerComponent. Shown under the "Controller" section.
 */

import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import bluetoothServiceData from '../../../common/bluetoothServiceData.js';
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
    const dependenciesGood = currentFormData.dependencyNames.length > 0;
    const controlFunctionGood = currentFormData.controlFunctionString.length > 0;
    const serviceIdGood = currentFormData.serviceId.length > 0;
    const characteristicIdGood = currentFormData.characteristicId.length > 0;
    const writingToCharacteristic = currentFormData.writeToCharacteristic;

    const invalidReasons = [];
    if ( !writingToCharacteristic && !controlledGood ) {
      invalidReasons.push( 'Must select at least one controlled component if reading from device.' );
    }
    if ( writingToCharacteristic && !dependenciesGood ) {
      invalidReasons.push( 'Must select at least one dependency component if writing to device.' );
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
  const controlledModelComponents = Component.findComponentsByName( allModelComponents, formData.controlledPropertyNames );
  const dependencyModelComponents = Component.findComponentsByName( allModelComponents, formData.dependencyNames );
  const referenceModelComponents = Component.findComponentsByName( allModelComponents, formData.referenceComponentNames );

  // The Properties that you can control are all the Properties minus the selected model components
  const controllableComponents = allModelComponents.filter( component => {
    return !controlledModelComponents.includes( component );
  } );

  const createComponent = () => {
    if ( props.activeEdit && props.activeEdit.component instanceof BluetoothListenerComponent ) {
      const component = props.activeEdit.component;
      component.nameProperty.value = props.componentName;
      component.setControlledProperties( controlledModelComponents );
      component.setDependencies( dependencyModelComponents );
      component.setReferenceComponentNames( formData.referenceComponentNames );
      component.controlFunctionString = formData.controlFunctionString;
      component.writeToCharacteristic = formData.writeToCharacteristic;
      component.serviceId = formData.serviceId;
      component.characteristicId = formData.characteristicId;
    }
    else {
      const bluetoothComponent = new BluetoothListenerComponent(
        props.componentName,
        dependencyModelComponents,
        controlledModelComponents,
        formData.controlFunctionString,
        formData.writeToCharacteristic,
        formData.serviceId,
        formData.characteristicId
      );

      // assign the reference component names
      bluetoothComponent.setReferenceComponentNames( formData.referenceComponentNames );

      props.activeEdit.program.listenerContainer.addBluetoothListener( bluetoothComponent );
    }

    props.onComponentCreated();
  };

  return (
    <div>

      {/* UUID Text Inputs */}
      <h3>UUID</h3>
      <Form.Label>Select the Bluetooth Service you want to use from your microcontroller:</Form.Label>
      <ServiceSelector
        formData={formData}
        onChange={event => {
          handleChange( {
            serviceId: event.target.value,

            // Clear out the characteristic ID when the service is changed by the user because the old
            // characteristic is probably no longer valid.
            characteristicId: ''
          } );
        }}
      ></ServiceSelector>

      <Form.Label>Select the Bluetooth Characteristic you want to use from the selected BLE Service:</Form.Label>
      <CharacteristicSelector
        formData={formData}
        onChange={event => {
          handleChange( { characteristicId: event.target.value } );
        }}
      ></CharacteristicSelector>
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
              selectedModelComponents={controlledModelComponents}

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
            components={controlledModelComponents}
            helperPrompt={'Use the following functions in your code to update model components. The device value is in a variable called `deviceValue`. Remember to decode it from the format of you device.'}
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
              selectedModelComponents={dependencyModelComponents}
              referenceComponentNames={formData.referenceComponentNames}
              handleChange={( ( selectedComponents, referenceComponentNames ) => {
                const changeObject = {
                  dependencyNames: selectedComponents.map( component => component.nameProperty.value )
                };

                // If the second argument is null, this means a change (likely adding) to the model components but
                // no change to the reference components.
                if ( referenceComponentNames ) {
                  changeObject.referenceComponentNames = referenceComponentNames;
                }

                handleChange( changeObject );
              } )}
            />
          </Container>
          <hr></hr>
          <VariableDocumentationList
            functionPrompt={'Use available variables to calculate a value. Set the value of the BLE characteristic with writeToCharacteristic( value ). Remember to convert the value to a the format expected by the device (likely Uint8Array).'}
            components={dependencyModelComponents}
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
        settableComponents={controlledModelComponents}
        variableComponents={controlledModelComponents}
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

const ServiceSelector = ( props ) => {
  const handleChange = props.onChange;
  if ( !handleChange ) {
    throw new Error( 'ServiceSelector requires an onChange prop.' );
  }

  const formData = props.formData;
  if ( !formData ) {
    throw new Error( 'ServiceSelector requires a formData prop.' );
  }

  return (
    <Form.Select
      onChange={handleChange}
      value={formData.serviceId}
    >
      <option value={''}>Select a service</option>
      {
        Array.from( bluetoothServiceData.serviceDescriptorToCharacteristicDescriptorMap.keys() ).map( serviceDescriptor => {
          return <option
            value={serviceDescriptor.serviceUUID}
            key={serviceDescriptor.serviceUUID}>
            {`${serviceDescriptor.name}`}
          </option>
        } )
      }
    </Form.Select>
  );
}

const CharacteristicSelector = ( props ) => {
  const handleChange = props.onChange;
  if ( !handleChange ) {
    throw new Error( 'CharacteristicSelector requires an onChange Prop.' );
  }

  const formData = props.formData;
  if ( !formData ) {
    throw new Error( 'CharacteristicSelector requires a formData prop.' );
  }

  // The available options for the characteristic selector will depend on the service selected.
  const serviceId = formData.serviceId;
  let characteristicDescriptors = [];

  if ( serviceId ) {
    const serviceDescriptors = Array.from( bluetoothServiceData.serviceDescriptorToCharacteristicDescriptorMap.keys() );
    const selectedServiceDescriptor = serviceDescriptors.find( serviceDescriptor => serviceDescriptor.serviceUUID === serviceId );

    // The characteristic descriptors for the selected service.
    characteristicDescriptors = bluetoothServiceData.serviceDescriptorToCharacteristicDescriptorMap.get( selectedServiceDescriptor );
  }
  else {

    // No service selected so no characteristics available.
    characteristicDescriptors = [];
  }


  return (
    <Form.Select
      onChange={handleChange}
      value={formData.characteristicId}
    >
      <option value={''}>Select a characteristic</option>

      {
        characteristicDescriptors.map( characteristicDescriptor => {
          return <option
            value={characteristicDescriptor.characteristicUUID}
            key={characteristicDescriptor.characteristicUUID}>
            {`${characteristicDescriptor.name}`}
          </option>
        } )
      }
    </Form.Select>
  );
}