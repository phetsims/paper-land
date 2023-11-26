import NamedProperty from './NamedProperty.js';

export default class NamedArrayItem extends NamedProperty {
  constructor( name, arrayComponentName, itemSchema ) {
    super( name, 'ArrayItem' );

    this.arrayName = arrayComponentName;

    // Defines the entries of the array item, an array with objects like
    // [ { entryName:'string', componentName: 'string' } ]
    this.itemSchema = itemSchema;
  }

  save() {
    return {
      name: this.nameProperty.value,
      arrayName: this.arrayName,
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