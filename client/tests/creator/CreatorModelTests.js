/**
 * Unit tests for CreatorModel.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanPropertyController from '../../creator/model/controllers/BooleanPropertyController.js';
import MultilinkListenerComponent from '../../creator/model/controllers/MultilinkListenerComponent.js';
import CreatorModel from '../../creator/model/CreatorModel.js';
import BackgroundViewComponent from '../../creator/model/views/BackgroundViewComponent.js';
import ImageViewComponent from '../../creator/model/views/ImageViewComponent.js';
import SpeechViewComponent from '../../creator/model/views/SpeechViewComponent.js';

QUnit.module( 'CreatorModel' );

/**
 * Tests to make sure that the all*Components lists are updated correctly when components are added and removed
 * and when programs are created and removed.
 */
QUnit.test( 'all components lists', async assert => {
  assert.ok( true, 'Passed!' );

  // a test CreatorModel with a program that we can add components to
  const creatorModel = new CreatorModel();

  // create a program
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  // add a couple of test components to the view
  const testImageComponent = new ImageViewComponent( 'testImage', [], '', 'on-bulb.png' );
  testProgram.viewContainer.addImageView( testImageComponent );
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );

  // the creatorModel should have the image component in its allViewComponents list
  assert.ok( creatorModel.allViewComponents.length === 1, 'Image component added to allViewComponents' );
  assert.ok( creatorModel.allModelComponents.length === 1, 'Boolean component added to allModelComponents' );

  // deleting the program should correctly update the all*Components lists
  creatorModel.deleteProgram( testProgram );

  assert.ok( creatorModel.allViewComponents.length === 0, 'Image component removed from allViewComponents' );
  assert.ok( creatorModel.allModelComponents.length === 0, 'Boolean component removed from allModelComponents' );

  // Add a new program with another component (deleting programs disposes them so it can't be reused)
  const testProgram2 = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );
  testProgram2.modelContainer.addBooleanProperty( 'testBoolean', true );
  assert.ok( creatorModel.allModelComponents.length === 1, 'Boolean component added to allModelComponents' );

  // delete that component directly and make sure that the allModelComponents list is updated
  testProgram2.modelContainer.removeBooleanProperty( 'testBoolean' );
  assert.ok( creatorModel.allModelComponents.length === 0, 'Boolean component removed from allModelComponents' );
} );

/**
 * Tests for createProgram - making sure that the program gets added and observers are added correctly
 * to update state.
 */
