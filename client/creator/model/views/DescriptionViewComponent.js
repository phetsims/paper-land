import ViewComponent from './ViewComponent.js';

export default class DescriptionViewComponent extends ViewComponent {
  constructor( name, modelComponentNames, controlFunctionString ) {
    super( name, modelComponentNames, controlFunctionString );
  }

  /**
   * Load an instance from a state object.
   */
  static fromStateObject( stateObject ) {
    return new DescriptionViewComponent(
      stateObject.name,
      stateObject.modelComponentNames,
      stateObject.controlFunctionString
    );
  }
}