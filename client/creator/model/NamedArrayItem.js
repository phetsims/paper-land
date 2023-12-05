import NamedProperty from './NamedProperty.js';

export default class NamedArrayItem extends NamedProperty {
  constructor( name, arrayComponent, itemSchema ) {
    super( name, 'ArrayItem' );

    this.arrayComponent = arrayComponent;

    // Defines the entries of the array item, an array with objects like
    // [ { entryName:'string', componentName: 'string' } ]
    this.itemSchema = itemSchema;
  }

  save() {
    return {
      name: this.nameProperty.value,
      arrayName: this.arrayComponent.nameProperty.value,
      itemSchema: this.itemSchema
    };
  }

  static getStateSchema() {
    return {
      itemSchema: [],
      arrayName: ''
    };
  }
}