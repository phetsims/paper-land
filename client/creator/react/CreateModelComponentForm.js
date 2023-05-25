import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './../CreatorMain.css';
import CreateBooleanForm from './CreateBooleanForm.js';
import CreateEnumerationForm from './CreateEnumerationForm.js';
import CreateNumberForm from './CreateNumberForm.js';
import CreatePositionForm from './CreatePositionForm.js';
import StyledButton from './StyledButton.js';

export default function CreateModelComponentForm( props ) {
  const [ selectedTab, setSelectedTab ] = useState( 'number' );
  const [ selectedTabFormValid, setSelectedTabFormValid ] = useState( false );
  const [ booleanFormValid, setBooleanFormValid ] = useState( true );
  const [ numberFormValid, setNumberFormValid ] = useState( false );
  const [ enumerationFormValid, setEnumerationFormValid ] = useState( false );

  const componentName = props.componentName;

  const getIsBooleanFormValid = isValid => setBooleanFormValid( isValid );
  const getIsNumberFormValid = isValid => setNumberFormValid( isValid );
  const getIsEnumerationFormValid = isValid => setEnumerationFormValid( isValid );

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
          <CreateBooleanForm isFormValid={getIsBooleanFormValid}></CreateBooleanForm>
        </Tab>
      </Tabs>
      <StyledButton disabled={!selectedTabFormValid} name={'Create Component'}></StyledButton>
    </>
  );
}