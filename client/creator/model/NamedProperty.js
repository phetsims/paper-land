/**
 * A Property for the model with a given name. This doesn't actually create the Property, but
 * represents the data for an observable to be created in Paper Playground.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Component from './Component.js';

class NamedProperty extends Component {

  /**
   * @param {string} name
   * @param {'BooleanProperty'|'NumberProperty'|'StringProperty'|'Vector2Property'|'DerivedProperty'} propertyType - A name for the type of Property this is, to categorize UI controls
   */
  constructor( name, propertyType ) {
    super( name );
    this.propertyType = propertyType;
  }

  /**
   * Save to a JSON to load state.
   */
  save() {
    throw new Error( 'Subclasses must override' );
  }

  /**
   * Load state from JSON.
   */
  load( stateObject ) {
    this.propertyType = stateObject.propertyType;
  }

  static getStateSchema() {
    return {
      ...Component.getInitialState(),
      propertyType: this.propertyType
    };
  }
}

export default NamedProperty;