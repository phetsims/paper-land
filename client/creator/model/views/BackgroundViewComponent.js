import ViewComponent from './ViewComponent.js';

export default class BackgroundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   */
  constructor( name, modelComponents, controlFunctionString ) {
    super( name, modelComponents, controlFunctionString );
  }

  /**
   * Given a state object, return a new SoundViewComponent.
   */
  static fromStateObject( stateObject, allComponents ) {

    const dependencies = ViewComponent.findDependenciesByName( allComponents, stateObject.modelComponentNames );
    return new BackgroundViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString
    );
  }
}