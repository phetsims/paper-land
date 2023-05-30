/**
 * Base class for a type with data to create a component that will control some property.
 */

export default class PropertyController {

  /**
   * @param {string} name
   * @param {NamedProperty}namedProperty
   * @param {phet.phetCore.Enumeration} controlTypeEnumeration
   * @param {phet.phetCore.EnumerationValue|string} controlTypeValue
   */
  constructor( name, namedProperty, controlTypeEnumeration, controlTypeValue ) {

    // {string} The name of this controller
    this.name = name;

    // {NamedProperty} that this will control
    this.namedProperty = namedProperty;

    // {Emitter} emits an event when it is time for this controller to be deleted
    this.deleteEmitter = new phet.axon.Emitter();

    // From React, we might get a string from the EnumerationValue, return to enum first
    controlTypeValue = PropertyController.controlTypeStringToValue( controlTypeValue, controlTypeEnumeration );
    PropertyController.assertEnumerationIncludes( controlTypeEnumeration, controlTypeValue );
    this.controlType = controlTypeValue;
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
}