/**
 * A Property for the model with a given name. This doesn't actually create the Property, but
 * represents the data for an observable to be created in Paper Playground.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
class NamedProperty {

  /**
   * @param {string} name
   * @param {'BooleanProperty'|'NumberProperty'|'StringProperty'|'Vector2Property'|'DerivedProperty'} propertyType - A name for the type of Property this is, to categorize UI controls
   */
  constructor( name, propertyType ) {
    this.name = name;
    this.propertyType = propertyType;

    // emits an event when it is time for this NamedProperty to be deleted
    this.deleteEmitter = new phet.axon.Emitter();
  }

  /**
   * Save to a JSON to load state.
   */
  save() {
    throw new Error( 'Subclasses must override' );
  }

  /**
   * Make eligible for garbage collection.
   * @public
   */
  dispose() {
    this.deleteEmitter.dispose();
  }
}

export default NamedProperty;