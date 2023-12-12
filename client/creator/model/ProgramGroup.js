export default class ProgramGroup {
  constructor() {

    // @public {ProgramModel[]} - List of all programs that exist in this group.
    this.programs = [];

    // The title of this group which can change
    this.titleProperty = new phet.core.Property( '' );

    // The position of this group in the creator view
    this.positionProperty = new phet.dot.Vector2Property( new phet.dot.Vector2( 0, 0 ) );

    // dimensions of the group box that contain programs
    this.widthProperty = new phet.core.Property( 0 );
    this.heightProperty = new phet.core.Property( 0 );
  }

  /**
   * Returns true if the bounding box of this group contains the given point.
   * @param point
   * @return {boolean}
   */
  groupBoundsContainsPoint( point ) {
    const minX = this.positionProperty.value.x;
    const maxX = minX + this.widthProperty.value;
    const minY = this.positionProperty.value.y;
    const maxY = minY + this.heightProperty.value;

    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
  }

  programIsInGroup( program ) {
    return this.programs.indexOf( program ) !== -1;
  }

  addProgramToGroup( program ) {

    // make sure that the program does not already exist in this group.
    if ( !this.programIsInGroup( program ) ) {
      this.programs.push( program );
    }
  }

  removeProgramFromGroup( program ) {
    if ( this.programIsInGroup( program ) ) {
      const index = this.programs.indexOf( program );
      this.programs.splice( index, 1 );
    }
  }

  save() {
    return {
      title: this.titleProperty.value,
      positionProperty: this.positionProperty.value.toStateObject(),
      width: this.widthProperty.value,
      height: this.heightProperty.value
    };
  }

  static fromStateObject( stateObject, allPrograms ) {
    const programGroup = new ProgramGroup();
    programGroup.titleProperty.value = stateObject.title;
    programGroup.positionProperty.value = phet.dot.Vector2.fromStateObject( stateObject.positionProperty );
    programGroup.widthProperty.value = stateObject.width;
    programGroup.heightProperty.value = stateObject.height;

    // This assumes that all programs have fully loaded and are positioned correctly
    allPrograms.forEach( program => {
      if ( programGroup.groupBoundsContainsPoint( program.positionProperty.value ) ) {
        programGroup.addProgramToGroup( program );
      }
    } );

    return programGroup;
  }
}