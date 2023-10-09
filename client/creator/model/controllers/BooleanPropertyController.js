import PropertyController from './PropertyController.js';
import WhiskerConfiguration from './WhiskerConfiguration.js';

// Ways you can control a Boolean from paper position
class ControlType extends phet.phetCore.EnumerationValue {

  // The boolean value is true when the program has a marker in it.
  static MARKER = new ControlType();

  // The boolean value is true when the paper is rotated 90 degrees.
  static ROTATION = new ControlType();

  // The boolean value is true when the paper is close to another.
  static WHISKER = new ControlType();

  static enumeration = new phet.phetCore.Enumeration( ControlType );
}

export default class BooleanPropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue, providedOptions ) {

    const options = _.merge( {

      // A collection of data that describes how whiskers will be used to control the Property.
      whiskerConfiguration: {},

      // If the control type is 'Marker', this is the color of the marker that will control the property.
      // Values can be 'red', 'green', 'blue', 'black', or empty (for all colors).
      markerColor: ''
    }, providedOptions );

    super( name, namedProperty, ControlType, controlTypeValue );

    this.whiskerConfiguration = new WhiskerConfiguration( options.whiskerConfiguration );
    this.markerColor = options.markerColor;
  }

  /**
   * Save a JSON representation of this controller for save/load.
   */
  save() {
    return {
      ...super.save(),
      whiskerConfiguration: this.whiskerConfiguration.save(),
      markerColor: this.markerColor
    };
  }

  /**
   * Define the schema for this controller for form validation and state.
   */
  static getStateSchema() {
    return {
      ...PropertyController.getStateSchema(),
      whiskerConfiguration: WhiskerConfiguration.getStateSchema(),
      markerColor: ''
    };
  }

  /**
   * Create an instance of this controller from a JSON representation.
   */
  static fromData( data, namedProperties ) {

    // Find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.nameProperty.value === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    const whiskerConfiguration = WhiskerConfiguration.fromData( data.whiskerConfiguration || {} );
    return new BooleanPropertyController( data.name, namedProperty, data.controlType, {
      whiskerConfiguration: whiskerConfiguration,
      markerColor: data.markerColor || ''
    } );
  }

  static ControlType = ControlType;
}