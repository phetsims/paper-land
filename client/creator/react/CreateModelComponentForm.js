import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../CreatorMain.css';
import CreateBooleanForm from './CreateBooleanForm.js';
import CreateDerivedForm from './CreateDerivedForm.js';
import CreateEnumerationForm from './CreateEnumerationForm.js';
import CreateNumberForm from './CreateNumberForm.js';
import CreatePositionForm from './CreatePositionForm.js';
import StyledButton from './StyledButton.js';

export default function CreateModelComponentForm( props ) {

  // Name string for the components
  const componentName = props.componentName;

  // {ProgramModel>}
  const activeProgram = props.activeProgram;

  // {ObservableArray<NamedProperty>}
  const allModelComponents = props.allModelComponents;

  const [ selectedTab, setSelectedTab ] = useState( 'boolean' );
  const [ selectedTabFormValid, setSelectedTabFormValid ] = useState( false );
  const [ booleanFormValid, setBooleanFormValid ] = useState( true );
  const [ numberFormValid, setNumberFormValid ] = useState( false );
  const [ positionFormValid, setPositionFormValid ] = useState( true );
  const [ enumerationFormValid, setEnumerationFormValid ] = useState( false );
  const [ derivedFormValid, setDerivedFormValid ] = useState( false );

  const getIsBooleanFormValid = isValid => setBooleanFormValid( isValid );
  const getIsNumberFormValid = isValid => setNumberFormValid( isValid );
  const getIsEnumerationFormValid = isValid => setEnumerationFormValid( isValid );
  const getIsPositionFormValid = isValid => setPositionFormValid( isValid );
  const getIsDerivedFormValid = isValid => setDerivedFormValid( isValid );

  // An object with { defaultValue: 'true' | 'false' }
  const booleanDataRef = useRef( {} );

  // An object with { { x: number, y: number} }
  const positionDataRef = useRef( {} );

  // An object with { min: number, max: number, default: number }
  const numberDataRef = useRef( {} );

  // An object with { values: [] }
  const enumerationDataRef = useRef( {} );

  // An object with { dependencies: NamedProperty[], derivation: string }
  const derivedDataRef = useRef( {} );

  // to be called every change so that we can use this data to create
  const getDataForNumber = data => { numberDataRef.current = data; };
  const getDataForEnumeration = data => { enumerationDataRef.current = data; };
  const getDataForBoolean = data => { booleanDataRef.current = data; };
  const getDataForPosition = data => { positionDataRef.current = data; };
  const getDataForDerived = data => { derivedDataRef.current = data; };

  useEffect( () => {
    if ( selectedTab === 'boolean' ) {
      setSelectedTabFormValid( booleanFormValid && componentName.length > 0 );
    }
    else if ( selectedTab === 'number' ) {
      setSelectedTabFormValid( numberFormValid && componentName.length > 0 );
    }
    else if ( selectedTab === 'enumeration' ) {
      setSelectedTabFormValid( enumerationFormValid && componentName.length > 0 );
    }
    else if ( selectedTab === 'position' ) {
      setSelectedTabFormValid( positionFormValid && componentName.length > 0 );
    }
    else if ( selectedTab === 'derived' ) {
      setSelectedTabFormValid( derivedFormValid && componentName.length > 0 );
    }
    else {
      setSelectedTabFormValid( false );
    }
  }, [ props.componentName, selectedTab, booleanFormValid, numberFormValid, enumerationFormValid, derivedFormValid ] );

  const createComponent = () => {

    if ( selectedTab === 'boolean' ) {

      // create a boolean Property (getting a string from the form)
      activeProgram.modelContainer.addBooleanProperty( componentName, booleanDataRef.current.defaultValue === 'true' );
    }
    else if ( selectedTab === 'number' ) {
      const numberData = numberDataRef.current;
      activeProgram.modelContainer.addNumberProperty( componentName, numberData.min, numberData.max, numberData.default );

    }
    else if ( selectedTab === 'enumeration' ) {
      activeProgram.modelContainer.addEnumerationProperty( componentName, enumerationDataRef.current.values );
    }
    else if ( selectedTab === 'position' ) {
      const positionData = positionDataRef.current;
      activeProgram.modelContainer.addVector2Property( componentName, positionData.x, positionData.y );
    }
    else if ( selectedTab === 'derived' ) {
      debugger;
      const dependencies = derivedDataRef.current.dependencies;
      const derivation = derivedDataRef.current.derivation;
      activeProgram.modelContainer.addDerivedProperty( componentName, dependencies, derivation );
    }
    else {
      throw new Error( 'Cannot create component for selected tab.' );
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey={selectedTab}
        className={styles.tabs}
        variant={'pill'}
        onSelect={( eventKey, event ) => {
          setSelectedTab( eventKey );
        }}
        justify
      >
        <Tab eventKey='boolean' title='Boolean' tabClassName={styles.tab}>
          <CreateBooleanForm isFormValid={getIsBooleanFormValid} getFormData={getDataForBoolean}></CreateBooleanForm>
        </Tab>
        <Tab eventKey='number' title='Number' tabClassName={styles.tab}>
          <CreateNumberForm isFormValid={getIsNumberFormValid} getFormData={getDataForNumber}></CreateNumberForm>
        </Tab>
        <Tab eventKey='position' title='Position' tabClassName={styles.tab}>
          <CreatePositionForm isFormValid={getIsPositionFormValid} getFormData={getDataForPosition}></CreatePositionForm>
        </Tab>
        <Tab eventKey='enumeration' title='Enumeration' tabClassName={styles.tab}>
          <CreateEnumerationForm isFormValid={getIsEnumerationFormValid} getFormData={getDataForEnumeration}></CreateEnumerationForm>
        </Tab>
        <Tab eventKey='derived' title='Derived' tabClassName={styles.tab}>
          <CreateDerivedForm allModelComponents={allModelComponents} isFormValid={getIsDerivedFormValid} getFormData={getDataForDerived}></CreateDerivedForm>
        </Tab>
      </Tabs>
      <StyledButton disabled={!selectedTabFormValid} name={'Create Component'} onClick={createComponent}></StyledButton>
    </>
  );
}