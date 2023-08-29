import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class ImageViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} imageFileName - an image file that exists in www/media/images
   */
  constructor( name, modelComponents, controlFunctionString, imageFileName ) {
    super( name, modelComponents, controlFunctionString );
    this.imageFileName = imageFileName;
  }

  /**
   * Save state to JSON for saving to database.
   */
  save() {
    return {
      ...super.save(),
      imageFileName: this.imageFileName
    };
  }

  /**
   * Given a state object, return a new ImageViewComponent.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new ImageViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      stateObject.imageFileName
    );
  }

  static getStateSchema() {
    return {
      ...ViewComponent.getStateSchema(),
      imageFileName: ''
    };
  }
}