/**
 * A class that manages custom code for a program. This ideally supports
 * behavior that is not abstracted in the interface. There is a code
 * string for each paper event that will be appended to the end
 * of the generated code.
 */
import { renameVariableInCode, replaceReferencesInCode } from '../../utils.js';

export default class CustomCodeContainer {
  constructor() {

    // The code strings for each paper event
    // Then update code editor form to match the metadata form.
    // Then code generation from this.
    this.onProgramAddedCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramRemovedCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramChangedPositionCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramMarkersAddedCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramMarkersRemovedCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramMarkersChangedPositionCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramAdjacentCodeProperty = new phet.axon.StringProperty( '' );
    this.onProgramSeparatedCodeProperty = new phet.axon.StringProperty( '' );

    // True if any of the above Properties have content.
    this.hasCustomCodeProperty = new phet.axon.DerivedProperty( [
      this.onProgramAddedCodeProperty,
      this.onProgramRemovedCodeProperty,
      this.onProgramChangedPositionCodeProperty,
      this.onProgramMarkersAddedCodeProperty,
      this.onProgramMarkersRemovedCodeProperty,
      this.onProgramMarkersChangedPositionCodeProperty,
      this.onProgramAdjacentCodeProperty,
      this.onProgramSeparatedCodeProperty
    ], ( onProgramAddedCode, onProgramRemovedCode, onProgramChangedPositionCode, onProgramMarkersAddedCode,
         onProgramMarkersRemovedCode, onProgramMarkersChangedPositionCode, onProgramAdjacentCode, onProgramSeparatedCode ) => {
      return onProgramAddedCode || onProgramRemovedCode || onProgramChangedPositionCode ||
             onProgramMarkersAddedCode || onProgramMarkersRemovedCode || onProgramMarkersChangedPositionCode ||
             onProgramAdjacentCode || onProgramSeparatedCode;
    } );
  }

  /**
   * Updates all variable references in code strings, replacing oldName with newName.
   */
  updateVariableReferences( newName, oldName ) {
    this.onProgramAddedCodeProperty.value = renameVariableInCode( this.onProgramAddedCodeProperty.value, newName, oldName );
    this.onProgramRemovedCodeProperty.value = renameVariableInCode( this.onProgramRemovedCodeProperty.value, newName, oldName );
    this.onProgramChangedPositionCodeProperty.value = renameVariableInCode( this.onProgramChangedPositionCodeProperty.value, newName, oldName );
    this.onProgramMarkersAddedCodeProperty.value = renameVariableInCode( this.onProgramMarkersAddedCodeProperty.value, newName, oldName );
    this.onProgramMarkersRemovedCodeProperty.value = renameVariableInCode( this.onProgramMarkersRemovedCodeProperty.value, newName, oldName );
    this.onProgramMarkersChangedPositionCodeProperty.value = renameVariableInCode( this.onProgramMarkersChangedPositionCodeProperty.value, newName, oldName );
    this.onProgramAdjacentCodeProperty.value = renameVariableInCode( this.onProgramAdjacentCodeProperty.value, newName, oldName );
    this.onProgramSeparatedCodeProperty.value = renameVariableInCode( this.onProgramSeparatedCodeProperty.value, newName, oldName );
  }

  /**
   * Disposes of all Properties within this container.
   */
  dispose() {
    this.hasCustomCodeProperty.dispose();
    this.onProgramAddedCodeProperty.dispose();
    this.onProgramRemovedCodeProperty.dispose();
    this.onProgramChangedPositionCodeProperty.dispose();
    this.onProgramMarkersAddedCodeProperty.dispose();
    this.onProgramMarkersRemovedCodeProperty.dispose();
    this.onProgramMarkersChangedPositionCodeProperty.dispose();
    this.onProgramAdjacentCodeProperty.dispose();
    this.onProgramSeparatedCodeProperty.dispose();
  }

  /**
   * Serialize this container to support save and load.
   */
  save() {
    return {
      onProgramAddedCode: this.onProgramAddedCodeProperty.value,
      onProgramRemovedCode: this.onProgramRemovedCodeProperty.value,
      onProgramChangedPositionCode: this.onProgramChangedPositionCodeProperty.value,
      onProgramMarkersAddedCode: this.onProgramMarkersAddedCodeProperty.value,
      onProgramMarkersRemovedCode: this.onProgramMarkersRemovedCodeProperty.value,
      onProgramMarkersChangedPositionCode: this.onProgramMarkersChangedPositionCodeProperty.value,
      onProgramAdjacentCode: this.onProgramAdjacentCodeProperty.value,
      onProgramSeparatedCode: this.onProgramSeparatedCodeProperty.value
    };
  }

  /**
   * Load an instance of this container from a serialized state.
   */
  load( stateObject ) {

    // The custom code container is new and may not have been saved yet
    stateObject = stateObject || {};

    this.onProgramAddedCodeProperty.value = stateObject.onProgramAddedCode || '';
    this.onProgramRemovedCodeProperty.value = stateObject.onProgramRemovedCode || '';
    this.onProgramChangedPositionCodeProperty.value = stateObject.onProgramChangedPositionCode || '';
    this.onProgramMarkersAddedCodeProperty.value = stateObject.onProgramMarkersAddedCode || '';
    this.onProgramMarkersRemovedCodeProperty.value = stateObject.onProgramMarkersRemovedCode || '';
    this.onProgramMarkersChangedPositionCodeProperty.value = stateObject.onProgramMarkersChangedPositionCode || '';
    this.onProgramAdjacentCodeProperty.value = stateObject.onProgramAdjacentCode || '';
    this.onProgramSeparatedCodeProperty.value = stateObject.onProgramSeparatedCode || '';
  }

  /**
   * After components have been renamed (likely from a rename), update all references to the renamed variables
   * in custom code. Note this operation is done on a serialized object.
   *
   * @param customCodeContainerJSON - State object for a CustomCodeContainer.
   * @param {Record<string,string>} nameChangeMap - A map of the changed component names, oldName -> new name
   */
  static updateReferencesAfterRename( customCodeContainerJSON, nameChangeMap ) {

    // update all references in custom code with the new names now that all renames are complete
    for ( const key in customCodeContainerJSON ) {
      for ( const oldName in nameChangeMap ) {
        const newName = nameChangeMap[ oldName ];
        customCodeContainerJSON[ key ] = replaceReferencesInCode( customCodeContainerJSON[ key ], newName, oldName );
      }
    }
  }
}