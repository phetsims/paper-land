/**
 * An implementation of the IDataService that uses the local file system to store data. The data is stored in a local directory
 * with the following structure:
 *
 * /data
 *   /spaces
 *     /spaceName
 *       /programs -> Contains the program data for the space
 *         /programNumber.json
 *         /programNumber.json
 *         /...
 *       /projects -> Contains the project data for the space
 *         /projectName.json
 *         /projectName.json
 *         /...
 *   /templates -> Contains the template data for the space (outside of spaces)
 *     /templateName.json
 *     /templateName.json
 *     /...
 *   /snippets -> Contains the snippet data for the space (outside of spaces)
 */

const fsPromises = require( 'fs' ).promises;
const fs = require( 'fs' );
const path = require( 'path' );
const IDataService = require( './IDataService.js' );
const Constants = require( './Constants.js' );
const { v4: uuidv4 } = require( 'uuid' );

// Path to the /data directory - user data will be stored here.
const dataDirectoryPath = path.join( __dirname, 'data' );

// Path to space data - this is the "active" program data in a space. Whatever should be detected by the camera.
// When you press "Send to Playground", a new set of programs will be put in this space.
const spacesDirectoryPath = path.join( dataDirectoryPath, 'spaces' );

// Path to templates - prepared projects that can be loaded into the space.
const templatesDirectoryPath = path.join( dataDirectoryPath, 'templates' );

// Path to the /default-data directory - default data will be stored here.
const defaultDataDirectoryPath = path.join( __dirname, 'default-data' );

// Create data, spaces and templates directories if they are missing
// fs.mkdirSync( dataDirectoryPath, { recursive: true } );
// fs.mkdirSync( spacesDirectoryPath, { recursive: true } );
// fs.mkdirSync( templatesDirectoryPath, { recursive: true } );

/**
 * The data for a program in the local file system.
 * @typedef {Object} Program
 * @property {number} number - The program number.
 * @property {string} originalCode - The original code before the last save.
 * @property {string} currentCode - The current code for the program.
 * @property {boolean} printed - Whether the program has been printed.
 * @property {Object} editorInfo - Used to 'claim' a program. Has a time field and an editorId field.
 * @property {string} currentCodeUrl - The URL for the current code. Something like 'program.spaceName.number.js'.
 * @property {string} currentCodeHash - A hash describing the program code.
 * @property {string} debugUrl - The URL for the debug info. Something like 'program.spaceName.number.debug'.
 * @property {string} claimUrl - A URL used to claim the program while it is being edited.
 * @property {boolean} codeHasChanged - Whether the code has changed since the last save.
 */

/**
 * The data for a project in the local file system.
 * @typedef {Object} Project
 * @property {string} projectData - The full JSON data object for the project.
 * @property {boolean} editing - Whether the project is currently being edited.
 */

/**
 * The data for a template in the local file system.
 * @typedef {Object} Template
 * @property {string} name - The name of the template.
 * @property {string} description - A description of the template.
 * @property {string} projectData - The full JSON data object for the project created by this template.
 * @property {string[]} keyWords - An array of key words associated with the template.
 * @property {string} spaceName - The name of the space the template is in.
 * @property {string} id - The id of the template.
 */

class LocalFileDataService extends IDataService {
  constructor( allowAccessToRestrictedFiles ) {
    super( allowAccessToRestrictedFiles );
  }

