import ProgramModel from './ProgramModel.js';

export default class CreatorModel {
  constructor() {

    // {ProgramModel[]} - Collection of all programs in the creator editor
    this.programs = [];

    // emits when a program is added
    this.programAddedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: ProgramModel } ] } );

    // emits when a program is removed
    this.programRemovedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: ProgramModel } ] } );

    // {Property<null|ProgramModel>} - A reference to the program that is currently selected for the user.
    // this.selectedProgramProperty = new phet.axon.Property( null );

    // {
    //   program
    //   editType: metadata, component, listener
    //
    // } | null
    this.activeEditProperty = new phet.axon.Property( null );
  }

  createProgram( initialPosition ) {
    const newProgram = new ProgramModel( initialPosition );
    this.programs.push( newProgram );

    const deleteListener = () => {
      this.deleteProgram( newProgram );
      newProgram.deleteEmitter.removeListener( deleteListener );
    };
    newProgram.deleteEmitter.addListener( deleteListener );

    this.programAddedEmitter.emit( newProgram );
  }

  deleteProgram( program ) {
    assert && assert( this.programs.includes( program ), 'program is not in this list of programs' );
    this.programs.splice( this.programs.indexOf( program ), 1 );

    this.programRemovedEmitter.emit( program );

    program.dispose();
  }
}