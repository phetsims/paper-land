import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../CreatorMain.css';
import CreateBooleanForm from './CreateBooleanForm.js';
import CreateEnumerationForm from './CreateEnumerationForm.js';
import CreateNumberForm from './CreateNumberForm.js';
import CreatePositionForm from './CreatePositionForm.js';
import StyledButton from './StyledButton.js';

export default function CreateModelComponentForm( props ) {

  // Name string for the components
  const componentName = props.componentName;

  // {ProgramModel>}
  const activeProgram = props.activeProgram;

  const [ selectedTab, setSelectedTab ] = useState( 'number' );
  const [ selectedTabFormValid, setSelectedTabFormValid ] = useState( false );
  const [ booleanFormValid, setBooleanFormValid ] = useState( true );
  const [ numberFormValid, setNumberFormValid ] = useState( false );
  const [ enumerationFormValid, setEnumerationFormValid ] = useState( false );

  const getIsBooleanFormValid = isValid => setBooleanFormValid( isValid );
  const getIsNumberFormValid = isValid => setNumberFormValid( isValid );
  const getIsEnumerationFormValid = isValid => setEnumerationFormValid( isValid );

  // An object with { defaultValue: boolean } - the values from the form to create an actual BooleanProperty
  const booleanDataRef = useRef( {} );

  // to be called every change so that we can use this data to create
  const getDataForBoolean = data => { booleanDataRef.current = data; };

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
    else {
      setSelectedTabFormValid( false );
    }
  }, [ props.componentName, selectedTab, booleanFormValid, numberFormValid, enumerationFormValid ] );

  const createComponent = () => {

    if ( selectedTab === 'boolean' ) {

      // create a boolean Property (getting a string from the form)
      activeProgram.modelContainer.addBooleanProperty( componentName, booleanDataRef.current.defaultValue === 'true' );
    }
    else if ( selectedTab === 'number' ) {
    }
    else if ( selectedTab === 'enumeration' ) {
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
        <Tab eventKey='number' title='Number' tabClassName={styles.tab}>
          <CreateNumberForm isFormValid={getIsNumberFormValid}></CreateNumberForm>
        </Tab>
        <Tab eventKey='enumeration' title='Enumeration' tabClassName={styles.tab}>
          <CreateEnumerationForm isFormValid={getIsEnumerationFormValid}></CreateEnumerationForm>
        </Tab>
        <Tab eventKey='position' title='Position' tabClassName={styles.tab}>
          <CreatePositionForm></CreatePositionForm>
        </Tab>
        <Tab eventKey='boolean' title='Boolean' tabClassName={styles.tab}>
          <CreateBooleanForm isFormValid={getIsBooleanFormValid} getFormData={getDataForBoolean}></CreateBooleanForm>
        </Tab>
      </Tabs>
      <StyledButton disabled={!selectedTabFormValid} name={'Create Component'} onClick={createComponent}></StyledButton>
    </>
  );
}