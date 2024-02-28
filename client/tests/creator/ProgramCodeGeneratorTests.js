/**
 * Unit tests for ProgramCodeGenerator.
 *
 * @author Jesse Greenberg
 */

import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import LocalStorageBoardController from '../../board/LocalStorageBoardController.js';
import CreatorModel from '../../creator/model/CreatorModel.js';

let localStorageBoardController = null;

QUnit.module( 'ProgramCodeGenerator', {
  before: function() {

    // TODO: Since we are going to use acorn instead, it seems that this is not necessary. Actually running
    //   the code and seeing how it interacts with the board by sending messages over local storage is too
    //   complicated, since paper land needs the projector to be running.
    const rootNode = new phet.scenery.Node();
    localStorageBoardController = new LocalStorageBoardController( rootNode );
  },
  after: function() {
    localStorageBoardController.dispose();
  }
} );

/**
 * An empty program should have generated code that runs and does nothing.
 */
QUnit.test( 'Empty Program', async assert => {
  assert.ok( 'true', 'passed!' );

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  const generatedCode = await testProgram.convertToProgramString();
  assert.ok( generatedCode.length > 0, 'there was some generated code' );

  // use acorn to inspect and test the generated code - this will error if there is a syntax error
  const ast = parse( generatedCode, { ecmaVersion: 'latest' } );

  walk.simple( ast, {

    VariableDeclarator( node ) {
      if ( node.id && node.id.name === 'onProgramAdded' ) {
        console.log( 'found onProgramAdded!' );

        // Verify contents of the function
      }
    }
  } );
} );