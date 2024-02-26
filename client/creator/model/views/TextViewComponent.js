import Component from '../Component.js';
import NodeViewComponent from './NodeViewComponent.js';

export default class TextViewComponent extends NodeViewComponent {

  constructor( name, modelComponents, controlFunctionString, providedOptions ) {
    super( name, modelComponents, controlFunctionString, providedOptions );
  }

  /**
   * Load an instance from a state object.
   */
  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new TextViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString, {
        referenceComponentNames: stateObject.referenceComponentNames
      }
    );
  }
}