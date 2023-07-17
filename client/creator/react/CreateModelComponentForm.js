import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { isNameValid } from '../../utils.js';
import NamedBooleanProperty from '../model/NamedBooleanProperty.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import NamedEnumerationProperty from '../model/NamedEnumerationProperty.js';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import NamedProperty from '../model/NamedProperty.js';
import NamedVector2Property from '../model/NamedVector2Property.js';
import styles from './../CreatorMain.css';
import CreateBooleanForm from './CreateBooleanForm.js';
import CreateDerivedForm from './CreateDerivedForm.js';
import CreateEnumerationForm from './CreateEnumerationForm.js';
import CreateNumberForm from './CreateNumberForm.js';
import CreatePositionForm from './CreatePositionForm.js';
import StyledButton from './StyledButton.js';

export default function CreateModelComponentForm( props ) {

  if ( !props.onComponentCreated ) {
    throw new Error( 'The onComponentCreated property must be specified.' );
  }

  // Name string for the components
  const componentName = props.componentName;

  // {ProgramModel>}
  const activeProgram = props.activeEdit.program;

  // {ActiveEdit|null} - Reference to the ActiveEdit object for the application.
  const activeEdit = props.activeEdit;

  // {ObservableArray<NamedProperty>}
  const allModelComponents = props.allModelComponents;

  // {CreatorModel}
  const model = props.model;

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

  const isComponentNameValid = () => {
    return isNameValid( activeEdit, model, componentName );
  };

  useEffect( () => {
    if ( selectedTab === 'boolean' ) {
      setSelectedTabFormValid( booleanFormValid && isComponentNameValid() );
    }
    else if ( selectedTab === 'number' ) {
      setSelectedTabFormValid( numberFormValid && isComponentNameValid() );
    }
    else if ( selectedTab === 'enumeration' ) {
      setSelectedTabFormValid( enumerationFormValid && isComponentNameValid() );
    }
    else if ( selectedTab === 'position' ) {
      setSelectedTabFormValid( positionFormValid && isComponentNameValid() );
    }
    else if ( selectedTab === 'derived' ) {
      setSelectedTabFormValid( derivedFormValid && isComponentNameValid() );
    }
    else {
      setSelectedTabFormValid( false );
    }
  }, [ props.componentName, selectedTab, booleanFormValid, numberFormValid, enumerationFormValid, derivedFormValid ] );

  const createComponent = () => {

    if ( activeEdit && activeEdit.component ) {


      // I considered do a delete/recreate here instead but I think that will be more complicated because
      // it requires that we totally reconstruct the relationships for the new component.
      console.log( 'To be implemented...UPDATE the active component with new data' );
    }
    else {
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
        const dependencies = derivedDataRef.current.dependencies;
        const derivation = derivedDataRef.current.derivation;
        activeProgram.modelContainer.addDerivedProperty( componentName, dependencies, derivation );
      }
      else {
        throw new Error( 'Cannot create component for selected tab.' );
      }
    }

    props.onComponentCreated();
  };

  const getTabForActiveEdit = () => {
    if ( activeEdit && activeEdit.component instanceof NamedProperty ) {
      const component = activeEdit.component;
      if ( component instanceof NamedBooleanProperty ) {
        return 'boolean';
      }
      else if ( component instanceof NamedNumberProperty ) {
        return 'number';
      }
      else if ( component instanceof NamedEnumerationProperty ) {
        return 'enumeration';
      }
      else if ( component instanceof NamedVector2Property ) {
        return 'position';
      }
      else if ( component instanceof NamedDerivedProperty ) {
        return 'derived';
      }
      else {
        throw new Error( 'Unknown component type.' );
      }
    }
    else {
      return null;
    }
  };

  const activeTabKey = ( activeEdit && activeEdit.component ) ? getTabForActiveEdit() : selectedTab;

  // If there is an active edit, you cannot change tabs
  const tabDisabled = !!( activeEdit && activeEdit.component );

  return (
    <>
      <Tabs
        activeKey={activeTabKey}
        className={styles.tabs}
        variant={'pill'}
        onSelect={( eventKey, event ) => {
          setSelectedTab( eventKey );
        }}

        justify
      >
        <Tab disabled={tabDisabled} eventKey='boolean' title='Boolean' tabClassName={styles.tab}>
          <CreateBooleanForm activeEdit={activeEdit} isFormValid={getIsBooleanFormValid} getFormData={getDataForBoolean}></CreateBooleanForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='number' title='Number' tabClassName={styles.tab}>
          <CreateNumberForm activeEdit={activeEdit} isFormValid={getIsNumberFormValid} getFormData={getDataForNumber}></CreateNumberForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='position' title='Position' tabClassName={styles.tab}>
          <CreatePositionForm activeEdit={activeEdit} isFormValid={getIsPositionFormValid} getFormData={getDataForPosition}></CreatePositionForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='enumeration' title='Enumeration' tabClassName={styles.tab}>
          <CreateEnumerationForm activeEdit={activeEdit} isFormValid={getIsEnumerationFormValid} getFormData={getDataForEnumeration}></CreateEnumerationForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='derived' title='Derived' tabClassName={styles.tab}>
          <CreateDerivedForm allModelComponents={allModelComponents} activeEdit={activeEdit} isFormValid={getIsDerivedFormValid} getFormData={getDataForDerived}></CreateDerivedForm>
        </Tab>
      </Tabs>
      <StyledButton disabled={!selectedTabFormValid} name={'Create Component'} onClick={createComponent}></StyledButton>
    </>
  );
}