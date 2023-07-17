/**
 * A named BooleanProperty, with an implementation for saving and loading from state.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedBooleanProperty extends NamedProperty {
  constructor( name, defaultValue ) {
    super( name, 'BooleanProperty' );
    this.defaultValue = defaultValue;
  }

  /**
   * Save state to JSON for saving to database.
   * @return {{defaultValue, propertyType, name: string}}
   */
  save() {
    return {
      name: this.nameProperty.value,
      defaultValue: this.defaultValue,
      propertyType: this.propertyType
    };
  }
}