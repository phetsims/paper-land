import ProgramControllerContainer from './ProgramControllerContainer.js';
import ProgramModelContainer from './ProgramModelContainer.js';

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

    // @public - responsible for all 'model' components of this program
    this.modelContainer = new ProgramModelContainer();

    this.controllerContainer = new ProgramControllerContainer();

    // @public - the position of this program in the editor
    this.positionProperty = new phet.dot.Vector2Property( initialPosition );

    // @public - emits an event when it is time to delete this program
    this.deleteEmitter = new phet.axon.Emitter();
  }

  /**
   * TODO: Remove any other connections with other programs.
   */
  dispose() {
    this.modelContainer.dispose();
    this.positionProperty.dispose();
    this.deleteEmitter.dispose();
  }

  save() {
    return {
      number: this.number,
      title: this.titleProperty.value,
      keywords: this.keywordsProperty.value,
      description: this.descriptionProperty.value,

      // A built-in function available because of phet-io
      positionProperty: this.positionProperty.value.toStateObject(),

      modelContainer: this.modelContainer.save(),
      controllerContainer: this.controllerContainer.save(),
      viewContainer: this.viewContainer.save()
    };
  }
}