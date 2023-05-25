export default class ProgramModel {

  /**
   * @param {dot.Vector2} initialPosition
   */
  constructor( initialPosition ) {

    // @public (read-only) - the number of this program
    this.number = Math.floor( Math.random() * 1000 );

    this.titleProperty = new phet.axon.StringProperty( '' );
    this.keywordsProperty = new phet.axon.StringProperty( '' );
    this.descriptionProperty = new phet.axon.StringProperty( '' );

    // {NamedProperty[]}
    this.modelProperties = [];

    // @public - emits when a model Property is added - inclues the new Property in the callback
    this.modelPropertyAddedEmitter = new phet.axon.Emitter();

    // @public - emits when a model Property is removed - includes the removed Property in the callback
    this.modelPropertyRemovedEmitter = new phet.axon.Emitter();

    // @public
    this.positionProperty = new phet.dot.Vector2Property( initialPosition );

    // @public - emits an event when it is time to delete this program
    this.deleteEmitter = new phet.axon.Emitter();

    // @public - individual custom listeners that will be called for each of the paper events
    this.listenersForProgramAdded = [];
    this.listenersForProgramChangedPosition = [];
    this.listenersForProgramRemoved = [];


  }

  /**
   * Adds a NamedProperty to this program.
   * @param {NamedProperty} namedProperty
   */
  addModelProperty( namedProperty ) {
    assert && assert( this.modelProperties.indexOf( namedProperty ) < 0, 'Property already in model' );
    this.modelProperties.push( namedProperty );
    this.modelPropertyAddedEmitter.emit( namedProperty );
  }

  /**
   * Removes a NamedProperty from this program.
   * @param {namedProperty} namedProperty
   */
  removeModelProperty( namedProperty ) {
    const indexOfProperty = this.modelProperties.indexOf( namedProperty );
    assert && assert( indexOfProperty > -1, 'Property not in model' );
    this.modelProperties.splice( indexOfProperty, 1 );
    this.modelPropertyRemovedEmitter.emit( namedProperty );
  }

  /**
   * TODO: Remove any other connections with other programs.
   */
  dispose() {
    this.modelPropertyAddedEmitter.dispose();
    this.modelPropertyRemovedEmitter.dispose();
    this.positionProperty.dispose();
    this.deleteEmitter.dispose();
  }
}