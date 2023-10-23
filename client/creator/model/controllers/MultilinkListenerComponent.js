import { renameVariableInCode } from '../../../utils.js';
import Component from '../Component.js';
import ListenerComponent from './ListenerComponent.js';

export default class MultilinkListenerComponent extends ListenerComponent {
  constructor( name, dependencies, controlledProperties, controlFunctionString ) {
    super( name, controlledProperties, controlFunctionString );

    // The list of Properties that will call the listener upon changing
    this._dependencies = [];

    // The list of names for the dependency NamedProperties.
    this.dependencyNames = [];

    // Updates the list of names for dependencies and the control function string if any name changes.
    this.boundUpdateDependencyPropertyNames = this.updateDependencyNames.bind( this );

    this.setDependencies( dependencies );
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
    } );

    // update references
    this._dependencies = dependencies;
    this.updateDependencyNames();

    // add listener to the dependency names so that custom code will automatically update if a name changes
    dependencies.forEach( dependency => {
      dependency.nameProperty.link( this.boundUpdateDependencyPropertyNames );
    } );
  }

  /**
   * Update the list of names for dependencies. They may change individually
   * or be set later.
   */
  updateDependencyNames( newName, oldName ) {
    this.dependencyNames = this._dependencies.map( dependency => dependency.nameProperty.value );

    if ( newName && oldName && this.controlFunctionString ) {
      this.controlFunctionString = renameVariableInCode( this.controlFunctionString, newName, oldName );
    }
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
      ...ListenerComponent.getStateSchema(),
      dependencyNames: []
    };
  }
}