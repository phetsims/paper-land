/**
 * A collection of functions that take data and controller name types and turns them into
 * code for the controller sections of code in the program templates.
 */
import NumberPropertyController from '../controllers/NumberPropertyController.js';

class ControllerCodeGenerator {

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
      return 'phet.paperLand.utils.getProgramCenter( points ).y';
    }
    else if ( directionControlType === NumberPropertyController.DirectionControlType.ROTATION ) {
      return 'phet.paperLand.utils.getNormalizedProgramRotation( points )';
    }
    else {
      throw new Error( `Unknown direction control type ${directionControlType}` );
    }
  }
}

export default ControllerCodeGenerator;