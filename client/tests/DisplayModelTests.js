/**
 * Unit tests for the displayModel and its operations.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import displayModel from '../board/displayModel.js';

QUnit.module( 'displayModel' );

QUnit.test( 'add/remove model components', assert => {
  assert.ok( displayModel.size === 0, 'first test, empty model' );

  const componentA = { x: 5 };
  phet.paperLand.addModelComponent( 'componentA', componentA );
  assert.ok( displayModel.size === 1, 'componentA added' );
  assert.ok( displayModel.get( 'componentA' ) === componentA, 'componentA in map' );

  phet.paperLand.removeModelComponent( 'componentA' );
  assert.ok( displayModel.size === 0, 'componentA removed' );
} );

QUnit.test( 'addModelObserver/removeModelObserver', assert => {

  const modelComponent = new phet.axon.Property( 0 );
  const componentListener = () => {};
  const handleComponentAttach = component => component.link( componentListener );
  const handleComponentDetach = component => component.unlink( componentListener );

  // tests adding component, then adding observer
  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );
  const observerId = phet.paperLand.addModelObserver( 'modelComponent', handleComponentAttach, handleComponentDetach );
  assert.ok( modelComponent.getListenerCount() === 1, 'handleComponentAttach should have been used since the model component exists' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 1, 'should be a listener watching for model component removal' );

  // tests removing component while observer is active
  phet.paperLand.removeModelComponent( 'modelComponent' );
  assert.ok( modelComponent.getListenerCount() === 0, 'handleComponentDetach should be used when the model component is removed' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 0, 'listener for component removal should have been removed' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 1, 'should be a listener waiting for the model component to be added back' );

  // tests adding component after adding observer
  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );
  assert.ok( modelComponent.getListenerCount() === 1, 'observer was active, component listener should have been added to the component' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 1, 'should be a listener watching for model component removal' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'listener waiting for model component to be added should have been removed' );

  // tests removing observer while component is active
  phet.paperLand.removeModelObserver( 'modelComponent', observerId );
  assert.ok( modelComponent.getListenerCount() === 0, 'observer was removed, componentListener should be detached' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 0, 'observer was removed, model should not be waiting for component removal' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'observer was removed, model should not be waiting for component addition' );
  assert.ok( displayModel.has( 'modelComponent' ), 'observer removed but model component remains in model' );

  // clear for next test
  phet.paperLand.removeModelComponent( 'modelComponent' );
} );

// Tests for this are more sparse, but addModelPropertyLink uses addModelObserver so addModelObserver tests should
// also cover most cases
QUnit.test( 'addModelPropertyLink/removeModelPropertyLink', assert => {

  const modelComponent = new phet.axon.Property( 0 );
  const componentListener = () => {};

  // Test adding the component and then adding the observer
  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );
  const linkId = phet.paperLand.addModelPropertyLink( 'modelComponent', componentListener );
  assert.ok( modelComponent.getListenerCount() === 1, 'addModelPropertyLink should add the componentListener since model component is available' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 1, 'should be waiting to handle component removal' );

  // tests removing the component observer while the model component is actives
  phet.paperLand.removeModelPropertyLink( 'modelComponent', linkId );
  assert.ok( modelComponent.getListenerCount() === 0, 'removeModelPropertyLink should detach the listener' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 0, 'observer removed, model should not be waiting for component removal' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'observer removed, model should not be waiting for component add' );

  // clear for next test
  phet.paperLand.removeModelComponent( 'modelComponent' );
} );

QUnit.test( 'multiple observers on the same observable', assert => {

  // add model components
  const modelComponent = new phet.axon.Property( 0 );
  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );

  // link two listeners to the same model component
  const listenerA = () => {};
  const listenerB = () => {};
  const linkIdA = phet.paperLand.addModelPropertyLink( 'modelComponent', listenerA );
  const linkIdB = phet.paperLand.addModelPropertyLink( 'modelComponent', listenerB );
  assert.ok( modelComponent.getListenerCount() === 2, 'two listeners linked to model Property' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 2, 'both waiting for model component to be removed' );

  // remove the model component, links should be detached
  phet.paperLand.removeModelComponent( 'modelComponent' );
  assert.ok( modelComponent.getListenerCount() === 0, 'both links detached' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 0, 'neither waiting for component removal' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 2, 'both now waiting for component addition' );

  // add the model component back
  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );
  assert.ok( modelComponent.getListenerCount() === 2, 'two listeners linked to model Property' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 2, 'both waiting for model component to be removed' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'neither waiting for component addition' );

  // remove one of the links
  phet.paperLand.removeModelPropertyLink( 'modelComponent', linkIdA );
  assert.ok( modelComponent.getListenerCount() === 1, 'one listener remains on property after first link removal' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 1, 'remaining observer waiting for model component to be removed' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'neither waiting for component addition' );

  // remove both of the links
  phet.paperLand.removeModelPropertyLink( 'modelComponent', linkIdB );
  assert.ok( modelComponent.getListenerCount() === 0, 'all links detached' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 0, 'nothing watching for removal' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'nothing watching for added' );

  phet.paperLand.removeModelComponent( 'modelComponent' );
} );

QUnit.test( 'addModelController/removeModelController', assert => {

  // I tried to do this test with an axon Property. For a reason I could not understand, setting the Property value
  // with property.value and property.set had no effect on the Property value in this context.
  const modelComponent = {
    value: 0
  };
  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );

  const controllerAttach = component => { modelComponent.value = component.value + 1; };
  const controllerDetach = component => { modelComponent.value = component.value - 1; };
  const controllerId = phet.paperLand.addModelController( 'modelComponent', controllerAttach, controllerDetach );

  assert.ok( modelComponent.value === 1, 'controller should have incremented the value' );

  phet.paperLand.removeModelComponent( 'modelComponent' );
  assert.ok( modelComponent.value === 0, 'removing component should invoke the detach' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 1, 'should be waiting for component to come back' );

  phet.paperLand.addModelComponent( 'modelComponent', modelComponent );
  assert.ok( modelComponent.value === 1, 'component added back, controller should be used' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'component returned, should not be waiting for it' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 1, 'component returned, should waiting for its removal' );

  phet.paperLand.removeModelController( 'modelComponent', controllerId );
  assert.ok( modelComponent.value === 0, 'removing controller should invoke the detach' );
  assert.ok( phet.paperLand.modelComponentAddedEmitter.getListenerCount() === 0, 'no longer waiting for add' );
  assert.ok( phet.paperLand.modelComponentRemovedEmitter.getListenerCount() === 0, 'no longer waiting for removal' );

  phet.paperLand.removeModelComponent( 'modelComponent' );
} );

QUnit.test( 'MultiModelObserver', assert => {

  // The dependency components. Each must be added to the model for the observer to attach.
  const componentA = { value: 0 };
  const componentB = { value: 0 };
  const componentC = { value: 0 };
  const componentD = { value: 0 };

  // an extra component that is not a dependency
  const componentE = { value: 0 };

  let attachCount = 0;
  const handleComponentsAttach = components => {
    attachCount++;
  };

  let detachCount = 0;
  const handleComponentsDetach = components => {
    detachCount++;
  };

  const componentNames = [ 'componentA', 'componentB', 'componentC', 'componentD' ];
  const observerId = phet.paperLand.addMultiModelObserver( componentNames, handleComponentsAttach, handleComponentsDetach );
  assert.ok( attachCount === 0, 'observer should not have attached yet' );
  assert.ok( detachCount === 0, 'observer should not have detached yet' );

  phet.paperLand.addModelComponent( 'componentA', componentA );
  assert.ok( attachCount === 0, 'observer should not have attached yet' );
  phet.paperLand.addModelComponent( 'componentB', componentB );
  assert.ok( attachCount === 0, 'observer should not have attached yet' );
  phet.paperLand.addModelComponent( 'componentC', componentC );
  assert.ok( attachCount === 0, 'observer should not have attached yet' );
  phet.paperLand.addModelComponent( 'componentD', componentD );
  assert.ok( attachCount === 1, 'observer should be attached now that all components are added' );
  assert.ok( detachCount === 0, 'observer should not have detached yet' );

  phet.paperLand.removeModelComponent( 'componentA' );
  assert.ok( attachCount === 1, 'observer should only have been attached once' );
  assert.ok( detachCount === 1, 'one dependency was removed after attachment, detachment should have happened' );

  phet.paperLand.removeModelComponent( 'componentB' );
  assert.ok( detachCount === 1, 'only one detachment event for all dependencies' );

  phet.paperLand.addModelComponent( 'componentA', componentA );
  phet.paperLand.addModelComponent( 'componentB', componentB );
  assert.ok( attachCount === 2, 'observer should have attached again' );

  phet.paperLand.addModelComponent( 'componentE', componentE );
  assert.ok( attachCount === 2, 'no op when adding a component out of the list' );

  phet.paperLand.removeModelComponent( 'componentE' );
  assert.ok( detachCount === 1, 'no op when removing a component out of the list' );

  phet.paperLand.removeMultiModelObserver( componentNames, observerId );
  assert.ok( detachCount === 2, 'observer should have been detached again when the observer is removed' );

  phet.paperLand.removeModelComponent( 'componentA' );
  assert.ok( detachCount === 2, 'observer removed, detach should not happen again' );

  phet.paperLand.addModelComponent( 'componentA', componentA );
  assert.ok( attachCount === 2, 'observer removed, attach should not happen again' );

  // remove all components for test
  phet.paperLand.removeModelComponent( 'componentA' );
  phet.paperLand.removeModelComponent( 'componentB' );
  phet.paperLand.removeModelComponent( 'componentC' );
  phet.paperLand.removeModelComponent( 'componentD' );
} );

QUnit.test( 'addModelPropertyMultilink', assert => {

  // add model components
  const componentAProperty = new phet.axon.Property( 0 );
  const componentBProperty = new phet.axon.Property( 0 );

  let listenerCount = 0;
  const listener = ( componentA, componentB ) => {
    listenerCount++;
  };

  const multilinkId = phet.paperLand.addModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], listener );
  assert.ok( listenerCount === 0, 'components do not exist in the model and the listener should not have been called' );

  phet.paperLand.addModelComponent( 'componentAProperty', componentAProperty );
  assert.ok( listenerCount === 0, 'componentAProperty exists in the model but componentBProperty does not, the listener should not have been called' );

  phet.paperLand.addModelComponent( 'componentBProperty', componentBProperty );
  assert.ok( listenerCount === 1, 'Both components now exist, the listener will be called.' );

  componentAProperty.value = 1;
  assert.ok( listenerCount === 2, 'Listener should be attached and changing a value should trigger it' );

  phet.paperLand.removeModelComponent( 'componentAProperty' );
  componentAProperty.value = 2;
  assert.ok( listenerCount === 2, 'Listener was detached on component removal, changing value should not call listener' );

  phet.paperLand.addModelComponent( 'componentAProperty', componentAProperty );
  assert.ok( listenerCount === 3, 'Adding components again, listener should trigger' );

  phet.paperLand.removeModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], multilinkId );

  componentAProperty.value = 3;
  assert.ok( listenerCount === 3, 'Multilink was removed, changing value should not call listener' );

  phet.paperLand.removeModelComponent( 'componentAProperty' );
  phet.paperLand.removeModelComponent( 'componentAProperty' );
} );

/**
 * Tests for the isWaitingForModelComponentProperty - a Property that indicates that the model is in a state where
 * it is waiting for other components to be added.
 */
