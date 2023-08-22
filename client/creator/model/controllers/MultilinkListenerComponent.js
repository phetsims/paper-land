import Component from '../Component.js';

export default class MultilinkListenerComponent extends Component {
  constructor( name, dependencies, controlledProperties, controlFunctionString ) {
    super( name );

    // The list of Properties that will call the listener upon changing
    this._dependencies = [];

    // The list of names for the dependency NamedProperties.
    this.dependencyNames = [];

    // The list of Properties that the user can change in the listener.
    this._controlledProperties = [];

    // The list of names for the controlled Properties.
    this.controlledPropertyNames = [];

    // {string} - the callback function for the Multilink
    this.controlFunctionString = controlFunctionString;

    // A Multilink that will update the collection of names whenever a dependency changes its name.
    this._dependencyNameChangeMultilink = null;

    // A multilink that will update the list of controlling Properties when one of their names change
    this._controllingPropertyNameChangeMultilink = null;

    this.setDependencies( dependencies );
    this.setControlledProperties( controlledProperties );
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

  /**
   * Set the list of Properties that are controlled by this MultilinkListenerComponent.
   */
  setControlledProperties( controlledProperties ) {
    if ( this._controllingPropertyNameChangeMultilink ) {
      this._controllingPropertyNameChangeMultilink.dispose();
      this._controllingPropertyNameChangeMultilink = null;
    }

    this._controlledProperties = controlledProperties;
    this.updateControlledPropertyNames();

    this._controllingPropertyNameChangeMultilink = phet.axon.Multilink.multilink(
      this._controlledProperties.map( controllingProperty => controllingProperty.nameProperty ),
      () => { this.updateControlledPropertyNames(); }
    );
  }

  /**
   * Updates the list of names of controlled Properties.
   */
  updateControlledPropertyNames() {
    this.controlledPropertyNames = this._controlledProperties.map( controllingProperty => controllingProperty.nameProperty.value );
  }

  save() {
    return {
      name: this.nameProperty.value,
      dependencyNames: this.dependencyNames,
      controlledPropertyNames: this.controlledPropertyNames,
      controlFunctionString: this.controlFunctionString
    };
  }

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