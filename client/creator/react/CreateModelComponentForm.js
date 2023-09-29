import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { isNameValid } from '../../utils.js';
import Component from '../model/Component.js';
import NamedBooleanProperty from '../model/NamedBooleanProperty.js';
import NamedBounds2Property from '../model/NamedBounds2Property.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import NamedEnumerationProperty from '../model/NamedEnumerationProperty.js';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import NamedProperty from '../model/NamedProperty.js';
import NamedVector2Property from '../model/NamedVector2Property.js';
import styles from './../CreatorMain.css';
import CreateBooleanForm from './CreateBooleanForm.js';
import CreateBoundsForm from './CreateBoundsForm.js';
import CreateComponentButton from './CreateComponentButton.js';
import CreateDerivedForm from './CreateDerivedForm.js';
import CreateEnumerationForm from './CreateEnumerationForm.js';
import CreateNumberForm from './CreateNumberForm.js';
import CreatePositionForm from './CreatePositionForm.js';

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
  const [ bounds2FormValid, setBoundsFormValid ] = useState( false );

  const getIsBooleanFormValid = isValid => setBooleanFormValid( isValid );
  const getIsNumberFormValid = isValid => setNumberFormValid( isValid );
  const getIsEnumerationFormValid = isValid => setEnumerationFormValid( isValid );
  const getIsPositionFormValid = isValid => setPositionFormValid( isValid );
  const getIsDerivedFormValid = isValid => setDerivedFormValid( isValid );
  const getIsBoundsFormValid = isValid => setBoundsFormValid( isValid );

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

  // An object with { defaultMinY: number, defaultMaxY: number, defaultMinX: number, defaultMaxX: number }
  const boundsDataRef = useRef( {} );

  // to be called every change so that we can use this data to create
  const getDataForNumber = data => { numberDataRef.current = data; };
  const getDataForEnumeration = data => { enumerationDataRef.current = data; };
  const getDataForBoolean = data => { booleanDataRef.current = data; };
  const getDataForPosition = data => { positionDataRef.current = data; };
  const getDataForDerived = data => { derivedDataRef.current = data; };
  const getDataForBounds = data => { boundsDataRef.current = data; };

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
    else if ( selectedTab === 'bounds' ) {
      setSelectedTabFormValid( bounds2FormValid && isComponentNameValid() );
    }
    else {
      setSelectedTabFormValid( false );
    }
  }, [ props.componentName, selectedTab, booleanFormValid, numberFormValid, enumerationFormValid, derivedFormValid, bounds2FormValid ] );

  const createComponent = () => {

    if ( activeEdit && activeEdit.component ) {

      // I considered do a delete/recreate here instead but I think that will be more complicated because
      // it requires that we totally reconstruct the relationships for the new component.
      // TODO: This should have a better deserialize method for each component
      const component = activeEdit.component;
      component.nameProperty.value = componentName;
      if ( selectedTab === 'boolean' ) {
        component.defaultValue = booleanDataRef.current.defaultValue;
      }
      else if ( selectedTab === 'number' ) {
        const numberData = numberDataRef.current;
        component.min = numberData.min;
        component.max = numberData.max;
        component.defaultValue = numberData.defaultValue;
      }
      else if ( selectedTab === 'position' ) {
        const positionData = positionDataRef.current;
        component.defaultX = positionData.defaultX;
        component.defaultY = positionData.defaultY;
      }
      else if ( selectedTab === 'eumeration' ) {
        component.values = enumerationDataRef.current.values;
      }
      else if ( selectedTab === 'derived' ) {
        const derivedData = derivedDataRef.current;
        component.dependencies = derivedData.dependencies;
        component.derivation = derivedData.derivation;
      }
      else if ( selectedTab === 'bounds' ) {
        const boundsData = boundsDataRef.current;
        component.defaultMinX = boundsData.defaultMinX;
        component.defaultMinY = boundsData.defaultMinY;
        component.defaultMaxX = boundsData.defaultMaxX;
        component.defaultMaxY = boundsData.defaultMaxY;
      }
    }
    else {
      if ( selectedTab === 'boolean' ) {

        // create a boolean Property (getting a string from the form)
        activeProgram.modelContainer.addBooleanProperty( componentName, booleanDataRef.current.defaultValue === 'true' );
      }
      else if ( selectedTab === 'number' ) {
        const numberData = numberDataRef.current;
        activeProgram.modelContainer.addNumberProperty( componentName, numberData.min, numberData.max, numberData.defaultValue );

      }
      else if ( selectedTab === 'enumeration' ) {
        activeProgram.modelContainer.addEnumerationProperty( componentName, enumerationDataRef.current.values );
      }
      else if ( selectedTab === 'position' ) {
        const positionData = positionDataRef.current;
        activeProgram.modelContainer.addVector2Property( componentName, positionData.defaultX, positionData.defaultY );
      }
      else if ( selectedTab === 'derived' ) {
        const dependencyNames = derivedDataRef.current.dependencyNames;
        const dependencies = Component.findComponentsByName( allModelComponents, dependencyNames );
        const derivation = derivedDataRef.current.derivation;
        activeProgram.modelContainer.addDerivedProperty( componentName, dependencies, derivation );
      }
      else if ( selectedTab === 'bounds' ) {
        const boundsData = boundsDataRef.current;
        activeProgram.modelContainer.addBounds2Property( componentName, boundsData.defaultMinX, boundsData.defaultMinY, boundsData.defaultMaxX, boundsData.defaultMaxY );
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
      else if ( component instanceof NamedBounds2Property ) {
        return 'bounds';
      }
      else {
        throw new Error( 'Unknown component type.' );
      }
    }
    else {
      return null;
    }
  };

  // Update the active tab based on the active edit from the model
  useEffect( () => {
    if ( activeEdit && activeEdit.component ) {
      setSelectedTab( getTabForActiveEdit() );
    }
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
        <Tab disabled={tabDisabled} eventKey='bounds' title='Bounds' tabClassName={styles.tab}>
          <CreateBoundsForm activeEdit={activeEdit} isFormValid={getIsBoundsFormValid} getFormData={getDataForBounds}></CreateBoundsForm>
        </Tab>
      </Tabs>
      <CreateComponentButton
        activeEditProperty={model.activeEditProperty}
        selectedTabFormValid={selectedTabFormValid}
        createComponent={createComponent}
      ></CreateComponentButton>
    </>
  );
}