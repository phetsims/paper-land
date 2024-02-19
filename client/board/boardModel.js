/**
 * The main model component for the board. This is a map with keys that are the name of the model component
 * and values of the model subcomponents components for board that are created by paper programs.
 *
 * This file has functions for the working with the model that are added to the paperLand namespace so that
 * they are available in paper program code.
 */

import boardConsole from './boardConsole.js';
import paperLand from './paperLand.js';

// The model of our sim design board, with all model Properties and components from paper programs.
// Map<string, Object> - keys are the name of the model component, values are any kind of model component
const boardModel = new Map();

// Each call to add addListenerToModelChangeEmitter increments this value. It is returned by the function
// so we have a unique id to the observer that is added to the observable (component name is not sufficient
// when multiple observers are added to the same observable).
let observerId = 0;

// Maps that give all functions listening for model component add/remove. We need references to those listeners
// so that we can easily add/remove them when the model component no longer exists in the model. The functions
// in these maps watch for changes to the global model object.
// Map<number, function> - keys are unique id returned by addModelObserver, functions are the listeners
const idToComponentAddedListenerMap = new Map();
const idToComponentRemovedListenerMap = new Map();

window.idToComponentAddedListenerMap = idToComponentAddedListenerMap;

// Maps the unique ID returned by addModelObserver to a detach function that will remove listeners or do other
// work when a model component is no longer available. The functions in this map actually detach from the
// model component.
const idToComponentDetachMap = new Map();

// A property that notifies if the boardModel is waiting for a model component to be added by some program. Components
// with connections to other programs may be waiting for another model component before they can be created. This
// can be confusing for the user. This property is used to show a message to the user when this is happening.
//
// NOTE: This Property must be updated any time a listener is added or removed from the idToComponentAddedListenerMap.
// TODO: Consider using a Property instead of a Map for the listeners, so we can listen for changes to the map.
paperLand.isWaitingForModelComponentProperty = new window.phet.axon.Property( false );

// Emits events when model components are added or removed, to be used in program code. Emits with two args
// {string} - name of the model component
// {*} - Reference to the component being added or removed
paperLand.modelComponentAddedEmitter = new window.phet.axon.Emitter();
paperLand.modelComponentRemovedEmitter = new window.phet.axon.Emitter();

// Maps program number to a JavaScript object that will be used to store data for that program. This is specifically
// for data related to a particular program number that is not relevant to the model. For example, you may
// want to do some behavior when a program becomes adjacent to another (specific) program without using model info.
// Map<number, {Object<string,number}> - keys are program numbers, values are any JavaScript object
const programDataMap = new Map();

// A global that represents the display size and will notify listeners when it changes.
const DEFAULT_DISPLAY_SIZE = new phet.dot.Dimension2( 640, 480 );
paperLand.displaySizeProperty = new phet.axon.Property( DEFAULT_DISPLAY_SIZE );

/**
 * Adds a model component to the model Object with the provided name. Emits events so client code can observe
 * changes to the model.
 * @param {string} componentName
 * @param {*} componentObject - any model component (Property, or object with multiple Properties and values)
 */
paperLand.addModelComponent = ( componentName, componentObject ) => {
  if ( boardModel.get( componentName ) === undefined ) {
    boardModel.set( componentName, componentObject );
    paperLand.modelComponentAddedEmitter.emit( componentName, componentObject );
  }
  else {
    boardConsole.warn( `Model already has component with name ${componentName}! Ignoring this component.` );
  }
};

/**
 * Returns the component in the boardModel with the provided name. Undefined if it doesn't exist.
 * @param {string} componentName
 * @returns {Object | undefined}
 */
paperLand.getModelComponent = componentName => {
  return boardModel.get( componentName );
};

/**
 * Remove a component with the provided name from the model. Updates the global modelProperty which is our map
 * of all model components and also emits a separate Emitter.
 * @param {string} componentName
 */
paperLand.removeModelComponent = componentName => {
  const componentObject = boardModel.get( componentName );

  if ( componentObject === undefined ) {
    boardConsole.warn( `Model does not have component with name ${componentName}! Use addModelComponent first.` );
  }
  else {

    // delete the object from the global model and then reassign to trigger a Property change
    boardModel.delete( componentName );

    // emit events, passing the componentObject through so that client can dispose of various objects
    paperLand.modelComponentRemovedEmitter.emit( componentName, componentObject );

    // dispose the component when we are done with it, if supported and the client hasn't already done so
    componentObject.dispose && !componentObject.isDisposed && componentObject.dispose();
  }
};

