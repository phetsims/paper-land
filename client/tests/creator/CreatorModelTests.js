/**
 * Unit tests for CreatorModel.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

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