QUnit.test( 'createProgram', assert => {

  // a test CreatorModel with a program that we can add components to
  const creatorModel = new CreatorModel();

  // create a program
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  assert.ok( creatorModel.programs.length === 1, 'Program added to programs list' );
  assert.ok( creatorModel.programs[ 0 ] === testProgram, 'Program added to programs list' );

  // make sure that the copy of the program successfully creates a new program in the creatorModel
  testProgram.copyEmitter.emit();
  assert.ok( creatorModel.programs.length === 2, 'Program copy successfully added to the list' );
  const copiedProgram = creatorModel.programs[ 1 ];

  // make sure that program delete removes the program from the list
  copiedProgram.deleteEmitter.emit();
  assert.ok( creatorModel.programs.length === 1, 'Program deleted from the list' );

  // make sure that adding components to the program updates the all*Components lists
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  const testBooleanComponent = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  const testImageComponent = new ImageViewComponent( 'testImage', [], '', 'on-bulb.png' );
  testProgram.viewContainer.addImageView( testImageComponent );
  const booleanController = new BooleanPropertyController( 'testBooleanController', testBooleanComponent, 'MARKER' );
  testProgram.controllerContainer.addBooleanPropertyController( booleanController );
  const linkListener = new MultilinkListenerComponent( 'testLinkListener', [ testBooleanComponent ], [], () => {} );
  testProgram.listenerContainer.addLinkListener( linkListener );

  assert.ok( creatorModel.allModelComponents.length === 1, 'Boolean component added to allModelComponents' );
  assert.ok( creatorModel.allViewComponents.length === 1, 'Image component added to allViewComponents' );
  assert.ok( creatorModel.allControllerComponents.length === 1, 'Boolean controller added to allControllers' );
  assert.ok( creatorModel.allListenerComponents.length === 1, 'Link listener added to allListeners' );

  // make sure that removing components from the program removes them from the all*Components lists
  testProgram.listenerContainer.removeLinkListener( linkListener );
  testProgram.controllerContainer.removeBooleanPropertyController( booleanController );
  testProgram.viewContainer.removeImageView( testImageComponent );
  testProgram.modelContainer.removeBooleanProperty( testBooleanComponent );

  assert.ok( creatorModel.allModelComponents.length === 0, 'Boolean component removed from allModelComponents' );
  assert.ok( creatorModel.allViewComponents.length === 0, 'Image component removed from allViewComponents' );
  assert.ok( creatorModel.allControllerComponents.length === 0, 'Boolean controller removed from allControllers' );
  assert.ok( creatorModel.allListenerComponents.length === 0, 'Link listener removed from allListeners' );

  // Make sure that deleting a program also removes its components from the all*Components lists
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  assert.ok( creatorModel.allModelComponents.length === 1, 'Boolean component added to allModelComponents' );
  testProgram.deleteEmitter.emit();
  assert.ok( creatorModel.allModelComponents.length === 0, 'Boolean component removed from allModelComponents' );

  assert.ok( creatorModel.programs.length === 0, 'Program deleted from programs list' );
} );

QUnit.test( 'deleteProgram', assert => {

  // a test CreatorModel with a program that we can add components to
  const creatorModel = new CreatorModel();

  // create a program
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );
  assert.ok( creatorModel.programs.length === 1, 'Program added to the list' );

  // Add components to the test program
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );

  // make sure that component is in the creator model allModelComponents list
  assert.ok( creatorModel.allModelComponents.length === 1, 'Boolean component added to allModelComponents' );

  creatorModel.deleteProgram( testProgram );
  assert.ok( creatorModel.programs.length === 0, 'Program deleted from the list' );

  // make sure that component is removed from the creator model allModelComponents list
  assert.ok( creatorModel.allModelComponents.length === 0, 'Boolean component removed from allModelComponents' );
} );

/**
 * Makes sure that expanding all programs from the CreatorModel works correctly.
 */
QUnit.test( 'setAllProgramsExpanded', assert => {

  // a test CreatorModel with a program that we can add components to
  const creatorModel = new CreatorModel();

  // create a program
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );
  const testProgram2 = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  // set all programs to expanded
  creatorModel.setAllProgramsExpanded( true );
  assert.ok( testProgram.expandedProperty.value, 'Program is expanded' );
  assert.ok( testProgram2.expandedProperty.value, 'Program is expanded' );

  // set all programs to collapsed
  creatorModel.setAllProgramsExpanded( false );
  assert.ok( !testProgram.expandedProperty.value, 'Program is collapsed' );
  assert.ok( !testProgram2.expandedProperty.value, 'Program is collapsed' );
} );

/**
 * Tests for isNameAvailable - component names are unique.
 */
QUnit.test( 'isNameAvailable', assert => {

  // a test CreatorModel with a program that we can add components to
  const creatorModel = new CreatorModel();

  // create a program
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  const testName1 = 'testName';
  const testName2 = 'testName2';

  // create a component with the same name as the program
  const testImageComponent = new ImageViewComponent( testName1, [], '', 'on-bulb.png' );
  testProgram.viewContainer.addImageView( testImageComponent );

  assert.ok( !creatorModel.isNameAvailable( testName1 ), 'Name is not available' );
  assert.ok( creatorModel.isNameAvailable( testName2 ), 'Name is available' );

  // remove the first component and name2 should be available
  testImageComponent.deleteEmitter.emit();
  assert.ok( creatorModel.isNameAvailable( testName1 ), 'Name is available again' );
} );

