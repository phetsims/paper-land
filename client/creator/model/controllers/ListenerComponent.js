import { replaceReferencesInCode } from '../../../utils.js';
import Component from '../Component.js';

export default class ListenerComponent extends Component {
  constructor( name, controlledProperties, controlFunctionString ) {
    super( name );

    // The list of Properties that the user can change in the listener.
    this._controlledProperties = [];

    // The list of names for the controlled Properties.
    this.controlledPropertyNames = [];

    // {string} - the callback function for the listener
    this.controlFunctionString = controlFunctionString;

    this.boundUpdateControlledPropertyNames = this.updateControlledPropertyNames.bind( this );

    // A map of controlled components to their removal listeners. Used to remove a controlled component from the
    // list when it is removed. Also used to remove the listeners that are associated with them to prevent memory leaks.
    this.controlledComponentListenerMap = new Map();

    this.setControlledProperties( controlledProperties );
  }

  /**
   * Set the list of Properties that are controlled by this MultilinkListenerComponent.
   */
  setControlledProperties( controlledProperties ) {

    // remove any listeners from the old controlledProperties
    this._controlledProperties.forEach( controlledProperty => {
      if ( controlledProperty.nameProperty.hasListener( this.boundUpdateControlledPropertyNames ) ) {
        controlledProperty.nameProperty.unlink( this.boundUpdateControlledPropertyNames );
      }
      if ( this.controlledComponentListenerMap.has( controlledProperty ) ) {
        controlledProperty.deleteEmitter.removeListener( this.controlledComponentListenerMap.get( controlledProperty ) );
        this.controlledComponentListenerMap.delete( controlledProperty );
      }
    } );

    // update references
    this._controlledProperties = controlledProperties;
    this.updateControlledPropertyNames();

    // add listener to the Property names so that custom code will automatically update if a name changes
    controlledProperties.forEach( controlledProperty => {
      controlledProperty.nameProperty.link( this.boundUpdateControlledPropertyNames );

      const removalListener = () => {
        this.removeControlledPropertyOnDelete( controlledProperty );
      }
      controlledProperty.deleteEmitter.addListener( removalListener );
      this.controlledComponentListenerMap.set( controlledProperty, removalListener );
    } );
  }

  /**
   * When a component is deleted,
   */
  removeControlledPropertyOnDelete( component ) {
    const newDependencies = this._controlledProperties.filter( modelComponent => modelComponent !== component );
    this.setControlledProperties( newDependencies );
  }

  /**
   * Updates the list of names of controlled Properties.
   */
  updateControlledPropertyNames( newName, oldName ) {
    this.controlledPropertyNames = this._controlledProperties.map( controllingProperty => controllingProperty.nameProperty.value );

    if ( newName && oldName && this.controlFunctionString ) {
      this.controlFunctionString = replaceReferencesInCode( this.controlFunctionString, newName, oldName );
    }
  }

  /**
   * Serializes this instance for save/load.
   */
  save() {
    return {
      ...super.save(),
      controlledPropertyNames: this.controlledPropertyNames,
      controlFunctionString: this.controlFunctionString
    };
  }

  static getStateSchema() {
    return {
      ...Component.getStateSchema(),
      controlledPropertyNames: [],
      controlFunctionString: ''
    };
  }
}