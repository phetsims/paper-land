import xhr from 'xhr';
import CreatorVisibilityModel from './CreatorVisibilityModel.js';
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

    this.allListenerComponents = phet.axon.createObservableArray();

    // {Property.<ActiveEdit|null>} - A reference to the program and type of components/data we are editing for it.
    this.activeEditProperty = new phet.axon.Property( null );

    // {Property.<boolean>} - The Space name that is currently being worked on
    this.spaceNameProperty = new phet.axon.Property( '' );

    // {Property.<boolean>} - The System name that is currently being worked on
    this.systemNameProperty = new phet.axon.Property( '' );

    // {CreatorVisibilityModel}
    this.visibilityModel = new CreatorVisibilityModel();

    // {Emitter} - Emits an event when the user would like to save the current system as programs
    // to the selected space. This will clear existing programs in the space, so we first move
    // to a confirmation dialog to confirm the action.
    this.sendRequestedEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits an event when the user has confirmed that they want to save the program
    // to the selected space.
    this.sendConfirmedEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits when some error happens that the user should be aware of, such as error during code
    // generation, load, or a failed request to the server.
    this.errorOccurredEmitter = new phet.axon.Emitter( { parameters: [ { valueType: 'string' } ] } );

    this.sendConfirmedEmitter.addListener( async () => {
      this.sendProgramsToPlayground()
        .then( () => {

          // Show a success notification if the request succeeds.
          console.log( 'Success!' );

        } )
        .catch( error => {
          this.errorOccurredEmitter.emit( error.message );

          // Show an error dialog if the request fails.
          console.error( 'ERROR:', error.message );
        } );
    } );
  }

  /**
   * Create a new program, registering important listeners for its removal within this model.
   * @param {Vector2} initialPosition - initial position for the program
   * @param {number} [programNumber] - the number of this program, defaults to a random number {number
   * @return {ProgramModel}
   */
  createProgram( initialPosition, programNumber ) {
    const newProgram = new ProgramModel( initialPosition, programNumber, this.activeEditProperty );
    this.programs.push( newProgram );

    // Listen for the delete emitter which tells us its time to delete a program
    const deleteListener = () => {
      this.deleteProgram( newProgram );
      newProgram.deleteEmitter.removeListener( deleteListener );
    };
    newProgram.deleteEmitter.addListener( deleteListener );

    // listen for when the program gets new components so we can add it to our global lists
    this.addComponentAddedListener( this.allModelComponents, newProgram.modelContainer.allComponents );
    this.addComponentAddedListener( this.allControllerComponents, newProgram.controllerContainer.allComponents );
    this.addComponentAddedListener( this.allViewComponents, newProgram.viewContainer.allComponents );
    this.addComponentAddedListener( this.allListenerComponents, newProgram.listenerContainer.allComponents );

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

    // Program components are loaded individually here because all program dependency components
    // must be created before view code.
    if ( json.programs ) {

      // first create all programs and load dependency model components
      json.programs.forEach( programJSON => {
        const programPosition = phet.dot.Vector2.fromStateObject( programJSON.positionProperty );
        const programNumber = programJSON.number;
        const newProgram = this.createProgram( programPosition, programNumber );

        newProgram.loadMetadata( programJSON );
        newProgram.loadDependencyModelComponents( programJSON );
        newProgram.loadCustomCode( programJSON );
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
        program.loadViewComponents( programJSON, this.allModelComponents );
      } );
    }
  }

  clear() {
    this.load( { programs: [] } );
  }

  /**
   * Returns an array of strings for the code of this system. Used to move code to the paper-playground database of
   * programs.
   */
  convertToProgramData() {
    const programStrings = [];
    this.programs.forEach( program => {
      programStrings.push( {
        number: program.number,
        code: program.convertToProgramString()
      } );
    } );
    return programStrings;
  }

  async sendProgramsToPlayground() {
    const url = new URL( `api/spaces/${this.spaceNameProperty.value}/programs/set`, window.location.origin ).toString();
    return new Promise( ( resolve, reject ) => {

      // Convert model to code for the database. If this throws an error for some reason (like an unsupported type),
      // the promise should reject.
      const dataForServer = this.convertToProgramData();

      if ( window.dev ) {
        dataForServer.forEach( programCodeString => {
          console.log( '///////////////////////////////////////////////////////////////////////////////////////////' );
          console.log( programCodeString.code );
          console.log( '///////////////////////////////////////////////////////////////////////////////////////////' );
        } );
      }

      xhr.post( url, {
        json: {
          programs: dataForServer
        }
      }, ( error, response ) => {
        if ( error ) {
          reject( error );
        }
        else {
          resolve( 'System Created!' );
          console.log( 'System created!' );

          // Set a flag on the appliation storage to indicate that programs were just created with Creator
          localStorage.paperProgramsCreatedWithCreator = true;
        }
      } );
    } );
  }
}