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

    // A multilink that will update the list of controlling Properties when one of their names change
    this._controllingPropertyNameChangeMultilink = null;

    this.setControlledProperties( controlledProperties );
  }

  /**
   * Set the list of Properties that are controlled by this MultilinkListenerComponent.
   */
  setControlledProperties( controlledProperties ) {
    if ( this._controllingPropertyNameChangeMultilink ) {
      this._controllingPropertyNameChangeMultilink.dispose();
      this._controllingPropertyNameChangeMultilink = null;
    }

    this._controlledProperties = controlledProperties;
    this.updateControlledPropertyNames();

    this._controllingPropertyNameChangeMultilink = phet.axon.Multilink.multilink(
      this._controlledProperties.map( controllingProperty => controllingProperty.nameProperty ),
      () => { this.updateControlledPropertyNames(); }
    );
  }

  /**
   * Updates the list of names of controlled Properties.
   */
  updateControlledPropertyNames() {
    this.controlledPropertyNames = this._controlledProperties.map( controllingProperty => controllingProperty.nameProperty.value );
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