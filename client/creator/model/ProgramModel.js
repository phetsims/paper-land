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

  /**
   * Load the metadata for this program.
   * @param stateObject
   */
  loadMetadata( stateObject ) {
    this.number = stateObject.number;
    this.titleProperty.value = stateObject.title;
    this.keywordsProperty.value = stateObject.keywords;
    this.descriptionProperty.value = stateObject.description;
  }

  /**
   * Load the model components that exist on their own, and must be available before any other components are created.
   */
  loadDependencyModelComponents( stateObject ) {
    this.modelContainer.loadDependencyModelComponents( stateObject.modelContainer );
  }

  /**
   * Load model components that require dependency model components to be created.
   * @param stateObject
   * @param allComponents - All model components (from all programs) that have been created so far.
   */
  loadDependentModelComponents( stateObject, allComponents ) {
    this.modelContainer.loadDependentModelComponents( stateObject.modelContainer, allComponents );
  }

  /**
   * Load controller components that will control model components.
   * @param stateObject
   * @param allComponents - All model components (from all programs) that have been created so far.
   */
  loadControllerComponents( stateObject, allComponents ) {
    this.controllerContainer.load( stateObject.controllerContainer, allComponents );
  }
}