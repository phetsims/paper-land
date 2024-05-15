class IDataService {

  /**
   * @param allowAccessToRestrictedFiles - {boolean} - If true, restricted files can be accessed.
   */
  constructor( allowAccessToRestrictedFiles ) {
    if ( this.constructor === IDataService ) {
      throw new TypeError( 'Cannot instantiate an interface' );
    }

    this.allowAccessToRestrictedFiles = allowAccessToRestrictedFiles;
  }

  /**
   * Calls a callback on the program data for all programs in a space
   *
   * @param {string} spaceName - The name of the space.
   * @param {Function} callback - The callback function to call when the data is ready.
   */
  getSpaceData( spaceName, callback ) {
    throw new Error( 'Method getSpaceData must be implemented' );
  }

  /**
   * Gets a list of all spaces in the saved state.
   */
  getSpacesList( response ) {
    throw new Error( 'Method getSpacesList must be implemented' );
  }

  /**
   * Gets the code of a program with the provided number in the provided space.
   * @param spaceName - space that this program is in
   * @param programNumber - number of the program to get the code for
   * @param response - response object for the route
   */
  getProgramCode( spaceName, programNumber, response ) {
    throw new Error( 'Method getProgramCode must be implemented' );
  }

  /**
   * Queries the database for program information in the requested spaces.
   *
   * TODO: It needs to extract specific information about the programs for the provided spaces like this:
   * Keywords, title, number
   *
   * {
   *   space: [
   *     {
   *       number: 'string'
   *       title: 'string'
   *       keywords: []
   *     },{
   *       ...
   *     }
   *   ]
   * }
   *
   * @param spacesList - A comma separated list of the space names to query, or '*' for all spaces.
   * @param {*} response - The response from the router.
   */
  getProgramSummaryList( spacesList, response ) {
    throw new Error( 'Method getProgramSummaryList must be implemented' );
  }

  /**
   * Gets a list of all spaces available that are NOT restricted to the curent user.
   */
  getUnrestrictedSpacesList( response ) {
    throw new Error( 'Method getUnrestrictedSpacesList must be implemented' );
  }

  /**
   * Adds a new program to the saved state. A new unique number for the spacename is assigned.
   * @param {string} spaceName - The name of the space to add the program to.
   * @param {string} code - The code for the new program.
   * @param {*} response - The response from the router.
   */
  addNewProgram( spaceName, code, response ) {
    throw new Error( 'Method addNewProgram must be implemented' );
  }

  /**
   * Delete the specified program from the provided space.
   */
  deleteProgram( spaceName, number, response ) {
    throw new Error( 'Method deleteProgram must be implemented' );
  }

  /**
   * Sets the debug info for the program with the provided number in the provided space.
   * @param spaceName
   * @param number
   * @param debugInfo - string containing debug info for the program
   * @param response - response for the route
   */
  setDebugInfo( spaceName, number, debugInfo, response ) {
    throw new Error( 'Method setDebugInfo must be implemented' );
  }

  /**
   * Clears all programs from the provided space.
   */
  clearPrograms( spaceName, response ) {
    throw new Error( 'Method clearPrograms must be implemented' );
  }

  /**
   * Adds a single program to the space. This is usually a premade program with code and metadata
   * already written from Creator.
   */
  addPremadeProgram( spaceName, program, response ) {
    throw new Error( 'Method addPremadeProgram must be implemented' );
  }

  /**
   * Saves program code to a program with the provided number in the provied space.
   */
  saveProgramToSpace( spaceName, number, code, response ) {
    throw new Error( 'Method saveProgramToSpace must be implemented' );
  }

  /**
   * Gets all snippets in the database.
   * @param {*} response - response from the router.
   */
  getAllSnippets( response ) {
    throw new Error( 'Method getAllSnippets must be implemented' );
  }

  /**
   * Creates a new snippet and adds it to the database.
   * @param {string} code - the code for the new snippet.
   * @param {*} response
   */
  createSnippet( code, response ) {
    throw new Error( 'Method createSnippet must be implemented' );
  }

  /**
   * Save the snipet code at the snipet with the provided number.
   * @param number - number of the snippet to save.
   * @param code - the code to save to the snippet.
   * @param response - response object from the route.
   */
  saveSnippet( number, code, response ) {
    throw new Error( 'Method saveSnippet must be implemented' );
  }

  /**
   * Claims a program for editing. This is used to prevent multiple users from editing the same program at the same
   * time.
   * @param spaceName - space for the program
   * @param number - the number of the program
   * @param request - request object from the route
   * @param response - response object from the route
   */
  claimProgram( spaceName, number, request, response ) {
    throw new Error( 'Method claimProgram must be implemented' );
  }

  /**
   * Marks a program as having been printed by the user.
   * @param spaceName - space for the program
   * @param number - the number of the program
   * @param printed - boolean value to set for printed
   * @param response - response object from the route
   */
  markPrinted( spaceName, number, printed, response ) {
    throw new Error( 'Method markPrinted must be implemented' );
  }

  /**
   * Gets all project names in the provided space.
   * @param spaceName - the name of the space to get the project names from.
   * @param response - response object from the route.
   */
  getProjectNames( spaceName, response ) {
    throw new Error( 'Method getProjectNames must be implemented' );
  }

  /**
   * Creates a new project in the provided space, with the provided name.
   * @param spaceName
   * @param projectName
   * @param response - response object from the route
   */
  createProject( spaceName, projectName, response ) {
    throw new Error( 'Method createProject must be implemented' );
  }

  /**
   * Creates a copy of the project and puts it in a new space with a new name.
   */
  copyProject( sourceSpaceName, sourceProjectName, destinationSpaceName, destinationProjectName, response ) {
    throw new Error( 'Method copyProject must be implemented' );
  }

  /**
   * Creates a new empty project with the provided name in the provided space.
   * @param spaceName
   * @param projectName
   * @param projectData - data to save in the project (an empty list of programs)
   * @param response - response object from the route
   */
  createEmptyProject( spaceName, projectName, projectData, response ) {
    throw new Error( 'Method createEmptyProject must be implemented' );
  }

  /**
   * Saves all project data to the databsae
   * @param spaceName - space to save the project data to
   * @param projectName - name of the project to save
   * @param projectData - data to save in the project
   * @param onComplete - called just before the response is sent
   * @param response - response object from the route
   */
  saveProjectData( spaceName, projectName, projectData, onComplete, response ) {
    throw new Error( 'Method saveProjectData must be implemented' );
  }

  /**
   * Saves a new template to the database.
   */
  createTemplate( templateName, description, keyWords, projectData, spaceName, response ) {
    throw new Error( 'Method saveTemplate must be implemented' );
  }

  /**
   * Saves a template in the database. The template must already exist.
   */
  saveTemplate( templateName, description, keyWords, projectData, templateId, response ) {
    throw new Error( 'Method saveTemplate must be implemented' );
  }

  /**
   * Gets all templates in the database.
   */
  getAllTemplates( response ) {
    throw new Error( 'Method getAllTemplates must be implemented' );
  }

  /**
   * Get the templates that can be used in the provided space. Will include all global templates and the template
   * that are assigned to the provided space.
   */
  getUsableTemplates( spaceName, response ) {
    throw new Error( 'Method getUsableTemplates must be implemented' );
  }

  /**
   * Get the templates that can be edited in the provided space. If the user has full access, it will include all
   * global templates. Otherwise, it will include teh templates assigned to the provided spaceName, assuming that
   * the user has access to the space.
   */
  getEditableTemplates( spaceName, allowAccessToRestrictedFiles, response ) {
    throw new Error( 'Method getEditableTemplates must be implemented' );
  }

  /**
   * Delete the template from the templates table with the provided name.
   */
  deleteTemplate( templateName, response ) {
    throw new Error( 'Method deleteTemplate must be implemented' );
  }

  /**
   * Gets a collection of project data for the project in the provided space.
   */
  getProjectData( spaceName, projectName, response ) {
    throw new Error( 'Method getProjectData must be implemented' );
  }

  /**
   * Gets the project data for the provided space and project name.
   */
  deleteProject( spaceName, projectName, response ) {
    throw new Error( 'Method deleteProject must be implemented' );
  }
}

module.exports = IDataService;