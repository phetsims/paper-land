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
  testProgram.modelContainer.addStringProperty( stringName, 'Test Value' );

  const vector2Name = 'testVector2';
  testProgram.modelContainer.addVector2Property( vector2Name, 5, 10 );

  const enumerationName = 'testEnumeration';
  testProgram.modelContainer.addEnumerationProperty( enumerationName, [ 'a', 'b', 'c' ] );

  const bounds2Name = 'testBounds2';
  testProgram.modelContainer.addBounds2Property( bounds2Name, 0, 3, 10, 13 );

  const derivedName = 'testDerived';
  const componentReference = testProgram.modelContainer.namedBooleanProperties[ 0 ];
  testProgram.modelContainer.addDerivedProperty( derivedName, [ componentReference ], 'return 5;' );

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
    bounds2Removed: false,

    // derived
    derivedCreated: false,
    derivedAdded: false,
    derivedMultilinkAdded: false,
    derivedRemoved: false,
    derivedMultilinkRemoved: false
  };

  /**
   * Creates a visitor for the AST, checking for code that creates and adds the model component to the boardModel.
   * This visitor looks for a 'NewExpression' in a variable declaration, so it will work for statements like
   *
   *  const variableName = new phet.dot.ClassName();
   *
   *  Other types will need a different visitor function.
   *
   * @param {string} variableName - name of the component that should be added with `paperLand.addModelComponent`
   * @param {string} className - name of the class to be constructed for the component
   * @param {string} createdStateKey - key of the stateObject to set if creation code is found
   * @param {string} addedStateKey - key of the stateObject to set if adding code is found
   * @param {Object} [providedOptions]
   * @return {{CallExpression(*): void, VariableDeclarator(*): void}}
   */
  const createOnProgramAddedVisitors = ( variableName, className, createdStateKey, addedStateKey, providedOptions ) => {

    const options = _.merge( {

      // A visitor function to be used for the arguments of the new expression - callback takes an array
      // of AST Nodes describing each argument
      argumentsVisitorCallback: () => {},

      // A callback to inspect any other CallExpressions in the AST for the onProgramAdded function, in addition to the
      // one is expected to add the component to the board model.
      callExpressionVisitorCallback: () => {}
    }, providedOptions );

    return {
      VariableDeclarator( node ) {
        if (

          // `const variableName` declaration
          node.id && node.id.name === variableName &&

          // `new phet.axon.className` expression
          node.init && node.init.type === 'NewExpression' && node.init.callee &&
          node.init.callee.property && node.init.callee.property.name === className
        ) {
          options.argumentsVisitorCallback( node.init.arguments );
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

        options.callExpressionVisitorCallback( node );
      }
    };
  };

  /**
   * Creates a visitor for the AST, checking for code that removes the model component from the boardModel.
   * @param {string} variableName - name of the component that should be removed with `paperLand.removeModelComponent`
   * @param {string} removedStateKey - key of the stateObject to set if removal code is found
   * @param {Object} [providedOptions]
   * @return {{CallExpression(*): void}}
   */
  const createOnProgramRemovedVisitors = ( variableName, removedStateKey, providedOptions ) => {

    const options = _.merge( {

      // A callback to inspect any other CallExpressions in the AST for the onProgramRemoved function, in addition to
      // the one that is expected to remove the component from the board model.
      callExpressionVisitorCallback: () => {}
    }, providedOptions );

    return {
      CallExpression( node ) {
        if (

          // looking for `phet.paperLand.removeModelComponent( 'variableName' );`
          node.callee && node.callee.property && node.callee.property.name === 'removeModelComponent' &&
          node.arguments && node.arguments[ 0 ] && node.arguments[ 0 ].value === variableName
        ) {
          stateObject[ removedStateKey ] = true;
        }

        options.callExpressionVisitorCallback( node );
      }
    };
  };

  walk.simple( ast, {
    VariableDeclarator: node => {

      // the onProgramAdded declaration
      if ( node.id && node.id.name === 'onProgramAdded' ) {
        walk.simple( node, createOnProgramAddedVisitors( booleanName, 'BooleanProperty', 'booleanCreated', 'booleanAdded', {
          argumentsVisitorCallback: argumentNodes => {

            // Make sure that the default value is false (as we set it in the test)
            assert.ok( argumentNodes.length === 1, 'BooleanProperty has one argument' );
            assert.ok( argumentNodes[ 0 ].type === 'Literal' && argumentNodes[ 0 ].value === false, 'BooleanProperty has the correct default value' );
          }
        } ) );
        walk.simple( node, createOnProgramAddedVisitors( numberName, 'NumberProperty', 'numberCreated', 'numberAdded', {
          argumentsVisitorCallback: argumentNodes => {

            // Make sure that the default value and range are set correctly
            assert.ok( argumentNodes.length === 2, 'NumberProperty has two arguments' );
            assert.ok( argumentNodes[ 0 ].type === 'Literal' && argumentNodes[ 0 ].value === 5, 'NumberProperty has the correct default value' );
            assert.ok(
              argumentNodes[ 1 ].type === 'ObjectExpression' && argumentNodes[ 1 ].properties.length === 1 &&
              argumentNodes[ 1 ].properties[ 0 ].key.name === 'range' && argumentNodes[ 1 ].properties[ 0 ].value.arguments.length === 2 &&
              argumentNodes[ 1 ].properties[ 0 ].value.arguments[ 0 ].value === 0 && argumentNodes[ 1 ].properties[ 0 ].value.arguments[ 1 ].value === 10,
              'NumberProperty has the correct values for the range'
            );
          }
        } ) );
        walk.simple( node, createOnProgramAddedVisitors( stringName, 'StringProperty', 'stringCreated', 'stringAdded', {
          argumentsVisitorCallback: argumentNodes => {

            // Make sure that the default value is the value provided in the creator model
            assert.ok( argumentNodes.length === 1, 'StringProperty has one argument' );
            assert.ok( argumentNodes[ 0 ].type === 'Literal' && argumentNodes[ 0 ].value === 'Test Value', 'StringProperty has the correct default value' );
          }
        } ) );
        walk.simple( node, createOnProgramAddedVisitors( vector2Name, 'Vector2Property', 'vector2Created', 'vector2Added', {
          argumentsVisitorCallback: argumentNodes => {

            // Make sure that the default value is the value provided in the creator model
            assert.ok( argumentNodes.length === 1, 'Vector2Property has one argument' );
            assert.ok( argumentNodes[ 0 ].type === 'NewExpression' && argumentNodes[ 0 ].callee.property.name === 'Vector2' &&
                       argumentNodes[ 0 ].arguments.length === 2 && argumentNodes[ 0 ].arguments[ 0 ].value === 5 &&
                       argumentNodes[ 0 ].arguments[ 1 ].value === 10, 'Vector2Property has the correct default value' );

          }
        } ) );
        walk.simple( node, createOnProgramAddedVisitors( enumerationName, 'StringProperty', 'enumerationCreated', 'enumerationAdded', {
          argumentsVisitorCallback: argumentNodes => {

            // The AST for an argument that is a StringProperty with provided default and valid values
            assert.ok( argumentNodes.length === 2, 'EnumerationProperty has two arguments' );
            assert.ok( argumentNodes[ 0 ].type === 'Literal' && argumentNodes[ 0 ].value === 'a', 'EnumerationProperty has the correct default value' );
            assert.ok( argumentNodes[ 1 ].type === 'ObjectExpression' && argumentNodes[ 1 ].properties.length === 1 &&
                       argumentNodes[ 1 ].properties[ 0 ].key.name === 'validValues' && argumentNodes[ 1 ].properties[ 0 ].value.elements.length === 3 &&
                       argumentNodes[ 1 ].properties[ 0 ].value.elements[ 0 ].value === 'a' && argumentNodes[ 1 ].properties[ 0 ].value.elements[ 1 ].value === 'b' &&
                       argumentNodes[ 1 ].properties[ 0 ].value.elements[ 2 ].value === 'c', 'EnumerationProperty has the correct valid values' );
          }
        } ) );
        walk.simple( node, createOnProgramAddedVisitors( bounds2Name, 'Property', 'bounds2Created', 'bounds2Added', {
          argumentsVisitorCallback: argumentNodes => {

            // The AST for an argument that is a Bounds2 object with provided default values
            assert.ok( argumentNodes.length === 1, 'Bounds2Property has one argument' );
            assert.ok( argumentNodes[ 0 ].type === 'NewExpression' && argumentNodes[ 0 ].callee.property.name === 'Bounds2' &&
                       argumentNodes[ 0 ].arguments.length === 4 && argumentNodes[ 0 ].arguments[ 0 ].value === 0 &&
                       argumentNodes[ 0 ].arguments[ 1 ].value === 3 && argumentNodes[ 0 ].arguments[ 2 ].value === 10 &&
                       argumentNodes[ 0 ].arguments[ 3 ].value === 13, 'Bounds2Property has the correct default value' );
          }
        } ) );

        walk.simple( node, createOnProgramAddedVisitors( derivedName, 'Property', 'derivedCreated', 'derivedAdded', {
          callExpressionVisitorCallback: node => {

            // searching for the addModelPropertyMultilink that actually updates the Property from dependencies
            if ( node.callee && node.callee.property && node.callee.property.name === 'addModelPropertyMultilink' ) {
              stateObject.derivedMultilinkAdded = true;
            }
          }
        } ) );
      }
      if ( node.id && node.id.name === 'onProgramRemoved' ) {
        walk.simple( node, createOnProgramRemovedVisitors( booleanName, 'booleanRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( numberName, 'numberRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( stringName, 'stringRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( vector2Name, 'vector2Removed' ) );
        walk.simple( node, createOnProgramRemovedVisitors( enumerationName, 'enumerationRemoved' ) );
        walk.simple( node, createOnProgramRemovedVisitors( bounds2Name, 'bounds2Removed' ) );
        walk.simple( node, createOnProgramRemovedVisitors( derivedName, 'derivedRemoved', {
          callExpressionVisitorCallback: node => {

            // searching for the removeModelPropertyMultilink that detaches the Property from dependencies
            if ( node.callee && node.callee.property && node.callee.property.name === 'removeModelPropertyMultilink' ) {
              stateObject.derivedMultilinkRemoved = true;
            }
          }
        } ) );
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
  assert.ok( stateObject.derivedCreated, 'DerivedProperty was created in onProgramAdded' );
  assert.ok( stateObject.derivedAdded, 'DerivedProperty was added in onProgramAdded' );
  assert.ok( stateObject.derivedRemoved, 'DerivedProperty was removed in onProgramRemoved' );
  assert.ok( stateObject.derivedMultilinkAdded, 'DerivedProperty multilink was added in onProgramAdded' );
  assert.ok( stateObject.derivedMultilinkRemoved, 'DerivedProperty multilink was removed in onProgramRemoved' );
} );