/**
 * An IDataService that will send requests to a database using knex.
 */

const crypto = require( 'crypto' );
const restrictedSpacesList = require( './restrictedSpacesList.js' );
const Constants = require( './Constants.js' );
const Utils = require( './Utils.js' );
const IDataService = require( './IDataService.js' );
const { response } = require( 'express' );

// The knex instance - processes all database requests, using a local or remote database depending
// on the environment.
const knex = require( 'knex' )( require( '../knexfile' )[ process.env.NODE_ENV || 'development' ] );

class KnexDataService extends IDataService {

  /**
   * @param allowAccessToRestrictedFiles - {boolean} - If true, restricted files can be accessed.
   */
  constructor( allowAccessToRestrictedFiles ) {
    super();

    this.allowAccessToRestrictedFiles = allowAccessToRestrictedFiles;
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
   * @param {string} spaceName
   * @param {*} response The response from the router.
   */
  addNewProgram( spaceName, response ) {
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
            getSpaceData( req, spaceData => {
              response.json( { number, spaceData } );
            } );
          } );
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
   * @param programNumber - number of the program to get the code for
   * @param response - response object for the route
   */
  getProgramCode( spaceName, programNumber, response ) {
    knex
      .select( 'currentCode' )
      .from( 'programs' )
      .where( { spaceName, programNumber } )
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

        console.log( 'EXISTING NAMES', existingNames );
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
}

module.exports = KnexDataService;