/**
 * Tests for getUniqueCopyName - makes sure that the copy name is unique, but not modified if it is already unique.
 */
QUnit.test( 'getUniqueCopyName', assert => {

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  const testName = 'testName';
  const testName2 = 'testName2';

  testProgram.modelContainer.addBooleanProperty( testName, true );
  const uniqueCopyName = creatorModel.getUniqueCopyName( testName );
  assert.ok( uniqueCopyName !== testName && creatorModel.isNameAvailable( uniqueCopyName ), 'Unique name produced that is available.' );

  const uniqueCopyName2 = creatorModel.getUniqueCopyName( testName2 );
  assert.ok( uniqueCopyName2 === testName2 && creatorModel.isNameAvailable( testName2 ), 'Name is already unique and not modified.' );
} );

/**
 * Test save and load functionality by creating a Model, saving it to state, clearing the model, and then restoring
 * it from the saved state.
 *
 * This is not complete at this time (does not save/load every component), but tests basic functionality.
 */
QUnit.test( 'save and load', assert => {

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  // Add some model components
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  testProgram.modelContainer.addNumberProperty( 'testNumber', 0, 10, 5 );
  testProgram.modelContainer.addStringProperty( 'testString', 'test' );
  testProgram.modelContainer.addVector2Property( 'testVector2', 0, 0 );
  const anyModelComponentReference = testProgram.modelContainer.namedBooleanProperties[ 0 ];

  // Add some view components
  const testImageComponent = new ImageViewComponent( 'testImage', [ anyModelComponentReference ], '', 'on-bulb.png' );
  const testDescriptionComponent = new SpeechViewComponent( 'testDescription', [ anyModelComponentReference ], '', 'test' );
  const testBackgroundComponent = new BackgroundViewComponent( 'testBackground', [ anyModelComponentReference ], '' );
  testProgram.viewContainer.addImageView( testImageComponent );
  testProgram.viewContainer.addSpeechView( testDescriptionComponent );
  testProgram.viewContainer.addBackgroundView( testBackgroundComponent );

  // Add some controller components
  const booleanController = new BooleanPropertyController( 'testBooleanController', anyModelComponentReference, 'MARKER' );
  testProgram.controllerContainer.addBooleanPropertyController( booleanController );

  // make sure the model is in the expected state
  assert.ok( creatorModel.allModelComponents.length === 4, 'Model components added' );
  assert.ok( creatorModel.allViewComponents.length === 3, 'View components added' );
  assert.ok( creatorModel.allControllerComponents.length === 1, 'Controller components added' );

  // Save the model
  const saveJSON = creatorModel.save();

  // make sure the model looks reasonable
  assert.ok( saveJSON.programs.length === 1, 'One program was saved' );

  const modelJSON = saveJSON.programs[ 0 ].modelContainer;
  assert.ok( modelJSON.namedBooleanProperties.length === 1, 'Boolean property saved' );
  assert.ok( modelJSON.namedNumberProperties.length === 1, 'Number property saved' );
  assert.ok( modelJSON.namedStringProperties.length === 1, 'String property saved' );
  assert.ok( modelJSON.namedVector2Properties.length === 1, 'Vector2 property saved' );

  const viewJSON = saveJSON.programs[ 0 ].viewContainer;
  assert.ok( viewJSON.imageViews.length === 1, 'Image view saved' );
  assert.ok( viewJSON.speechViews.length === 1, 'Description view saved' );
  assert.ok( viewJSON.backgroundViews.length === 1, 'Background view saved' );

  const controllerJSON = saveJSON.programs[ 0 ].controllerContainer;
  assert.ok( controllerJSON.booleanPropertyControllers.length === 1, 'Boolean controller saved' );

  // clear the model and make sure it is empty
  creatorModel.clear();
  assert.ok( creatorModel.allModelComponents.length === 0, 'Model components cleared' );
  assert.ok( creatorModel.allViewComponents.length === 0, 'View components cleared' );
  assert.ok( creatorModel.allControllerComponents.length === 0, 'Controller components cleared' );
  assert.ok( creatorModel.programs.length === 0, 'Programs cleared' );

  // load the model from the saved state
  creatorModel.load( saveJSON );

  // re-verify the state of the model as it was before
  assert.ok( creatorModel.allModelComponents.length === 4, 'Model components added' );
  assert.ok( creatorModel.allViewComponents.length === 3, 'View components added' );
  assert.ok( creatorModel.allControllerComponents.length === 1, 'Controller components added' );
  assert.ok( creatorModel.programs.length === 1, 'Programs added' );
} );

