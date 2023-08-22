import ProgramCodeGenerator from './code/ProgramCodeGenerator.js';
import ProgramControllerContainer from './ProgramControllerContainer.js';
import ProgramModelContainer from './ProgramModelContainer.js';
import ProgramViewContainer from './views/ProgramViewContainer.js';
import ProgramListenerContainer from './ProgramListenerContainer.js';

// This value comes from the paper-land API. I am not sure why this value is used. It exists in server files so
// I am not sure how best to share it.
const MAX_PROGRAM_NUMBER = 8400 / 4;

export default class ProgramModel {

  /**
   * @param {dot.Vector2} initialPosition
   * @param {number} [initialNumber] - the number of this program
   * @param {Property<ActiveEdit|null>} activeEditProperty
   */
  constructor( initialPosition, initialNumber, activeEditProperty ) {

    // @public (read-only) - the number of this program
    this.number = initialNumber === undefined ? Math.floor( Math.random() * MAX_PROGRAM_NUMBER ) : initialNumber;

    // @public (read-only)
    this.activeEditProperty = activeEditProperty;

    this.titleProperty = new phet.axon.StringProperty( '' );
    this.keywordsProperty = new phet.axon.StringProperty( '' );
    this.descriptionProperty = new phet.axon.StringProperty( '' );

    // @public - responsible for all 'model' components of this program
    this.modelContainer = new ProgramModelContainer( this, activeEditProperty );

    // @public - responsible for all 'controller' components of this program
    this.controllerContainer = new ProgramControllerContainer( this, activeEditProperty );

    // @public - responsible for all 'view' components of this program
    this.viewContainer = new ProgramViewContainer( this, activeEditProperty );

    // @public - responsible for miscellaneous 'listener' components for this program.
    this.listenerContainer = new ProgramListenerContainer( this, activeEditProperty );

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
    const usedInModel = this.modelContainer.allComponents.some( component => component.nameProperty.value === name );
    const usedInController = this.controllerContainer.allComponents.some( component => component.nameProperty.value === name );
    const usedInView = this.viewContainer.allComponents.some( component => component.nameProperty.value === name );
    const usedInListener = this.listenerContainer.allComponents.some( component => component.nameProperty.value === name );

    return usedInModel || usedInController || usedInView || usedInListener;
  }

  /**
   * TODO: Remove any other connections with other programs.
   */
  dispose() {
    this.positionProperty.dispose();

    this.modelContainer.dispose();
    this.controllerContainer.dispose();
    this.viewContainer.dispose();
    this.listenerContainer.dispose();

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
      viewContainer: this.viewContainer.save(),
      listenerContainer: this.listenerContainer.save()
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

    // I am considering listener components like this similar to the 'controller' components and
    // loading them as part of this step.
    const listenerContainer = stateObject.listenerContainer || {}
    this.listenerContainer.load( listenerContainer, allComponents );
  }

  /**
   * Load view components of this ProgramModel.
   * @param stateObject
   * @param allComponents - All components of the model (from all programs).
   */
  loadViewComponents( stateObject, allComponents ) {
    this.viewContainer.load( stateObject.viewContainer, allComponents );
  }

  /**
   * Converts this program to a string of code that will actually be used in the paper-playground
   * framework.
   */
  convertToProgramString() {
    return ProgramCodeGenerator.convertToCode( this );
  }
}