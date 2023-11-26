/**
 * The class for a named ObservableArray that can be created through the Creator interface.
 *
 * It has no value, as the interface does not support populating default arbitrary values. But instances of this class
 * mean that the code generator will set up an observable array which other components can use or be modified
 * by custom code.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedObservableArray extends NamedProperty {
  constructor( name ) {
    super( name, 'ObservableArray' );
  }

  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType
    };
  }
}