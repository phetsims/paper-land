/**
 * This is a model component that keeps a reference to a single instance of a NamedArrayItem in a NamedObservableArray.
 */

import NamedProperty from './NamedProperty.js';

export default class NamedArrayItemReference extends NamedProperty {
  constructor( name ) {
    super( name, 'NamedArrayItemReference' );
  }

  save() {
    return {
      name: this.nameProperty.value
    };
  }

  static getStateSchema() {
    return {
      arrayName: ''
    };
  }
}