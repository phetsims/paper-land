import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../../CreatorMain.css';
import BooleanPropertyController from '../../model/controllers/BooleanPropertyController.js';
import EnumerationPropertyController from '../../model/controllers/EnumerationPropertyController.js';
import NumberPropertyController from '../../model/controllers/NumberPropertyController.js';
import Vector2PropertyController from '../../model/controllers/Vector2PropertyController.js';
import Utils from '../../Utils.js';
import StyledButton from '../StyledButton.js';
import CreateBooleanControllerForm from './CreateBooleanControllerForm.js';
import CreateEnumerationControllerForm from './CreateEnumerationControllerForm.js';
import CreateNumberControllerForm from './CreateNumberControllerForm.js';
import CreateVector2ControllerForm from './CreateVector2ControllerForm.js';

export default function CreateModelControllerForm( props ) {

  // {phet.axon.ObservableArray<NamedProperty>} - All model components available.
  const allModelComponents = props.allModelComponents;

  const activeProgram = props.activeEdit.program;

  // {string}
  const componentName = props.componentName;

  if ( !props.onComponentCreated ) {
    throw new Error( 'CreateModelControllerForm requires an onComponentCreated callback' );
  }

  /**
   * Get a list of all model components, except for DerivedProperty components. Those cannot be controlled directly.
   */
  function getComponentsExcludingDerived() {
    return allModelComponents.filter( component => component.propertyType !== 'DerivedProperty' );
  }

  const [ allComponents, setAllComponents ] = useState( getComponentsExcludingDerived() );
  const [ selectedComponent, setSelectedComponent ] = useState( allComponents[ 0 ] || null );

  // State for whether the selected component form is valid for creation.
  // It is dependent on the valid state for a particular form.
  const [ componentFormValid, setComponentFormValid ] = useState( false );

  // State for whether a particular form is valid for creating a controller.
  const [ positionFormValid, setPositionFormValid ] = useState( false );
  const [ booleanFormValid, setBooleanFormValid ] = useState( false );
  const [ numberFormValid, setNumberFormValid ] = useState( false );
  const [ enumerationFormValid, setEnumerationFormValid ] = useState( false );

  // forwarded to each form for a controller type to make sure that entries are reasonable
  const getIsPositionFormValid = isValid => setPositionFormValid( isValid );
  const getIsBooleanFormValid = isValid => setBooleanFormValid( isValid );
  const getIsNumberFormValid = isValid => setNumberFormValid( isValid );
  const getIsEnumerationFormValid = isValid => setEnumerationFormValid( isValid );

  // An object with { { controlType: Vector2PropertyController.ControlType } }
  const positionDataRef = useRef( {} );
  const booleanDataRef = useRef( {} );
  const enumerationDataRef = useRef( {} );

  // An object with {
  //  directionControlType: NumberPropertyController.DirectionControlType,
  //  relationshipControlType: NumberPropertyController.RelationshipControlType
  // }
  const numberDataRef = useRef( {} );

  // To be called on form changes to receive the data to create controllers
  const getDataForPosition = data => { positionDataRef.current = data; };
  const getDataForBoolean = data => { booleanDataRef.current = data; };
  const getDataFormNumber = data => { numberDataRef.current = data; };
  const getDataForEnumeration = data => { enumerationDataRef.current = data; };

  const createComponent = () => {
    if ( selectedComponentType === 'Vector2Property' ) {
      const vector2PropertyController = new Vector2PropertyController( componentName, selectedComponent, positionDataRef.current.controlType );
      activeProgram.controllerContainer.addVector2PropertyController( vector2PropertyController );
    }
    else if ( selectedComponentType === 'BooleanProperty' ) {
      const booleanController = new BooleanPropertyController( componentName, selectedComponent, booleanDataRef.current.controlType );
      activeProgram.controllerContainer.addBooleanPropertyController( booleanController );
    }
    else if ( selectedComponentType === 'NumberProperty' ) {
      const numberController = new NumberPropertyController( componentName, selectedComponent, numberDataRef.current.directionControlType, numberDataRef.current.relationshipControlType );
      activeProgram.controllerContainer.addNumberPropertyController( numberController );
    }
    else if ( selectedComponentType === 'StringProperty' ) {
      const enumerationController = new EnumerationPropertyController( componentName, selectedComponent, enumerationDataRef.current.controlType );
      activeProgram.controllerContainer.addEnumerationPropertyController( enumerationController );
    }

    props.onComponentCreated();
  };

  const selectedComponentType = selectedComponent ? selectedComponent.propertyType : null;

  // Update state when a new model component is created (receiving new data from a phet.axon component)
  useEffect( () => {

    const allComponentsListener = componentsLength => {

      // Gets all model components that are not DerivedProperties - DerivedProperties cannot be externally controlled.
      // React requires a new array reference to update correctly. Filter does that for us.
      const withoutDerivedProperties = getComponentsExcludingDerived();
      setAllComponents( withoutDerivedProperties );
      setSelectedComponent( withoutDerivedProperties[ 0 ] || null );
    };

    // Linked lazily because we do not want to trigger a re-render immediately in this render (infinite loop)
    allModelComponents.lengthProperty.lazyLink( allComponentsListener );

    // returning a function tells useEffect to dispose of this component when it is time
    return function cleanup() {
      allModelComponents.lengthProperty.unlink( allComponentsListener );
    };
  } );

  // Update valid form state when validity of a child form changes.
  useEffect( () => {
    if ( selectedComponentType === 'Vector2Property' ) {
      setComponentFormValid( positionFormValid && componentName.length > 0 );
    }
    else if ( selectedComponentType === 'BooleanProperty' ) {
      setComponentFormValid( booleanFormValid && componentName.length > 0 );
    }
    else if ( selectedComponentType === 'NumberProperty' ) {
      setComponentFormValid( numberFormValid && componentName.length > 0 );
    }
    else if ( selectedComponentType === 'StringProperty' ) {
      setComponentFormValid( enumerationFormValid && componentName.length > 0 );
    }
    else {
      setComponentFormValid( false );
    }
  } );

  return (
    <>
      <div>
        <div className={styles.controlElement}>
          <Form.Label>Select a model component:</Form.Label>
          <Form.Select
            onChange={event => {
              const indexOfSelection = Utils.getIndexFromIdString( event.target.value );
              setSelectedComponent( allComponents[ indexOfSelection ] );
            }}
          >
            {allComponents.map( ( component, index ) => {
              return <option value={`${component.nameProperty.value}-${index}`} key={`${component.nameProperty.value}-${index}`}>{component.nameProperty.value}</option>;
            } )}
          </Form.Select>
        </div>
        {selectedComponentType === 'Vector2Property' ? <CreateVector2ControllerForm getFormData={getDataForPosition} isFormValid={getIsPositionFormValid}></CreateVector2ControllerForm> :
         selectedComponentType === 'StringProperty' ? <CreateEnumerationControllerForm getFormData={getDataForEnumeration} isFormValid={getIsEnumerationFormValid}></CreateEnumerationControllerForm> :
         selectedComponentType === 'NumberProperty' ? <CreateNumberControllerForm getFormData={getDataFormNumber} isFormValid={getIsNumberFormValid}></CreateNumberControllerForm> :
         selectedComponentType === 'BooleanProperty' ? <CreateBooleanControllerForm getFormData={getDataForBoolean} isFormValid={getIsBooleanFormValid}></CreateBooleanControllerForm> :
         <p className={styles.controlElement}>Create a Model Component to control.</p>
        }
        <StyledButton disabled={!componentFormValid} name={'Create Component'} onClick={createComponent}></StyledButton>
      </div>
    </>
  );
}