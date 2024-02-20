/**
 * Unit tests for CreatorModel.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanPropertyController from '../../creator/model/controllers/BooleanPropertyController.js';
import MultilinkListenerComponent from '../../creator/model/controllers/MultilinkListenerComponent.js';
import CreatorModel from '../../creator/model/CreatorModel.js';
import ImageViewComponent from '../../creator/model/views/ImageViewComponent.js';

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