/**
 * Set program data for the provided program number at the provided name. Note this lets you override any
 * previously set data.
 * @param {number} programNumber
 * @param {string} dataName
 * @param {*} dataObject
 */
paperLand.setProgramData = ( programNumber, dataName, dataObject ) => {
  const programData = programDataMap.get( programNumber ) || {};
  programData[ dataName ] = dataObject;
  programDataMap.set( programNumber, programData );
};

/**
 * Delete program data for the provided program number at the provided name.
 * @param {number} programNumber
 * @param {string} dataName
 */
paperLand.removeProgramData = ( programNumber, dataName ) => {
  const programData = programDataMap.get( programNumber );
  if ( programData ) {
    delete programData[ dataName ];
  }
};

/**
 * Get program data for the provided program number at the provided name. Returns null if no data exists.
 * @param {number} programNumber
 * @param {string} dataName
 * @return {*|null}
 */
paperLand.getProgramData = ( programNumber, dataName ) => {
  const programData = programDataMap.get( programNumber );
  if ( programData ) {
    return programData[ dataName ] || null;
  }
  else {
    return null;
  }
};

/**
 * Adds a listener to the provided emitter and saves a reference to it in a Map so it can be easily removed later.
 * @param observerId {number}
 * @param listener {function} - listener for when the model component is added/removed
 * @param addOrRemove {'add'|'remove'} - whether you are listening for model component 'add' or 'remove'
 */
const addListenerToModelChangeEmitter = ( observerId, listener, addOrRemove ) => {
  let emitter;
  let listenerMap;

  if ( addOrRemove === 'add' ) {
    emitter = paperLand.modelComponentAddedEmitter;
    listenerMap = idToComponentAddedListenerMap;
  }
  else {
    emitter = paperLand.modelComponentRemovedEmitter;
    listenerMap = idToComponentRemovedListenerMap;
  }

  emitter.addListener( listener );

  if ( !listenerMap.has( observerId ) ) {
    listenerMap.set( observerId, [] );
  }
  listenerMap.get( observerId ).push( listener );

  // If there are any listeners in the 'component added listener map', then the boardModel is in a state where
  // it is waiting for a model component to be added.
  phet.paperLand.isWaitingForModelComponentProperty.value = idToComponentAddedListenerMap.size > 0;
};

/**
 * Removes the listener from the provided emitter and clears it from the reference Map.
 *
 * @param observerId {number}
 * @param listener {function}
 * @param addOrRemove {'add'|'remove'} - are you removing a listener that was watching for component 'add' or 'remove'?
 */
const removeListenerFromModelChangeEmitter = ( observerId, listener, addOrRemove ) => {
  let emitter;
  let listenerMap;

  if ( addOrRemove === 'add' ) {
    emitter = paperLand.modelComponentAddedEmitter;
    listenerMap = idToComponentAddedListenerMap;
  }
  else {
    emitter = paperLand.modelComponentRemovedEmitter;
    listenerMap = idToComponentRemovedListenerMap;
  }

  emitter.removeListener( listener );

  if ( !listenerMap.has( observerId ) ) {
    boardConsole.error( 'listenerMap does not have provided listener.' );
  }
  else {
    const listeners = listenerMap.get( observerId );
    const index = listeners.indexOf( listener );
    if ( index > -1 ) {
      listeners.splice( index, 1 );

      if ( listeners.length === 0 ) {
        listenerMap.delete( observerId );
      }
    }
    else {
      boardConsole.error( 'listener was not in the array for component' );
    }
  }

  // If there are still any listeners in the 'component added listener map', then the boardModel is in a state where
  // it is waiting for a model component to be added.
  phet.paperLand.isWaitingForModelComponentProperty.value = idToComponentAddedListenerMap.size > 0;
};

/**
 * Add an observer for a model component that is expected to be in the boardModel.
 *
 * When the model exists, handleComponentAttach is called with it and listeners are added to the boardModel to detach
 * when the model component is removed. When the model does not exist (or is removed), listeners are added to the board
 * model to handle when the component is added back again.
 *
 * This supports paper programs that have dependencies on each-other while also allowing them to be added to the
 * view in any order.
 * @param componentName {string} - name of the model component to attach to
 * @param handleComponentAttach {function(component)} - handles attachment to the model component when the component
 *                                                      exists (for example, call `component.link` here)
 * @param handleComponentDetach {function(component)} - handles detachment from the model component when component is
 *                                                      removed (for example, call `component.unlink` here)
 *
 * TODO: Replace implementation by using addMultiModelObserver?
 */
