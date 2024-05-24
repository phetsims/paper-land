import { renameVariableInCode } from '../../../utils.js';
import Component from '../Component.js';
import ListenerComponent from './ListenerComponent.js';

export default class MultilinkListenerComponent extends ListenerComponent {
  constructor( name, dependencies, controlledProperties, controlFunctionString, providedOptions ) {

    const options = _.merge( {

      // List of components by name that will connect with a reference - this means that when the component
      // changes, it will not re-trigger the listener control function, but the component will be available
      // to reference in the control function.
      referenceComponentNames: []
    }, providedOptions );

    super( name, controlledProperties, controlFunctionString );

    // The list of Properties that may call the listener upon changing. This is the collection of all dependencies,
    // but some may be used as references (won't actually trigger a listener, but will be available in a control
    // function).
    this._dependencies = [];

    // The list of names for the dependency NamedProperties.
    this.dependencyNames = [];

    this.referenceComponentNames = options.referenceComponentNames;

    // Updates the list of names for dependencies and the control function string if any name changes.
    this.boundUpdateDependencyPropertyNames = this.updateDependencyNames.bind( this );

    // A map of components to their removal listeners. Used to remove components when they are deleted, and also
    // remove the listeners that are associated with them to prevent memory leaks.
    this.removeListenerMap = new Map();

    this.setDependencies( dependencies );
    this.setReferenceComponentNames( options.referenceComponentNames || [] );
  }

  /**
   * Set the list of dependency Properties for this MultilinkListenerComponent. These are
   * the Properties that will trigger the callback when they change.
   */
  setDependencies( dependencies ) {

    // remove any listeners from the old dependencies
    this._dependencies.forEach( dependency => {
      if ( dependency.nameProperty.hasListener( this.boundUpdateDependencyPropertyNames ) ) {
        dependency.nameProperty.unlink( this.boundUpdateDependencyPropertyNames );
      }
      if ( this.removeListenerMap.has( dependency ) ) {
        dependency.deleteEmitter.removeListener( this.removeListenerMap.get( dependency ) );
        this.removeListenerMap.delete( dependency );
      }
    } );

    // update references
    this._dependencies = dependencies;
    this.updateDependencyNames();

    // If any of the reference components are no longer in the list of dependencies, remove them
    this.referenceComponentNames = this.referenceComponentNames.filter( name => {
      return this.dependencyNames.includes( name );
    } );

    // add listener to the dependency names so that custom code will automatically update if a name changes
    dependencies.forEach( dependency => {
      dependency.nameProperty.link( this.boundUpdateDependencyPropertyNames );

      // to remove the listener if it is deleted
      const removalListener = () => {
        this.removeComponentOnDelete( dependency );
      };
      dependency.deleteEmitter.addListener( removalListener );
      this.removeListenerMap.set( dependency, removalListener );
    } );
  }

  /**
   * When a component is deleted,
   */
  removeComponentOnDelete( component ) {
    const newDependencies = this._dependencies.filter( modelComponent => modelComponent !== component );
    this.setDependencies( newDependencies );
  }

  /**
   * Update the list of names for dependencies. They may change individually
   * or be set later.
   */
  updateDependencyNames( newName, oldName ) {
    this.dependencyNames = this._dependencies.map( dependency => dependency.nameProperty.value );

    // if the old name is in the list of reference components, we need to update the reference component names
    // as well
    if ( oldName && this.referenceComponentNames.includes( oldName ) ) {
      const indexOfOldName = this.referenceComponentNames.indexOf( oldName );
      this.referenceComponentNames[ indexOfOldName ] = newName;
    }

    if ( newName && oldName && this.controlFunctionString ) {
      this.controlFunctionString = renameVariableInCode( this.controlFunctionString, newName, oldName );
    }
  }

  /**
   * Set the list of components that will be used as references, instead of "dependencies". When these components
   * change, they will not trigger the listener, but they will be available in the control function.
   */
  setReferenceComponentNames( referenceComponentNames ) {

    // Make sure that the reference components are in the list of dependencies
    referenceComponentNames.forEach( referenceComponentName => {
      assert && assert( this.dependencyNames.includes( referenceComponentName ), 'Reference component must be in the list of dependencies' );
    } );

    this.referenceComponentNames = referenceComponentNames;
  }

  save() {
    return {
      ...super.save(),
      dependencyNames: this.dependencyNames,
      referenceComponentNames: this.referenceComponentNames,
      controlFunctionString: this.controlFunctionString
    };
  }

  /**
   * Creates a new MultilinkListenerComponent from a serialized state.
   */
  static fromData( data, namedProperties ) {
    const dependencies = Component.findComponentsByName( namedProperties, data.dependencyNames );
    if ( dependencies.length < 1 ) {
      throw new Error( 'Could not find dependencies for MultilinkController.' );
    }

    const controlledProperties = Component.findComponentsByName( namedProperties, data.controlledPropertyNames );
    if ( controlledProperties.length < 1 ) {
      throw new Error( 'Could not find controlled properties for MultilinkController.' );
    }

    return new MultilinkListenerComponent( data.name, dependencies, controlledProperties, data.controlFunctionString, {
      referenceComponentNames: data.referenceComponentNames
    } );
  }

  static getStateSchema() {
    return {
      ...ListenerComponent.getStateSchema(),
      referenceComponentNames: [],
      dependencyNames: []
    };
  }
}