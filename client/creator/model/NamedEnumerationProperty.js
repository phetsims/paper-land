/**
 * A named NumberProperty, with an implementation for saving and loading from state.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedEnumerationProperty extends NamedProperty {
  constructor( name, values, defaultValue ) {
    super( name, 'NumberProperty' );

    this.values = values;
    this.defaultValue = defaultValue;
  }

  /**
   * Save state to JSON for saving to database.
   * @return {{defaultValue, propertyType, name: string, defaultValue: unknown}}
   */
  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      defaultValue: this.defaultValue,
      values: this.values
    };
  }
}