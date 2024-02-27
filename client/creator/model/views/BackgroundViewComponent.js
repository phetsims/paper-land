import Component from '../Component.js';
import ViewComponent from './ViewComponent.js';

export default class BackgroundViewComponent extends ViewComponent {

  /**
   * @param {string} name - name of this component
   * @param {NamedProperty[]} modelComponents - names of the model components this represents
   * @param {string} controlFunctionString - a function called to change the view whenever the model changes
   * @param {Object} [providedOptions] - options for this view component
   */
  constructor( name, modelComponents, controlFunctionString, providedOptions ) {

    const options = phet.phetCore.merge( {
      fillColor: 'green'
    }, providedOptions );

    super( name, modelComponents, controlFunctionString, options );

    this.fillColor = options.fillColor;
  }

  save() {
    return {
      ...super.save(),
      fillColor: this.fillColor
    };
  }

  static getStateSchema() {
    return {
      ...ViewComponent.getStateSchema(),
      fillColor: 'green'
    };
  }

  /**
   * Given a state object, return a new SoundViewComponent.
   */
  static fromStateObject( stateObject, allComponents ) {

    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new BackgroundViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      {
        fillColor: stateObject.fillColor,
        referenceComponentNames: stateObject.referenceComponentNames
      }
    );
  }
}