/**
 * Unit tests for ProgramCodeGenerator.
 *
 * @author Jesse Greenberg
 */

import CreatorModel from '../../creator/model/CreatorModel.js';

QUnit.module( 'ProgramCodeGenerator' );

/**
 * An empty program should have generated code that runs and does nothing.
 */
QUnit.test( 'Empty Program', async assert => {
  assert.ok( 'true', 'passed!' );

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  const generatedCode = await testProgram.convertToProgramString();
  assert.ok( generatedCode.length > 0, 'there was some generated code' );
} );