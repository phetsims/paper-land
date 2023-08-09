/**
 * Base class for a type with data to create a component that will control some property.
 */
import Component from '../Component.js';

export default class PropertyController extends Component {

  /**
   * @param {string} name
   * @param {NamedProperty}namedProperty
   * @param {phet.phetCore.Enumeration} controlTypeEnumeration
   * @param {phet.phetCore.EnumerationValue|string} controlTypeValue
   */
  constructor( name, namedProperty, controlTypeEnumeration, controlTypeValue ) {
    super( name );

    // {NamedProperty} that this will control
    this.namedProperty = namedProperty;

    // From React, we might get a string from the EnumerationValue, return to enum first
    controlTypeValue = PropertyController.controlTypeStringToValue( controlTypeValue, controlTypeEnumeration );
    PropertyController.assertEnumerationIncludes( controlTypeEnumeration, controlTypeValue );
    this.controlType = controlTypeValue;
  }

  /**
   * Save the data related to this controller so it can be restored to JSON.
   * @return {{controlType, name: string}}
   */
  save() {
    return {
      name: this.nameProperty.value,
      controlledComponentName: this.namedProperty.nameProperty.value,
      controlType: this.controlType.name
    };
  }

  static controlTypeStringToValue( enumValue, enumeration ) {
    if ( typeof enumValue === 'string' ) {
      return enumeration.enumeration.getValue( enumValue );
    }
    return enumValue;
  }

  static assertEnumerationIncludes( enumeration, value ) {
    assert && assert( enumeration.enumeration.includes( value ), 'Incorrect control type' );
  }

  static getStateSchema() {
    return {
      ...Component.getStateSchema(),
      controlledComponentName: '',
      controlType: ''
    };
  }
}