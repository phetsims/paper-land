/**
 * A named NumberProperty, with an implementation for saving and loading from state.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedNumberProperty extends NamedProperty {
  constructor( name, min, max, defaultValue ) {
    super( name, 'NumberProperty' );

    this.min = min;
    this.max = max;
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
      min: this.min,
      max: this.max,
      defaultValue: this.defaultValue
    };
  }
}