  /**
   * Calls a callback on the program data for all programs in a space. The data is an object that looks like this:
   * {
   *   programs: Program[],
   *   spaceName: 'string'
   * }
   */
  getSpaceData( spaceName, callback ) {

    const spaceNamePath = path.join( spacesDirectoryPath, spaceName );

    // The path to the programs directory in this space
    const spaceProgramsPath = path.join( spaceNamePath, 'programs' );

    // The data object to return, will be populated as we read the files.
    const data = {
      programs: [],
      spaceName: spaceName
    };

    fsPromises.readdir( spaceProgramsPath )
      .then( files => {
        const fileReadPromises = files.map( file => {
          const filePath = path.join( spaceProgramsPath, file );
          return fsPromises.readFile( filePath, 'utf8' )
            .then( fileContents => {
              const program = JSON.parse( fileContents );
              data.programs.push( program );
            } );
        } );

        // Wait for all file read operations to complete
        return Promise.all( fileReadPromises );
      } )
      .then( () => {

        // Once all files have been read and data is populated, call the callback
        callback( data );
      } )
      .catch( err => {

        if ( err.code === 'ENOENT' ) {

          // If the space directory doesn't exist, create it and call the callback with an empty space data object
          fs.mkdir( spaceNamePath, { recursive: true }, err => {
            if ( err ) {
              console.error( `Error creating space directory ${spaceNamePath}: ${err}` );
              callback( { programs: [], spaceName: spaceName } );
            }
            else {
              callback( { programs: [], spaceName: spaceName } );
            }
          } );
        }
        else {

          // Handle errors by perhaps invoking the callback with `null` or an error
          console.error( `Error reading local save data for space ${spaceName}: ${err}` );
          callback( null, err );
        }
      } );
  }

  /**
   * Gets the list of all available spaces. FOr this service, this is the list of drectories
   * under data/spaces.
   */
  getSpacesList( response ) {
    fsPromises.readdir( spacesDirectoryPath, { withFileTypes: true } )
      .then( entries => {
        const directories = entries
          .filter( dirent => dirent.isDirectory() )
          .map( dirent => dirent.name );

        response.json( directories );
      } )
      .catch( err => {
        console.error( `Error reading spaces directory: ${err}` );
        response.status( 500 ).send( 'Error reading spaces directory' );
      } );
  }

  getProgramCode( spaceName, programNumber, response ) {
    const programPath = path.join( spacesDirectoryPath, spaceName, 'programs', `${programNumber}.json` );
    fsPromises.readFile( programPath, 'utf8' )
      .then( fileContents => {
        const program = JSON.parse( fileContents );
        response.set( 'Content-Type', 'text/javascript;charset=UTF-8' );
        response.json( program.currentCode );
      } )
      .catch( err => {
        console.error( `Error reading program ${programNumber} in space ${spaceName}: ${err}` );
        response.status( 500 ).send( 'Error reading program' );
      } );
  }

  getProgramSummaryList( spacesList, response ) {
    const spacesDirectoryPath = path.join( dataDirectoryPath, 'spaces' );
    const spaces = spacesList !== '*' ? spacesList.split( ',' ) : null;

    fsPromises.readdir( spacesDirectoryPath )
      .then( spaceDirs => {
        if ( spaces ) {
          // Filter out directories not in spaces, if spaces is not '*'
          return spaceDirs.filter( spaceName => spaces.includes( spaceName ) );
        }
        return spaceDirs;
      } )
      .then( filteredSpaces => {
        const summaryPromises = filteredSpaces.map( spaceName => {
          const spacePath = path.join( spacesDirectoryPath, spaceName, 'programs' );
          return fsPromises.readdir( spacePath )
            .then( programFiles => {
              return Promise.all( programFiles.map( programFile => {
                const programPath = path.join( spacePath, programFile );
                return fsPromises.readFile( programPath, 'utf8' )
                  .then( fileContents => {
                    const program = JSON.parse( fileContents );
                    return {
                      number: program.number, spaceName: spaceName, currentCode: program.currentCode
                    };
                  } )
                  .catch( err => console.error( `Error reading file ${programFile}: ${err}` ) );
              } ) );
            } )
            .catch( err => console.error( `Error accessing directory ${spaceName}: ${err}` ) );
        } );

        return Promise.all( summaryPromises );
      } )
      .then( programSummaries => {

        // Flatten the array of arrays and filter out any undefined resulting from catch blocks
        const flatSummaries = programSummaries.flat().filter( summary => !!summary );

        response.json( flatSummaries );
      } )
      .catch( err => {
        console.error( `Error generating program summary list: ${err}` );
        response.status( 500 ).send( 'Error reading program data' );
      } );
  }

  /**
   * Gets a list of all spaces available that are NOT restricted to the current user.
   *
   * Note that for local file serving, there is no concept of restricted spaces, so this method
   * will return the same list of spaces as getSpacesList.
   * @param response
   */
  getUnrestrictedSpacesList( response ) {
    this.getSpacesList( response );
  }

