import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class DescriptionViewComponent extends ViewComponent {
  constructor( name, modelComponents, controlFunctionString, options ) {
    super( name, modelComponents, controlFunctionString, options );
  }

  /**
   * Load an instance from a state object.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new DescriptionViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      {
        lazyLink: stateObject.lazyLink
      }
    );
  }
}