import xhr from 'xhr';
import clientConstants from '../../clientConstants.js';
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

    // A Property for when any request to save/send to playground/load is currently in progress. Certain UI
    // components should be unusable while these operations are in progress.
    this.serverRequestInProgressProperty = new phet.axon.BooleanProperty( false );

    // {Emitter} - Emits an event when the user would like to send the current project as programs
    // to the selected space. This will clear existing programs in the space, so we first move
    // to a confirmation dialog to confirm the action.
    this.sendRequestedEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits an event when the user has confirmed that they want to save the program
    // to the selected space.
    this.sendConfirmedEmitter = new phet.axon.Emitter();

    // {Property} - If true, we do not wait for the user to confirm the send request. The user
    // can elect to skip that confirmation if they want to.
    this.skipSendRequestWarningProperty = new phet.axon.Property( false );

    // {Emitter} - Emits when some error happens that the user should be aware of, such as error during code
    // generation, load, or a failed request to the server.
    this.errorOccurredEmitter = new phet.axon.Emitter( { parameters: [ { valueType: 'string' } ] } );

    // {Emitter} - Emits when any successful action takes place. We generally want to display that some action
    // was successful. Use this to display a success message to the user.
    this.successOccurredEmitter = new phet.axon.Emitter( { parameters: [ { valueType: 'string' } ] } );

    // {Emitter} - Emits when the save request to the server is successful.
    this.saveSuccessfulEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits when the programs are successfully sent to Paper Playground.
    this.sendSuccessfulEmitter = new phet.axon.Emitter();

    // {Emitter} - Emits an event whenever the user makes an action that requires a general confirmation. For
    // example, deleting a program or deleting a component. Takes a message and an action - a callback that
    // will be done if the user confirms the action.
    this.confirmRequestEmitter = new phet.axon.Emitter( {
      parameters: [
        {

          // Instead of a class with valueType check, lets ensure that the object has the correct keys.
          isValidValue: value => {
            return value.hasOwnProperty( 'message' ) && value.hasOwnProperty( 'action' );
          }
        }
      ]
    } );

    // {Emitter} - Emits when the save template request to the server is successful.
    this.saveTemplateSuccessfulEmitter = new phet.axon.Emitter();

    this.sendConfirmedEmitter.addListener( async () => {

      // The send to playground operation was confirmed
      this.serverRequestInProgressProperty.value = true;

      // Save programs to the server whenever we send to the playground (users expected this to be automatic).
      await this.sendSaveRequest();

      this.sendProgramsToPlayground()
        .then( () => {

          // Show a success notification if the request succeeds.
          console.log( 'Success!' );
          this.sendSuccessfulEmitter.emit();
          this.serverRequestInProgressProperty.value = false;

        } )
        .catch( error => {
          this.errorOccurredEmitter.emit( error.message );
          this.serverRequestInProgressProperty.value = false;

          // Show an error dialog if the request fails.
          console.error( 'ERROR:', error.message );
        } );
    } );
  }

  /**
   * Quickly expand/collapse all programs in the model.
   */
  setAllProgramsExpanded( expanded ) {
    this.programs.forEach( program => {
      program.expandedProperty.value = expanded;
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
   * @param {string} [suffixString] - The suffix to add to the name, defaults to "_Copy"
   */
  getUniqueCopyName( name, suffixString = '_Copy' ) {

    // only rename components if necessary
    if ( this.isNameAvailable( name ) ) {
      return name;
    }

    // As a safety precaution, we will only try a certain number of times to find a unique name.
    const maxAttempts = 1000;

    let copyNumber = 1;
    while ( copyNumber < maxAttempts ) {
      const copyName = `${name}${suffixString}${copyNumber}`;
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

    // Convert to JSON and shift down a bit so it is clear this is a new program
    const programJSON = program.save();
    programJSON.positionProperty = program.positionProperty.value.plusXY( 20, 20 ).toStateObject();
    programJSON.title = `${programJSON.title}_Copy`;

    const copyJSON = { programs: [ programJSON ] };
    this.copyProgramsFromJSON( copyJSON );
  }

  /**
   * Create a copy of a program from the provided JSON state. The new program is given a random number. The program and
   * component names are copied but will include a suffix or make them unique.
   * @param json
   * @return {ProgramModel}
   */
  copyProgramsFromJSON( json ) {
    if ( json.programs ) {

      // work on a deep copy so that we do not modify the original JSON
      const deepCopy = JSON.parse( JSON.stringify( json ) );

      // First, go through ALL components in all provided programs and rename components that would collide with
      // existing components. Save names to a map so that we can update references and relationships with
      // those renamed components later.
      const nameChangeMap = {}; // Maps oldName -> newName
      deepCopy.programs.forEach( programJSON => {

        // Create a unique program number
        programJSON.number = ProgramModel.generateUniqueProgramNumber( this.programs );

        // Rename all components as necessary to avoid duplicates
        const newNames = ProgramModel.renameComponentsToAvoidDuplicates( programJSON, this.getUniqueCopyName.bind( this ) );
        _.merge( nameChangeMap, newNames );
      } );

      // Now that everything has been renamed, we can update the relationships and references to renamed components.
      deepCopy.programs.forEach( programJSON => {
        ProgramModel.updateReferencesAfterRename( programJSON, nameChangeMap );
      } );

      // After everything has been renamed, we can load the system from the JSON like normal.
      this.loadProgramsFromJSON( deepCopy );
    }
  }

  /**
   * Deletes the program from them model, removing all contained components.
   */
  deleteProgram( program ) {
    assert && assert( this.programs.includes( program ), 'program is not in this list of programs' );
    this.programs.splice( this.programs.indexOf( program ), 1 );

    this.programRemovedEmitter.emit( program );

    program.dispose();
  }

  /**
   * Save this model as JSON for serialization.
   * @return {Object} json
   * @throws error if problem is found with state object
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

      // First create dependent components so that all are available in allComponents. It is possible
      // that dependent components are dependent on OTHER dependent components.
      json.programs.forEach( programJSON => {
        const program = this.programs.find( program => program.numberProperty.value === programJSON.number );
        program.createDependentModelComponents( programJSON );
      } );

      // Now set connections between dependent components and dependency components.
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
      this.copyProgramsFromJSON( templateJSON );
    }
    catch( error ) {
      this.errorOccurredEmitter.emit( error.message );
    }
  }

  clear() {
    this.load( { programs: [] } );
  }

  /**
   * Returns an array of objects with program number and code for this project. Used to move code to the
   * paper-playground database of programs.
   */
  async convertToProgramData() {

    const programStringsPromises = this.programs.map( async program => {
      const code = await program.convertToProgramString();
      return {
        number: program.numberProperty.value,
        code: code
      };
    } );

    // Use Promise.all to wait for all program strings to be processed
    return Promise.all( programStringsPromises );
  }

  /**
   * Send a request to the server to save the current programs to the selected space.
   * @return {Promise<string>}
   */
  async sendProgramsToPlayground() {

    // Convert model to code for the database. If this throws an error for some reason (like an unsupported type),
    // the promise should reject.
    try {
      const dataForServer = await this.convertToProgramData();

      try {

        // First, clear all programs in the space
        const clearUrl = new URL( `api/spaces/${this.spaceNameProperty.value}/programs/clear`, window.location.origin ).toString();
        await this.sendRequest( clearUrl, 'POST', {} );

        // Now add the programs one by one. Adding sequentially reduces the payload size which has limitations.
        for ( const programData of dataForServer ) {

          // Await the request to add each individual program
          const addUrl = new URL( `api/spaces/${this.spaceNameProperty.value}/programs/add-premade-program`, window.location.origin ).toString();
          await this.sendRequest( addUrl, 'POST', { program: programData } );
        }

        // If everything succeeds, resolve the promise
        console.log( 'All programs sent successfully!' );
        return 'All programs sent successfully!';

      }
      catch( error ) {
        console.error( 'Error sending programs:', error );
      }
    }
    catch( error ) {
      console.error( 'Error converting programs to code:', error );
      throw error;
    }

    return 'Error sending programs to playground.';
  }

  /**
   * A helper function that sends a general request to the server.
   * @param url - API endpoint
   * @param method - XHR method
   * @param data - payload (json)
   */
  async sendRequest( url, method, data ) {
    return new Promise( ( resolve, reject ) => {
      xhr[ method.toLowerCase() ]( url, {
        json: data
      }, ( error, response ) => {
        if ( error ) {
          reject( error );
        }
        else {
          resolve( response );
        }
      } );
    } );
  }

  /**
   * Send a save request to the server, and emit an event when it succeeds.
   * @return {Promise<unknown>}
   */
  async sendSaveRequest() {
    let json;
    try {
      json = this.save();
    }
    catch( error ) {
      this.errorOccurredEmitter.emit( error.message );
      return;
    }

    let allChunksSent = false; // the server will let us know when it receives all the chunks

    // A timeout for the save request so that if it fails or gets interrupted, we can notify the
    // user.
    const timeout = ms => new Promise( ( _, reject ) => setTimeout( () => {
      if ( !allChunksSent ) {
        this.errorOccurredEmitter.emit( 'The save request timed out. Please try again later.' );
        reject( new Error( `Save request timed out after ${ms}ms.` ) );
      }
    }, ms ) );

    // We are about to start sending chunks of data, clear the stored data for this project first.
    const clearUrl = new URL( `api/creator/chunk/${this.spaceNameProperty.value}/clear`, window.location.origin ).toString();
    await this.sendRequest( clearUrl, 'PUT', {} );

    // Send each program as a separate chunk so that the payload to the server is not too large
    const totalChunksCount = json.programs.length;
    if ( totalChunksCount === 0 ) {

      // an API request to save an empty project since there are no programs in the current project
      const url = new URL( `api/creator/clear/${this.spaceNameProperty.value}/${this.projectNameProperty.value}`, window.location.origin ).toString();
      await this.sendRequest( url, 'PUT', {} );

      // There were no chunks to send.
      allChunksSent = true;
    }
    else {
      for ( const programData of json.programs ) {
        const url = new URL( `api/creator/chunk/${this.spaceNameProperty.value}/${this.projectNameProperty.value}`, window.location.origin ).toString();

        const response = await Promise.race( [ this.sendRequest( url, 'PUT', { programData, totalChunksCount } ), timeout( 10000 ) ] );
        if ( response && response.body && response.body.status ) {
          if ( response.body.status === 'CHUNKS_SENT' ) {
            allChunksSent = true;
          }
        }
        else {

          // The timeout error occurred because we didn't have a status from the request, stop trying.
          break;
        }
      }
    }

    if ( allChunksSent ) {
      this.saveSuccessfulEmitter.emit();
    }
    else {
      this.errorOccurredEmitter.emit( 'An error occurred while saving this project.' );
    }
  }

  /**
   * Synchronously save this model as JSON and request a download of it so that it can be saved/used later
   * locally on the user's computer.
   */
  sendDownloadJSONRequest() {
    const json = this.save();
    const blob = new Blob( [ JSON.stringify( json ) ], { type: 'application/json' } );
    const url = URL.createObjectURL( blob );
    const a = document.createElement( 'a' );
    a.download = 'project.json';
    a.href = url;
    a.click();
    URL.revokeObjectURL( url );
  }

  /**
   * Send a request to load a project from a JSON file on the user's local machine.
   */
  sendLoadJSONRequest() {

    const input = document.createElement( 'input' );
    input.type = 'file';
    input.accept = '.json';

    // Read the file and load the JSON
    input.addEventListener( 'change', event => {
      const file = event.target.files[ 0 ];
      if ( file ) {
        const reader = new FileReader();
        reader.onload = event => {
          try {
            const json = JSON.parse( event.target.result );
            this.load( json );
          }
          catch( error ) {
            this.errorOccurredEmitter.emit( `Error loading project from JSON: ${error.message}` );
          }
        };
        reader.readAsText( file, 'UTF-8' );
      }
    } );

    input.click();
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