  /**
   * Creates a new space in the local file system. If the space already exists, this method will do nothing.
   */
  createSpace( spaceName, response ) {
    const spacePath = path.join( spacesDirectoryPath, spaceName );

    const programsPath = path.join( spacePath, 'programs' );
    const projectsPath = path.join( spacePath, 'projects' );

    // Create the space directory if it doesn't exist - recursive: true will not create a new directory
    // or throw an error if it already exists.
    try {

      // create the space directory as well as the programs and projects directories under it
      fs.mkdirSync( spacePath, { recursive: true } );
      fs.mkdirSync( programsPath, { recursive: true } );
      fs.mkdirSync( projectsPath, { recursive: true } );
    }
    catch( error ) {
      console.error( `Error creating space directory ${spacePath}: ${error}` );
      response.status( 500 ).send( 'Error creating space directory' );
    }
  }

  /**
   * Write a new program to the local file system. Will create a file in the programs directory for the
   * provided space.
   */
  addNewProgram( spaceName, code, response ) {

    // The path to the programs directory for this space
    const spaceProgramsPath = path.join( spacesDirectoryPath, spaceName, 'programs' );

    this.createSpace( spaceName, response );

    fsPromises.readdir( spaceProgramsPath )
      .then( files => {

        // Get the existing program numbers in this space
        const existingNumbers = files.map( file => parseInt( path.basename( file, '.json' ) ) );
        const number = Constants.generateProgramNumber( existingNumbers, Constants.MAX_PROGRAM_NUMBER );

        // The path to the new program file
        const programPath = path.join( spaceProgramsPath, `${number}.json` );

        // The data to write to the file
        const programData = {
          number: number,
          originalCode: code,
          currentCode: code,
          printed: false,
          editorInfo: {},
          currentCodeUrl: `program.${spaceName}.${number}.js`,
          currentCodeHash: '',
          debugUrl: `/api/spaces/${spaceName}/programs/${number}/debugInfo`,
          claimUrl: `/api/spaces/${spaceName}/programs/${number}/claim`,
          codeHasChanged: false
        };

        // Write the file
        return fsPromises
          .writeFile( programPath, JSON.stringify( programData, null, 2 ) )
          .then( () => {
            this.getSpaceData( spaceName, spaceData => {
              response.json( { number, spaceData } );
            } );
          } );
      } )
  }

  /**
   * Deletes a program from the local file system. Will remove the file in the programs directory for the
   * provided space.
   */
  deleteProgram( spaceName, number, response ) {
    const programPath = path.join( spacesDirectoryPath, spaceName, 'programs', `${number}.json` );
    fsPromises
      .unlink( programPath )
      .then( () => {
        response.json( { numberOfProgramsDeleted: 1 } );
      } )
      .catch( err => {
        console.error( `Error deleting program ${number} in space ${spaceName}: ${err}` );
        response.status( 500 ).send( 'Error deleting program' );
      } );
  }

  /**
   * Writes debug info data to a specific program.
   */
  setDebugInfo( spaceName, number, debugInfo, response ) {

    // The path to the program file
    const programPath = path.join( spacesDirectoryPath, spaceName, 'programs', `${number}.json` );

    fsPromises.readFile( programPath, 'utf8' )
      .then( fileContents => {
        const program = JSON.parse( fileContents );
        program.debugInfo = JSON.stringify( debugInfo );

        // Write the object back to the file
        fsPromises.writeFile( programPath, JSON.stringify( program, null, 2 ) )
          .then( () => {
            response.json( {} );
          } )
          .catch( err => {
            response.status( 500 ).send( 'Error writing debug info' );
          } );
        response.json( {} );
      } ).catch( err => {
      response.status( 500 ).send( 'Error reading program' );
    } );
  }

  /**
   * Clears all programs from a space. Will remove all files in the programs directory for the
   * provided space.
   */
  clearPrograms( spaceName, response ) {

    // The path to the programs directory for this space
    const spaceProgramsPath = path.join( spacesDirectoryPath, spaceName, 'programs' );

    fsPromises.readdir( spaceProgramsPath )
      .then( files => {
        const unlinkPromises = files.map( file => {
          const filePath = path.join( spaceProgramsPath, file );
          return fsPromises.unlink( filePath );
        } );

        Promise.all( unlinkPromises ).then( () => {
          response.json( { numberOfProgramsDeleted: files.length } );
        } );
      } )
      .catch( err => {
        console.error( `Error clearing programs in space ${spaceName}: ${err}` );
      } );
  }