/**
 * Test program copy functionality for programs that contain components with reference relationships.
 */
QUnit.test( 'Copy program with reference relationships', assert => {

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  // Add some model components
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  testProgram.modelContainer.addNumberProperty( 'testNumber', 0, 10, 5 );
  const booleanComponentInstance = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  const numberComponentInstance = testProgram.modelContainer.namedNumberProperties[ 0 ];

  assert.ok( creatorModel.allModelComponents.length === 2, 'Model components added' );

  const testImageComponent = new ImageViewComponent( 'testImage', [ booleanComponentInstance, numberComponentInstance ], '', 'on-bulb.png', {

    // Make the boolean component a reference component for testing
    referenceComponentNames: [ booleanComponentInstance.nameProperty.value ]
  } );
  testProgram.viewContainer.addImageView( testImageComponent );
  assert.ok( creatorModel.allViewComponents.length === 1, 'View components added' );

  assert.ok( testImageComponent.referenceComponentNames.length === 1, 'Reference component added to view component' );
  assert.ok( testImageComponent.referenceComponentNames.includes( booleanComponentInstance.nameProperty.value ), 'Reference component added to view component' );

  // Test copying the program
  creatorModel.copyProgram( testProgram );
  assert.ok( creatorModel.programs.length === 2, 'Program copied successfully' );

  assert.ok( creatorModel.allModelComponents.length === 4, 'Model components copied' );
  assert.ok( creatorModel.allViewComponents.length === 2, 'View components copied' );
} );

