/**
 * A named Vector2Property, with an implementation for saving and loading from state.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedVector2Property extends NamedProperty {
  constructor( name, x, y ) {
    super( name, 'Vector2Property' );

    this.defaultX = x;
    this.defaultY = y;
  }

  /**
   * Save state to JSON for saving to database.
   * @return {{defaultValue, propertyType, name: string, value: unknown}}
   */
  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      defaultX: this.defaultX,
      defaultY: this.defaultY
    };
  }

  /**
   * Return an initial serialized state for a NamedVector2Property, to validate objects as we work
   * with data related to this type and to initialize forms.
   */
  static getStateSchema() {
    return {
      defaultX: 0,
      defaultY: 0
    };
  }
}