  /**
   */
  addPremadeProgram( spaceName, program, response ) {

    // The path to the programs directory for this space
    const spaceProgramsPath = path.join( spacesDirectoryPath, spaceName, 'programs' );

    // Make sure the space is available if it hasn't been created yet.
    this.createSpace( spaceName, response );

    // Add a premade program with a number and code
    const number = program.number;
    const code = program.code;

    // The path to the new program file
    const programPath = path.join( spaceProgramsPath, `${number}.json` );

    // The data to write to the file
    const programData = {
      number: number,
      originalCode: code,
      currentCode: code,
      printed: false,
      editorInfo: [],
      currentCodeUrl: `program.${spaceName}.${number}.js`,
      currentCodeHash: '',
      debugUrl: `/api/spaces/${spaceName}/programs/${program.number}/debugInfo`,
      claimUrl: `/api/spaces/${spaceName}/programs/${program.number}/claim`,
      codeHasChanged: false
    };

    // Write the file
    fsPromises.writeFile( programPath, JSON.stringify( programData, null, 2 ) ).then( () => {
      this.getSpaceData( spaceName, spaceData => {
        response.json( { message: 'Program added successfully' } );
      } );
    } ).catch( err => {
      console.error( `Error adding premade program ${number} in space ${spaceName}: ${err}` );
      response.status( 500 ).send( 'Error adding premade program' );
    } )
  }

  saveProgramToSpace( spaceName, number, code, response ) {

    // The path to the program file
    const programPath = path.join( spacesDirectoryPath, spaceName, 'programs', `${number}.json` );

    fsPromises.readFile( programPath, 'utf8' ).then( fileContents => {
      const program = JSON.parse( fileContents );
      program.currentCode = code;

      // Write the object back to the file
      fsPromises.writeFile( programPath, JSON.stringify( program, null, 2 ) ).then( () => {
        response.json( {} );
      } ).catch( err => {
        response.status( 500 ).send( 'Error writing program' );

      } );

    } ).catch( err => {
      console.error( `Error reading program ${number} in space ${spaceName}: ${err}` );
      response.status( 500 ).send( 'Error reading program' );
    } );
  }

  /**
   * Snippets are not yet implemented, but just be graceful for this request.
   */
  getAllSnippets( response ) {
    console.error( 'Method getAllSnippets must be implemented' );
    response.json( { snippets: [] } );
  }

  /**
   * Snippets are not yet implemented, but just be graceful for this request.
   */
  createSnippet( code, response ) {
    console.error( 'Method createSnippet must be implemented' );
    response.json( { number: 0, snippetCode: 'Snippets are not supported.' } );
  }

  saveSnippet( number, code, response ) {
    console.error( 'Method saveSnippet must be implemented' );
    response.json( {} );
  }

  /**
   * Mark the program
   * @param spaceName
   * @param number
   * @param request
   * @param response
   */
  claimProgram( spaceName, number, request, response ) {

    // The path to the program file
    const programPath = path.join( spacesDirectoryPath, spaceName, 'programs', `${number}.json` );

    fsPromises.readFile( programPath, 'utf8' ).then( fileContents => {
      const program = JSON.parse( fileContents );

      const editorInfo = program.editorInfo;
      if (
        editorInfo.time &&
        editorInfo.time + Constants.EDITOR_HANDLE_DURATION > Date.now() &&
        editorInfo.editorId !== request.body.editorId
      ) {
        response.status( 400 );
        response.json( {} );
      }
      else {
        program.editorInfo = { time: Date.now(), editorId: request.body.editorId };
        fsPromises.writeFile( programPath, JSON.stringify( program, null, 2 ) ).then( () => {
          response.json( {
            debugInfo: JSON.parse( program.debugInfo || '{}' ),
            editorInfo
          } );
        } ).catch( err => {
          response.status( 500 ).send( 'Error writing program' );
        } );
      }
    } ).catch( err => {
      console.error( `Error reading program ${number} in space ${spaceName}: ${err}` );
      response.status( 500 ).send( 'Error reading program' );
    } );
  }

