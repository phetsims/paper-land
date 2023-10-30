import PropertyController from './PropertyController.js';

// Ways you can control a BoundsProperty from paper position
class ControlType extends phet.phetCore.EnumerationValue {

  // The bounds will match the size of the paper
  static PAPER_SIZE = new ControlType();

  static enumeration = new phet.phetCore.Enumeration( ControlType );
}

export default class BoundsPropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue ) {
    super( name, namedProperty, ControlType, controlTypeValue );
  }

  static fromData( data, namedProperties ) {

    // find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.nameProperty.value === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    return new BoundsPropertyController( data.name, namedProperty, data.controlType );
  }

  static ControlType = ControlType;
}