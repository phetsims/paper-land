/**
 * Base class for a ViewComponent. A data structure representing some view component in
 * the paper playground framework.
 */
import Component from '../Component.js';

export default class ViewComponent extends Component {

  /**
   * @param {string} name - the name of this component
   * @param {string[]} modelComponentNames - the name of the model component that this view component represents
   * @param {string} controlFunctionString - the function that is called when the model component changes
   */
  constructor( name, modelComponentNames, controlFunctionString ) {
    super( name );
    this.modelComponentNames = modelComponentNames;
    this.controlFunctionString = controlFunctionString;
  }

  /**
   * Saves ViewComponent data for serialization, but to be overridden and extended by subclasses.
   */
  save() {
    return {
      name: this.nameProperty.value,
      modelComponentNames: this.modelComponentNames,
      controlFunctionString: this.controlFunctionString
    };
  }

  load() {
    throw new Error( 'Subclasses must override' );
  }
}