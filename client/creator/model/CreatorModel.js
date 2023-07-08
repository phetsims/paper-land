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

    this.allControllerComponents = phet.axon.createObservableArray();

    this.allViewComponents = phet.axon.createObservableArray();

    // {Property.<ActiveEdit|null>} - A reference to the program and type of components/data we are editing for it.
    this.activeEditProperty = new phet.axon.Property( null );

    // {Property.<boolean>} - The Space name that is currently being worked on
    this.spaceNameProperty = new phet.axon.Property( '' );

    // {Property.<boolean>} - The System name that is currently being worked on
    this.systemNameProperty = new phet.axon.Property( '' );

    window.saveFunction = this.save.bind( this );
  }

  /**
   * Create a new program, registering important listeners for its removal within this model.
   * @param {Vector2} initialPosition - initial position for the program
   * @param {number} [programNumber] - the number of this program, defaults to a random number {number
   * @return {ProgramModel}
   */
  createProgram( initialPosition, programNumber ) {
    const newProgram = new ProgramModel( initialPosition, programNumber );
    this.programs.push( newProgram );

    // Listen for the delete emitter which tells us its time to delete a program
    const deleteListener = () => {
      this.deleteProgram( newProgram );
      newProgram.deleteEmitter.removeListener( deleteListener );
    };
    newProgram.deleteEmitter.addListener( deleteListener );

    // listen for when the program gets a new model component so we can add it to our global list
    this.addComponentAddedListener( this.allModelComponents, newProgram.modelContainer.allComponents );
    this.addComponentAddedListener( this.allControllerComponents, newProgram.controllerContainer.allComponents );

    // // Listen for when a program gets a new component so we can add it to the global list
    // const modelComponentAddedListener = addedModelComponent => {
    //   this.allModelComponents.push( addedModelComponent );
    //
    //   // listen for its removal
    //   const modelComponentRemovedListener = removedModelComponent => {
    //     if ( addedModelComponent === removedModelComponent ) {
    //       this.allModelComponents.remove( removedModelComponent );
    //       newProgram.modelContainer.allComponents.elementRemovedEmitter.removeListener( modelComponentRemovedListener );
    //     }
    //   };
    //   newProgram.modelContainer.allComponents.elementRemovedEmitter.addListener( modelComponentRemovedListener );
    // };
    // newProgram.modelContainer.allComponents.elementAddedEmitter.addListener( modelComponentAddedListener );

    this.programAddedEmitter.emit( newProgram );

    return newProgram;
  }

  /**
   * Adds a listener to the provided programComponentList that will add the component to a global list in this model.
   * Also registers removal listeners so that global lists are up to date.
   *
   * @param allComponentsList - the observable global list for this model
   * @param programComponentList - the observable list for a specific program
   */
  addComponentAddedListener( allComponentsList, programComponentList ) {
    const componentAddedListener = addedComponent => {
      allComponentsList.push( addedComponent );

      // listen for its removal
      const componentRemovedListener = removedComponent => {
        if ( addedComponent === removedComponent ) {
          allComponentsList.remove( removedComponent );
          programComponentList.elementRemovedEmitter.removeListener( componentRemovedListener );
        }
      };
      programComponentList.elementRemovedEmitter.addListener( componentRemovedListener );
    };
    programComponentList.elementAddedEmitter.addListener( componentAddedListener );
  }

  /**
   * Returns true if the provided Name is not used by any of the component containers.
   * @param {string} name
   */
  isNameAvailable( name ) {

    // Check if the name is used by any of the programs
    return !this.programs.some( program => program.isNameUsed( name ) );
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

  /**
   * Save this model as JSON for serialization.
   * @return {Object} json
   *
   * @public
   */
  save() {
    return {
      programs: this.programs.map( program => program.save() )
    };
  }

  /**
   * Load a state for the model as described by the provided JSON.
   * @param {Object} json
   *
   * @public
   */
  load( json ) {

    // shallow copy as we clear the array
    this.programs.slice().forEach( program => this.deleteProgram( program ) );

    if ( json.programs ) {

      // first create all programs and load dependency model components
      json.programs.forEach( programJSON => {
        const programPosition = phet.dot.Vector2.fromStateObject( programJSON.positionProperty );
        const programNumber = programJSON.number;
        const newProgram = this.createProgram( programPosition, programNumber );

        newProgram.loadMetadata( programJSON );
        newProgram.loadDependencyModelComponents( programJSON );
      } );

      // then load DerivedProperty components once dependencies are in place
      json.programs.forEach( programJSON => {
        const program = this.programs.find( program => program.number === programJSON.number );
        program.loadDependentModelComponents( programJSON, this.allModelComponents );
      } );

      // then load controller/view components once model components are in place
      json.programs.forEach( programJSON => {
        const program = this.programs.find( program => program.number === programJSON.number );
        program.loadControllerComponents( programJSON, this.allModelComponents );

        // TODO
        // program.loadViewComponents( programJSON );
      } );
    }
  }

  clear() {
    this.load( { programs: [] } );
  }
}