import ProgramCodeGenerator from './code/ProgramCodeGenerator.js';
import CustomCodeContainer from './CustomCodeContainer.js';
import ProgramControllerContainer from './ProgramControllerContainer.js';
import ProgramListenerContainer from './ProgramListenerContainer.js';
import ProgramModelContainer from './ProgramModelContainer.js';
import ProgramViewContainer from './views/ProgramViewContainer.js';

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
    this.numberProperty = new phet.axon.NumberProperty( initialNumber === undefined ? ProgramModel.generateUniqueProgramNumber() : initialNumber );

    // @public (read-only)
    this.activeEditProperty = activeEditProperty;

    // Various metadata or configuration that applies to the entire program
    this.titleProperty = new phet.axon.StringProperty( '' );
    this.keywordsProperty = new phet.axon.StringProperty( '' );
    this.descriptionProperty = new phet.axon.StringProperty( '' );
    this.topWhiskerLengthProperty = new phet.axon.NumberProperty( 0.2 );
    this.bottomWhiskerLengthProperty = new phet.axon.NumberProperty( 0.2 );
    this.leftWhiskerLengthProperty = new phet.axon.NumberProperty( 0.2 );
    this.rightWhiskerLengthProperty = new phet.axon.NumberProperty( 0.2 );

    // @public - responsible for all 'model' components of this program
    this.modelContainer = new ProgramModelContainer( this, activeEditProperty );

    // @public - responsible for all 'controller' components of this program
    this.controllerContainer = new ProgramControllerContainer( this, activeEditProperty );

    // @public - responsible for all 'view' components of this program
    this.viewContainer = new ProgramViewContainer( this, activeEditProperty );

    // @public - responsible for miscellaneous 'listener' components for this program.
    this.listenerContainer = new ProgramListenerContainer( this, activeEditProperty );

    // @public - responsiblg for any custom code for the paper events in this program
    this.customCodeContainer = new CustomCodeContainer( this, activeEditProperty );

    // @public - the position of this program in the editor
    this.positionProperty = new phet.dot.Vector2Property( initialPosition );

    // @public - emits an event when it is time to delete this program
    this.deleteEmitter = new phet.axon.Emitter();

    // @public - emits an event when the user wants to copy this program
    this.copyEmitter = new phet.axon.Emitter();
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
    this.customCodeContainer.dispose();

    this.deleteEmitter.dispose();
  }

  save() {
    return {
      number: this.numberProperty.value,
      title: this.titleProperty.value,
      keywords: this.keywordsProperty.value,
      description: this.descriptionProperty.value,

      topWhiskerLength: this.topWhiskerLengthProperty.value,
      rightWhiskerLength: this.rightWhiskerLengthProperty.value,
      bottomWhiskerLength: this.bottomWhiskerLengthProperty.value,
      leftWhiskerLength: this.leftWhiskerLengthProperty.value,

      // A built-in function available because of phet-io
      positionProperty: this.positionProperty.value.toStateObject(),

      modelContainer: this.modelContainer.save(),
      controllerContainer: this.controllerContainer.save(),
      viewContainer: this.viewContainer.save(),
      listenerContainer: this.listenerContainer.save(),

      customCodeContainer: this.customCodeContainer.save()
    };
  }

  /**
   * Load the metadata for this program.
   * @param stateObject
   */
  loadMetadata( stateObject ) {
    this.numberProperty.value = stateObject.number;
    this.titleProperty.value = stateObject.title;
    this.keywordsProperty.value = stateObject.keywords;
    this.descriptionProperty.value = stateObject.description;

    // These were added late in the game. We need to be graceful if someone is saving data without saving/loading
    // these values.
    // TODO: Someday, we should remove the fallback code.
    this.topWhiskerLengthProperty.value = stateObject.topWhiskerLength || 0.2;
    this.rightWhiskerLengthProperty.value = stateObject.rightWhiskerLength || 0.2;
    this.bottomWhiskerLengthProperty.value = stateObject.bottomWhiskerLength || 0.2;
    this.leftWhiskerLengthProperty.value = stateObject.leftWhiskerLength || 0.2;
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
    const listenerContainer = stateObject.listenerContainer || {};
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
   * Load any custom code that is associated with this program.
   */
  loadCustomCode( stateObject ) {
    this.customCodeContainer.load( stateObject.customCodeContainer );
  }

  /**
   * Converts this program to a string of code that will actually be used in the paper-playground
   * framework.
   */
  convertToProgramString() {
    return ProgramCodeGenerator.convertToCode( this );
  }

  /**
   * Renames components in (from a JSON representation of a program) to avoid duplicates.
   * @param {JSON} stateObject - Serialized ProgramModel
   * @param getUniqueCopyName - Implementation for creating a unique name (and determining if that is needed).
   *
   * @return {Record<string,string>} - A map of old name -> newName so that when a component is renamed we can
   *                                   update references.
   */
  static renameComponentsToAvoidDuplicates( stateObject, getUniqueCopyName ) {
    const nameChangeMap = {};

    const updateNames = containerJSON => {
      for ( const key in containerJSON ) {
        const components = containerJSON[ key ];
        components.forEach( componentJSON => {
          const originalName = componentJSON.name;
          componentJSON.name = getUniqueCopyName( componentJSON.name );
          nameChangeMap[ originalName ] = componentJSON.name;
        } );
      }
    };

    updateNames( stateObject.modelContainer );
    updateNames( stateObject.controllerContainer );
    updateNames( stateObject.viewContainer );
    updateNames( stateObject.listenerContainer );

    return nameChangeMap;
  }

  /**
   * After a rename of components (likely from a copy), update references between components and
   * variable names in any custom code.
   *
   * @param programJSON
   * @param nameChangeMap
   */
  static updateReferencesAfterRename( programJSON, nameChangeMap ) {

    // Update references between model components after components have been renamed from a copy
    // (Mostly needed for NamedDerivedProperty).
    ProgramModelContainer.updateReferencesAfterRename( programJSON.modelContainer, nameChangeMap );

    // Update the reference between controller components and their controlled model components after a rename.
    ProgramControllerContainer.updateReferencesAfterRename( programJSON.controllerContainer, nameChangeMap );

    // Update references between model and view components, and update usages in custom code for view components.
    ProgramViewContainer.updateReferencesAfterRename( programJSON.viewContainer, nameChangeMap );

    // Update references between dependency and controlled components in a custom listener function.
    ProgramListenerContainer.updateReferencesAfterRename( programJSON.listenerContainer, nameChangeMap );

    // Update code references in custom code after components have been renamed.
    CustomCodeContainer.updateReferencesAfterRename( programJSON.customCodeContainer, nameChangeMap );
  }

  /**
   * Create a unique number (bound by MAX_PROGRAM_NUMBER) for a new program. If any other programs are provided,
   * the number will be unique from those programs.
   *
   * @param [allPrograms]
   */
  static generateUniqueProgramNumber( allPrograms ) {
    allPrograms = allPrograms || [];

    const existingNumbers = allPrograms.map( program => program.numberProperty.value );
    let number = Math.floor( Math.random() * MAX_PROGRAM_NUMBER );

    // Keep trying until we find a unique number
    let tries = 0;
    const maxTries = 100; // a safety net so we don't search forever
    while ( existingNumbers.includes( number ) && tries < maxTries ) {
      number = Math.floor( Math.random() * MAX_PROGRAM_NUMBER );
      tries++;

      assert && assert( tries < maxTries, 'Unable to find a unique program number after 100 tries.' );
    }

    return number;
  }
}