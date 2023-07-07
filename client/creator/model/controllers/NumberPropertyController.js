import PropertyController from './PropertyController.js';

// Ways you can control a Boolean from paper events
class DirectionControlType extends phet.phetCore.EnumerationValue {

  // Moving paper left and right controls the value.
  static HORIZONTAL = new DirectionControlType();

  // Moving paper up and down controls the value.
  static VERTICAL = new DirectionControlType();

  // Rotating the paper controls the value.
  static ROTATION = new DirectionControlType();

  static enumeration = new phet.phetCore.Enumeration( DirectionControlType );
}

// Relationships for the control
class RelationshipControlType extends phet.phetCore.EnumerationValue {

  // Value is controlled linearly across the range as the paper moves in the defined direction
  static LINEAR = new RelationshipControlType();

  // Value changes exponentially as the paper moves in the defined direction
  static EXPONENTIAL = new RelationshipControlType();

  // Value changes in a logarithmic relationship as paper moves in the defined direction
  static LOGARITHMIC = new RelationshipControlType();

  static enumeration = new phet.phetCore.Enumeration( RelationshipControlType );
}

export default class NumberPropertyController extends PropertyController {
  constructor( name, namedProperty, directionControlTypeValue, relationshipControlTypeValue ) {
    super( name, namedProperty, DirectionControlType, directionControlTypeValue );

    // Convert back to enumeration value if React forms gave us a string
    relationshipControlTypeValue = PropertyController.controlTypeStringToValue( relationshipControlTypeValue, RelationshipControlType );
    PropertyController.assertEnumerationIncludes( RelationshipControlType, relationshipControlTypeValue );
    this.relationshipControlType = relationshipControlTypeValue;
  }

  /**
   * Save the data related to this controller so it can be restored to JSON.
   * @return {{controlType, name: string}}
   */
  save() {
    return {
      name: this.name,
      controlledComponentName: this.namedProperty.name,
      controlType: this.controlType.name,
      relationshipControlType: this.relationshipControlType.name
    };
  }

  static fromData( data, namedProperties ) {

    // Find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.name === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    return new NumberPropertyController( data.name, namedProperty, data.controlType, data.relationshipControlType );
  }

  static DirectionControlType = DirectionControlType;
  static RelationshipControlType = RelationshipControlType;
}