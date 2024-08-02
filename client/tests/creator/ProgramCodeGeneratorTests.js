/**
 * Unit tests for ProgramCodeGenerator.
 *
 * @author Jesse Greenberg
 */

import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import CreatorModel from '../../creator/model/CreatorModel.js';
import ShapeViewComponent from '../../creator/model/views/ShapeViewComponent.js';

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

  const arrayName = 'testArray';
  const arrayLengthComponentName = 'testArrayLength';
  const addedItemReference = 'testArrayAddedItem';
  const removedItemReference = 'testArrayRemovedItem';
  testProgram.modelContainer.addObservableArray( arrayName, arrayLengthComponentName, addedItemReference, removedItemReference );

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
    derivedMultilinkRemoved: false,

    // array - creates multiple components to track length and the last item added/removed
    arrayCreated: false,
    arrayAdded: false,
    arrayRemoved: false
  };

  /**
   * Creates a visitor for the AST, checking for code that creates and adds the model component to the displayModel.
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
   * Creates a visitor for the AST, checking for code that removes the model component from the displayModel.
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

        // Make sure that the array and all of its sub components are created and added
        walk.simple( node, createOnProgramAddedVisitors( arrayName, 'Property', 'arrayCreated', 'arrayAdded', {
          argumentsVisitorCallback: argumentNodes => {

            // The AST for an argument that is an ObservableArray object with provided default value (an empty array)
            assert.ok( argumentNodes.length === 1, 'ObservableArray has one argument' );
            assert.ok( argumentNodes[ 0 ].type === 'ArrayExpression' && argumentNodes[ 0 ].elements.length === 0, 'ObservableArray has the correct default value' );
          }
        } ) );
        walk.simple( node, createOnProgramAddedVisitors( arrayLengthComponentName, 'Property', 'arrayLengthComponentCreated', 'arrayLengthComponentAdded' ) );
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

        // make sure that array and sub components are removed
        walk.simple( node, createOnProgramRemovedVisitors( arrayName, 'arrayRemoved' ) );
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
  assert.ok( stateObject.arrayCreated, 'ObservableArray was created in onProgramAdded' );
  assert.ok( stateObject.arrayAdded, 'ObservableArray was added in onProgramAdded' );
  assert.ok( stateObject.arrayRemoved, 'ObservableArray was removed in onProgramRemoved' );
} );

QUnit.test( 'View Components - Line Shape', async assert => {

  const creatorModel = new CreatorModel();
  const testProgram = creatorModel.createProgram( new phet.dot.Vector2( 0, 0 ), 1 );

  // One model component which we can use to verify model -> view connections
  const booleanName = 'testBoolean';
  testProgram.modelContainer.addBooleanProperty( booleanName, false );
  const booleanReference = testProgram.modelContainer.namedBooleanProperties[ 0 ];

  // ShapeViewComponent
  const shapeViewComponentName = 'testShapeView';
  const shapeViewComponent = new ShapeViewComponent( shapeViewComponentName, [ booleanReference ], '', {
    shapeType: 'line'
  } );
  testProgram.viewContainer.addShapeView( shapeViewComponent );

  // The generated code
  const generatedCode = await testProgram.convertToProgramString();

  console.log( generatedCode );

  // acorn will throw an error if there is a syntax problem
  const ast = parse( generatedCode, { ecmaVersion: 'latest' } );
  assert.ok( true, 'program code was generated' );

  const stateObject = {

    // The multilink is expected to update the shape when dependencies change
    multilinkCreated: false,

    // makes sure that setter functions for the line points are defined
    setX1Defined: false,
    setY1Defined: false,
    setX2Defined: false,
    setY2Defined: false,

    // makes sure that the setter functions actually update the shape
    setX1SetsShape: false,
    setY1SetsShape: false,
    setX2SetsShape: false,
    setY2SetsShape: false
  };

  // Walk down the AST - we expect to find an addModelPropertyMultilink() that will update the shape from dependencies
  walk.simple( ast, {
    CallExpression( node ) {
      if ( node.callee && node.callee.property && node.callee.property.name === 'addModelPropertyMultilink' ) {

        // the arguments of the multilink should include the boolean name
        assert.ok( node.arguments[ 0 ].elements.length === 1, 'addModelPropertyMultilink has one dependency' );
        assert.ok( node.arguments[ 0 ].elements[ 0 ].value === booleanName, 'addModelPropertyMultilink has the correct dependency' );

        // the second argument of the multilink should include functions that update the shape
        const updateFunctionNode = node.arguments[ 1 ];
        assert.ok( updateFunctionNode.type === 'ArrowFunctionExpression', 'addModelPropertyMultilink has a function' );

        /**
         * A visitor for the AST walker that looks for a variable declaring a setter function that will update some
         * field on the shape view component.
         * @param setterName - the name of the setter function to look for
         * @param fieldName - the name of the field on the shape view component that the setter should update
         * @param setterDefinedObjectKey - the key of the stateObject to set if the setter function is found
         * @param assignmentCorrectObjectKey - the key of the stateObject to set if the setter function updates the
         *                                     correct field
         */
        const createInspectSetterFunctionVisitor = ( setterName, fieldName, setterDefinedObjectKey, assignmentCorrectObjectKey ) => {
          return {
            VariableDeclarator( childNode ) {
              if ( childNode.init.type === 'ArrowFunctionExpression' && childNode.id.name === setterName ) {
                stateObject[ setterDefinedObjectKey ] = true;
                walk.simple( childNode, {
                  AssignmentExpression( assignmentNode ) {
                    if ( assignmentNode.left.property && assignmentNode.left.property.name === fieldName ) {
                      stateObject[ assignmentCorrectObjectKey ] = true;
                    }
                  }
                } );
              }
            }
          };
        };

        // Walk down the function to make sure that the update functions for the Line are as expected
        walk.simple( updateFunctionNode, createInspectSetterFunctionVisitor( 'setX1', 'shape', 'setX1Defined', 'setX1SetsShape' ) );
        walk.simple( updateFunctionNode, createInspectSetterFunctionVisitor( 'setY1', 'shape', 'setY1Defined', 'setY1SetsShape' ) );
        walk.simple( updateFunctionNode, createInspectSetterFunctionVisitor( 'setX2', 'shape', 'setX2Defined', 'setX2SetsShape' ) );
        walk.simple( updateFunctionNode, createInspectSetterFunctionVisitor( 'setY2', 'shape', 'setY2Defined', 'setY2SetsShape' ) );

        stateObject.multilinkCreated = true;
      }
    }
  } );

  // in case the multilink is missing - if thats the case, other tests in the walk will never run
  assert.ok( stateObject.multilinkCreated, 'addModelPropertyMultilink was found in the generated code' );
  assert.ok( stateObject.setX1Defined, 'setX1 is defined in the control function' );
  assert.ok( stateObject.setX1SetsShape, 'setX1 updates the shape' );
  assert.ok( stateObject.setY1Defined, 'setY1 is defined in the control function' );
  assert.ok( stateObject.setY1SetsShape, 'setY1 updates the shape' );
  assert.ok( stateObject.setX2Defined, 'setX2 is defined in the control function' );
  assert.ok( stateObject.setX2SetsShape, 'setX2 updates the shape' );
  assert.ok( stateObject.setY2Defined, 'setY2 is defined in the control function' );
  assert.ok( stateObject.setY2SetsShape, 'setY2 updates the shape' );

} );