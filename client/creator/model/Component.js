/**
 * A base class for a component that can be created or edited by the Creator tool.
 */

export default class Component {

  /**
   * @param {string} name - the name of this component
   */
  constructor( name ) {

    this.nameProperty = new phet.axon.StringProperty( name );

    // emits an event when it is time for this NamedProperty to be deleted
    this.deleteEmitter = new phet.axon.Emitter();
  }

  /**
   * Disposes the emitters (removing any listeners on them) to prevent memory leaks.
   */
  dispose() {
    this.deleteEmitter.dispose();
  }

  static getStateSchema() {
    return {
      name: ''
    };
  }

  /**
   * Serializes this data for save/load.
   */
  save() {
    return {
      name: this.nameProperty.value
    };
  }

  /**
   * Find components (dependencies) that have a name in the list of name strings.
   *
   * @param {NamedProperty[]} dependencies
   * @param {string[]} names
   */
  static findComponentsByName( dependencies, names ) {
    const matchingDependencies = [];

    for ( const dependency of dependencies ) {
      if ( names.includes( dependency.nameProperty.value ) ) {
        matchingDependencies.push( dependency );
      }
    }

    return matchingDependencies;
  }
}