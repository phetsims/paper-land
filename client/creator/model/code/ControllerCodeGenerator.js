/**
 * A collection of functions that take data and controller name types and turns them into
 * code for the controller sections of code in the program templates.
 */
import BooleanPropertyController from '../controllers/BooleanPropertyController.js';
import EnumerationPropertyController from '../controllers/EnumerationPropertyController.js';
import NumberPropertyController from '../controllers/NumberPropertyController.js';
import Vector2PropertyController from '../controllers/Vector2PropertyController.js';

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

  static getVector2ControllerChangedPositionCode( controlType, controlledName ) {
    const createComputeValueCode = modelPropertyName => {
      const currentValue = `${modelPropertyName}.value`;
      return controlType === Vector2PropertyController.ControlType.MATCH_CENTER ? 'phet.paperLand.utils.getBoardPositionFromPoints( points, sharedData.displaySize )' :
             controlType === Vector2PropertyController.ControlType.MATCH_X ? `new phet.dot.Vector2( phet.paperLand.utils.getBoardPositionFromPoints( points, sharedData.displaySize ).x, ${currentValue}.y )` :
             controlType === Vector2PropertyController.ControlType.MATCH_Y ? `new phet.dot.Vector2( ${currentValue}.x, phet.paperLand.utils.getBoardPositionFromPoints( points, sharedData.displaySize ).y )` :
             `throw new Error( 'Unknown Vector2 control type from controller code generator' - ${controlType} )`;
    };
    return ControllerCodeGenerator.getModelControllerCode( controlledName, createComputeValueCode );
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

  static getEnumerationControllerChangedPositionCode( controlType, controlledName, enumerationValues ) {
    if ( controlType === EnumerationPropertyController.ControlType.ROTATION ) {

      // Convert the array of values to a string, keeping the array format like "[ 'value1', 'value2' ]"
      const arrayString = JSON.stringify( enumerationValues );

      const createComputeValueCode = () => {
        return `phet.paperLand.utils.getEnumerationValueFromProgramRotation( points, ${arrayString} )`;
      };
      return ControllerCodeGenerator.getModelControllerCode( controlledName, createComputeValueCode );
    }
    return '';
  }

  static getEnumerationControllerMarkersChangedCode( controlType, controlledName, enumerationValues ) {
    if ( controlType === EnumerationPropertyController.ControlType.MARKERS ) {

      // Convert the array of values to a string, keeping the array format like "[ 'value1', 'value2' ]"
      const arrayString = JSON.stringify( enumerationValues );

      const createComputeValueCode = () => {
        return `phet.paperLand.utils.getEnumerationValueFromProgramMarkers( markers, ${arrayString} )`;
      };
      return ControllerCodeGenerator.getModelControllerCode( controlledName, createComputeValueCode );
    }
    return '';
  }

}

export default ControllerCodeGenerator;