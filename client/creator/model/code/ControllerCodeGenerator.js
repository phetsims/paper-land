/**
 * A collection of functions that take data and controller name types and turns them into
 * code for the controller sections of code in the program templates.
 */
import BooleanPropertyController from '../controllers/BooleanPropertyController.js';
import BoundsPropertyController from '../controllers/BoundsPropertyController.js';
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

  static getNumberControllerChangedPositionCode( controlTypeFamily, controlType, relationshipControlType, controlledName ) {
    if ( controlTypeFamily === 'PAPER_MOVEMENT' ) {
      if ( relationshipControlType !== NumberPropertyController.RelationshipControlType.LINEAR ) {
        throw new Error( `Sorry, only linear relationships are supported at this time. Can't generate code for ${relationshipControlType} control of ${controlledName}.` );
      }

      const calculateValueCode = controlType === NumberPropertyController.NumberPropertyControlType.ROTATION ? 'phet.paperLand.utils.getNormalizedProgramRotation( points )' :
                                 controlType === NumberPropertyController.NumberPropertyControlType.VERTICAL ? '( 1 - phet.paperLand.utils.getProgramCenter( points ).y )' :
                                 controlType === NumberPropertyController.NumberPropertyControlType.HORIZONTAL ? 'phet.paperLand.utils.getProgramCenter( points ).x' :
                                 `throw new Error( 'Unknown direction control type from controller code generator' - ${controlType} )`;

      // This gives us the normalized value of the control method, between zero and one. Multiplying by the length
      // of model range gives us the resultant model value.
      const createComputeValueCode = modelPropertyName => {
        return `${modelPropertyName}.range.min + ${calculateValueCode} * ( ${modelPropertyName}.range.max - ${modelPropertyName}.range.min )`;
      };
      return ControllerCodeGenerator.getModelControllerCode( controlledName, createComputeValueCode );
    }
    else {
      return '';
    }
  }

  static getNumberControllerMarkersChangedPositionCode( controlTypeFamily, controlType, relationshipControlType, controlledName, colorName ) {
    if ( controlTypeFamily === 'MARKERS' && controlType === NumberPropertyController.NumberPropertyControlType.MARKER_LOCATION ) {

      // control type might be null for no selected control types (which we allow here and assume linear behavior)
      if ( relationshipControlType !== null && relationshipControlType !== NumberPropertyController.RelationshipControlType.LINEAR ) {
        throw new Error( `Sorry, only linear relationships are supported at this time. Can't generate code for ${relationshipControlType} control of ${controlledName}.` );
      }

      // Get the position of the marker within the program - this callbac has access to current markers on the
      // program, and each marker has the normalized position on the program. In a single line so that
      // it can easily be inserted into a function.
      const createComputeValueCode = modelPropertyName => {

        // Make sure there is a marker of the provided color, otherwise we won't change the value
        return `phet.paperLand.utils.getNormalizedVerticalMarkerPositionOnPaper( markers, '${colorName}' ) !== null ?
        phet.paperLand.utils.getNormalizedVerticalMarkerPositionOnPaper( markers, '${colorName}' ) * ( ${modelPropertyName}.range.getLength() ) + ${modelPropertyName}.range.min :
        phet.paperLand.getModelComponent( '${controlledName}' ).value`;
      };

      return ControllerCodeGenerator.getModelControllerCode( controlledName, createComputeValueCode );
    }
    else {
      return '';
    }
  }

  /**
   * Get the controller code for a NamedBounds2Property. There is only one control type for now, setting
   * the bounds to match the paper dimensions.
   * @param controlType
   * @param controlledName
   * @return {string}
   */
  static getBoundsControllerChangedPositionCode( controlType, controlledName ) {
    if ( controlType !== BoundsPropertyController.ControlType.PAPER_SIZE ) {
      throw new Error( `Sorry, only match paper control type is supported at this time. Can't generate code for ${controlType} control of ${controlledName}.` );
    }

    const calculateBoundsString = 'phet.paperLand.utils.getAbsolutePaperBounds( points )';
    return ControllerCodeGenerator.getModelControllerCode( controlledName, () => calculateBoundsString );
  }

  static getNumberControllerMarkersAddedCode( controlTypeFamily, controlType, relationshipControlType, controlledName, colorName ) {
    if ( controlTypeFamily === 'MARKERS' ) {
      if ( controlType === NumberPropertyController.NumberPropertyControlType.MARKER_COUNT ) {

        // If a specific color is specified, count the number of markers of that color, otherwise count all markerss
        const calculateValueString = colorName !== 'all' ? `_.filter(markers, { colorName: '${colorName}' }).length` : 'markers.length';

        return ControllerCodeGenerator.getModelControllerCode(
          controlledName,

          // When a marker is added, the value should be true
          () => calculateValueString
        );
      }
    }
    return '';
  }

  static getNumberControllerMarkersRemovedCode( controlTypeFamily, controlType, relationshipControlType, controlledName, colorName ) {
    if ( controlTypeFamily === 'MARKERS' ) {
      if ( controlType === NumberPropertyController.NumberPropertyControlType.MARKER_COUNT ) {

        // If a specific color is used, the value will be false when there are no more of that color. Otherwise it
        // will be false when there are no more markers.
        const calculateValueString = colorName !== 'all' ? `_.filter(markers, { colorName: '${colorName}' }).length` : 'markers.length';

        return ControllerCodeGenerator.getModelControllerCode(
          controlledName,

          // The value should be false when there are no more markers
          () => calculateValueString
        );
      }
    }
    return '';
  }

  /**
   * Code added to the program for the 'onProgramAdded' callback. This supports global markers by adding listeners
   * to the Emitters that emit an event when a marker is added/removed from the camera. Related tear-down code
   * is added to the 'onProgramRemoved' callback.
   * @param componentName
   * @param controlTypeFamily
   * @param controlType
   * @param controlledName
   * @param colorName - one of 'all', 'red', 'green', 'blue', 'black'
   * @return {string}
   */
  static getNumberControllerProgramAddedCode( componentName, controlTypeFamily, controlType, controlledName, colorName ) {
    let controllerCode = '';

    if ( controlTypeFamily === 'MARKERS' ) {
      if ( controlType === NumberPropertyController.NumberPropertyControlType.GLOBAL_MARKER_COUNT ) {

        // Use a new unique ID in case there is a collision in the same scope
        const uniqueListenerReference = `scratchpad.${componentName}MarkersChangedListener`;
        const calculateValueString = colorName !== 'all' ? `_.filter( sharedData.allMarkers, { colorName: '${colorName}' }).length` : 'sharedData.allMarkers.length';

        const updateModelCode = ControllerCodeGenerator.getModelControllerCode( controlledName, () => calculateValueString );

        controllerCode = `
        ${uniqueListenerReference} = () => { ${updateModelCode} };
        phet.paperLand.markersAddedEmitter.addListener( scratchpad.${componentName}MarkersChangedListener );
        phet.paperLand.markersRemovedEmitter.addListener( scratchpad.${componentName}MarkersChangedListener );
        `;
      }
    }
    return controllerCode;
  }

  /**
   * Removes listeners on emitters watching for global markers. This is called when the program is removed. Code is
   * only added if this component has the correct control type and family.
   */
  static getNumberControllerProgramRemovedCode( componentName, controlTypeFamily, controlType ) {
    let controllerCode = '';

    if ( controlTypeFamily === 'MARKERS' ) {
      if ( controlType === NumberPropertyController.NumberPropertyControlType.GLOBAL_MARKER_COUNT ) {
        controllerCode = `
        phet.paperLand.markersAddedEmitter.removeListener( scratchpad.${componentName}MarkersChangedListener );
        phet.paperLand.markersRemovedEmitter.removeListener( scratchpad.${componentName}MarkersChangedListener );
        `;
      }
    }
    return controllerCode;
  }

  static getVector2ControllerChangedPositionCode( controlType, controlledName ) {
    const createComputeValueCode = modelPropertyName => {
      const currentValue = `${modelPropertyName}.value`;
      return controlType === Vector2PropertyController.ControlType.MATCH_CENTER ? 'phet.paperLand.utils.getProgramCenter( points )' :
             controlType === Vector2PropertyController.ControlType.MATCH_X ? `new phet.dot.Vector2( phet.paperLand.utils.getProgramCenter( points ).x, ${currentValue}.y )` :
             controlType === Vector2PropertyController.ControlType.MATCH_Y ? `new phet.dot.Vector2( ${currentValue}.x, phet.paperLand.utils.getProgramCenter( points ).y )` :
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

        // The value is only true when the program is rotated between 0.25 and 0.75 (roughly upside down)
        () => 'phet.paperLand.utils.getNormalizedProgramRotation( points ) > 0.25 && phet.paperLand.utils.getNormalizedProgramRotation( points ) < 0.75'
      );
    }
    return '';
  }

  /**
   * If the control type for boolean is markers, code should be added to the onProgramMarkersAdded event
   * to update the value when a marker is added.
   */
  static getBooleanControllerMarkersAddedCode( booleanControlType, controlledName, colorName ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.MARKER ) {

      // If a specific color is specified, count the number of markers of that color, otherwise count all markerss
      const calculateValueString = colorName ? `_.filter(markers, { colorName: '${colorName}' }).length > 0` : 'markers.length > 0';

      return ControllerCodeGenerator.getModelControllerCode(
        controlledName,

        // When a marker is added, the value should be true
        () => calculateValueString
      );
    }
    return '';
  }

  /**
   * If the control type for boolean is markers, code should be added to the onProgramMarkersRemoved event
   * to update the value when a marker is removed.
   */
  static getBooleanControllerMarkersRemovedCode( booleanControlType, controlledName, colorName ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.MARKER ) {

      // If a specific color is used, the value will be false when there are no more of that color. Otherwise it
      // will be false when there are no more markers.
      const calculateValueString = colorName ? `_.filter(markers, { colorName: '${colorName}' }).length > 0` : 'markers.length > 0';

      return ControllerCodeGenerator.getModelControllerCode(
        controlledName,

        // The value should be false when there are no more markers
        () => calculateValueString
      );
    }
    return '';
  }

  static getBooleanControllerAdjacentCode( booleanControlType, controlledName, otherProgramNumber ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.WHISKER ) {
      const computeValueCode = () => {
        if ( otherProgramNumber ) {

          // if another paper is provided, value is true when adjacent to that paper
          return `otherPaperNumber === ${otherProgramNumber}`;
        }
        else {

          // always true when adjacent to another program
          return 'true';
        }
      };
      return ControllerCodeGenerator.getModelControllerCode( controlledName, computeValueCode );
    }
    return '';
  }

  static getBooleanControllerSeparatedCode( booleanControlType, controlledName, otherProgramNumber ) {
    if ( booleanControlType === BooleanPropertyController.ControlType.WHISKER ) {
      return ControllerCodeGenerator.getModelControllerCode( controlledName, modelPropertyName => {

        if ( otherProgramNumber ) {

          // if the other program is equal to the provide one, value becomes false on separation, otherwise
          // the value stays the same
          return `otherPaperNumber === ${otherProgramNumber} ? false : ${modelPropertyName}.value`;
        }
        else {

          // no program number to compare against, value always becomes falseon separation
          return 'false';
        }

      } );
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