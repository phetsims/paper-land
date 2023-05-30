import ProgramModel from './ProgramModel.js';

export default class CreatorModel {
  constructor() {

    // {ProgramModel[]} - Collection of all programs in the creator editor
    this.programs = [];

    // emits when a program is added
    this.programAddedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: ProgramModel } ] } );

    // emits when a program is removed
    this.programRemovedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: ProgramModel } ] } );

    // An obserable array of all model components in all programs
    this.allModelComponents = phet.axon.createObservableArray();

    // {Property.<ActiveEdit|null>} - A reference to the program and type of components/data we are editing for it.
    this.activeEditProperty = new phet.axon.Property( null );
  }

  createProgram( initialPosition ) {
    const newProgram = new ProgramModel( initialPosition );
    this.programs.push( newProgram );

    // Listen for the delete emitter which tells us its time to delete a program
    const deleteListener = () => {
      this.deleteProgram( newProgram );
      newProgram.deleteEmitter.removeListener( deleteListener );
    };
    newProgram.deleteEmitter.addListener( deleteListener );

    // Listen for when a program gets a new component so we can add it to the global list
    const modelComponentAddedListener = addedModelComponent => {
      this.allModelComponents.push( addedModelComponent );

      // listen for its removal
      const modelComponentRemovedListener = removedModelComponent => {
        if ( addedModelComponent === removedModelComponent ) {
          this.allModelComponents.remove( removedModelComponent );
          newProgram.modelContainer.allComponents.elementRemovedEmitter.removeListener( modelComponentRemovedListener );
        }
      };
      newProgram.modelContainer.allComponents.elementRemovedEmitter.addListener( modelComponentRemovedListener );
    };
    newProgram.modelContainer.allComponents.elementAddedEmitter.addListener( modelComponentAddedListener );

    this.programAddedEmitter.emit( newProgram );
  }

  deleteProgram( program ) {
    assert && assert( this.programs.includes( program ), 'program is not in this list of programs' );
    this.programs.splice( this.programs.indexOf( program ), 1 );

    // Remove any model components in this container from the list of all components
    program.modelContainer.allComponents.forEach( component => {
      if ( this.allModelComponents.indexOf( component ) > -1 ) {
        this.allModelComponents.remove( component );
      }
    } );

    this.programRemovedEmitter.emit( program );

    program.dispose();
  }
}