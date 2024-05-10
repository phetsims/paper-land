import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class SpeechViewComponent extends ViewComponent {
  constructor( name, modelComponents, controlFunctionString, options ) {
    super( name, modelComponents, controlFunctionString, options );
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
      {
        lazyLink: stateObject.lazyLink,
        referenceComponentNames: stateObject.referenceComponentNames
      }
    );
  }
}