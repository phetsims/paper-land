/**
 * A class that manages custom code for a program. This ideally supports
 * behavior that is not abstracted in the interface. There is a code
 * string for each paper event that will be appended to the end
 * of the generated code.
 */

export default class CustomCodeContainer {
  constructor() {

    // The code strings for each paper event
    // TODO for next time: Transitioning to axon Property, use these throughough thisfile.
    // Then update code editor form to match the metadata form.
    // Then code generation from this.
    this.onProgramAddedCode = new phet.axon.StringProperty( '' );
    this.onProgramRemovedCode = new phet.axon.StringProperty( '' );
    this.onProgramChangedPositionCode = new phet.axon.StringProperty( '' );
    this.onProgramMarkersAddedCode = new phet.axon.StringProperty( '' );
    this.onProgramMarkersRemovedCode = new phet.axon.StringProperty( '' );
    this.onProgramMarkersChangedPositionCode = new phet.axon.StringProperty( '' );
    this.onProgramAdjacentCode = new phet.axon.StringProperty( '' );
    this.onProgramSeparatedCode = new phet.axon.StringProperty( '' );
  }

  save() {
    return {
      onProgramAddedCode: this.onProgramAddedCode,
      onProgramRemovedCode: this.onProgramRemovedCode,
      onProgramChangedPositionCode: this.onProgramChangedPositionCode,
      onProgramMarkersAddedCode: this.onProgramMarkersAddedCode,
      onProgramMarkersRemovedCode: this.onProgramMarkersRemovedCode,
      onProgramMarkersChangedPositionCode: this.onProgramMarkersChangedPositionCode,
      onProgramAdjacentCode: this.onProgramAdjacentCode,
      onProgramSeparatedCode: this.onProgramSeparatedCode
    };
  }

  load( stateObject ) {

    // The custom code container is new and may not have been saved yet
    stateObject = stateObject || {};

    this.onProgramAddedCode = stateObject.onProgramAddedCode;
    this.onProgramRemovedCode = stateObject.onProgramRemovedCode;
    this.onProgramChangedPositionCode = stateObject.onProgramChangedPositionCode;
    this.onProgramMarkersAddedCode = stateObject.onProgramMarkersAddedCode;
    this.onProgramMarkersRemovedCode = stateObject.onProgramMarkersRemovedCode;
    this.onProgramMarkersChangedPositionCode = stateObject.onProgramMarkersChangedPositionCode;
    this.onProgramAdjacentCode = stateObject.onProgramAdjacentCode;
    this.onProgramSeparatedCode = stateObject.onProgramSeparatedCode;
  }
}