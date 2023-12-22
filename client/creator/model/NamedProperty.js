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
   * @param {'BooleanProperty'|'NumberProperty'|'EnumerationProperty'|'Vector2Property'|'DerivedProperty'|'Bounds2Property'|'ObservableArray' | 'ArrayItem' | 'NamedArrayItemReference' | 'StringProperty' } propertyType - A name for the type of Property this is, to categorize UI controls
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

  /**
   * Returns a schema describing the data for this component. Used by React form validation and loading so that
   * React components know how to save/structure form data.
   */
  static getStateSchema() {
    throw new Error( 'Subclasses must override' );
  }
}

export default NamedProperty;