/**
 * A named DerivedProperty, with an implementation for saving and loading from state.
 */

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

    this.setDependencies( dependencies );
  }

  setDependencies( dependencies ) {
    if ( this._nameChangeMultilink ) {
      this._nameChangeMultilink.dispose();
      this._nameChangeMultilink = null;
    }

    this._dependencies = dependencies;
    this.updateDependencyNames();

    this._nameChangeMultilink = phet.axon.Multilink.multilink(
      this._dependencies.map( dependency => dependency.nameProperty ),
      () => { this.updateDependencyNames(); }
    );
  }

  updateDependencyNames() {
    this.dependencyNames = this._dependencies.map( dependency => dependency.nameProperty.value );
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