paperLand.addModelObserver = ( componentName, handleComponentAttach, handleComponentDetach ) => {

  // reference to a new identifier so callbacks below use the same value as observerId increments
  const uniqueId = ++observerId; // (get next value before saving reference)

  // Component exists in the model - do whatever work is needed on attach and add listeners to watch for when
  // the component is removed again.
  const handleComponentExists = component => {
    handleComponentAttach( component );

    // store the detach so we can call it when we remove the model observer
    idToComponentDetachMap.set( uniqueId, handleComponentDetach );

    const componentRemovedListener = removedComponentName => {
      if ( componentName === removedComponentName ) {
        handleComponentDoesNotExist( component );
        removeListenerFromModelChangeEmitter( uniqueId, componentRemovedListener, 'remove' );
      }
    };
    addListenerToModelChangeEmitter( uniqueId, componentRemovedListener, 'remove' );
  };
  const handleComponentDoesNotExist = component => {
    if ( component !== undefined ) {
      handleComponentDetach( component );

      // now that it is detached, we don't want to attempt to detach again when we remove the observer
      idToComponentDetachMap.delete( uniqueId );
    }

    const componentAddedListener = ( addedComponentName, addedComponent ) => {
      if ( componentName === addedComponentName ) {
        handleComponentExists( addedComponent );
        removeListenerFromModelChangeEmitter( uniqueId, componentAddedListener, 'add' );
      }
    };
    addListenerToModelChangeEmitter( uniqueId, componentAddedListener, 'add' );
  };

  if ( boardModel.has( componentName ) ) {

    // component already exists in the model, handle it and wait for removal
    handleComponentExists( boardModel.get( componentName ) );
  }
  else {

    // component does not exist yet, wait for it to be added
    handleComponentDoesNotExist();
  }

  return uniqueId;
};

/**
 * When an observer is removed, remove the related listeners that watch for an individual model component add/remove.
 */
const cleanupListenerMaps = observerId => {
  const componentAddedListeners = idToComponentAddedListenerMap.get( observerId );
  if ( componentAddedListeners ) {
    while ( componentAddedListeners.length > 0 ) {
      paperLand.modelComponentAddedEmitter.removeListener( componentAddedListeners.pop() );
    }
    idToComponentAddedListenerMap.delete( observerId );
  }
  const componentRemovedListeners = idToComponentRemovedListenerMap.get( observerId );
  if ( componentRemovedListeners ) {
    while ( componentRemovedListeners.length > 0 ) {
      paperLand.modelComponentRemovedEmitter.removeListener( componentRemovedListeners.pop() );
    }
    idToComponentRemovedListenerMap.delete( observerId );
  }

  // If there are still any listeners in the 'component added listener map', then the boardModel is in a state where
  // it is waiting for a model component to be added.
  phet.paperLand.isWaitingForModelComponentProperty.value = idToComponentAddedListenerMap.size > 0;
};

/**
 * Removes the model observer for the component with the provided name and does some detachment from the model
 * component.
 * @param componentName {string} - name of the model component to stop watching
 * @param observerId {number} - The unique ID returned by addModelObserver, needed to remove internal listeners watching
 *                              for model changes.
 */
paperLand.removeModelObserver = ( componentName, observerId ) => {
  if ( idToComponentDetachMap.has( observerId ) ) {
    if ( !boardModel.has( componentName ) ) {
      boardConsole.error( 'Failure in removeModelObserver. componentName could be incorrect or something else went wrong.' );
    }
    idToComponentDetachMap.get( observerId )( boardModel.get( componentName ) );
    idToComponentDetachMap.delete( observerId );
  }

  cleanupListenerMaps( observerId );
};

/**
 * Add an observer for multiple model components that are expected to exist in the boardModel.
 *
 * When all components exist in the model, handleComponentsAttach is called. When any of the components are removed,
 * handleComponentsDetach is called. Listeners are added to attach and detach when the dependencies are detected and'
 * missing.
 *
 * Returns an ID so that the observer can be removed when necessary.
 *
 * @param {string[]} componentNames - Array of components that are required for attach
 * @param {function} handleComponentsAttach - called when all components exist in the model
 * @param {function} handleComponentsDetach - called when any of the components are removed from the model
 * @return {number}
 */
