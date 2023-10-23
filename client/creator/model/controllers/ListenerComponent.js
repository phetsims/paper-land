import { renameVariableInCode } from '../../../utils.js';
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
    } );

    // update references
    this._controlledProperties = controlledProperties;
    this.updateControlledPropertyNames();

    // add listener to the Property names so that custom code will automatically update if a name changes
    controlledProperties.forEach( controlledProperty => {
      controlledProperty.nameProperty.link( this.boundUpdateControlledPropertyNames );
    } );
  }

  /**
   * Updates the list of names of controlled Properties.
   */
  updateControlledPropertyNames( newName, oldName ) {
    this.controlledPropertyNames = this._controlledProperties.map( controllingProperty => controllingProperty.nameProperty.value );

    if ( newName && oldName && this.controlFunctionString ) {
      this.controlFunctionString = renameVariableInCode( this.controlFunctionString, newName, oldName );

      // the listener component also has 'setter' functions for each like 'setMyComponent' - the setter function
      // is the name with 'set' prepended and the first letter capitalized
      const newSetterName = 'set' + newName.charAt( 0 ).toUpperCase() + newName.slice( 1 );
      const oldSetterName = 'set' + oldName.charAt( 0 ).toUpperCase() + oldName.slice( 1 );
      this.controlFunctionString = renameVariableInCode( this.controlFunctionString, newSetterName, oldSetterName );
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