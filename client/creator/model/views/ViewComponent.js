/**
 * Base class for a ViewComponent. A data structure representing some view component in
 * the paper playground framework.
 */
import Component from '../Component.js';

export default class ViewComponent extends Component {

  /**
   * @param {string} name - the name of this component
   * @param {NamedProperty[]} modelComponents - the name of the model component that this view component represents
   * @param {string} controlFunctionString - the function that is called when the model component changes
   */
  constructor( name, modelComponents, controlFunctionString ) {
    super( name );
    this._modelComponents = modelComponents;
    this.controlFunctionString = controlFunctionString;

    this.setModelComponents( modelComponents );
  }

  setModelComponents( components ) {
    this._modelComponents = components;

    this.modelComponentNames = this._modelComponents.map( component => component.nameProperty.value );
  }

  /**
   * Saves ViewComponent data for serialization, but to be overridden and extended by subclasses.
   */
  save() {
    return {
      name: this.nameProperty.value,
      modelComponentNames: this._modelComponents.map( component => component.nameProperty.value ),
      controlFunctionString: this.controlFunctionString
    };
  }

  load() {
    throw new Error( 'Subclasses must override' );
  }

  /**
   * Find all of the components (dependencies) that have a name in the list of name strings.
   *
   * @param {NamedProperty[]} dependencies
   * @param {string[]} names
   */
  static findDependenciesByName( dependencies, names ) {
    const matchingDependencies = [];

    for ( const dependency of dependencies ) {
      if ( names.includes( dependency.nameProperty.value ) ) {
        matchingDependencies.push( dependency );
      }
    }

    return matchingDependencies;
  }
}