paperLand.addMultiModelObserver = ( componentNames, handleComponentsAttach, handleComponentsDetach ) => {

  // reference to a new identifier so callbacks below use the same value as observerId increments
  const uniqueId = ++observerId; // (get next value before saving reference)

  // All dependencies exist in the model - do whatever work is needed on attach and add listeners to watch for when
  // a dependency is removed again.
  const handleComponentsExist = components => {
    if ( assert ) {

      // verify that every component is in the model
      const allComponentsExist = componentNames.every( componentName => boardModel.has( componentName ) );
      assert( allComponentsExist, 'All components must exist in the model to add a multi-model observer.' );
    }

    handleComponentsAttach( components );

    // store the detach listener so we can call it when we remove the model observer
    idToComponentDetachMap.set( uniqueId, handleComponentsDetach );

    const componentRemovedListener = removedComponentName => {

      // one of the dependency components was removed, so we need to remove this entire observer
      if ( componentNames.includes( removedComponentName ) ) {
        handleComponentsDoNotExist( components );
        removeListenerFromModelChangeEmitter( uniqueId, componentRemovedListener, 'remove' );
      }
    };
    addListenerToModelChangeEmitter( uniqueId, componentRemovedListener, 'remove' );
  };

  const handleComponentsDoNotExist = components => {
    if ( components !== undefined ) {
      handleComponentsDetach( components );

      // now that it is detached, we don't want to attempt to detach again when we remove the observer
      idToComponentDetachMap.delete( uniqueId );
    }

    const componentAddedListener = ( addedComponentName, addedComponent ) => {

      // if every dependency is in the model, the observer can be added
      if ( componentNames.every( name => boardModel.has( name ) ) ) {
        handleComponentsExist( componentNames.map( name => boardModel.get( name ) ) );
        removeListenerFromModelChangeEmitter( uniqueId, componentAddedListener, 'add' );
      }
    };
    addListenerToModelChangeEmitter( uniqueId, componentAddedListener, 'add' );
  };

  if ( componentNames.every( name => boardModel.has( name ) ) ) {

    // component already exists in the model, handle it and wait for removal
    const components = componentNames.map( name => boardModel.get( name ) );
    handleComponentsExist( components );
  }
  else {

    // component does not exist yet, wait for it to be added
    handleComponentsDoNotExist();
  }

  return uniqueId;
};

/**
 * Removes an observer that is watching for multiple components to exist in the model. If all components
 * exist when the observer is removed, the detachment callback provided to addMultiModelObserver will be called.
 *
 * @param {string[]} componentNames - Array of components that were provided to addMultiModelObserver
 * @param {number} observerId - The unique ID returned by addMultiModelObserver, needed to remove internal listeners.
 */
phet.paperLand.removeMultiModelObserver = ( componentNames, observerId ) => {
  if ( idToComponentDetachMap.has( observerId ) ) {
    const components = componentNames.map( name => boardModel.get( name ) );
    idToComponentDetachMap.get( observerId )( components );
    idToComponentDetachMap.delete( observerId );
  }

  cleanupListenerMaps( observerId );
};

/**
 * Adds a listener to a Property in the boardModel. If the Property does not exist, the listener will be linked
 * as soon as it does. If the Property is removed from the model, the listener will be unlinked, but linked again
 * as soon as the Property is added back to the model.
 * @param componentName {string} - name of the component to observe
 * @param listener - {function(value)} - listener linked to the model Property
 * @returns {number} - An ID that uniquely identifies the listeners added in this link, so they can be removed later.
 */
paperLand.addModelPropertyLink = ( componentName, listener ) => {
  return paperLand.addModelObserver(
    componentName,
    component => {
      if ( !component.link ) {
        boardConsole.error( 'component is not an axon.Property.' );
        throw new Error( 'Model component is not a Property' );
      }
      component.link( listener );
    },
    component => {
      if ( !component.unlink ) {
        boardConsole.error( 'component is not an axon.Property.' );
        throw new Error( 'Model component is not a Property' );
      }
      component.unlink( listener );
    }
  );
};

/**
 * Removes a listener form a Property in the boardModel and stops watching for changes to the boardModel to add/remove
 * the Property listener again when the model Property is added/removed from the boardModel.
 * @param componentName {string} - name of Property to unlink from
 * @param linkId {number} - Unique ID returned by preceding addModelPropertyLink, needed to find listeners to remove
 */
paperLand.removeModelPropertyLink = ( componentName, linkId ) => {
  paperLand.removeModelObserver(
    componentName,
    linkId
  );
};

