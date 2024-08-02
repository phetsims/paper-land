/**
 * An IDataService that will send requests to a database using knex.
 */

const crypto = require( 'crypto' );
const restrictedSpacesList = require( './restrictedSpacesList.js' );
const Constants = require( './Constants.js' );
const Utils = require( './Utils.js' );
const IDataService = require( './IDataService.js' );

// A config file should have been created by now.
const loadConfig = require( './loadConfig.js' );
const config = loadConfig();

// The knex instance - processes all database requests, using a local or remote database depending
// on the environment.
const knex = require( 'knex' )( require( '../knexfile' )[ config.MODE || 'development' ] );

class KnexDataService extends IDataService {

  /**
   * @param allowAccessToRestrictedFiles - {boolean} - If true, restricted files can be accessed.
   */
  constructor( allowAccessToRestrictedFiles ) {
    super( allowAccessToRestrictedFiles );
  }

  /**
   * See IDataService for documentation.
   */
  getSpaceData( spaceName, callback ) {
    knex( 'programs' )
      .select( 'number', 'originalCode', 'currentCode', 'printed', 'editorInfo' )
      .where( { spaceName } )
      .then( programData => {
        callback( {
          programs: programData.map( program => {
            const editorInfo = JSON.parse( program.editorInfo || '{}' );

            return {
              ...program,
              currentCodeUrl: `program.${spaceName}.${program.number}.js`,
              currentCodeHash: crypto
                .createHmac( 'sha256', '' )
                .update( program.currentCode )
                .digest( 'hex' ),
              debugUrl: `/api/spaces/${spaceName}/programs/${program.number}/debugInfo`,
              claimUrl: `/api/spaces/${spaceName}/programs/${program.number}/claim`,
              editorInfo: {
                ...editorInfo,
                claimed: !!( editorInfo.time && editorInfo.time + Constants.EDITOR_HANDLE_DURATION > Date.now() ),
                readOnly: !this.allowAccessToRestrictedFiles && restrictedSpacesList.includes( spaceName )
              },
              codeHasChanged: program.currentCode !== program.originalCode
            };
          } ),
          spaceName
        } );
      } );
  }

  /**
   * Gets a list of all spaces in the saved state.
   */
  getSpacesList( response ) {
    knex
      .distinct()
      .from( 'programs' )
      .pluck( 'spaceName' )
      .then( spaceNames => {
        response.json( spaceNames );
      } )
      .catch( error => {
        console.log( `Error getting spaces list: ${error}` );
      } );
  }

  /**
   * Gets a list of all spaces available that are NOT restricted to the curent user.
   */
  getUnrestrictedSpacesList( response ) {
    knex
      .distinct()
      .from( 'programs' )
      .pluck( 'spaceName' )
      .then( spaceNames => {

        // filter out the restricted spaces
        const filteredSpaceNames = spaceNames.filter( spaceName => Utils.canAccessSpace( spaceName ) );
        response.json( filteredSpaceNames );
      } )
      .catch( error => {
        console.log( `Error getting spaces list: ${error}` );
      } );
  }

  /**
   * See the IDataService for documentation.
   */
  getProgramSummaryList( spacesList, response ) {
    let summaryQuery = knex.select( [ 'currentCode', 'number', 'spaceName' ] ).from( 'programs' );

    const spaces = spacesList.split( ',' );
    if ( spacesList !== '*' ) {
      spaces.forEach( ( space, index ) => {
        if ( index === 0 ) {
          summaryQuery = summaryQuery.where( { spaceName: space } );
        }
        else {
          summaryQuery = summaryQuery.orWhere( { spaceName: space } );
        }
      } );
    }

    summaryQuery.then( selectResult => {
      response.json( selectResult );
    } );
  }

