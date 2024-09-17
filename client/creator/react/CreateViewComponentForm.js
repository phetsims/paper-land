import React, { useEffect, useRef, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Component from '../model/Component.js';
import BackgroundViewComponent from '../model/views/BackgroundViewComponent.js';
import CreateShapeViewForm from '../model/views/CreateShapeViewForm.js';
import SpeechViewComponent from '../model/views/SpeechViewComponent.js';
import ImageViewComponent from '../model/views/ImageViewComponent.js';
import ShapeViewComponent from '../model/views/ShapeViewComponent.js';
import SoundViewComponent from '../model/views/SoundViewComponent.js';
import TextViewComponent from '../model/views/TextViewComponent.js';
import ViewComponent from '../model/views/ViewComponent.js';
import styles from './../CreatorMain.css';
import CreateBackgroundViewForm from './CreateBackgroundViewForm.js';
import CreateComponentButton from './CreateComponentButton.js';
import CreateSpeechViewForm from './CreateSpeechViewForm.js';
import CreateImageViewForm from './CreateImageViewForm.js';
import CreateSoundViewForm from './CreateSoundViewForm.js';
import CreateTextViewForm from './CreateTextViewForm.js';
import FormInvalidReasons from './FormInvalidReasons.js';

const getTabForActiveEdit = activeEdit => {
  if ( activeEdit && activeEdit.component instanceof ViewComponent ) {
    const component = activeEdit.component;

    if ( component instanceof BackgroundViewComponent ) {
      return 'background';
    }
    else if ( component instanceof SpeechViewComponent ) {
      return 'speech';
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

  const [ soundsFormInvalidReasons, setSoundsFormInvalidReasons ] = useState( [] );
  const [ speechFormInvalidReasons, setSpeechFormInvalidReasons ] = useState( [] );
  const [ textFormInvalidReasons, setTextFormInvalidReasons ] = useState( [] );
  const [ shapesFormInvalidReasons, setShapesFormInvalidReasons ] = useState( [] );
  const [ backgroundFormInvalidReasons, setBackgroundFormInvalidReasons ] = useState( [] );
  const [ imagesFormInvalidReasons, setImagesFormInvalidReasons ] = useState( [] );

  // refs to form data
  const generalDataRef = useRef( {} );
  const soundsDataRef = useRef( {} );
  const speechDataRef = useRef( {} );
  const imagesDataRef = useRef( {} );
  const shapesDataRef = useRef( {} );
  const backgroundDataRef = useRef( {} );

  // to be called every change so that we can use data to create components
  const getDataForGeneral = data => {generalDataRef.current = data;};
  const getDataForSounds = data => {soundsDataRef.current = data;};
  const getDataForSpeech = data => {speechDataRef.current = data;};
  const getDataForImages = data => {imagesDataRef.current = data;};
  const getDataForShapes = data => {shapesDataRef.current = data;};
  const getDataForBackground = data => {backgroundDataRef.current = data;};

  // functions for subcomponents to set form validity
  const getSoundsFormInvalidReasons = formInvalidReasons => setSoundsFormInvalidReasons( formInvalidReasons );
  const getSpeechFormInvalidReasons = formInvalidReasons => setSpeechFormInvalidReasons( formInvalidReasons );
  const getBackgroundFormInvalidReasons = formInvalidReasons => setBackgroundFormInvalidReasons( formInvalidReasons );
  const getImagesFormInvalidReasons = formInvalidReasons => setImagesFormInvalidReasons( formInvalidReasons );
  const getTextFormInvalidReasons = formInvalidReasons => setTextFormInvalidReasons( formInvalidReasons );
  const getShapesFormInvalidReasons = formInvalidReasons => setShapesFormInvalidReasons( formInvalidReasons );


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
      setSelectedTabFormValid( soundsFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'speech' ) {
      setSelectedTabFormValid( speechFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'background' ) {
      setSelectedTabFormValid( backgroundFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'images' ) {
      setSelectedTabFormValid( imagesFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'text' ) {
      setSelectedTabFormValid( textFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
    else if ( selectedTab === 'shapes' ) {
      setSelectedTabFormValid( shapesFormInvalidReasons.length === 0 && isComponentNameValid() );
    }
  }, [ props.componentName, selectedTab, soundsFormInvalidReasons, speechFormInvalidReasons, backgroundFormInvalidReasons, imagesFormInvalidReasons, shapesFormInvalidReasons, textFormInvalidReasons ] );

  // Set the selected tab when the active edit changes
  useEffect( () => {
    setSelectedTab( getTabForActiveEdit( activeEdit ) );
  }, [ activeEdit ] );

  // View components can observe changes to all components except for ArrayItems, which only serve to
  // add data to arrays.
  const usableModelComponents = props.allModelComponents.filter( component => {
    return component.propertyType !== 'ArrayItem';
  } );

  const createComponent = () => {
    const componentName = props.componentName;
    const componentNames = generalDataRef.current.modelComponentNames;
    const lazyLink = generalDataRef.current.lazyLink;
    const selectedModelComponents = Component.findComponentsByName( usableModelComponents, componentNames );
    const controlFunctionString = generalDataRef.current.controlFunctionString;

    const referenceComponentNames = generalDataRef.current.referenceComponentNames;

    if ( activeEdit && activeEdit.component ) {
      const editingComponent = activeEdit.component;

      // basic updates
      editingComponent.nameProperty.value = componentName;
      editingComponent.setModelComponents( selectedModelComponents );
      editingComponent.setReferenceComponentNames( referenceComponentNames );
      editingComponent.controlFunctionString = controlFunctionString;

      // component specific data
      if ( selectedTab === 'sounds' ) {
        editingComponent.soundFileName = soundsDataRef.current.soundFileName;
        editingComponent.loop = soundsDataRef.current.loop;
        editingComponent.autoplay = soundsDataRef.current.autoplay;
        editingComponent.lazyLink = lazyLink;
      }
      else if ( selectedTab === 'speech' ) {
        editingComponent.lazyLink = lazyLink;
        editingComponent.basicSpeechString = speechDataRef.current.basicSpeechString;
      }
      else if ( selectedTab === 'images' ) {
        editingComponent.imageFileName = imagesDataRef.current.imageFileName;
        editingComponent.defaultViewOptions = imagesDataRef.current.defaultViewOptions;
      }
      else if ( selectedTab === 'shapes' ) {
        editingComponent.defaultShapeOptions = shapesDataRef.current.defaultShapeOptions;
        editingComponent.defaultViewOptions = shapesDataRef.current.defaultViewOptions;
      }
      if ( selectedTab === 'background' ) {
        editingComponent.fillColor = backgroundDataRef.current.fillColor;
      }
      else if ( selectedTab === 'text' ) {

        // update options
        editingComponent.defaultViewOptions = generalDataRef.current.defaultViewOptions;
      }
    }
    else {

      // Create and add the new view component. Reference is kept so we can assign reference component connections
      // at the end.
      let newComponent;

      if ( selectedTab === 'sounds' ) {
        const soundFileName = soundsDataRef.current.soundFileName;
        const loop = soundsDataRef.current.loop;
        const autoplay = soundsDataRef.current.autoplay;
        newComponent = new SoundViewComponent( componentName, selectedModelComponents, controlFunctionString, soundFileName, loop, autoplay, {
          lazyLink: lazyLink
        } );
        activeProgram.viewContainer.addSoundView( newComponent );
      }
      else if ( selectedTab === 'speech' ) {
        const basicSpeechString = speechDataRef.current.basicSpeechString;
        newComponent = new SpeechViewComponent( componentName, selectedModelComponents, controlFunctionString, basicSpeechString, {
          lazyLink: lazyLink
        } );
        activeProgram.viewContainer.addSpeechView( newComponent );
      }
      else if ( selectedTab === 'background' ) {
        newComponent = new BackgroundViewComponent( componentName, selectedModelComponents, controlFunctionString, {
          fillColor: backgroundDataRef.current.fillColor
        } );
        activeProgram.viewContainer.addBackgroundView( newComponent );
      }
      else if ( selectedTab === 'images' ) {
        const imageFileName = imagesDataRef.current.imageFileName;
        const options = imagesDataRef.current.defaultShapeOptions;
        newComponent = new ImageViewComponent( componentName, selectedModelComponents, controlFunctionString, imageFileName, options );
        activeProgram.viewContainer.addImageView( newComponent );
      }
      else if ( selectedTab === 'text' ) {
        const textOptions = generalDataRef.current.defaultViewOptions;
        newComponent = new TextViewComponent( componentName, selectedModelComponents, controlFunctionString, textOptions );
        activeProgram.viewContainer.addTextView( newComponent );
      }
      else if ( selectedTab === 'shapes' ) {

        // Combine the shape and view specific options into a single options object
        const shapeOptions = {
          ...shapesDataRef.current.defaultShapeOptions,
          ...shapesDataRef.current.defaultViewOptions
        };
        newComponent = new ShapeViewComponent( componentName, selectedModelComponents, controlFunctionString, shapeOptions );
        activeProgram.viewContainer.addShapeView( newComponent );
      }

      assert && assert( newComponent, `No component created for component type ${selectedTab}` );

      // assign the reference components to the new view component
      newComponent.setReferenceComponentNames( referenceComponentNames );
    }

    props.onComponentCreated();
  };

  const getInvalidReasonsForSelectedTab = () => {
    let invalidReasons = [];
    if ( selectedTab === 'shapes' ) {
      invalidReasons = shapesFormInvalidReasons;
    }
    else if ( selectedTab === 'sounds' ) {
      invalidReasons = soundsFormInvalidReasons;
    }
    else if ( selectedTab === 'speech' ) {
      invalidReasons = speechFormInvalidReasons;
    }
    else if ( selectedTab === 'background' ) {
      invalidReasons = backgroundFormInvalidReasons;
    }
    else if ( selectedTab === 'images' ) {
      invalidReasons = imagesFormInvalidReasons;
    }
    else if ( selectedTab === 'text' ) {
      invalidReasons = textFormInvalidReasons;
    }
    else {
      invalidReasons = [];
    }

    // At least one model component must be a dependency - they can't all be references
    const referenceComponentNames = generalDataRef.current.referenceComponentNames;
    const modelComponentNames = generalDataRef.current.modelComponentNames;
    if ( referenceComponentNames && modelComponentNames && // if they are both defined
         referenceComponentNames.length > 0 && // if there are reference components
         referenceComponentNames.length >= modelComponentNames.length ) {
      invalidReasons.push( 'At least one model component must be a dependency.' );
    }

    return invalidReasons;
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
            allModelComponents={usableModelComponents}
            isFormValid={getShapesFormInvalidReasons}
            getGeneralFormData={getDataForGeneral}
            getShapeFormData={getDataForShapes}
            activeEdit={activeEdit}
          ></CreateShapeViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='background' title='Background' tabClassName={styles.tab}>
          <CreateBackgroundViewForm
            allModelComponents={usableModelComponents}
            isFormValid={getBackgroundFormInvalidReasons}
            getGeneralFormData={getDataForGeneral}
            getBackgroundFormData={getDataForBackground}
            activeEdit={activeEdit}
          ></CreateBackgroundViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='images' title='Images' tabClassName={styles.tab}>
          <CreateImageViewForm
            allModelComponents={usableModelComponents}
            isFormValid={getImagesFormInvalidReasons}
            getImageFormData={getDataForImages}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateImageViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='text' title='Text' tabClassName={styles.tab}>
          <CreateTextViewForm
            allModelComponents={usableModelComponents}
            isFormValid={getTextFormInvalidReasons}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateTextViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='sounds' title='Sounds' tabClassName={styles.tab}>
          <CreateSoundViewForm
            allModelComponents={usableModelComponents}
            isFormValid={getSoundsFormInvalidReasons}
            getSoundFormData={getDataForSounds}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          ></CreateSoundViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='speech' title='Speech' tabClassName={styles.tab}>
          <CreateSpeechViewForm
            allModelComponents={usableModelComponents}
            isFormValid={getSpeechFormInvalidReasons}
            getSpeechFormData={getDataForSpeech}
            getGeneralFormData={getDataForGeneral}
            activeEdit={activeEdit}
          >
          </CreateSpeechViewForm>
        </Tab>
        <Tab disabled={tabDisabled} eventKey='vibration' title='Vibration' tabClassName={styles.tab}>
          TODO: Select a model component and describe how its values change vibration patterns. Select if vibration should happen every change.
        </Tab>
      </Tabs>
      <FormInvalidReasons invalidReasons={getInvalidReasonsForSelectedTab()} componentNameValid={isComponentNameValid()}></FormInvalidReasons>
      <CreateComponentButton
        selectedTabFormValid={selectedTabFormValid}
        createComponent={createComponent}
        activeEditProperty={model.activeEditProperty}
      ></CreateComponentButton>
    </>
  );
}