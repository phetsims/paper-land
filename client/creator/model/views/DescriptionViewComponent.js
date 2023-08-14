import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class DescriptionViewComponent extends ViewComponent {
  constructor( name, modelComponents, controlFunctionString ) {
    super( name, modelComponents, controlFunctionString );
  }

  /**
   * Load an instance from a state object.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new DescriptionViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString
    );
  }
}