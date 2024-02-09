import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class SoundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} soundFileName - a sound file that exists in www/media/sounds
   * @param {boolean} loop - whether or not to loop the sound
   * @param {boolean} autoplay - Does the sound play every component change or only from custom code?
   * @param {Object} [providedOptions] - options for this view component
   */
  constructor( name, modelComponents, controlFunctionString, soundFileName, loop, autoplay, providedOptions ) {
    super( name, modelComponents, controlFunctionString, providedOptions );
    this.soundFileName = soundFileName;

    // may be undefined when loading
    this.loop = loop || false;

    // In general, you want to play a sound every time your component changes.
    this.autoplay = autoplay === undefined ? true : autoplay;
  }

  /**
   * Save state to JSON for saving to database.
   */
  save() {
    return {
      ...super.save(),
      soundFileName: this.soundFileName,
      loop: this.loop,
      autoplay: this.autoplay
    };
  }

  /**
   * Given a state object, return a new SoundViewComponent.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new SoundViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      stateObject.soundFileName,
      stateObject.loop,
      stateObject.autoplay,
      {
        referenceComponentNames: stateObject.referenceComponentNames
      }
    );
  }

  static getStateSchema() {
    return {
      ...ViewComponent.getStateSchema(),
      soundFileName: '',
      loop: false,
      autoplay: true
    };
  }
}