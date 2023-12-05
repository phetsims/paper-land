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

    // The name of the lenth coponent that was created for this array. If it still
    // exists when we try to remove this component, we will remove the length component too.
    this.lengthComponentName = '';
  }

  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      lengthComponentName: this.lengthComponentName
    };
  }

  /**
   * Load state from JSON.
   */
  load( stateObject ) {
    super.load( stateObject );
    this.lengthComponentName = stateObject.lengthComponentName;
  }
}