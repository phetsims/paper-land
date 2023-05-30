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

  static ControlType = ControlType;
}