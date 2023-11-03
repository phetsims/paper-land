import xhr from 'xhr';
import CreatorVisibilityModel from './CreatorVisibilityModel.js';
import ProgramModel from './ProgramModel.js';

export default class CreatorModel {
  constructor() {

    // {ProgramModel[]} - Collection of all programs in the creator editor
    this.programs = phet.axon.createObservableArray();

    // emits when a program is added
    this.programAddedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: ProgramModel } ] } );

    // emits when a program is removed
    this.programRemovedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: ProgramModel } ] } );

    // Emits an event whenever the model successfully loads a new state from JSON.
    this.loadCompleteEmitter = new phet.axon.Emitter();

    // An obserable array of all model components in all programs
    this.allModelComponents = phet.axon.createObservableArray();

    this.allControllerComponents = phet.axon.createObservableArray();

    this.allViewComponents = phet.axon.createObservableArray();

    this.allListenerComponents = phet.axon.createObservableArray();

    // {Property.<ActiveEdit|null>} - A reference to the program and type of components/data we are editing for it.
    this.activeEditProperty = new phet.axon.Property( null );

    // {Property.<boolean>} - The Space name that is currently being worked on
    this.spaceNameProperty = new phet.axon.Property( '' );

    // {Property.<boolean>} - Whether the space is restricted to the current user, and many controls are disabled.
    this.spaceRestrictedProperty = new phet.axon.BooleanProperty( false );

    // {Property.<boolean>} - The Project name that is currently being worked on
    this.projectNameProperty = new phet.axon.Property( '' );

    // {Property.<boolean>} - Are we currently creating new programs from a template?
    this.creatingFromTemplateProperty = new phet.axon.BooleanProperty( false );

    // {CreatorVisibilityModel}
    this.visibilityModel = new CreatorVisibilityModel();

    // {Emitter} - Emits an event when the user would like to save the current project as programs
    // to the selected space. This will clear existing programs in the space, so we first move
    // to a confirmation dialog to confirm the action.
    this.sendRequestedEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits an event when the user has confirmed that they want to save the program
    // to the selected space.
    this.sendConfirmedEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits when some error happens that the user should be aware of, such as error during code
    // generation, load, or a failed request to the server.
    this.errorOccurredEmitter = new phet.axon.Emitter( { parameters: [ { valueType: 'string' } ] } );

    // {Emitter} - Emits when any successful action takes place. We generally want to display that some action
    // was successful. Use this to display a success message to the user.
    this.successOccurredEmitter = new phet.axon.Emitter( { parameters: [ { valueType: 'string' } ] } );

    // {Emitter} - Emits when the save request to the server is successful.
    this.saveSuccessfulEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits when the save template request to the server is successful.
    this.saveTemplateSuccessfulEmitter = new phet.axon.Emitter();

    this.sendConfirmedEmitter.addListener( async () => {

      // Save programs to the server whenever we send to the playground (users expected this to be automatic).
      await this.sendSaveRequest();

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
   * @param {number} [programNumber] - the number of this program, defaults to a random number
   * @return {ProgramModel}
   */
  createProgram( initialPosition, programNumber ) {
    const newProgram = new ProgramModel( initialPosition, programNumber, this.activeEditProperty );
    this.programs.push( newProgram );

    // listen for requests to copy this program
    const copyListener = () => {
      this.copyProgram( newProgram );
    };
    newProgram.copyEmitter.addListener( copyListener );

    // Listen for the delete emitter which tells us its time to delete a program
    const deleteListener = () => {
      this.deleteProgram( newProgram );
      newProgram.deleteEmitter.removeListener( deleteListener );

      // remove the copy listener as well
      newProgram.copyEmitter.removeListener( copyListener );
    };
    newProgram.deleteEmitter.addListener( deleteListener );

    // listen for when the program gets new components so that we can add it to our global lists (this function also
    // registers the component removal listeners)
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

      // add to the global list
      allComponentsList.push( addedComponent );

      // observe name changes so that all custom code (in EVERY program) can update when a component is renamed
      const nameChangeListener = ( newName, oldName ) => {
        if ( oldName ) {
          this.programs.forEach( programModel => {
            programModel.customCodeContainer.updateVariableReferences( newName, oldName );
          } );
        }
      };
      addedComponent.nameProperty.link( nameChangeListener );

      // listen for its removal
      const componentRemovedListener = removedComponent => {
        if ( addedComponent === removedComponent ) {
          allComponentsList.remove( removedComponent );
          programComponentList.elementRemovedEmitter.removeListener( componentRemovedListener );
          addedComponent.nameProperty.unlink( nameChangeListener );
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

  /**
   * From the provided name, add a "_copy1" suffix, or increment the number if that copy value until we find an
   * available name.
   *
   * @param {string} name - The name we want to copy.
   */
  getUniqueCopyName( name ) {

    // As a safety precaution, we will only try a certain number of times to find a unique name.
    const maxAttempts = 1000;

    let copyNumber = 1;
    while ( copyNumber < maxAttempts ) {
      const copyName = `${name}_Copy${copyNumber}`;
      if ( this.isNameAvailable( copyName ) ) {
        return copyName;
      }
      copyNumber++;
    }

    // If we get here, we have tried too many times and should throw an error.
    throw new Error( `Could not find a unique name for ${name}` );
  }

  /**
   * Returns true if the provided number is not used by any of the other programs.
   */
  isNumberAvailable( number ) {
    return !this.programs.some( program => program.numberProperty.value === number );
  }

  /**
   * Makes a copy of this program. The new program is given a random number. The program and component names
   * are copied but will include a suffix to make them unique. And the metadata will indicate that
   * this program was copied from another.
   * @param program
   */
  copyProgram( program ) {
    assert && assert( this.programs.includes( program ), 'program is not in this list of programs' );

    const newPosition = program.positionProperty.value.plusXY( 20, 20 );
    const newProgram = this.createProgram( newPosition );

    const programJSON = program.save();
    newProgram.copyFromOther( programJSON, this.getUniqueCopyName.bind( this ), this.allModelComponents );
    return newProgram;
  }

  /**
   * Create a copy of a program from the provided JSON state. The new program is given a random number. The program and
   * component names are copied but will include a suffix or make them unique.
   * @param programJSON
   * @return {ProgramModel}
   */
  copyProgramFromJSON( programJSON ) {
    const newPosition = phet.dot.Vector2.fromStateObject( programJSON.positionProperty ).plusXY( 20, 20 );
    const newProgram = this.createProgram( newPosition );

    newProgram.copyFromOther( programJSON, this.getUniqueCopyName.bind( this ), this.allModelComponents );
    return newProgram;
  }

  /**
   * Deletes the program from them model, removing all contained components.
   */
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
    this.loadProgramsFromJSON( json );

    this.loadCompleteEmitter.emit();
  }

  loadProgramsFromJSON( json ) {

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
        const program = this.programs.find( program => program.numberProperty.value === programJSON.number );
        program.loadDependentModelComponents( programJSON, this.allModelComponents );
      } );

      // then load controller/view components once model components are in place
      json.programs.forEach( programJSON => {
        const program = this.programs.find( program => program.numberProperty.value === programJSON.number );
        program.loadControllerComponents( programJSON, this.allModelComponents );
        program.loadViewComponents( programJSON, this.allModelComponents );
      } );
    }
  }

  /**
   * Create one or more programs from the provided JSON.
   * @param templateJSONString - Saved state describing the programs we need to create.
   */
  createFromTemplate( templateJSONString ) {

    try {
      const templateJSON = JSON.parse( templateJSONString );
      templateJSON.programs.forEach( programJSON => {
        this.copyProgramFromJSON( programJSON );
      } );
    }
    catch( error ) {
      this.errorOccurredEmitter.emit( error.message );
    }
  }

  clear() {
    this.load( { programs: [] } );
  }

  /**
   * Returns an array of strings for the code of this project. Used to move code to the paper-playground database of
   * programs.
   */
  convertToProgramData() {
    const programStrings = [];
    this.programs.forEach( program => {
      programStrings.push( {
        number: program.numberProperty.value,
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
          resolve( 'Project Created!' );
          console.log( 'Project created!' );

          // Set a flag on the appliation storage to indicate that programs were just created with Creator
          localStorage.paperProgramsCreatedWithCreator = true;
        }
      } );
    } );
  }

  /**
   * Send a save request to the server, and emit an event when it succeeds.
   * @return {Promise<unknown>}
   */
  async sendSaveRequest() {

    return new Promise( ( resolve, reject ) => {
      const json = this.save();

      console.log( json );

      const url = new URL( `api/creator/${this.spaceNameProperty.value}/${this.projectNameProperty.value}`, window.location.origin ).toString();
      xhr.put( url, { json: { projectData: json } }, ( error, response ) => {
        if ( error ) {
          console.error( error );
          reject( error );
        }
        else {
          this.saveSuccessfulEmitter.emit();
          resolve();
        }
      } );
    } );
  }

  /**
   * Send a request to save a new template with the current programs in the editor.
   * @param templateName - Name for the template
   * @param description - A description of what this template does
   * @param keyWords - keywords to search for this template
   * @param saveToSpace - If true, the template will be saved to the currently selected space. Otherwise spaceName
   *                      will be left null in the database, and the template will be available to all spaces.
   * @return {Promise<unknown>}
   */
  async sendSaveTemplateRequest( templateName, description, keyWords, saveToSpace ) {
    const spaceName = saveToSpace ? this.spaceNameProperty.value : null;

    return new Promise( ( resolve, reject ) => {
      const json = this.save();

      const url = new URL( 'api/creator/templates', window.location.origin ).toString();
      xhr.put( url, {
        json: {
          templateName, description, keyWords, projectData: json, spaceName: spaceName
        }
      }, ( error, response ) => {
        if ( error ) {
          console.error( error );
          this.errorOccurredEmitter.emit( error.message );
          reject( error );
        }
        else {

          if ( response.statusCode === 402 ) {
            this.errorOccurredEmitter.emit( 'Template name already exists' );
          }
          else if ( response.statusCode === 403 ) {
            this.errorOccurredEmitter.emit( response.body );
          }
          else if ( response.statusCode === 200 ) {
            this.saveTemplateSuccessfulEmitter.emit();
            resolve();
          }
          else {
            this.errorOccurredEmitter.emit( 'Unknown error occurred' );
          }
        }
      } );
    } );
  }

  /**
   * Update a template with the provided data.
   * @param templateId - the unique id for this template (within the database)
   * @param templateName
   * @param description
   * @param keyWords
   */
  async sendUpdateTemplateRequest( templateId, templateName, description, keyWords ) {
    return new Promise( ( resolve, reject ) => {
      const json = this.save();

      const url = new URL( 'api/creator/templates/update/save', window.location.origin ).toString();
      xhr.put( url, {
        json: {
          templateName, description, keyWords, projectData: json, templateId
        }
      }, ( error, response ) => {
        if ( error ) {
          console.error( error );
          this.errorOccurredEmitter.emit( error.message );
          reject( error );
        }
        else if ( response.statusCode === 403 ) {
          this.errorOccurredEmitter.emit( response.body );
          reject( error );
        }
        else if ( response.statusCode === 200 ) {
          this.saveTemplateSuccessfulEmitter.emit();
          resolve();
        }
        else {
          this.errorOccurredEmitter.emit( 'Unknown error occurred' );
          reject( error );
        }
      } );
    } );
  }

  /**
   * Sends a delete request to the server to delete a template.
   * @param templateName
   * @return {Promise<unknown>}
   */
  async sendDeleteTemplateRequest( templateName ) {
    return new Promise( ( resolve, reject ) => {
      const url = new URL( `api/creator/templates/delete/${templateName}`, window.location.origin ).toString();
      xhr.get( url, {}, ( error, response ) => {
        if ( error ) {
          console.error( error );
          this.errorOccurredEmitter.emit( error.message );
          reject( error );
        }
        else {
          resolve();
        }
      } );
    } );
  }

  /**
   * Sends a general request to the server related to templates.
   */
  async sendTemplateRequest( url ) {
    return new Promise( ( resolve, reject ) => {
      xhr.get( url, {}, ( error, response ) => {
        if ( error ) {
          console.error( error );
          this.errorOccurredEmitter.emit( error.message );
          reject( error );
        }
        else {
          resolve( response.body );
        }
      } );
    } );
  }

  /**
   * Sends a request to the server to get all templates that can be used to create new programs. This includes all
   * global templates and all templates that has been created for the selected space.
   */
  async sendGetTemplatesForUseRequest( spaceName ) {
    if ( !spaceName ) {
      throw new Error( 'Cannot request templates for use without a space name' );
    }

    const url = new URL( `api/creator/templates/use/${spaceName}`, window.location.origin ).toString();
    return this.sendTemplateRequest( url );
  }

  /**
   * Send a request to the server to get all available templates that can be edited by the
   * user (based on the selected space and user privileges).
   */
  async sendGetTemplatesForEditRequest( spaceName ) {
    if ( !spaceName ) {
      throw new Error( 'Cannot request templates for edit without a space name' );
    }

    const url = new URL( `api/creator/templates/edit/${spaceName}`, window.location.origin ).toString();
    return this.sendTemplateRequest( url );
  }
}