/**
 * A Property for the model with a given name.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
class NamedProperty {

  /**
   * @param {string} name
   * @param {Property} property
   */
  constructor( name, property ) {
    this.name = name;
    this.property = property;

    // emits an event when it is time for this NamedProperty to be deleted
    this.deleteEmitter = new phet.axon.Emitter();
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