import PropertyController from './PropertyController.js';

// Ways you can control an Enumeration Property from paper events.
class ControlType extends phet.phetCore.EnumerationValue {

  // Markers added to the program will cycle through values.
  static MARKERS = new ControlType();

  // Will cycle through values as the paper rotates.
  static ROTATION = new ControlType();

  static enumeration = new phet.phetCore.Enumeration( ControlType );
}

export default class EnumerationPropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue ) {
    super( name, namedProperty, ControlType, controlTypeValue );
  }

  /**
   *
   * @param data
   * @param namedProperties
   * @return {EnumerationPropertyController}
   */
  static fromData( data, namedProperties ) {

    // Find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.nameProperty.value === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    return new EnumerationPropertyController( data.name, namedProperty, data.controlType );
  }

  static ControlType = ControlType;
}