/**
 * Unit tests for ProgramCodeGenerator.
 *
 * @author Jesse Greenberg
 */

import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import CreatorModel from '../../creator/model/CreatorModel.js';

QUnit.module( 'ProgramCodeGenerator' );

/**
 * An empty program should have generated code that runs and does nothing.
 */
QUnit.test( 'Empty Program', async assert => {
  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ) );

  const generatedCode = await testProgram.convertToProgramString();
  assert.ok( generatedCode.length > 0, 'there was some generated code' );

  // acorn will throw an error if the code is not valid
  parse( generatedCode, { ecmaVersion: 'latest' } );
  assert.ok( true, 'empty program code was parsed' );
} );

/**
 * Create a project with one of each model component. Make sure that the generated code is free of syntax errors,
 * and that the components are created and added in the onProgramAdded callback. Also make sure that the components
 * are removed in onProgramRemoved.
 *
 * TODO: Test the array component
 * TODO: Test the derived component - doesn't actually use a new expression, it uses a multilink
 * TODO: Test arguments for each (initial values, valid values, etc.)
 */
QUnit.test( 'Model Components', async assert => {

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ), 1 );

  // create one of each model component type
  const booleanName = 'testBoolean';
  testProgram.modelContainer.addBooleanProperty( booleanName, false );

  const numberName = 'testNumber';
  testProgram.modelContainer.addNumberProperty( numberName, 0, 10, 5 );

  const stringName = 'testString';
  testProgram.modelContainer.addStringProperty( stringName, '' );

  const vector2Name = 'testVector2';
  testProgram.modelContainer.addVector2Property( vector2Name, 5, 10 );

  const enumerationName = 'testEnumeration';
  testProgram.modelContainer.addEnumerationProperty( enumerationName, [ 'a', 'b', 'c' ] );

  const bounds2Name = 'testBounds2';
  testProgram.modelContainer.addBounds2Property( bounds2Name, 0, 0, 10, 10 );

  const generatedCode = await testProgram.convertToProgramString();

  // acorn will throw an error if there is a syntax problem
  const ast = parse( generatedCode, { ecmaVersion: 'latest' } );
  assert.ok( true, 'program code was generated' );

  // An object to keep track of what is found in the AST so that values can be set in callbacks and checked at the end.
  const stateObject = {

    // boolean
    booleanCreated: false,
    booleanAdded: false,
    booleanRemoved: false,

    // number
    numberCreated: false,
    numberAdded: false,
    numberRemoved: false,

    // string
    stringCreated: false,
    stringAdded: false,
    stringRemoved: false,

    // vector2
    vector2Created: false,
    vector2Added: false,
    vector2Removed: false,

    // enumeration
    enumerationCreated: false,
    enumerationAdded: false,
    enumerationRemoved: false,

    // bounds2
    bounds2Created: false,
    bounds2Added: false,
    bounds2Removed: false
  };

  /**
   * Creates a visitor for the AST, checking for code that creates and adds the model component to the boardModel.
   *
   * @param {string} variableName - name of the component that should be added with `paperLand.addModelComponent`
   * @param {string} className - name of the class to be constructed for the component
   * @param {string} createdStateKey - key of the stateObject to set if creation code is found
   * @param {string} addedStateKey - key of the stateObject to set if adding code is found
   * @return {{CallExpression(*): void, VariableDeclarator(*): void}}
   */
  const createOnProgramAddedVisitors = ( variableName, className, createdStateKey, addedStateKey ) => {
    return {
      VariableDeclarator( node ) {
        if (

          // `const variableName` declaration
          node.id && node.id.name === variableName &&

          // `new phet.axon.className` expression
          node.init && node.init.type === 'NewExpression' && node.init.callee &&
          node.init.callee.property && node.init.callee.property.name === className
        ) {
          stateObject[ createdStateKey ] = true;
        }
      },
      CallExpression( node ) {
        if (

          // looking for `phet.paperLand.addModelComponent( 'variableName', variableName );`
          node.callee && node.callee.property && node.callee.property.name === 'addModelComponent' &&
          node.arguments && node.arguments[ 0 ] && node.arguments[ 0 ].value === variableName
        ) {
          stateObject[ addedStateKey ] = true;
        }
      }
    };
  };

  /**
   * Creates a visitor for the AST, checking for code that removes the model component from the boardModel.
   * @param {string} variableName - name of the component that should be removed with `paperLand.removeModelComponent`
   * @param {string} removedStateKey - key of the stateObject to set if removal code is found
   * @return {{CallExpression(*): void}}
   */
  const createOnProgramRemovedVisitors = ( variableName, removedStateKey ) => {
    return {
      CallExpression( node ) {
        if (

          // looking for `phet.paperLand.removeModelComponent( 'variableName' );`
          node.callee && node.callee.property && node.callee.property.name === 'removeModelComponent' &&
          node.arguments && node.arguments[ 0 ] && node.arguments[ 0 ].value === variableName
        ) {
          stateObject[ removedStateKey ] = true;
        }
      }
    };
  };

  walk.simple( ast, {
    VariableDeclarator: node => {

      // the onProgramAdded declaration
      if ( node.id && node.id.name === 'onProgramAdded' ) {
        walk.simple( node, createOnProgramAddedVisitors( booleanName, 'BooleanProperty', 'booleanCreated', 'booleanAdded' ) );
        walk.simple( node, createOnProgramAddedVisitors( numberName, 'NumberProperty', 'numberCreated', 'numberAdded' ) );
        walk.simple( node, createOnProgramAddedVisitors( stringName, 'StringProperty', 'stringCreated', 'stringAdded' ) );
        walk.simple( node, createOnProgramAddedVisitors( vector2Name, 'Vector2Property', 'vector2Created', 'vector2Added' ) );
        walk.simple( node, createOnProgramAddedVisitors( enumerationName, 'StringProperty', 'enumerationCreated', 'enumerationAdded' ) );
        walk.simple( node, createOnProgramAddedVisitors( bounds2Name, 'Property', 'bounds2Created', 'bounds2Added' ) );
      }
      if ( node.id && node.id.name === 'onProgramRemoved' ) {
        walk.simple( node, createOnProgramRemovedVisitors( booleanName, 'booleanRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( numberName, 'numberRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( stringName, 'stringRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( vector2Name, 'vector2Removed' ) );
        walk.simple( node, createOnProgramRemovedVisitors( enumerationName, 'enumerationRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( bounds2Name, 'bounds2Removed' ) );
      }
    }
  } );

  assert.ok( stateObject.booleanCreated, 'BooleanProperty was created in onProgramAdded' );
  assert.ok( stateObject.booleanAdded, 'BooleanProperty was added in onProgramAdded' );
  assert.ok( stateObject.booleanRemoved, 'BooleanProperty was removed in onProgramRemoved' );
  assert.ok( stateObject.numberCreated, 'NumberProperty was created in onProgramAdded' );
  assert.ok( stateObject.numberAdded, 'NumberProperty was added in onProgramAdded' );
  assert.ok( stateObject.numberRemoved, 'NumberProperty was removed in onProgramRemoved' );
  assert.ok( stateObject.stringCreated, 'StringProperty was created in onProgramAdded' );
  assert.ok( stateObject.stringAdded, 'StringProperty was added in onProgramAdded' );
  assert.ok( stateObject.stringRemoved, 'StringProperty was removed in onProgramRemoved' );
  assert.ok( stateObject.vector2Created, 'Vector2Property was created in onProgramAdded' );
  assert.ok( stateObject.vector2Added, 'Vector2Property was added in onProgramAdded' );
  assert.ok( stateObject.vector2Removed, 'Vector2Property was removed in onProgramRemoved' );
  assert.ok( stateObject.enumerationCreated, 'EnumerationProperty was created in onProgramAdded' );
  assert.ok( stateObject.enumerationAdded, 'EnumerationProperty was added in onProgramAdded' );
  assert.ok( stateObject.enumerationRemoved, 'EnumerationProperty was removed in onProgramRemoved' );
  assert.ok( stateObject.bounds2Created, 'Bounds2Property was created in onProgramAdded' );
  assert.ok( stateObject.bounds2Added, 'Bounds2Property was added in onProgramAdded' );
  assert.ok( stateObject.bounds2Removed, 'Bounds2Property was removed in onProgramRemoved' );
} );