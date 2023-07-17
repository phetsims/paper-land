/**
 * The combination of a Program and what is currently being edited. This data is used for state to
 * determine which are available to the user to create program content.
 */

export default class ActiveEdit {

  /**
   * @param {ProgramModel} program
   * @param {EditType} editType
   * @param {Component|null} [component] - the component that is being edited, if any
   */
  constructor( program, editType, component ) {
    this.program = program;
    this.editType = editType;
    this.component = component || null;
  }
}