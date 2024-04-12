/**
 * The class for a named ObservableArray that can be created through the Creator interface.
 *
 * It has no value, as the interface does not support populating default arbitrary values. But instances of this class
 * mean that the code generator will set up an observable array which other components can use or be modified
 * by custom code.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedObservableArray extends NamedProperty {
  constructor( name, lengthComponentName, arrayAddedItemReference, arrayRemovedItemReference ) {
    super( name, 'ObservableArray' );

    // The name of the length component that was created for this array. If it still
    // exists when we try to remove this component, we will remove the length component too.
    this.lengthComponentName = lengthComponentName;

    // {NamedArrayItemReference} - the reference to a NamedArrayItem, which the user can refer to to
    // work with the most recently added/removed items.
    this.arrayAddedItemReference = arrayAddedItemReference;
    this.arrayRemovedItemReference = arrayRemovedItemReference;
  }

  save() {
    return {
      name: this.nameProperty.value,
      propertyType: this.propertyType,
      lengthComponentName: this.lengthComponentName,
      arrayAddedItemReferenceName: this.arrayAddedItemReference?.nameProperty.value,
      arrayRemovedItemReferenceName: this.arrayRemovedItemReference?.nameProperty.value
    };
  }
}