QUnit.test( 'Deleting a component should remove it from other component dependency lists', assert => {
  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  testProgram.modelContainer.addNumberProperty( 'testNumber', 0, 10, 5 );
  const booleanComponentInstance = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  const numberComponentInstance = testProgram.modelContainer.namedNumberProperties[ 0 ];

  assert.ok( creatorModel.allModelComponents.length === 2, 'Model components added' );

  const testImageComponent = new ImageViewComponent( 'testImage', [ booleanComponentInstance, numberComponentInstance ], '', 'on-bulb.png', {

    // Make the boolean component a reference component for testing
    referenceComponentNames: [ booleanComponentInstance.nameProperty.value ]
  } );
  testProgram.viewContainer.addImageView( testImageComponent );
  assert.ok( creatorModel.allViewComponents.length === 1, 'View components added' );

  // Initial state check
  assert.ok( testImageComponent._modelComponents.length === 2, 'There are two model components for the view component' );

  // delete the reference component
  booleanComponentInstance.deleteEmitter.emit();

  // make sure the reference component is removed from the view component
  assert.ok( testImageComponent._modelComponents.length === 1, 'Reference component removed from view component' );

  // remove the number component as well, and we should no longer have any model components
  numberComponentInstance.deleteEmitter.emit();
  assert.ok( testImageComponent._modelComponents.length === 0, 'Model components removed from view component' );

  //--------------------------------------------------------------------------------
  // Same test for the MultilinkListenerComponent/ListenerComponent
  //--------------------------------------------------------------------------------
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  testProgram.modelContainer.addNumberProperty( 'testNumber', 0, 10, 5 );
  const booleanComponentInstance2 = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  const numberComponentInstance2 = testProgram.modelContainer.namedNumberProperties[ 0 ];

  const testListenerComponent = new MultilinkListenerComponent( 'testListener', [ booleanComponentInstance2, numberComponentInstance2 ], [], () => {} );
  testProgram.listenerContainer.addLinkListener( testListenerComponent );

  // Initial state check
  assert.ok( testListenerComponent._dependencies.length === 2, 'There are two model components for the listener component' );

  // delete the reference component
  booleanComponentInstance2.deleteEmitter.emit();

  // make sure the reference component is removed from the listener component
  assert.ok( testListenerComponent._dependencies.length === 1, 'Reference component removed from listener component' );

  // remove the number component as well, and we should no longer have any model components
  numberComponentInstance2.deleteEmitter.emit();
  assert.ok( testListenerComponent._dependencies.length === 0, 'Model components removed from listener component' );

  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  testProgram.modelContainer.addNumberProperty( 'testNumber', 0, 10, 5 );
  testProgram.modelContainer.addNumberProperty( 'controlledNumber', 0, 10, 5 );
  const booleanComponentInstance3 = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  const numberComponentInstance3 = testProgram.modelContainer.namedNumberProperties[ 0 ];
  const controlledNumberComponentInstance3 = testProgram.modelContainer.namedNumberProperties[ 1 ];

  const testListenerComponent2 = new MultilinkListenerComponent( 'testListener', [ booleanComponentInstance3, numberComponentInstance3 ], [ controlledNumberComponentInstance3 ], () => {} );
  testProgram.listenerContainer.addLinkListener( testListenerComponent2 );

  // Initial state check
  assert.ok( testListenerComponent2._controlledProperties.length === 1, 'There is one controlled Property' );
  assert.ok( testListenerComponent2._dependencies.length === 2, 'There are two dependencies for the MultilinkListenerComponent' );

  // delete the controlled component, it should be removed from the listener component
  controlledNumberComponentInstance3.deleteEmitter.emit();
  assert.ok( testListenerComponent2._controlledProperties.length === 0, 'Controlled component removed from listener component' );

  // delete one of the dependencies, it should be removed from the listener component
  numberComponentInstance3.deleteEmitter.emit();
  assert.ok( testListenerComponent2._dependencies.length === 1, 'Dependency removed from listener component' );
  booleanComponentInstance3.deleteEmitter.emit();
  assert.ok( testListenerComponent2._dependencies.length === 0, 'Dependency removed from listener component' );

  //--------------------------------------------------------------------------------
  // Same test for the NamedDerivedProperty
  //--------------------------------------------------------------------------------
  testProgram.modelContainer.addBooleanProperty( 'testBoolean', true );
  testProgram.modelContainer.addNumberProperty( 'testNumber', 0, 10, 5 );
  const booleanComponentInstance4 = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  const numberComponentInstance4 = testProgram.modelContainer.namedNumberProperties[ 0 ];

  testProgram.modelContainer.addDerivedProperty( 'derivedComponent', [ booleanComponentInstance4, numberComponentInstance4 ], () => {} );
  const derivedComponentInstance = testProgram.modelContainer.namedDerivedProperties[ 0 ];

  // initial state check
  assert.ok( derivedComponentInstance._dependencies.length === 2, 'There are two dependencies for the NamedDerivedProperty' );

  // Delete a component and it should be removed from the derived component's list
  numberComponentInstance4.deleteEmitter.emit();
  assert.ok( derivedComponentInstance._dependencies.length === 1, 'Dependency removed from derived component' );

  // Delete the second one
  booleanComponentInstance4.deleteEmitter.emit();
  assert.ok( derivedComponentInstance._dependencies.length === 0, 'Dependency removed from derived component' );
} );