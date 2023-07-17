/**
 * A named DerivedProperty, with an implementation for saving and loading from state.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedDerivedProperty extends NamedProperty {
  constructor( name, dependencies, derivation ) {
    super( name, 'DerivedProperty' );

    // {string[]} - the list of names for the derivations
    this.dependencyNames = dependencies.map( dependency => dependency.nameProperty.value );

    // {string} - the function for the DerivedProperty
    this.derivation = derivation;
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
}