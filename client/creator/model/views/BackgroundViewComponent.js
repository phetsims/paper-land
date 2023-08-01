import ViewComponent from './ViewComponent.js';

export default class BackgroundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {string[]} modelComponentNames - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   */
  constructor( name, modelComponentNames, controlFunctionString ) {
    super( name, modelComponentNames, controlFunctionString );
  }

  /**
   * Given a state object, return a new SoundViewComponent.
   */
  static fromStateObject( stateObject ) {
    return new BackgroundViewComponent(
      stateObject.name,
      stateObject.modelComponentNames,
      stateObject.controlFunctionString
    );
  }
}