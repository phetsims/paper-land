/**
 * Base class for a ViewComponent. A data structure representing some view component in
 * the paper playground framework.
 */
import { renameVariableInCode } from '../../../utils.js';
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

    this.boundUpdateDependencyNames = this.updateDependencyNames.bind( this );

    this.setModelComponents( modelComponents );
  }

  setModelComponents( components ) {
    this._modelComponents.forEach( component => {
      if ( component.nameProperty.hasListener( this.boundUpdateDependencyNames ) ) {
        component.nameProperty.unlink( this.boundUpdateDependencyNames );
      }
    } );

    this._modelComponents = components;
    this.updateDependencyNames();

    components.forEach( component => {
      component.nameProperty.link( this.boundUpdateDependencyNames );
    } );
  }

  /**
   * Updates the list of dependency names when we have a name change.
   */
  updateDependencyNames( newName, oldName ) {
    this.modelComponentNames = this._modelComponents.map( component => component.nameProperty.value );

    if ( newName && oldName && this.controlFunctionString ) {
      this.controlFunctionString = renameVariableInCode( this.controlFunctionString, newName, oldName );
    }
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

  static getStateSchema() {
    return {
      name: '',
      modelComponentNames: [],
      controlFunctionString: ''
    };
  }
}