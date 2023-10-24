import PropertyController from './PropertyController.js';

// Ways you can control a Boolean from paper events
class NumberPropertyControlType extends phet.phetCore.EnumerationValue {

  // Paper motion control types
  static HORIZONTAL = new NumberPropertyControlType();
  static VERTICAL = new NumberPropertyControlType();
  static ROTATION = new NumberPropertyControlType();

  // Marker control types
  static MARKER_COUNT = new NumberPropertyControlType();
  static MARKER_LOCATION = new NumberPropertyControlType();

  static enumeration = new phet.phetCore.Enumeration( NumberPropertyControlType );
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

const FamilyToControlTypeMap = {
  PAPER_MOVEMENT: [
    NumberPropertyControlType.HORIZONTAL,
    NumberPropertyControlType.VERTICAL,
    NumberPropertyControlType.ROTATION
  ],
  MARKERS: [
    NumberPropertyControlType.MARKER_COUNT,
    NumberPropertyControlType.MARKER_LOCATION
  ]
};

// controlType - one of NumberPropertyControlType
// selectedControlTypeFamily - one of 'PAPER_MOVEMENT' or 'MARKERS'
// relationshipControlType - one of RelationshipControlType


export default class NumberPropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue, relationshipControlTypeValue ) {

    // Convert back to enumeration value if React forms gave us a string
    relationshipControlTypeValue = PropertyController.controlTypeStringToValue( relationshipControlTypeValue, RelationshipControlType );

    // get the control type family from teh provided control type

    // only PAPER_MOVEMENT has relationship control types, so check for that one first and fall back to MARKERS -
    // convert to strings in case the value comes in from a React form
    const paperMovementControlTypesAsStrings = FamilyToControlTypeMap.PAPER_MOVEMENT.map( controlType => controlType.name );
    const controlTypeFamily = paperMovementControlTypesAsStrings.includes( controlTypeValue.toString() ) ? 'PAPER_MOVEMENT' : 'MARKERS';

    super( name, namedProperty, NumberPropertyControlType, controlTypeValue, controlTypeFamily );

    // {RelationshipControlType|null} This may not be defined depending on the control type family
    this.relationshipControlType = relationshipControlTypeValue || null;
  }

  /**
   * Save the data related to this controller so it can be restored to JSON.
   * @return {{controlType, name: string}}
   */
  save() {
    return {
      ...super.save(),

      // will only be defined for 'PAPER_MOVEMENT'
      relationshipControlType: this.relationshipControlType ? this.relationshipControlType.name : null
    };
  }

  static getStateSchema() {
    return {
      ...PropertyController.getStateSchema(),
      relationshipControlType: '',

      // a type specific default needs to be provided
      controlTypeFamily: 'PAPER_MOVEMENT'
    };
  }

  static fromData( data, namedProperties ) {

    // Find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.nameProperty.value === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    return new NumberPropertyController( data.name, namedProperty, data.controlType, data.relationshipControlType );
  }

  static NumberPropertyControlType = NumberPropertyControlType;
  static RelationshipControlType = RelationshipControlType;
  static FAMILY_TO_CONTROL_TYPE_MAP = FamilyToControlTypeMap;
}