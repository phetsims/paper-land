import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BackgroundViewComponent from '../model/views/BackgroundViewComponent.js';
import DescriptionViewComponent from '../model/views/DescriptionViewComponent.js';
import SoundViewComponent from '../model/views/SoundViewComponent.js';
import styles from './../CreatorMain.css';
import CreateBackgroundViewForm from './CreateBackgroundViewForm.js';
import CreateDescriptionViewForm from './CreateDescriptionViewForm.js';
import CreateSoundViewForm from './CreateSoundViewForm.js';
import StyledButton from './StyledButton.js';

export default function CreateViewComponentForm( props ) {

  // require props
  if ( !props.onComponentCreated ) {
    throw new Error( 'The onComponentCreated prop is required.' );
  }
  if ( !props.model ) {
    throw new Error( 'The model prop is required.' );
  }
  if ( props.componentName === undefined ) {

    // could be an empty string
    throw new Error( 'The componentName prop is required.' );
  }
  const model = props.model;
  const componentName = props.componentName;

  // {ProgramModel}
  const activeProgram = props.activeEdit.program;

  // component state
  const [ selectedTabFormValid, setSelectedTabFormValid ] = useState( false );
  const [ selectedTab, setSelectedTab ] = useState( 'sounds' );
  const [ soundsFormValid, setSoundsFormValid ] = useState( false );
  const [ descriptionFormValid, setDescriptionFormValid ] = useState( false );
  const [ backgroundFormValid, setBackgroundFormValid ] = useState( false );

  // refs to form data
  const generalDataRef = useRef( {} );
  const soundsDataRef = useRef( {} );

  // to be called every change so that we can use data to create components
  const getDataForGeneral = data => {generalDataRef.current = data;};
  const getDataForSounds = data => {soundsDataRef.current = data;};

  // functions for subcomponents to set form validity
  const getIsSoundsFormValid = isFormValid => setSoundsFormValid( isFormValid );
  const getIsDescriptionFormValid = isFormValid => setDescriptionFormValid( isFormValid );
  const getIsBackgroundFormValid = isFormValid => setBackgroundFormValid( isFormValid );


  const isComponentNameValid = () => {
    return componentName.length > 0 && model.isNameAvailable( componentName );
  };

  useEffect( () => {
    if ( selectedTab === 'sounds' ) {
      setSelectedTabFormValid( soundsFormValid && isComponentNameValid() );
    }
    else if ( selectedTab === 'description' ) {
      setSelectedTabFormValid( descriptionFormValid && isComponentNameValid() );
    }
    else if ( selectedTab === 'background' ) {
      setSelectedTabFormValid( backgroundFormValid && isComponentNameValid() );
    }

  }, [ props.componentName, selectedTab, soundsFormValid, descriptionFormValid ] );

  const createComponent = () => {
    const componentName = props.componentName;
    const modelComponentNames = generalDataRef.current.dependencies.map( dependency => dependency.nameProperty.value );
    const controlFunctionString = generalDataRef.current.code;
    if ( selectedTab === 'sounds' ) {
      const soundFileName = soundsDataRef.current.soundFileName;
      const soundViewComponent = new SoundViewComponent( componentName, modelComponentNames, controlFunctionString, soundFileName );
      activeProgram.viewContainer.addSoundView( soundViewComponent );
    }
    else if ( selectedTab === 'description' ) {
      const descriptionViewComponent = new DescriptionViewComponent( componentName, modelComponentNames, controlFunctionString );
      activeProgram.viewContainer.addDescriptionView( descriptionViewComponent );
    }
    else if ( selectedTab === 'background' ) {
      const backgroundViewComponent = new BackgroundViewComponent( componentName, modelComponentNames, controlFunctionString );
      activeProgram.viewContainer.addBackgroundView( backgroundViewComponent );
    }

    props.onComponentCreated();
  };

  return (
    <>
      <Tabs
        defaultActiveKey={'shapes'}
        className={styles.tabs}
        variant={'pill'}
        onSelect={( eventKey, event ) => {
          setSelectedTab( eventKey );
        }}
        justify
      >
        <Tab eventKey='shapes' title='Shapes' tabClassName={styles.tab}>
          TODO: Select a model component, a shape, and describe how the model component will manipulate it (scale, position, fill, stroke, etc).
        </Tab>
        <Tab eventKey='background' title='Background' tabClassName={styles.tab}>
          <CreateBackgroundViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsBackgroundFormValid}
            getGeneralFormData={getDataForGeneral}
          ></CreateBackgroundViewForm>
        </Tab>
        <Tab eventKey='images' title='Images' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change an image (path, scale, position, rotation, etc...).
        </Tab>
        <Tab eventKey='sounds' title='Sounds' tabClassName={styles.tab}>
          <CreateSoundViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsSoundsFormValid}
            getSoundFormData={getDataForSounds}
            getGeneralFormData={getDataForGeneral}
          ></CreateSoundViewForm>
        </Tab>
        <Tab eventKey='description' title='Description' tabClassName={styles.tab}>
          <CreateDescriptionViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsDescriptionFormValid}
            getGeneralFormData={getDataForGeneral}
          >
          </CreateDescriptionViewForm>
        </Tab>
        <Tab eventKey='vibration' title='Vibration' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change vibration patterns. Select if vibration should happen every change.
        </Tab>
      </Tabs>
      <StyledButton disabled={!selectedTabFormValid} name={'Create Component'} onClick={createComponent}></StyledButton></>
  );
}