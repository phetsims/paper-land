/**
 * Base class for a ViewComponent. A data structure representing some view component in
 * the paper playground framework.
 */

export default class ViewComponent {

  /**
   * @param {string} name - the name of this component
   * @param {string[]} modelComponentNames - the name of the model component that this view component represents
   * @param {string} controlFunctionString - the function that is called when the model component changes
   */
  constructor( name, modelComponentNames, controlFunctionString ) {
    this.name = name;
    this.modelComponentNames = modelComponentNames;
    this.controlFunctionString = controlFunctionString;
    this.deleteEmitter = new phet.axon.Emitter();
  }

  save() {
    throw new Error( 'Subclasses must override' );
  }

  load() {
    throw new Error( 'Subclasses must override' );
  }

  dispose() {
    this.deleteEmitter.dispose();
  }
}