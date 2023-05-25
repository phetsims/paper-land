/**
 * Collection of model components for a single program, with functions to create them.
 */
import NamedProperty from './NamedProperty.js';

export default class ProgramModelContainer {
  constructor() {

    this.namedBooleanProperties = phet.axon.createObservableArray();

  }

  /**
   * Creates a NamedProperty with the provided name and BooleanProperty for this model.
   * @param {string} name
   * @param {boolean} defaultValue
   */
  addBooleanProperty( name, defaultValue ) {
    this.namedBooleanProperties.push( new NamedProperty( name, new phet.axon.BooleanProperty( defaultValue ) ) );
  }
}