  /**
   * Update the printed field for a program in the space.
   */
  markPrinted( spaceName, number, printed, response ) {

    // The path to the program file
    const programPath = path.join( spacesDirectoryPath, spaceName, 'programs', `${number}.json` );

    fsPromises.readFile( programPath, 'utf8' ).then( fileContents => {
      const program = JSON.parse( fileContents );
      program.printed = printed;

      // Write the object back to the file
      fsPromises.writeFile( programPath, JSON.stringify( program, null, 2 ) ).then( () => {
        this.getSpaceData( spaceName, spaceData => {
          response.json( { spaceData } );
        } );
      } ).catch( err => {
        response.status( 500 ).send( 'Error writing program' );
      } );
    } ).catch( err => {
      console.error( `Error reading program ${number} in space ${spaceName}: ${err}` );
      response.status( 500 ).send( 'Error reading program' );
    } );
  }

  /**
   * Returns the list of projects in the space. This will be the list of files in the projects directory under
   * the space directory.
   * @param spaceName
   * @param response
   */
  getProjectNames( spaceName, response ) {
    const spaceProjectsPath = path.join( spacesDirectoryPath, spaceName, 'projects' );

    fsPromises.readdir( spaceProjectsPath )
      .then( files => {

        const fileNames = files.map( file => path.basename( file, '.json' ) );
        response.json( { projectNames: fileNames } );
      } )
      .catch( err => {
        console.error( `Error reading projects in space ${spaceName}: ${err}` );
        response.status( 500 ).send( 'Error reading projects' );
      } );
  }

  /**
   * Creates a new project in the local file system, under the space name directory.
   */
  createProject( spaceName, projectName, response ) {

    // The path to the projects directory for this space
    const spaceProjectsPath = path.join( spacesDirectoryPath, spaceName, 'projects' );

    // Make sure the space exists before creating the project
    this.createSpace( spaceName, response );

    // Check if the project already exists by seeing if any files in the projects directory
    // already has this name
    fsPromises.readdir( spaceProjectsPath )
      .then( files => {
        if ( files.includes( `${projectName}.json` ) ) {
          response.status( Constants.MISSING_INFO ).send( 'Project already exists in this space.' );
        }
        else {

          // The path to the new project file
          const projectPath = path.join( spaceProjectsPath, `${projectName}.json` );

          // The data to write to the file
          const projectData = {
            projectData: {
              programs: []
            },
            editing: false
          };

          // Write the file
          fsPromises.writeFile( projectPath, JSON.stringify( projectData, null, 2 ) ).then( () => {
            response.json( { projectName: projectName } );
          } ).catch( err => {
            consfole.error( `Error creating project ${projectName} in space ${spaceName}: ${err}` );
            response.status( 500 ).send( 'Error creating project' );
          } );
        }
      } )
      .catch( err => {
        console.error( `Error reading projects in space ${spaceName}: ${err}` );
        response.status( 500 ).send( 'Error reading projects' );
      } );
  }

  /**
   * Copies one project file to another location with a new space/project name.
   */
  copyProject( sourceSpaceName, sourceProjectName, destinationSpaceName, destinationProjectName, response ) {

    // The path to the source project
    const sourceProjectPath = path.join( spacesDirectoryPath, sourceSpaceName, 'projects', `${sourceProjectName}.json` );

    // Make sure that the source project exists - note that while simple this may be susceptible
    // to race conditions, consider readFile if you run into problems.
    fsPromises.access( sourceProjectPath, fs.constants.F_OK )
      .then( () => {

        // The path to the destination project
        const destinationProjectPath = path.join( spacesDirectoryPath, destinationSpaceName, 'projects', `${destinationProjectName}.json` );

        // Read the source project data
        return fsPromises.readFile( sourceProjectPath, 'utf8' )
          .then( fileContents => {
            const projectData = JSON.parse( fileContents );

            // Write the project data to the destination project
            return fsPromises.writeFile( destinationProjectPath, JSON.stringify( projectData, null, 2 ) )
              .then( () => {
                response.status( Constants.SUCCESS ).json( {} );
              } );
          } );
      } )
      .catch( err => {
        response.status( Constants.PROJECT_DOES_NOT_EXIST ).send( 'Source project does not exist' );
      } );
  }

