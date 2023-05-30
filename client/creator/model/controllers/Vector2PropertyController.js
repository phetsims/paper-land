import PropertyController from './PropertyController.js';

// Ways you can control a Vector2Property from paper position
class ControlType extends phet.phetCore.EnumerationValue {

  // Sets the Vector2Property to be the same as the paper position (with transforms)
  static MATCH_CENTER = new ControlType();

  // Sets the Vector2Property x value to be the same as the paper's x value (with transforms)
  static MATCH_X = new ControlType();

  // Sets the Vector2Property y value to be the same as the paper's y value (with transforms)
  static MATCH_Y = new ControlType();

  static enumeration = new phet.phetCore.Enumeration( ControlType );
}

export default class Vector2PropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue ) {
    super( name, namedProperty, ControlType, controlTypeValue );
  }

  static ControlType = ControlType;
}