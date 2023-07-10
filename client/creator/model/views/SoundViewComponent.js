import ViewComponent from './ViewComponent.js';

export default class SoundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {string[]} modelComponentNames - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} soundFileName - a sound file that exists in www/media/sounds
   */
  constructor( name, modelComponentNames, controlFunctionString, soundFileName ) {
    super( name, modelComponentNames, controlFunctionString );
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
  static fromStateObject( stateObject ) {
    return new SoundViewComponent(
      stateObject.name,
      stateObject.modelComponentNames,
      stateObject.controlFunctionString,
      stateObject.soundFileName
    );
  }
}