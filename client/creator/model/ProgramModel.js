import ProgramControllerContainer from './ProgramControllerContainer.js';
import ProgramModelContainer from './ProgramModelContainer.js';

export default class ProgramModel {

  /**
   * @param {dot.Vector2} initialPosition
   * @param {number} [initialNumber] - the number of this program
   */
  constructor( initialPosition, initialNumber ) {

    // @public (read-only) - the number of this program
    this.number = initialNumber === undefined ? Math.floor( Math.random() * 1000 ) : initialNumber;

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
   * Returns true if the provided name is already taken by some component container.
   */
  isNameUsed( name ) {

    // Check if the name is used by any of the model components
    const usedInModel = this.modelContainer.allComponents.some( component => component.name === name );
    const usedInController = this.controllerContainer.allComponents.some( component => component.name === name );

    return usedInModel || usedInController;
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
      controllerContainer: this.controllerContainer.save()
    };
  }

  load( stateObject ) {
    this.number = stateObject.number;
    this.titleProperty.value = stateObject.title;
    this.keywordsProperty.value = stateObject.keywords;
    this.descriptionProperty.value = stateObject.description;

    this.positionProperty.value = phet.dot.Vector2.fromStateObject( stateObject.positionProperty );

    // Load all model components first, since view and controller components are dependent on them
    this.modelContainer.load( stateObject.modelContainer );
    this.controllerContainer.load( stateObject.controllerContainer, this.modelContainer.allComponents );

    // TODO
    // this.viewContainer.load( stateObject.viewContainer, this.modelContainer.allComponents );
  }
}