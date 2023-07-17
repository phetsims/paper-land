import PropertyController from './PropertyController.js';

// Ways you can control a Boolean from paper position
class ControlType extends phet.phetCore.EnumerationValue {

  // The boolean value is true when the program has a marker in it.
  static MARKER = new ControlType();

  // The boolean value is true when the paper is rotated 90 degrees.
  static ROTATION = new ControlType();

  static enumeration = new phet.phetCore.Enumeration( ControlType );
}

export default class BooleanPropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue ) {
    super( name, namedProperty, ControlType, controlTypeValue );
  }

  static fromData( data, namedProperties ) {

    // Find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.nameProperty.value === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    return new BooleanPropertyController( data.name, namedProperty, data.controlType );
  }

  static ControlType = ControlType;
}