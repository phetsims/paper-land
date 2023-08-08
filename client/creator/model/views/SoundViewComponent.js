import ViewComponent from './ViewComponent.js';

export default class SoundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} soundFileName - a sound file that exists in www/media/sounds
   */
  constructor( name, modelComponents, controlFunctionString, soundFileName ) {
    super( name, modelComponents, controlFunctionString );
    this.soundFileName = soundFileName;
  }

  /**
   * Save state to JSON for saving to database.
   */
  save() {
    return {
      ...super.save(),
      soundFileName: this.soundFileName
    };
  }

  /**
   * Given a state object, return a new SoundViewComponent.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = ViewComponent.findDependenciesByName( allComponents, stateObject.modelComponentNames );
    return new SoundViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      stateObject.soundFileName
    );
  }
}