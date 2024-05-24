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
   * @param {Object} [providedOptions] - options for this view component
   */
  constructor( name, modelComponents, controlFunctionString, providedOptions ) {

    const options = _.merge( {

      // If true, the multilink that observes the dependency components will be attached lazily so that
      // the listener doesn't trigger until the next change.
      lazyLink: false,

      // List of components by name that will connect with a reference - this means that when the component
      // changes, it will not re-trigger the view component control function, but the component will
      // be available in the reference callback.
      referenceComponentNames: []
    }, providedOptions );

    super( name );
    this._modelComponents = modelComponents;

    // @public (read-only) - list of the model component names, updated in setModelComponents
    this.modelComponentNames = [];

    // See options. This is populated in setReferenceComponentNames.
    this.referenceComponentNames = [];

    // @public (read-only) - the control function provided by the user that controls this
    // view component from the dependencies
    this.controlFunctionString = controlFunctionString;

    // @public (read-only) - if true, the multilink that observes the dependency components will be attached lazily so
    this.lazyLink = options.lazyLink;

    this.boundUpdateDependencyNames = this.updateDependencyNames.bind( this );

    // A map of components to their removal listeners. Used to remove components when they are deleted, and
    // also remove the listeners that are associated with them to prevent memory leaks.
    this.removeListenerMap = new Map();

    this.setModelComponents( modelComponents );
    this.setReferenceComponentNames( options.referenceComponentNames || [] );
  }

  setModelComponents( components ) {

    // Unlink name change listeners
    this._modelComponents.forEach( component => {
      if ( component.nameProperty.hasListener( this.boundUpdateDependencyNames ) ) {
        component.nameProperty.unlink( this.boundUpdateDependencyNames );
      }
      if ( this.removeListenerMap.has( component ) ) {
        component.deleteEmitter.removeListener( this.removeListenerMap.get( component ) );
        this.removeListenerMap.delete( component );
      }
    } );

    this._modelComponents = components;

    // Update the list of name strings from the current components
    this.updateDependencyNames();

    // If any of the references are no longer in the list of model components, they must be removed
    this.referenceComponentNames = this.referenceComponentNames.filter( name => {
      return this.modelComponentNames.includes( name );
    } );

    // Link name change and delete listeners to the new components
    components.forEach( component => {
      component.nameProperty.link( this.boundUpdateDependencyNames );

      const removalListener = () => {
        this.removeComponentOnDelete( component );
      };
      component.deleteEmitter.addListener( removalListener );
      this.removeListenerMap.set( component, removalListener );
    } );
  }

  /**
   * Set the list of components that will be used as references (not dependencies) for this view component.
   * These components will be required for the view component to be created, but will not be added to a
   * controlling multilink - this is useful when you want a component to control the value but not trigger
   * a redraw every time it changes.
   *
   * @param referenceComponentNames
   */
  setReferenceComponentNames( referenceComponentNames ) {

    // Make sure that the reference components are in the list of model components
    referenceComponentNames.forEach( referenceComponentName => {
      assert && assert( this.modelComponentNames.includes( referenceComponentName ), 'Reference component must be in the list of model components' );
    } );

    this.referenceComponentNames = referenceComponentNames;
  }

  /**
   * Updates the list of dependency names when we have a name change.
   */
  updateDependencyNames( newName, oldName ) {
    this.modelComponentNames = this._modelComponents.map( component => component.nameProperty.value );

    // if the old name is in the list of reference components, we need to update the reference component names
    // as well
    if ( oldName && this.referenceComponentNames.includes( oldName ) ) {
      const indexOfOldName = this.referenceComponentNames.indexOf( oldName );
      this.referenceComponentNames[ indexOfOldName ] = newName;
    }

    // Rename the variable in the control function string
    if ( newName && oldName && this.controlFunctionString ) {
      this.controlFunctionString = renameVariableInCode( this.controlFunctionString, newName, oldName );
    }
  }

  /**
   * When a component is deleted, we need to remove it from the list of dependencies and references.
   * @param component
   */
  removeComponentOnDelete( component ) {
    const newComponents = this._modelComponents.filter( modelComponent => modelComponent !== component );
    this.setModelComponents( newComponents );
    console.log( 'removing on delete!', component );
  }

  /**
   * Saves ViewComponent data for serialization, but to be overridden and extended by subclasses.
   */
  save() {
    return {
      name: this.nameProperty.value,
      modelComponentNames: this._modelComponents.map( component => component.nameProperty.value ),
      referenceComponentNames: this.referenceComponentNames,
      controlFunctionString: this.controlFunctionString,
      lazyLink: this.lazyLink
    };
  }

  load() {
    throw new Error( 'Subclasses must override' );
  }

  static getStateSchema() {
    return {
      name: '',
      modelComponentNames: [],
      referenceComponentNames: [],
      controlFunctionString: '',
      lazyLink: false
    };
  }
}