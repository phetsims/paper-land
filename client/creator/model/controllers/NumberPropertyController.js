import PropertyController from './PropertyController.js';

// Ways you can control a Boolean from paper events
class NumberPropertyControlType extends phet.phetCore.EnumerationValue {

  // Paper motion control types
  static HORIZONTAL = new NumberPropertyControlType();
  static VERTICAL = new NumberPropertyControlType();
  static ROTATION = new NumberPropertyControlType();

  // Marker control types
  // the number of markers on THIS paper
  static MARKER_COUNT = new NumberPropertyControlType();

  // the position of a marker on this paper, you can use the marker like a slider thumb - only one
  // marker per paper
  static MARKER_LOCATION = new NumberPropertyControlType();

  // the number of markers detected on all papers
  static GLOBAL_MARKER_COUNT = new NumberPropertyControlType();

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
    NumberPropertyControlType.GLOBAL_MARKER_COUNT,
    NumberPropertyControlType.MARKER_LOCATION
  ]
};

const MARKER_COLORS = [
  'all',
  'red',
  'green',
  'blue',
  'black'
];

export default class NumberPropertyController extends PropertyController {
  constructor( name, namedProperty, controlTypeValue, relationshipControlTypeValue, providedOptions ) {

    const options = phet.phetCore.merge( {

      // One of MARKER_COLORS - Only this selected color will be used to control the value
      // when using marker control types
      markerColor: 'all'
    }, providedOptions );

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

    this.markerColor = options.markerColor;
  }

  /**
   * Save the data related to this controller so it can be restored to JSON.
   * @return {{controlType, name: string}}
   */
  save() {

    // Make sure that the control type is a valid value for the NumberPropertyController.
    const superSave = super.save();
    if ( !NumberPropertyControlType.enumeration.getValue( superSave.controlType ) ) {
      throw new Error( `There is an incorrect value in the control type for ${this.nameProperty.value}. Please contact the developer. You can try re-creating the controller.` );
    }

    return {
      ...superSave,
      markerColor: this.markerColor,

      // will only be defined for 'PAPER_MOVEMENT'
      relationshipControlType: this.relationshipControlType ? this.relationshipControlType.name : null
    };
  }

  static getStateSchema() {
    return {
      ...PropertyController.getStateSchema(),
      relationshipControlType: '',

      // a type specific default needs to be provided
      controlTypeFamily: 'PAPER_MOVEMENT',
      markerColor: 'all'
    };
  }

  static fromData( data, namedProperties ) {

    // Find the NamedProperty that this controller will control
    const namedProperty = namedProperties.find( namedProperty => namedProperty.nameProperty.value === data.controlledComponentName );
    if ( !namedProperty ) {
      throw new Error( `Could not find named property with name: ${data.controlledComponentName}` );
    }

    return new NumberPropertyController( data.name, namedProperty, data.controlType, data.relationshipControlType, {
      markerColor: data.markerColor
    } );
  }

  static NumberPropertyControlType = NumberPropertyControlType;
  static RelationshipControlType = RelationshipControlType;
  static FAMILY_TO_CONTROL_TYPE_MAP = FamilyToControlTypeMap;
  static MARKER_COLORS = MARKER_COLORS;
}