  createTemplate( templateName, description, keyWords, projectData, spaceName, response ) {

    // Get all existing templates so we can inspect their data
    this.getTemplateData( allTemplatesData => {

      // Check if the template in this space already exists
      if ( allTemplatesData.some( template => template.spaceName === spaceName && template.name === templateName ) ) {
        response.status( 402 ).send( 'Name already exists for this template.' );
      }
      else {

        // The data to write to the file
        const templateData = {
          name: templateName,
          description: description,
          keyWords: keyWords,
          projectData: projectData,
          spaceName: spaceName,
          id: uuidv4()
        };

        // Write the file
        const templatePath = path.join( templatesDirectoryPath, `${templateName}.json` );
        fsPromises.writeFile( templatePath, JSON.stringify( templateData, null, 2 ) ).then( () => {
          response.status( 200 ).json( {} );
        } ).catch( err => {
          console.error( `Error creating template ${templateName}: ${err}` );
          response.status( Constants.UNKNOWN_ERROR ).send( 'An error occurred while saving the template' );
        } );
      }
    }, response );
  }

  saveTemplate( templateName, description, keyWords, projectData, templateId, response ) {

    // Find the template with the matching ID
    this.getTemplateData( allTemplatesData => {
      const template = allTemplatesData.find( template => template.id === templateId );
      if ( !template ) {
        response.status( Constants.PROJECT_DOES_NOT_EXIST ).send( 'Template not found' );
      }
      else {

        // The path to the template file
        const templatePath = path.join( templatesDirectoryPath, `${templateName}.json` );

        // The data to write to the file
        const templateData = {
          name: templateName,
          description: description,
          keyWords: keyWords,
          projectData: projectData,
          spaceName: template.spaceName,
          id: templateId
        };

        // Write the file
        fsPromises.writeFile( templatePath, JSON.stringify( templateData, null, 2 ) ).then( () => {
          response.status( 200 ).json( {} );
        } ).catch( err => {
          console.error( `Error saving template ${templateName}: ${err}` );
          response.status( 500 ).send( 'Error saving template' );
        } );
      }
    }, response );
  }

  getAllTemplates( response ) {
    throw new Error( 'I believe this is unused. Implement if you hit this.' );
  }

  /**
   * Returns the list of available templates where the spaceName matches the provided name, or the space
   * name is "null" - indicating it belongs to all spaces.
   */
  getUsableTemplates( spaceName, response ) {
    this.getTemplateData( allTemplatesData => {

      // Find templates where the spaceName matches the provided name or the spaceName is 'null'.
      const usableTemplates = allTemplatesData.filter( template => template.spaceName === spaceName || template.spaceName === 'null' );

      // Return the usable templates
      response.json( { templates: usableTemplates } );
    }, response );
  }

  deleteTemplate( templateName, response ) {

    // Delete all templates with the provided name
    fsPromises.readdir( templatesDirectoryPath )
      .then( files => {
        const templateFiles = files.filter( file => file.startsWith( templateName ) );

        const deletePromises = templateFiles.map( file => {
          const filePath = path.join( templatesDirectoryPath, file );
          return fsPromises.unlink( filePath );
        } );

        return Promise.all( deletePromises );
      } )
      .then( () => {
        response.json( {
          numberOfTemplatesDeleted: numberOfDeleted
        } );
      } )
      .catch( err => {
        console.error( `Error deleting template ${templateName}: ${err}` );
        response.status( 500 ).send( 'Error deleting template' );
      } );
  }

  /**
   * A helper function that gets all data for templates, reading them from local files and parsing the JSON data
   * into a JavaScript object. When ready, a callback is called with the data.
   * @param callback - The callback to call when the data is ready.
   * @param response - The response object to use if an error occurs.
   */
  getTemplateData( callback, response ) {
    fsPromises.readdir( templatesDirectoryPath )
      .then( files => {

        // Read all data for existing templates
        const readAndParsePromises = files.map( file => {
          const filePath = path.join( templatesDirectoryPath, file );
          return fsPromises.readFile( filePath, 'utf8' ).then( fileContents => JSON.parse( fileContents ) );
        } );

        return Promise.all( readAndParsePromises );
      } ).then( allTemplatesData => {

      // All templates data packaged into an array of object literals
      callback( allTemplatesData );
    } ).catch( err => {
      console.error( `Error reading templates: ${err}` );
      response.status( 500 ).send( 'Error reading templates' );
    } );
  }

