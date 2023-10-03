import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Component from '../model/Component.js';
import BackgroundViewComponent from '../model/views/BackgroundViewComponent.js';
import CreateShapeViewForm from '../model/views/CreateShapeViewForm.js';
import DescriptionViewComponent from '../model/views/DescriptionViewComponent.js';
import ImageViewComponent from '../model/views/ImageViewComponent.js';
import ShapeViewComponent from '../model/views/ShapeViewComponent.js';
import SoundViewComponent from '../model/views/SoundViewComponent.js';
import TextViewComponent from '../model/views/TextViewComponent.js';
import ViewComponent from '../model/views/ViewComponent.js';
import styles from './../CreatorMain.css';
import CreateBackgroundViewForm from './CreateBackgroundViewForm.js';
import CreateComponentButton from './CreateComponentButton.js';
import CreateDescriptionViewForm from './CreateDescriptionViewForm.js';
import CreateImageViewForm from './CreateImageViewForm.js';
import CreateSoundViewForm from './CreateSoundViewForm.js';
import CreateTextViewForm from './CreateTextViewForm.js';

const getTabForActiveEdit = activeEdit => {
  if ( activeEdit && activeEdit.component instanceof ViewComponent ) {
    const component = activeEdit.component;

    if ( component instanceof BackgroundViewComponent ) {
      return 'background';
    }
    else if ( component instanceof DescriptionViewComponent ) {
      return 'description';
    }
    else if ( component instanceof ImageViewComponent ) {
      return 'images';
    }
    else if ( component instanceof SoundViewComponent ) {
      return 'sounds';
    }
    else if ( component instanceof TextViewComponent ) {
      return 'text';
    }
    else if ( component instanceof ShapeViewComponent ) {
      return 'shapes';
    }
    else {
      throw new Error( 'Unknown component view type for tabs' );
    }
  }
  else {
    return null;
  }
};

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

  // {ActiveEdit}
  const activeEdit = props.activeEdit;

  // component state
  const [ selectedTabFormValid, setSelectedTabFormValid ] = useState( false );
  const [ selectedTab, setSelectedTab ] = useState( 'sounds' );

  const [ soundsFormValid, setSoundsFormValid ] = useState( [] );
  const [ descriptionFormValid, setDescriptionFormValid ] = useState( [] );
  const [ textFormValid, setTextFormValid ] = useState( [] );
  const [ shapesFormValid, setShapesFormValid ] = useState( [] );
  const [ backgroundFormValid, setBackgroundFormValid ] = useState( [] );
  const [ imagesFormValid, setImagesFormValid ] = useState( [] );

  // refs to form data
  const generalDataRef = useRef( {} );
  const soundsDataRef = useRef( {} );
  const imagesDataRef = useRef( {} );
  const shapesDataRef = useRef( {} );

  // to be called every change so that we can use data to create components
  const getDataForGeneral = data => {generalDataRef.current = data;};
  const getDataForSounds = data => {soundsDataRef.current = data;};
  const getDataForImages = data => {imagesDataRef.current = data;};
  const getDataForShapes = data => {shapesDataRef.current = data;};

  // functions for subcomponents to set form validity
  const getIsSoundsFormValid = isFormValid => setSoundsFormValid( isFormValid );
  const getIsDescriptionFormValid = isFormValid => setDescriptionFormValid( isFormValid );
  const getIsBackgroundFormValid = isFormValid => setBackgroundFormValid( isFormValid );
  const getIsImagesFormValid = isFormValid => setImagesFormValid( isFormValid );
  const getIsTextFormValid = isFormValid => setTextFormValid( isFormValid );
  const getIsShapesFormValid = isFormValid => setShapesFormValid( isFormValid );


  const isComponentNameValid = () => {
    if ( activeEdit && activeEdit.component ) {
      return componentName.length > 0 && ( model.isNameAvailable( componentName ) || activeEdit.component.nameProperty.value === componentName );

    }
    else {
      return componentName.length > 0 && model.isNameAvailable( componentName );
    }
  };

  useEffect( () => {
    if ( selectedTab === 'sounds' ) {
      setSelectedTabFormValid( soundsFormValid.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'description' ) {
      setSelectedTabFormValid( descriptionFormValid.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'background' ) {
      setSelectedTabFormValid( backgroundFormValid.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'images' ) {
      setSelectedTabFormValid( imagesFormValid.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'text' ) {
      setSelectedTabFormValid( textFormValid.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'shapes' ) {
      setSelectedTabFormValid( shapesFormValid.length === 0 && isComponentNameValid() );
    }
  }, [ props.componentName, selectedTab, soundsFormValid, descriptionFormValid, backgroundFormValid, imagesFormValid, shapesFormValid, textFormValid ] );

  // Set the selected tab when the active edit changes
  useEffect( () => {
    setSelectedTab( getTabForActiveEdit( activeEdit ) );
  }, [ activeEdit ] );

  const createComponent = () => {
    const componentName = props.componentName;
    const componentNames = generalDataRef.current.modelComponentNames;
    const selectedModelComponents = Component.findComponentsByName( props.allModelComponents, componentNames );
    const controlFunctionString = generalDataRef.current.controlFunctionString;

    if ( activeEdit && activeEdit.component ) {
      const editingComponent = activeEdit.component;

      // basic updates
      editingComponent.nameProperty.value = componentName;
      editingComponent.setModelComponents( selectedModelComponents );
      editingComponent.controlFunctionString = controlFunctionString;

      // component specific data
      if ( selectedTab === 'sounds' ) {
        editingComponent.soundFileName = soundsDataRef.current.soundFileName;
        editingComponent.loop = soundsDataRef.current.loop;
        editingComponent.autoplay = soundsDataRef.current.autoplay;
      }
      else if ( selectedTab === 'images' ) {
        editingComponent.imageFileName = imagesDataRef.current.imageFileName;
        editingComponent.defaultViewOptions = imagesDataRef.current.defaultViewOptions;
      }
      else if ( selectedTab === 'shapes' ) {
        editingComponent.defaultShapeOptions = shapesDataRef.current.defaultShapeOptions;
        editingComponent.defaultViewOptions = shapesDataRef.current.defaultViewOptions;
      }
    }
    else {

      if ( selectedTab === 'sounds' ) {
        const soundFileName = soundsDataRef.current.soundFileName;
        const loop = soundsDataRef.current.loop;
        const autoplay = soundsDataRef.current.autoplay;
        const soundViewComponent = new SoundViewComponent( componentName, selectedModelComponents, controlFunctionString, soundFileName, loop, autoplay );
        activeProgram.viewContainer.addSoundView( soundViewComponent );
      }
      else if ( selectedTab === 'description' ) {
        const descriptionViewComponent = new DescriptionViewComponent( componentName, selectedModelComponents, controlFunctionString );
        activeProgram.viewContainer.addDescriptionView( descriptionViewComponent );
      }
      else if ( selectedTab === 'background' ) {
        const backgroundViewComponent = new BackgroundViewComponent( componentName, selectedModelComponents, controlFunctionString );
        activeProgram.viewContainer.addBackgroundView( backgroundViewComponent );
      }
      else if ( selectedTab === 'images' ) {
        const imageFileName = imagesDataRef.current.imageFileName;
        const options = imagesDataRef.current.defaultShapeOptions;
        const imageViewComponent = new ImageViewComponent( componentName, selectedModelComponents, controlFunctionString, imageFileName, options );
        activeProgram.viewContainer.addImageView( imageViewComponent );
      }
      else if ( selectedTab === 'text' ) {
        const textViewComponent = new TextViewComponent( componentName, selectedModelComponents, controlFunctionString );
        activeProgram.viewContainer.addTextView( textViewComponent );
      }
      else if ( selectedTab === 'shapes' ) {

        // Combine the shape and view specific options into a single options object
        const shapeOptions = {
          ...shapesDataRef.current.defaultShapeOptions,
          ...shapesDataRef.current.defaultViewOptions
        };
        const shapeViewComponent = new ShapeViewComponent( componentName, selectedModelComponents, controlFunctionString, shapeOptions );
        activeProgram.viewContainer.addShapeView( shapeViewComponent );
      }
    }

    props.onComponentCreated();
  };

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
        <Tab disabled={tabDisabled} eventKey='shapes' title='Shapes' tabClassName={styles.tab}>
          <CreateShapeViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsShapesFormValid}
            getGeneralFormData={getDataForGeneral}
            getShapeFormData={getDataForShapes}
            activeEdit={activeEdit}
          ></CreateShapeViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='background' title='Background' tabClassName={styles.tab}>
          <CreateBackgroundViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsBackgroundFormValid}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateBackgroundViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='images' title='Images' tabClassName={styles.tab}>
          <CreateImageViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsImagesFormValid}
            getImageFormData={getDataForImages}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateImageViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='text' title='Text' tabClassName={styles.tab}>
          <CreateTextViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsTextFormValid}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateTextViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='sounds' title='Sounds' tabClassName={styles.tab}>
          <CreateSoundViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsSoundsFormValid}
            getSoundFormData={getDataForSounds}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateSoundViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='description' title='Description' tabClassName={styles.tab}>
          <CreateDescriptionViewForm
            allModelComponents={props.allModelComponents}
            isFormValid={getIsDescriptionFormValid}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          >
          </CreateDescriptionViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='vibration' title='Vibration' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change vibration patterns. Select if vibration should happen every change.
        </Tab>
      </Tabs>
      <CreateComponentButton
        selectedTabFormValid={selectedTabFormValid}
        createComponent={createComponent}
        activeEditProperty={model.activeEditProperty}
      ></CreateComponentButton>
    </>
  );
}