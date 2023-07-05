/**
 * A named DerivedProperty, with an implementation for saving and loading from state.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedDerivedProperty extends NamedProperty {
  constructor( name, dependencies, derivation ) {
    super( name, 'DerivedProperty' );

    // {string[]} - the list of names for the derivations
    this.dependencyPropertyNames = dependencies.map( dependency => dependency.name );

    // {string} - the function for the DerivedProperty
    this.derivation = derivation;
  }

  /**
   * Save state to JSON for saving to database.
   * @return {{name: string, propertyType: string, dependencyPropertyNames: string[], derivation: string}}
   */
  save() {
    return {
      name: this.name,
      propertyType: this.propertyType,
      dependencyPropertyNames: this.dependencyPropertyNames,
      derivation: this.derivation
    };
  }
}