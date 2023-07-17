/**
 * A base class for a component that can be created or edited by the Creator tool.
 */

export default class Component {

  /**
   * @param {string} name - the name of this component
   */
  constructor( name ) {

    this.name = name;

    // emits an event when it is time for this NamedProperty to be deleted
    this.deleteEmitter = new phet.axon.Emitter();
  }

  /**
   * Disposes the emitters (removing any listeners on them) to prevent memory leaks.
   */
  dispose() {
    this.deleteEmitter.dispose();
  }
}