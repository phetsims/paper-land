/**
 * Unit tests for the ProgramCodeValidator.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import CreatorModel from '../../creator/model/CreatorModel.js';
import ImageViewComponent from '../../creator/model/views/ImageViewComponent.js';
import SoundViewComponent from '../../creator/model/views/SoundViewComponent.js';

QUnit.module( 'ProgramCodeValidator' );

/**
 * QUnit assert.throws does not support async, so this is our own. In addition, you
 * can specify whether you expect an error to be thrown.
 *
 * @param assert - QUnit assert
 * @param asyncCallback - an async function that should throw an error
 * @param expectError - true if you expect an error to be thrown, false if you don't
 * @param message - message for the test
 * @return {Promise<void>}
 */
const assertThrowsAsync = async ( assert, asyncCallback, expectError, message ) => {
  try {
    await asyncCallback();
    assert.ok( !expectError, message );
  }
  catch( e ) {
    assert.ok( expectError, message );
  }
};

/**
 * Test the checkForMissingAssets function. Makes sure that it throws errors when assets are missing and does not
 * when used assets are available.
 */
QUnit.test( 'checkForMissingAssets', async assert => {
  assert.ok( true, 'Passed!' );

  // a test CreatorModel with a program that we can add components to
  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );
  const boundConvertToCodeString = testProgram.convertToProgramString.bind( testProgram );

  //--------------------------------------------------------------------------------
  // Image tests
  //--------------------------------------------------------------------------------

  // if tests using these fail, make sure they are in images and uploads
  const imageFile = 'on-bulb.png';
  const uploadsImageFile = 'uploads/real-image.png';

  // image tests using these fail, make sure they are NOT in images and uploads
  const bogusImageFile = 'not-a-real-image.png';
  const bogusUploadsImageFile = 'uploads/not-a-real-image.png';
  const imageComponent = new ImageViewComponent( 'testImage', [], '', imageFile );

  testProgram.viewContainer.addImageView( imageComponent );

  await assertThrowsAsync( assert, boundConvertToCodeString, false, 'Image from default set is available and used correctly.' );

  imageComponent.imageFileName = bogusImageFile;
  await assertThrowsAsync( assert, boundConvertToCodeString, true, 'Image is missing from the default set, expect an error.' );

  imageComponent.imageFileName = uploadsImageFile;
  await assertThrowsAsync( assert, boundConvertToCodeString, false, 'Image from uploads is available and used correctly.' );

  imageComponent.imageFileName = bogusUploadsImageFile;
  await assertThrowsAsync( assert, boundConvertToCodeString, true, 'Image from uploads is not available, expect an error.' );

  // restore default to something that will pass
  imageComponent.imageFileName = imageFile;

  imageComponent.controlFunctionString = `setImage( '${imageFile}' )`;
  await assertThrowsAsync( assert, boundConvertToCodeString, false, 'Image from default set is available and used correctly in custom code.' );

  imageComponent.controlFunctionString = `setImage( '${bogusImageFile}' )`;
  await assertThrowsAsync( assert, boundConvertToCodeString, true, 'Image from default set is not available in custom code, expect an error.' );

  imageComponent.controlFunctionString = `setImage( '${uploadsImageFile}' )`;
  await assertThrowsAsync( assert, boundConvertToCodeString, false, 'Image from uploads is available and used correctly in custom code.' );

  imageComponent.controlFunctionString = `setImage( '${bogusUploadsImageFile}' )`;
  await assertThrowsAsync( assert, boundConvertToCodeString, true, 'Image from uploads is not available in custom code, expect an error.' );

  // restore default to something that will pass
  imageComponent.controlFunctionString = '';

  //--------------------------------------------------------------------------------
  // Sound tests
  //--------------------------------------------------------------------------------

  // if tests using these fail, make sure they are in sounds and uploads
  const soundFile = 'loonCall.mp3';
  const uploadsSoundFile = 'uploads/real-sound.mp3';

  // sound tests using these fail, make sure they are NOT in sounds and uploads
  const bogusSoundFile = 'not-a-real-sound.mp3';
  const bogusUploadsSoundFile = 'uploads/not-a-real-sound.mp3';

  const soundComponent = new SoundViewComponent( 'testSound', [], '', soundFile, false, false );
  testProgram.viewContainer.addSoundView( soundComponent );
  await assertThrowsAsync( assert, boundConvertToCodeString, false, 'Sound from default set is available.' );

  soundComponent.soundFileName = bogusSoundFile;
  await assertThrowsAsync( assert, boundConvertToCodeString, true, 'Sound from default set is not available, expect an error.' );

  soundComponent.soundFileName = uploadsSoundFile;
  await assertThrowsAsync( assert, boundConvertToCodeString, false, 'Sound from uploads is available.' );

  soundComponent.soundFileName = bogusUploadsSoundFile;
  await assertThrowsAsync( assert, boundConvertToCodeString, true, 'Sound from uploads is not available, expect an error.' );
} );