  /**
   * See IDataService for documentation.
   */
  addNewProgram( spaceName, code, response ) {
    knex
      .select( 'number' )
      .from( 'programs' )
      .where( { spaceName } )
      .then( selectResult => {
        const existingNumbers = selectResult.map( result => result.number );
        const potentialNumbers = [];
        for ( let i = 0; i < Constants.MAX_PROGRAM_NUMBER; i++ ) {
          if ( !existingNumbers.includes( i ) ) {
            potentialNumbers.push( i );
          }
        }
        if ( potentialNumbers.length === 0 ) {
          response.status( 400 ).send( 'No more available numbers' );
        }
        const number = potentialNumbers[ Math.floor( Math.random() * potentialNumbers.length ) ];

        knex( 'programs' )
          .insert( {
            spaceName, number, originalCode: code, currentCode: code
          } )
          .then( () => {
            this.getSpaceData( spaceName, spaceData => {
              response.json( { number, spaceData } );
            } );
          } );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  deleteProgram( spaceName, number, response ) {
    knex( 'programs' )
      .where( { spaceName, number } )
      .del()
      .then( numberOfProgramsDeleted => {
        response.json( { numberOfProgramsDeleted } );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  clearPrograms( spaceName, response ) {
    knex( 'programs' )
      .where( { spaceName } )
      .del()
      .then( numberOfProgramsDeleted => {
        response.json( { numberOfProgramsDeleted } );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  addPremadeProgram( spaceName, program, response ) {
    knex( 'programs' )
      .insert( {
        spaceName: spaceName,
        number: program.number,
        originalCode: program.code,
        currentCode: program.code
      } )
      .then( () => {
        response.json( { message: 'Program added successfully' } );
      } )
      .catch( error => {
        response.status( Constants.UNKNOWN_ERROR ).send( error );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  saveProgramToSpace( spaceName, number, code, response ) {
    knex( 'programs' )
      .update( { currentCode: code } )
      .where( { spaceName, number } )
      .then( () => {
        response.json( {} );
      } );
  }

  /**
   * See IDataService for documentation.
   * @param spaceName - space that this program is in
   * @param number - number of the program to get the code for
   * @param response - response object for the route
   */
  getProgramCode( spaceName, number, response ) {
    knex
      .select( 'currentCode' )
      .from( 'programs' )
      .where( { spaceName, number } )
      .then( selectResult => {
        response.set( 'Content-Type', 'text/javascript;charset=UTF-8' );
        response.send( selectResult[ 0 ].currentCode );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  getAllSnippets( response ) {
    knex
      .select( [ 'code', 'number' ] )
      .from( 'snippets' )
      .then( selectResult => {
        response.json( { snippets: selectResult } );
      } );
  }

  /**
   * See IDataService for documentation.
   * @param number
   * @param code
   * @param response
   */
  saveSnippet( number, code, response ) {
    knex( 'snippets' )
      .update( { code: code } )
      .where( { number } )
      .then( () => {
        response.json( {} );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  createSnippet( code, response ) {
    knex
      .select( 'number' )
      .from( 'snippets' )
      .then( selectResult => {
        const nextNumber = selectResult.length + 1;
        if ( nextNumber > Constants.MAX_SNIPPET_NUMBER ) {
          response.status( Constants.MISSING_INFO ).send( `Cannot make any more snippets, max ${Constants.MAX_SNIPPET_NUMBER}` );
        }

        knex( 'snippets' )
          .insert( { number: nextNumber, code: code } )
          .then( () => {
            response.json( { number: nextNumber, snippetCode: code } );
          } );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  claimProgram( spaceName, number, request, response ) {
    knex
      .select( [ 'debugInfo', 'editorInfo' ] )
      .from( 'programs' )
      .where( { spaceName, number } )
      .then( selectResult => {
        if ( selectResult.length === 0 ) {
          response.status( 404 );
        }
        const editorInfo = JSON.parse( selectResult[ 0 ].editorInfo || '{}' );
        if (
          editorInfo.time &&
          editorInfo.time + Constants.EDITOR_HANDLE_DURATION > Date.now() &&
          editorInfo.editorId !== request.body.editorId
        ) {
          response.status( 400 );
          response.json( {} );
        }
        else {
          knex( 'programs' )
            .update( { editorInfo: JSON.stringify( { ...request.body, time: Date.now() } ) } )
            .where( { spaceName, number } )
            .then( () => {
              response.json( {
                debugInfo: JSON.parse( selectResult[ 0 ].debugInfo || '{}' ),
                editorInfo
              } );
            } );
        }
      } );
  }

  /**
   * See IDataService for documentation.
   */
  getProjectNames( spaceName, response ) {
    knex
      .select( 'projectName' )
      .from( 'creator-data' )
      .where( { spaceName } )
      .then( selectResult => {
        response.json( { projectNames: selectResult.map( resultObject => resultObject.projectName ) } );
      } );
  }

  /**
   * See IDataService for documentation.
   */
  createProject( spaceName, projectName, response ) {
    knex
      .select( 'projectName' )
      .from( 'creator-data' )
      .where( { spaceName } )
      .then( selectResult => {
        const existingNames = selectResult.map( result => result.projectName );

        if ( existingNames.includes( projectName ) ) {
          response.status( Constants.MISSING_INFO ).send( 'Name already exists for this space.' );
        }
        else {
          knex( 'creator-data' )
            .insert( {
              spaceName, projectName, projectData: {}, editing: false
            } )
            .then( () => {
              response.json( { projectName: projectName } );
            } );
        }
      } );
  }

  /**
   * See IDataService for documentation.
   */
  copyProject( sourceSpaceName, sourceProjectName, destinationSpaceName, destinationProjectName, response ) {
    knex
      .select( 'projectData' )
      .from( 'creator-data' )
      .where( { spaceName: sourceSpaceName, projectName: sourceProjectName } )
      .then( sourceProjectResult => {
        if ( sourceProjectResult.length === 0 ) {
          response.status( Constants.PROJECT_DOES_NOT_EXIST ).send( 'Source project does not exist' );
        }
        else {
          knex
            .select( 'projectName' )
            .from( 'creator-data' )
            .where( { spaceName: destinationSpaceName } )
            .then( destinationSpaceResult => {
              const existingNames = destinationSpaceResult.map( result => result.projectName );
              if ( existingNames.includes( destinationProjectName ) ) {
                response.status( Constants.PROJECT_ALREADY_EXISTS ).send( 'Destination project already exists' );
              }
              else if ( !Utils.canAccessSpace( destinationSpaceName ) ) {
                response.status( Constants.SPACE_RESTRICTED ).send( 'Destination space is restricted' );
              }
              else {
                knex( 'creator-data' )
                  .insert( {
                    spaceName: destinationSpaceName,
                    projectName: destinationProjectName,
                    projectData: sourceProjectResult[ 0 ].projectData,
                    editing: false
                  } )
                  .then( () => {
                    response.status( Constants.SUCCESS ).json( {} );
                  } );
              }
            } );
        }
      } );
  }

  /**
   * See IDataService.
   */
  createEmptyProject( spaceName, projectName, projectData, response ) {
    knex( 'creator-data' )
      .update( { projectData: projectData } )
      .where( { spaceName, projectName } )
      .then( () => {
        response.json( {} );
      } );
  }

  /**
   * See IDataService.
   */
  saveProjectData( spaceName, projectName, projectData, onComplete, response ) {
    knex( 'creator-data' )
      .update( { projectData: projectData } )
      .where( { spaceName, projectName } )
      .then( () => {

        // Handle any work before submitting the response
        onComplete();

        response.json( { status: 'CHUNKS_SENT' } );
      } );
  }

  /**
   * See IDataService.
   */
  createTemplate( templateName, description, keyWords, projectData, spaceName, response ) {

    // Make sure that the name is unique for the space the template is in. We allow duplicate names for
    // different spaces and for templates in the global space.
    // NOTE: Templates are uniquely identified by ID in the database so overlapping names is fine.
    // This limitation just helps avoid a confusing UX.
    knex
      .select( 'name', 'spaceName' )
      .from( 'creator-templates' )
      .where( { name: templateName, spaceName: spaceName } )
      .then( selectResult => {
        const existingNames = selectResult.map( result => result.name );
        if ( existingNames.includes( templateName ) ) {
          response.status( 402 ).send( 'Name already exists for this template.' );
        }
        else {
          knex( 'creator-templates' )
            .insert( {
              name: templateName,
              projectData: projectData,
              description: description,
              keyWords: keyWords,
              spaceName: spaceName
            } )
            .then( () => {
              response.status( 200 ).json( {} );
            } )
            .catch( error => {
              response.status( Constants.UNKNOWN_ERROR ).send( 'An error occurred while saving the template' );
            } );
        }
      } );
  }

  /**
   * See IDataService.
   */
  saveTemplate( templateName, description, keyWords, projectData, templateId, response ) {
    knex( 'creator-templates' )
      .select( '*' )
      .where( { id: templateId } )
      .first()
      .then( template => {
        if ( !template ) {
          response.status( Constants.PROJECT_DOES_NOT_EXIST ).send( 'Template not found' );
        }
        else {
          knex( 'creator-templates' )
            .where( { id: templateId } )
            .update( {
              name: templateName,
              projectData: projectData,
              description: description,
              keyWords: keyWords
            } )
            .then( () => {
              response.status( Constants.SUCCESS ).send( 'Template updated successfully' );
            } )
            .catch( error => {
              response.status( Constants.UNKNOWN_ERROR ).send( 'An error occurred while updating the template' );
            } );
        }
      } )
      .catch( error => {
        response.status( Constants.UNKNOWN_ERROR ).send( 'An error occurred while checking for the template' );
      } );
  }

  /**
   * See IDataService.
   */
  getAllTemplates( response ) {
    knex
      .select( 'name', 'description', 'keyWords', 'projectData', 'id' )
      .from( 'creator-templates' )
      .then( selectResult => {
        response.json( { templates: selectResult } );
      } );
  }

  /**
   * See IDataService.
   */
  getUsableTemplates( spaceName, response ) {
    knex
      .select( 'name', 'description', 'keyWords', 'projectData', 'id', 'spaceName' )
      .from( 'creator-templates' )
      .where( { spaceName: spaceName } )
      .orWhereNull( 'spaceName' )
      .then( selectResult => {
        response.json( { templates: selectResult } );
      } );
  }

  /**
   * See IDataService.
   */
  getEditableTemplates( spaceName, allowAccessToRestrictedFiles, response ) {
    const query = knex
      .select( 'name', 'description', 'keyWords', 'projectData', 'id', 'spaceName' )
      .from( 'creator-templates' );

    if ( Utils.canAccessSpace( spaceName ) ) {
      query.where( { spaceName: spaceName } );
    }

    if ( allowAccessToRestrictedFiles ) {
      query.orWhereNull( 'spaceName' );
    }

    query.then( selectResult => {
      response.json( { templates: selectResult } );
    } );
  }

  /**
   * See IDataService.
   */
  deleteTemplate( templateName, response ) {
    knex( 'creator-templates' )
      .where( { name: templateName } )
      .del()
      .then( numberOfTemplatesDeleted => {
        response.json( { numberOfTemplatesDeleted } );
      } );
  }

  /**
   * See IDataService.
   */
  getProjectData( spaceName, projectName, response ) {
    knex
      .select( 'projectData' )
      .from( 'creator-data' )
      .where( { spaceName, projectName } )
      .then( selectResult => {
        if ( selectResult.length === 0 ) {
          response.status( 404 );
        }
        else {
          response.json( { projectData: selectResult[ 0 ].projectData } );
        }
      } );
  }

  /**
   * See IDataService.
   */
  deleteProject( spaceName, projectName, response ) {
    knex( 'creator-data' )
      .where( { spaceName, projectName: projectName } )
      .del()
      .then( numberOfProgramsDeleted => {
        response.json( { numberOfProgramsDeleted } );
      } );
  }

  /**
   * See IDataService.
   */
  setDebugInfo( spaceName, number, debugInfo, response ) {
    knex( 'programs' )
      .update( { debugInfo: JSON.stringify( debugInfo ) } )
      .where( { spaceName, number } )
      .then( () => {
        response.json( {} );
      } );
  }

  /**
   * See IDataService.
   */
  markPrinted( spaceName, number, printed, response ) {
    knex( 'programs' )
      .update( { printed } )
      .where( { spaceName, number } )
      .then( () => {
        this.getSpaceData( spaceName, spaceData => {
          response.json( spaceData );
        } );
      } );
  }
}

module.exports = KnexDataService;