import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class SpeechViewComponent extends ViewComponent {

  /**
   * @param name - Name for the component
   * @param modelComponents - list of model components that this view depends on.
   * @param controlFunctionString - The function that will be called to update the view.
   * @param basicSpeechString - A basic string to speak, when a control function is not used.
   * @param options
   */
  constructor( name, modelComponents, controlFunctionString, basicSpeechString, options ) {
    super( name, modelComponents, controlFunctionString, options );

    this.basicSpeechString = basicSpeechString || '';
  }

  save() {
    return {
      ...super.save(),
      basicSpeechString: this.basicSpeechString
    };
  }

  static getStateSchema() {
    return {
      ...ViewComponent.getStateSchema(),
      basicSpeechString: ''
    };
  }

  /**
   * Load an instance from a state object.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new SpeechViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      stateObject.basicSpeechString,
      {
        lazyLink: stateObject.lazyLink,
        referenceComponentNames: stateObject.referenceComponentNames
      }
    );
  }
}