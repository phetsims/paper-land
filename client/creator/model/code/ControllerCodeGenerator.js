/**
 * A collection of functions that take data and controller name types and turns them into
 * code for the controller sections of code in the program templates.
 */
import BooleanPropertyController from '../controllers/BooleanPropertyController.js';
import NumberPropertyController from '../controllers/NumberPropertyController.js';

// A unique identifier that we can apply to variables to make sure that generated variables have unique names.
let uniqueId = 0;

class ControllerCodeGenerator {


  /**
   * Returns a bit of code that will set a model Property value in controller code, with a check first
   * that makes sure the model component is available. A unique ID is assigned to variables to make sure that
   * variable names are unique if this code is used multiple times in the same scope.
   * @param controlledName - name of the component this code will control
   * @param createComputeValueCode - Creates a function, with the generated uniquely identified model component name
   *                                 that computes the value for the model Property. The resultant value is set to the
   *                                 model component.
   *                                 ** Do not include the `component.value =` part of the code. **
   *                                 ** Do not include a semicolon. **
   * @return {string}
   */
  static getModelControllerCode( controlledName, createComputeValueCode ) {
    const modelPropertyName = `modelProperty${uniqueId++}`;
    const computeValueCode = createComputeValueCode( modelPropertyName );

    return `
    const ${modelPropertyName} = phet.paperLand.getModelComponent( '${controlledName}' );
    if ( ${modelPropertyName} ) {
      ${modelPropertyName}.value = ${computeValueCode};
    }`;
  }

  static getNumberControllerChangedPositionCode( directionControlType, relationshipControlType, controlledName ) {
    if ( relationshipControlType !== NumberPropertyController.RelationshipControlType.LINEAR ) {
      throw new Error( `Sorry, only linear relationships are supported at this time. Can't generate code for ${relationshipControlType} control of ${controlledName}.` );
    }

    const calculateValueCode = directionControlType === NumberPropertyController.DirectionControlType.ROTATION ? 'phet.paperLand.utils.getNormalizedProgramRotation( points )' :
                               directionControlType === NumberPropertyController.DirectionControlType.VERTICAL ? '( 1 - phet.paperLand.utils.getProgramCenter( points ).y )' :
                               directionControlType === NumberPropertyController.DirectionControlType.HORIZONTAL ? 'phet.paperLand.utils.getProgramCenter( points ).x' :
                               `throw new Error( 'Unknown direction control type from controller code generator' - ${directionControlType} )`;

    // This gives us the normalized value of the control method, between zero and one. Multiplying by the length
    // of model range gives us the resultant model value.
    const createComputeValueCode = modelPropertyName => {
      return `${modelPropertyName}.range.min + ${calculateValueCode} * ( ${modelPropertyName}.range.max - ${modelPropertyName}.range.min )`;
    };
    return ControllerCodeGenerator.getModelControllerCode( controlledName, createComputeValueCode );
  }

  /**
   * Returns a string of code that will get the value of paper information that can be used
   * to map to a value in model space. For example, if the control type is horizontal, then
   * it will return the code that gets the center X of the paper (in paper coordinates) so that
   * the horizontal position of the paper can then be used to map to a model value.
   * @param {DirectionControlType} directionControlType
   * @return {string}
   */
  static getNumberControllerValueGetter( directionControlType ) {
    if ( directionControlType === NumberPropertyController.DirectionControlType.HORIZONTAL ) {
      return 'phet.paperLand.utils.getProgramCenter( points ).x';
    }
    else if ( directionControlType === NumberPropertyController.DirectionControlType.VERTICAL ) {

      // 0 is at the top in paper coordinates, so we need to invert the y value
      return '1 - phet.paperLand.utils.getProgramCenter( points ).y';
    }
    else if ( directionControlType === NumberPropertyController.DirectionControlType.ROTATION ) {
      return 'phet.paperLand.utils.getNormalizedProgramRotation( points )';
    }
    else {
      throw new Error( `Unknown direction control type ${directionControlType}` );
    }
  }

  /**
   * If the control type for boolean is rotation, code should be added for the onProgramChangedPosition
   * event. No code is needed for this event for the other control types.
   */
  static getBooleanControllerChangedPositionCode( booleanControlType, controlledName ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.ROTATION ) {
      return ControllerCodeGenerator.getModelControllerCode(
        controlledName,

        // The value is only true when the program is rotated
        () => 'phet.paperLand.utils.getNormalizedProgramRotation( points ) > Math.PI / 2'
      );
    }
    return '';
  }

  /**
   * If the control type for boolean is markers, code should be added to the onProgramMarkersAdded event
   * to update the value when a marker is added.
   */
  static getBooleanControllerMarkersAddedCode( booleanControlType, controlledName ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.MARKER ) {
      return ControllerCodeGenerator.getModelControllerCode(
        controlledName,

        // When a marker is added, the value should be true
        () => 'markers.length > 0'
      );
    }
    return '';
  }

  /**
   * If the control type for boolean is markers, code should be added to the onProgramMarkersRemoved event
   * to update the value when a marker is removed.
   */
  static getBooleanControllerMarkersRemovedCode( booleanControlType, controlledName ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.MARKER ) {
      return ControllerCodeGenerator.getModelControllerCode(
        controlledName,

        // The value should be false when there are no more markers
        () => 'markers.length > 0'
      );
    }
    return '';
  }
}

export default ControllerCodeGenerator;