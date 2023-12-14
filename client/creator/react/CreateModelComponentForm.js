import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { isNameValid } from '../../utils.js';
import Component from '../model/Component.js';
import NamedArrayItem from '../model/NamedArrayItem.js';
import NamedArrayItemReference from '../model/NamedArrayItemReference.js';
import NamedBooleanProperty from '../model/NamedBooleanProperty.js';
import NamedBounds2Property from '../model/NamedBounds2Property.js';
import NamedDerivedProperty from '../model/NamedDerivedProperty.js';
import NamedEnumerationProperty from '../model/NamedEnumerationProperty.js';
import NamedNumberProperty from '../model/NamedNumberProperty.js';
import NamedObservableArray from '../model/NamedObservableArray.js';
import NamedProperty from '../model/NamedProperty.js';
import NamedVector2Property from '../model/NamedVector2Property.js';
import styles from './../CreatorMain.css';
import CreateArrayForm from './CreateArrayForm.js';
import CreateArrayItemForm from './CreateArrayItemForm.js';
import CreateBooleanForm from './CreateBooleanForm.js';
import CreateBoundsForm from './CreateBoundsForm.js';
import CreateComponentButton from './CreateComponentButton.js';
import CreateDerivedForm from './CreateDerivedForm.js';
import CreateEnumerationForm from './CreateEnumerationForm.js';
import CreateNumberForm from './CreateNumberForm.js';
import CreatePositionForm from './CreatePositionForm.js';
import FormInvalidReasons from './FormInvalidReasons.js';

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

  const [ booleanFormInvalidReasons, setBooleanFormInvalidReasons ] = useState( [] );
  const [ numberFormInvalidReasons, setNumberFormInvalidReasons ] = useState( [] );
  const [ positionFormInvalidReasons, setPositionFormInvalidReasons ] = useState( [] );
  const [ enumerationFormInvalidReasons, setEnumerationFormInvalidReasons ] = useState( [] );
  const [ derivedFormInvalidReasons, setDerivedFormInvalidReasons ] = useState( [] );
  const [ boundsFormInvalidReasons, setBoundsFormInvalidReasons ] = useState( [] );
  const [ arrayFormInvalidReasons, setArrayFormInvalidReasons ] = useState( [] );
  const [ arrayItemFormInvalidReasons, setArrayItemFormInvalidReasons ] = useState( [] );

  const getBooleanFormInvalidReasons = validStrings => setBooleanFormInvalidReasons( validStrings );
  const getNumberFormInvalidReasons = validStrings => setNumberFormInvalidReasons( validStrings );
  const getEnumerationFormInvalidReasons = validStrings => setEnumerationFormInvalidReasons( validStrings );
  const getPositionFormInvalidReasons = validStrings => setPositionFormInvalidReasons( validStrings );
  const getDerivedFormInvalidReasons = validStrings => setDerivedFormInvalidReasons( validStrings );
  const getBoundsFormInvalidReasons = validStrings => setBoundsFormInvalidReasons( validStrings );
  const getArrayFormInvalidReasons = validStrings => setArrayFormInvalidReasons( validStrings );
  const getArrayItemFormInvalidReasons = validStrings => setArrayItemFormInvalidReasons( validStrings );

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

  // An object with { itemSchema: [ { entryName: string, componentName: string } ] }
  const arrayItemDataRef = useRef( {} );

  // to be called every change so that we can use this data to create
  const getDataForNumber = data => { numberDataRef.current = data; };
  const getDataForEnumeration = data => { enumerationDataRef.current = data; };
  const getDataForBoolean = data => { booleanDataRef.current = data; };
  const getDataForPosition = data => { positionDataRef.current = data; };
  const getDataForDerived = data => { derivedDataRef.current = data; };
  const getDataForBounds = data => { boundsDataRef.current = data; };
  const getDataForArrayItem = data => { arrayItemDataRef.current = data; };

  const isComponentNameValid = () => {
    return isNameValid( activeEdit, model, componentName );
  };

  useEffect( () => {
    if ( selectedTab === 'boolean' ) {
      setSelectedTabFormValid( booleanFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'number' ) {
      setSelectedTabFormValid( numberFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'enumeration' ) {
      setSelectedTabFormValid( enumerationFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'position' ) {
      setSelectedTabFormValid( positionFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'derived' ) {
      setSelectedTabFormValid( derivedFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'bounds' ) {
      setSelectedTabFormValid( boundsFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'array' ) {
      setSelectedTabFormValid( arrayFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'arrayItem' ) {
      setSelectedTabFormValid( arrayItemFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === '' ) {

      // When empty, either nothing or an internally created component is selected, so we can't edit anything
      // except the name.
      setSelectedTabFormValid( isComponentNameValid() );
    }
    else {
      setSelectedTabFormValid( false );
    }
  }, [ props.componentName, selectedTab, booleanFormInvalidReasons, numberFormInvalidReasons, enumerationFormInvalidReasons, derivedFormInvalidReasons, boundsFormInvalidReasons, arrayFormInvalidReasons ] );

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
      else if ( selectedTab === 'enumeration' ) {
        component.values = enumerationDataRef.current.values;
      }
      else if ( selectedTab === 'arrayItem' ) {

        // save the new array to the component
        component.arrayComponent = Component.findComponentsByName(
          allModelComponents,
          [ arrayItemDataRef.current.arrayName ]
        )[ 0 ];

        // save the new schema, getting references to actual components from the saved names
        component.itemSchema = NamedArrayItem.getSchemaWithComponents( arrayItemDataRef.current.itemSchema, allModelComponents );
      }
      else if ( selectedTab === 'derived' ) {
        const derivedData = derivedDataRef.current;
        const dependencies = Component.findComponentsByName( allModelComponents, derivedData.dependencyNames );
        component.setDependencies( dependencies );
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
      else if ( selectedTab === 'array' ) {

        // Will be used for the name of a created derived property just for the length, see below
        const lengthComponentName = model.getUniqueCopyName( `${componentName}Length`, '_arrayLength' );

        // Add a component that can be used to keep a reference to the last added item to the array
        const itemAddedComponentName = model.getUniqueCopyName( `${componentName}AddedItem`, '_AddedItem' );
        activeProgram.modelContainer.addNamedArrayItemReference( itemAddedComponentName );

        // Add a component that can be used to keep a reference to the last removed item from the array
        const itemRemovedComponentName = model.getUniqueCopyName( `${componentName}RemovedItem`, '_RemovedItem' );
        activeProgram.modelContainer.addNamedArrayItemReference( itemRemovedComponentName );

        // get the references to the new components
        const itemAddedComponent = activeProgram.modelContainer.getComponent( itemAddedComponentName );
        const itemRemovedComponent = activeProgram.modelContainer.getComponent( itemRemovedComponentName );

        // Add the observable array
        activeProgram.modelContainer.addObservableArray( componentName, lengthComponentName, itemAddedComponent, itemRemovedComponent );

        // Get the reference to the new component
        const newArrayComponent = activeProgram.modelContainer.getComponent( componentName );

        // Add a derived property to the model so that the user can just observe the length
        // of the array.
        activeProgram.modelContainer.addDerivedProperty(
          lengthComponentName, [ newArrayComponent ],
          `return ${componentName}.length;`
        );

        // Add the custom-created components to the array component so that it can modify or remove them
        // when necessary
        newArrayComponent.lengthComponentName = lengthComponentName;
      }
      else if ( selectedTab === 'arrayItem' ) {
        const itemData = arrayItemDataRef.current;
        const arrayComponent = Component.findComponentsByName( allModelComponents, [ itemData.arrayName ] )[ 0 ];

        // the form data has the name of the component, but we need the component itself
        const realSchema = NamedArrayItem.getSchemaWithComponents( itemData.itemSchema, allModelComponents );
        activeProgram.modelContainer.addObservableArrayItem( componentName, arrayComponent, realSchema );
      }
      else {
        throw new Error( 'Cannot create component for selected tab.' );
      }
    }

    props.onComponentCreated();
  };

  const getInvalidReasonsForSelectedTab = () => {
    if ( selectedTab === 'boolean' ) {
      return booleanFormInvalidReasons;
    }
    else if ( selectedTab === 'number' ) {
      return numberFormInvalidReasons;
    }
    else if ( selectedTab === 'enumeration' ) {
      return enumerationFormInvalidReasons;
    }
    else if ( selectedTab === 'position' ) {
      return positionFormInvalidReasons;
    }
    else if ( selectedTab === 'derived' ) {
      return derivedFormInvalidReasons;
    }
    else if ( selectedTab === 'bounds' ) {
      return boundsFormInvalidReasons;
    }
    else if ( selectedTab === 'array' ) {
      return arrayFormInvalidReasons;
    }
    else {
      return [];
    }
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
      else if ( component instanceof NamedObservableArray ) {
        return 'array';
      }
      else if ( component instanceof NamedArrayItem ) {
        return 'arrayItem';
      }
      else if ( component instanceof NamedArrayItemReference ) {

        // For this item (which was created internally) there is nothing that the user can edit.
        return '';
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
          <CreateBooleanForm activeEdit={activeEdit} isFormValid={getBooleanFormInvalidReasons} getFormData={getDataForBoolean}></CreateBooleanForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='number' title='Number' tabClassName={styles.tab}>
          <CreateNumberForm activeEdit={activeEdit} isFormValid={getNumberFormInvalidReasons} getFormData={getDataForNumber}></CreateNumberForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='position' title='Position' tabClassName={styles.tab}>
          <CreatePositionForm activeEdit={activeEdit} isFormValid={getPositionFormInvalidReasons} getFormData={getDataForPosition}></CreatePositionForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='enumeration' title='Enumeration' tabClassName={styles.tab}>
          <CreateEnumerationForm activeEdit={activeEdit} isFormValid={getEnumerationFormInvalidReasons} getFormData={getDataForEnumeration}></CreateEnumerationForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='derived' title='Derived' tabClassName={styles.tab}>
          <CreateDerivedForm allModelComponents={allModelComponents} activeEdit={activeEdit} isFormValid={getDerivedFormInvalidReasons} getFormData={getDataForDerived}></CreateDerivedForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='bounds' title='Bounds' tabClassName={styles.tab}>
          <CreateBoundsForm activeEdit={activeEdit} isFormValid={getBoundsFormInvalidReasons} getFormData={getDataForBounds}></CreateBoundsForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='array' title='Array' tabClassName={styles.tab}>
          <CreateArrayForm activeEdit={activeEdit} isFormValid={getArrayFormInvalidReasons} getFormData={() => {}}></CreateArrayForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='arrayItem' title='Array Item' tabClassName={styles.tab}>
          <CreateArrayItemForm allModelComponents={allModelComponents} activeEdit={activeEdit} isFormValid={getArrayItemFormInvalidReasons} getFormData={getDataForArrayItem}></CreateArrayItemForm>
        </Tab>
      </Tabs>
      <FormInvalidReasons invalidReasons={getInvalidReasonsForSelectedTab()} componentNameValid={isComponentNameValid()}></FormInvalidReasons>
      <CreateComponentButton
        activeEditProperty={model.activeEditProperty}
        selectedTabFormValid={selectedTabFormValid}
        createComponent={createComponent}
      ></CreateComponentButton>
    </>
  );
}