QUnit.test( 'isWaitingForModelComponentProperty', assert => {
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'initial state' );

  // add model components
  const componentAProperty = new phet.axon.Property( 0 );
  const componentBProperty = new phet.axon.Property( 0 );

  // add components - no observers yet so this should have no impact on the Property
  phet.paperLand.addModelComponent( 'componentAProperty', componentAProperty );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'no observers, no change' );

  phet.paperLand.addModelComponent( 'componentBProperty', componentBProperty );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'no observers, no change' );

  // Add an observer while both are in the model - since both Properties are available upon the link,
  // the model should not be in a waiting state
  const multilinkId = phet.paperLand.addModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], () => {} );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'both components are available, no waiting' );

  // Remove the observer - should have no impact on the Property since the observer is totally removed
  phet.paperLand.removeModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], multilinkId );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'observer removed, no change' );

  // Remove one of the components, then add back a multilink - Now the model is in a waiting state for the
  // component to be added back before the observer can be attached
  phet.paperLand.removeModelComponent( 'componentAProperty' );
  const multilinkId2 = phet.paperLand.addModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], () => {} );
  assert.ok( phet.paperLand.isWaitingForModelComponentProperty.value, 'componentAProperty is missing, model is waiting' );

  // Add the component back - the model should no longer be waiting
  phet.paperLand.addModelComponent( 'componentAProperty', componentAProperty );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'componentAProperty added back, no longer waiting' );

  // remove both components, the model should be in a waiting state for both
  phet.paperLand.removeModelComponent( 'componentAProperty' );
  phet.paperLand.removeModelComponent( 'componentBProperty' );
  assert.ok( phet.paperLand.isWaitingForModelComponentProperty.value, 'both components are missing, model is waiting' );

  // remove the multilink with both components gone, the model should no longer be waiting
  phet.paperLand.removeModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], multilinkId2 );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'multilink removed while both components available, no longer waiting' );

  // Add the multilink back while no components are in the model, the model should be in a waiting state
  const multilinkId3 = phet.paperLand.addModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], () => {} );
  assert.ok( phet.paperLand.isWaitingForModelComponentProperty.value, 'no components available, model is waiting' );

  // Add each component back until out of the waiting state
  phet.paperLand.addModelComponent( 'componentAProperty', componentAProperty );
  assert.ok( phet.paperLand.isWaitingForModelComponentProperty.value, 'one component available, model is waiting' );
  phet.paperLand.addModelComponent( 'componentBProperty', componentBProperty );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'both components available, no longer waiting' );

  // remove the components and the multilink
  phet.paperLand.removeModelComponent( 'componentAProperty' );
  phet.paperLand.removeModelComponent( 'componentBProperty' );
  phet.paperLand.removeModelPropertyMultilink( [ 'componentAProperty', 'componentBProperty' ], multilinkId3 );
  assert.ok( !phet.paperLand.isWaitingForModelComponentProperty.value, 'all removed, no longer waiting' );
} );