/**
 * Adds a listener to multiple Properties in the boardModel. If any of the Properties do not exist, the listener will
 * be linked as soon as they do. If any of the Properties are removed from the model, the listener will be unlinked,
 * but linked again as soon as the Property is added back to the model.
 *
 * @param {string[]} componentNames
 * @param {function} listener - the callback for the Multilink
 * @param {Object} providedOptions - options for this call
 * @return {number}
 */
paperLand.addModelPropertyMultilink = ( componentNames, listener, providedOptions ) => {

  const options = phet.phetCore.merge( {

    // If true, the link is added lazily (callbacks are not called until first Property changes)
    lazy: false,

    // Additional Properties to include in the Multilink that may not be associated with the board model.
    otherProperties: [],

    // Additional Properties to include in the addMultiModelObserver but not in the Multilink. This is useful
    // for Properties that are needed in the observer callback, but should NOT be included as dependencies in the
    // Multilink.
    //
    // {string[]} - the list of names for the references
    otherReferences: []
  }, providedOptions );

  let multilink = null;

  // The list of components that are required to exist to create the multilink (Note this is NOT the list
  // of dependencies for the multilink)
  const requiredComponents = [ ...componentNames, ...options.otherReferences ];

  return paperLand.addMultiModelObserver(
    requiredComponents,

    // attach - Attach the multilink when all components exist
    allComponents => {
      if ( !allComponents.every( component => component.link ) ) {
        throw new Error( 'Model component must be an axon.Property for addModelPropertyMultilink' );
      }
      if ( multilink !== null ) {
        throw new Error( 'Multilink already exists.' );
      }

      // Get the list of components to assign to the multilink - this is the list of provided components
      // without the otherReferences
      const boardMultilinkComponents = componentNames.map( name => {
        if ( !boardModel.has( name ) ) {
          throw new Error( 'We are inside the multimodel observer, so all components should exist.' );
        }
        return boardModel.get( name );
      } );

      multilink = new phet.axon.Multilink( [ ...boardMultilinkComponents, ...options.otherProperties ], listener, options.lazy );
    },

    // detach - detach the multilink
    components => {
      if ( !components.every( component => component.link ) ) {
        throw new Error( 'Model component must be an axon.Property for addModelPropertyMultilink' );
      }

      multilink.dispose();
      multilink = null;
    }
  );
};

/**
 * Removes a multilink that was added with addModelPropertyMultilink and stops watching for properties to be added
 * and removed from the model.
 *
 * @param {string[]} componentNames
 * @param {number} linkId
 */
paperLand.removeModelPropertyMultilink = ( componentNames, linkId, providedOptions ) => {

  const options = phet.phetCore.merge( {

    // Additional Properties that were included in the addMultiModelObserver but not in the Multilink.
    // If you added these in the addModelPropertyMultilink, you must provide the same reference names
    // here to fully remove the observer.
    //
    // {string[]} - the list of names for the references
    otherReferences: []
  } );

  const requiredComponents = [ ...componentNames, ...options.otherReferences ];
  paperLand.removeMultiModelObserver(
    requiredComponents,
    linkId
  );
};

/**
 * Returns true if every name in the provided list is currently in the model.
 * @param {string[]} componentNames
 */
paperLand.hasAllModelComponents = componentNames => {
  return componentNames.every( name => boardModel.has( name ) );
};

/**
 * Adds a function that sets a Property value once when the value exists or is added to the model.
 * @param componentName {string} - the name of the component to control
 * @param controllerAttach {function(component)} - called with the component to set its value
 * @param controllerDetach {function(component)} - any work you need to do when the controller or component is removed
 * @returns {number} - Unique ID needed to remove this controller when the model Property is removed.
 */
paperLand.addModelController = ( componentName, controllerAttach, controllerDetach ) => {
  return paperLand.addModelObserver( componentName, controllerAttach, controllerDetach );
};

/**
 * Removes a controller from a model component, and stops watching for the component to be added/removed from the model.
 * @param componentName {string}
 * @param controllerId {number} - value returned by addModelController, to detach internal listeners
 */
paperLand.removeModelController = ( componentName, controllerId ) => {
  paperLand.removeModelObserver( componentName, controllerId );
};

// The amount of time that has elapsed since the board was created, useful in animation.
paperLand.elapsedTimeProperty = new phet.axon.Property( 0 );
phet.axon.stepTimer.addListener( dt => {
  paperLand.elapsedTimeProperty.value = paperLand.elapsedTimeProperty.value + dt;
} );

export default boardModel;