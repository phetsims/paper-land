import Component from '../Component.js';
import ListenerComponent from './ListenerComponent.js';

export default class MultilinkListenerComponent extends ListenerComponent {
  constructor( name, dependencies, controlledProperties, controlFunctionString ) {
    super( name, controlledProperties, controlFunctionString );

    // The list of Properties that will call the listener upon changing
    this._dependencies = [];

    // The list of names for the dependency NamedProperties.
    this.dependencyNames = [];

    // A Multilink that will update the collection of names whenever a dependency changes its name.
    this._dependencyNameChangeMultilink = null;

    this.setDependencies( dependencies );
  }

  /**
   * Set the list of dependency Properties for this MultilinkListenerComponent. These are
   * the Properties that will trigger the callback when they change.
   */
  setDependencies( dependencies ) {
    if ( this._dependencyNameChangeMultilink ) {
      this._dependencyNameChangeMultilink.dispose();
      this._dependencyNameChangeMultilink = null;
    }

    this._dependencies = dependencies;
    this.updateDependencyNames();

    this._dependencyNameChangeMultilink = phet.axon.Multilink.multilink(
      this._dependencies.map( dependency => dependency.nameProperty ),
      () => { this.updateDependencyNames(); }
    );
  }

  /**
   * Update the list of names for dependencies. They may change individually
   * or be set later.
   */
  updateDependencyNames() {
    this.dependencyNames = this._dependencies.map( dependency => dependency.nameProperty.value );
  }

  save() {
    return {
      ...super.save(),
      dependencyNames: this.dependencyNames,
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

    return new MultilinkListenerComponent( data.name, dependencies, controlledProperties, data.controlFunctionString );
  }

  static getStateSchema() {
    return {
      name: '',
      dependencyNames: [],
      controlledPropertyNames: [],
      controlFunctionString: ''
    };
  }
}