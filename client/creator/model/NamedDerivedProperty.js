/**
 * A named DerivedProperty, with an implementation for saving and loading from state.
 */

import { renameVariableInCode } from '../../utils.js';
import NamedProperty from './NamedProperty.js';

export default class NamedDerivedProperty extends NamedProperty {
  constructor( name, dependencies, derivation ) {
    super( name, 'DerivedProperty' );

    this._dependencies = dependencies;

    // {string[]} - the list of names for the derivations
    this.dependencyNames = [];

    // {string} - the function for the DerivedProperty
    this.derivation = derivation;

    // A Multilink that will update the collection of names whenever a dependency changes its name.
    this._nameChangeMultilink = null;

    // A map of dependency components to their removal listeners. Used to remove dependencies from the
    // list when it is deleted. Also used to remove the listeners that are associated with them to prevent
    // memory leaks.
    this.dependencyComponentListenerMap = new Map();

    // A single listener that updates the derivation to use new variable names whenever a dependency name changes.
    this.boundUpdateDependencyNames = this.updateDependencyNames.bind( this );

    this.setDependencies( dependencies );
  }

  /**
   * Set the list of dependencies for this DerivedProperty.
   * @param dependencies
   */
  setDependencies( dependencies ) {
    this._dependencies.forEach( dependency => {
      if ( dependency.nameProperty.hasListener( this.boundUpdateDependencyNames ) ) {
        dependency.nameProperty.unlink( this.boundUpdateDependencyNames );
      }
      if ( this.dependencyComponentListenerMap.has( dependency ) ) {
        dependency.deleteEmitter.removeListener( this.dependencyComponentListenerMap.get( dependency ) );
        this.dependencyComponentListenerMap.delete( dependency );
      }
    } );

    // update references
    this._dependencies = dependencies;
    this.updateDependencyNames();

    // link to new dependencies
    dependencies.forEach( dependency => {
      dependency.nameProperty.link( this.boundUpdateDependencyNames );

      const removalListener = () => {
        this.removeDependencyOnDelete( dependency );

      };
      dependency.deleteEmitter.addListener( removalListener );
      this.dependencyComponentListenerMap.set( dependency, removalListener );
    } );
  }

  /**
   * When a dependency is deleted, it should be removed from this component's list of dependencies. This is
   * called on the dependency's deleteEmitter.
   */
  removeDependencyOnDelete( dependency ) {
    const newDependencies = this._dependencies.filter( modelComponent => modelComponent !== dependency );
    this.setDependencies( newDependencies );
  }

  updateDependencyNames( newName, oldName ) {
    this.dependencyNames = this._dependencies.map( dependency => dependency.nameProperty.value );

    if ( newName && oldName && this.derivation ) {
      this.derivation = renameVariableInCode( this.derivation, newName, oldName );
    }
  }

  /**
   * Save state to JSON for saving to database.
   * @return {{name: string, propertyType: string, dependencyNames: string[], derivation: string}}
   */
  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      dependencyNames: this.dependencyNames,
      derivation: this.derivation
    };
  }

  static getStateSchema() {
    return {
      dependencyNames: [],
      derivation: ''
    };
  }
}