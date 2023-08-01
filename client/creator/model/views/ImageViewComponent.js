import ViewComponent from './ViewComponent.js';

export default class ImageViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {string[]} modelComponentNames - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} imageFileName - an image file that exists in www/media/images
   */
  constructor( name, modelComponentNames, controlFunctionString, imageFileName ) {
    super( name, modelComponentNames, controlFunctionString );
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
  static fromStateObject( stateObject ) {
    return new ImageViewComponent(
      stateObject.name,
      stateObject.modelComponentNames,
      stateObject.controlFunctionString,
      stateObject.imageFileName
    );
  }
}