  /**
   * TODO: It isn't clear to me how this is different from createProject, which also creates an empty project.
   */
  createEmptyProject( spaceName, projectName, projectData, response ) {
    this.createProject( spaceName, projectName, response );
  }

  /**
   * Saves all project data to the local file system.
   */
  saveProjectData( spaceName, projectName, projectData, onComplete, response ) {

    // The path to the project file
    const projectPath = path.join( spacesDirectoryPath, spaceName, 'projects', `${projectName}.json` );

    // Get the existing project data
    fsPromises.readFile( projectPath, 'utf8' ).then( fileContents => {
      const project = JSON.parse( fileContents );
      project.projectData = projectData;

      // Write the object back to the file
      fsPromises.writeFile( projectPath, JSON.stringify( project, null, 2 ) ).then( () => {
        onComplete( response );
      } ).catch( err => {
        response.status( 500 ).send( 'Error writing project while saving project data' );
      } );
    } ).catch( err => {
      response.status( 500 ).send( 'Error reading project while trying to save data' );
    } );
  }

  /**
   * Gets the project data for a project with the provided name and space. Note this provides the actual `projectData`,
   * not the Project Object (defined above).
   */
  getProjectData( spaceName, projectName, response ) {

    // The path to the project file
    const projectPath = path.join( spacesDirectoryPath, spaceName, 'projects', `${projectName}.json` );

    // Read the project data from the file, convert it to a javascript object
    fsPromises.readFile( projectPath, 'utf8' ).then( fileContents => {
      const project = JSON.parse( fileContents );
      response.json( { projectData: project.projectData } );
    } ).catch( err => {
      response.status( 404 );
    } );
  }

  deleteProject( spaceName, projectName, response ) {

    // The path to the project file
    const projectPath = path.join( spacesDirectoryPath, spaceName, 'projects', `${projectName}.json` );

    // Delete the project file
    fsPromises.unlink( projectPath ).then( () => {
      response.json( { numberOfProjectsDeleted: 1 } );
    } ).catch( err => {
      response.status( 500 ).send( 'Error deleting project - project may not exist.' );
    } );
  }

  /**
   * Sets up the default local data for the application. If there is no data directory or the directory is empty,
   * copy the contents of the default-data directory into the data directory.
   */
  copyDefaultData() {

    // if the data directory is empty, or there is no data directory, copy the contents of default-data
    // into the data directory
    fsPromises.readdir( dataDirectoryPath )
      .then( files => {

        // If the directory exists but is empty
        if ( files.length === 0 ) {
          return this.copyDirectory( defaultDataDirectoryPath, dataDirectoryPath );
        }
        else {
          console.log( 'Data directory already exists and is not empty.' );
        }
      } )
      .catch( err => {
        // If the directory does not exist, attempt to copy the files
        if ( err.code === 'ENOENT' ) {
          return this.copyDirectory( defaultDataDirectoryPath, dataDirectoryPath );
        }
        else {
          // Log other types of errors
          console.error( `Error reading the data directory: ${err}` );
        }
      } )
      .then( () => {
        console.log( 'Local file setup is complete.' );
      } )
      .catch( err => {
        console.error( `Error copying default data: ${err}` );
      } );
  }


  copyDirectory( src, dest ) {
    return fsPromises.mkdir( dest, { recursive: true } ).then( () => {
      return fsPromises.readdir( src, { withFileTypes: true } );
    } ).then( dirents => {
      const promises = dirents.map( ( dirent ) => {
        const srcPath = path.join( src, dirent.name );
        const destPath = path.join( dest, dirent.name );

        if ( dirent.isDirectory() ) {
          return this.copyDirectory( srcPath, destPath );
        }
        else {
          return fsPromises.copyFile( srcPath, destPath );
        }
      } );
      return Promise.all( promises );
    } );
  }
}

module.exports = LocalFileDataService;