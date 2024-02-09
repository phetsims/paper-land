import Component from '../Component.js';
import NodeViewComponent from './NodeViewComponent.js';

export default class ImageViewComponent extends NodeViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {string} imageFileName - an image file that exists in www/media/images
   * @param {Object} [options] - options for the NodeViewComponent
   */
  constructor( name, modelComponents, controlFunctionString, imageFileName, options ) {
    super( name, modelComponents, controlFunctionString, options );
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
      stateObject.imageFileName, {

        // the defaultViewOptions are saved specially but are passed as general options to the constructor,
        // so we deconstruct them here
        ...stateObject.defaultViewOptions,
        referenceComponentNames: stateObject.referenceComponentNames
      }
    );
  }

  static getStateSchema() {
    return {
      ...NodeViewComponent.getStateSchema(),
      imageFileName: ''
    };
  }
}