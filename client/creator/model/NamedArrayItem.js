import Component from './Component.js';
import NamedProperty from './NamedProperty.js';

export default class NamedArrayItem extends NamedProperty {
  constructor( name, arrayComponent, itemSchema ) {
    super( name, 'ArrayItem' );

    // @param {NamedObservableArray|null} arrayComponent - the array that this item belongs to. This may be null.
    // Creator allows it but code generation will fail.
    this.arrayComponent = arrayComponent;

    // Defines the entries of the array item, an array with objects like
    // [ { entryName:'string', component: NamedProperty } ]
    this.itemSchema = itemSchema;
  }

  save() {

    // Just grab the name of the component in the schema to save
    const serializedSchema = this.itemSchema.map( entry => {
      return {
        entryName: entry.entryName,
        componentName: entry.component.nameProperty.value
      };
    } );

    return {
      name: this.nameProperty.value,

      // The array name may be undefined if the user manually deletes it.
      arrayName: this.arrayComponent ? this.arrayComponent.nameProperty.value : '',
      itemSchema: serializedSchema
    };
  }

  /**
   * Given a serialized schema state, return an actual schema with references to Components needed
   * to instantiate an instance of a NamedArrayItem. This is used when loading a NamedArrayItem,
   * constructing one, and saving changes. Form data and serialized NamedArrayItems just have
   * the name of the component, not a reference to the actual component.
   *
   * @param itemSchemaWithStrings
   * @param allModelComponents
   * @return {*}
   */
  static getSchemaWithComponents( itemSchemaWithStrings, allModelComponents ) {
    const realSchema = itemSchemaWithStrings.map( entry => {
      const component = Component.findComponentsByName( allModelComponents, [ entry.componentName ] )[ 0 ];
      return {
        entryName: entry.entryName,
        component: component
      };
    } );
    assert && assert( realSchema.length === itemSchemaWithStrings.length, 'Could not find all components for array item.' );

    return realSchema;
  }

  static getStateSchema() {
    return {
      itemSchema: [],
      arrayName: ''
    };
  }
}