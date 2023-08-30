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
      whiskerConfiguration: {}
    }, providedOptions );

    super( name, namedProperty, ControlType, controlTypeValue );

    // A collection of data that describes how whiskers will be used to control the Property.
    this.whiskerConfiguration = new WhiskerConfiguration( options.whiskerConfiguration );
  }

  /**
   * Save a JSON representation of this controller for save/load.
   */
  save() {
    return {
      ...super.save(),
      whiskerConfiguration: this.whiskerConfiguration.save()
    };
  }

  /**
   * Define the schema for this controller for form validation and state.
   */
  static getStateSchema() {
    return {
      ...PropertyController.getStateSchema(),
      whiskerConfiguration: WhiskerConfiguration.getStateSchema()
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
      whiskerConfiguration: whiskerConfiguration
    } );
  }

  static ControlType = ControlType;
}