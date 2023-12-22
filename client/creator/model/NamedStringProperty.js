/**
 * A model component that you can create in Creator. It represents a string for contants, descriptions, or
 * other string values.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedStringProperty extends NamedProperty {
  constructor( name, defaultValue ) {
    super( name, 'StringProperty' );

    this.defaultValue = defaultValue;
  }

  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      defaultValue: this.defaultValue
    };
  }

  static getStateSchema() {
    return {
      defaultValue: ''
    };
  }
}