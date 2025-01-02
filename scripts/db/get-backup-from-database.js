/**
 * NodeJS script to read the paper program data from the configured database and store them locally.  This is generally
 * used to back up the paper programs and potentially store them in GitHub.
 *
 * Data will be stored in the following directory structure:
 *   <path-to-backup-dir>/
 *     templates/
 *       <template-name>.json
 *       ...
 *     spaces/
 *       <space-name>/
 *         programs/
 *           <program-number>.json
 *           ...
 *         projects/
 *           <project-name>.json
 *           ...
 *
 *
 * IMPORTANT NOTE: This script must be run from the top level of the repo if you want to use the URL in the .env file.
 * Example Usage:
 *
 *   node scripts/db/get-programs-from-database.js paper-programs-backup
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

const fs = require( 'fs' );
const os = require( 'os' );

// A config.json is required for development. Run `npm run create-config` to create one.
const config = require( '../../config.json' );

const USAGE_STRING = 'Usage: node get-programs-from-db.js <path-to-backup-dir>';

// Make sure the correct number of arguments were supplied.
if ( process.argv.length !== 3 || ( process.argv.length === 3 && process.argv[ 2 ][ 0 ] === '-' ) ) {
  console.log( USAGE_STRING );
  process.exit( 1 );
}

// Helper function to fix end-of-line issues so that this works on any OS.
const fixEOL = string => string.split( '\r' ).join( '' ).split( '\n' ).join( os.EOL );

// Removes invalid characters from a name so that it can be used as a file name.
const sanitizeName = providedName => providedName.replace( /[<>:"/\\|?*]+/g, '_' );

const pathToBackupDirectory = process.argv[ 2 ];

// Set up the DB connection.
const knex = require( 'knex' )( require( '../../knexfile' )[ config.MODE || 'development' ] );

// Clear the old backup directory if it exists.
if ( fs.existsSync( pathToBackupDirectory ) ) {
  console.log( `Clearing old backup directory ${pathToBackupDirectory}` );
  fs.rmdirSync( pathToBackupDirectory, { recursive: true } );
}

// Create the backup directory.
fs.mkdirSync( pathToBackupDirectory );

// Create subdirectories for spaces and templates.
const spacesSubdirectory = `${pathToBackupDirectory}/spaces`;
const templatesSubdirectory = `${pathToBackupDirectory}/templates`;
const paths = [ spacesSubdirectory, templatesSubdirectory ];
paths.forEach( path => {
  if ( !fs.existsSync( path ) ) {
    fs.mkdirSync( path );
  }
  else {
    console.log( `Directory ${path} already exists, skipping creation.` );
  }
} );

// Read the information from the DB and store it on the local file system.  This uses async options, so it needs to be
// enclosed in an async function.
( async () => {

  console.log( 'Reading data from DB...' );
  console.log( `  DB URL =  ${config.DATABASE_URL}` );

  try {

    // Get a list of all the "play spaces" in the DB.
    const playSpaces = await knex
      .distinct()
      .from( 'programs' )
      .pluck( 'spaceName' );

    console.log( `  Found ${playSpaces.length} play spaces` );

    for ( const playSpace of playSpaces ) {

      // Check if the subdirectory for this play space exists and, if not, create it.
      const playSpaceSubdirectory = `${spacesSubdirectory}/${playSpace}`;
      if ( !fs.existsSync( playSpaceSubdirectory ) ) {
        fs.mkdirSync( playSpaceSubdirectory );
      }

      console.log( `  Getting programs in playSpace ${playSpace}` );

      const programsSubdirectory = `${playSpaceSubdirectory}/programs`;
      if ( !fs.existsSync( programsSubdirectory ) ) {
        fs.mkdirSync( programsSubdirectory );
      }

      const programInfo = await knex
        .select( [ 'number', 'currentCode' ] )
        .from( 'programs' )
        .where( { spaceName: playSpace } );

      programInfo.forEach( programInfoObject => {
        console.log( `    Getting program #${programInfoObject.number}, "${extractTitleFromCode( programInfoObject.currentCode )}"` );
        const filePath = `${programsSubdirectory}/${programInfoObject.number.toString()}.json`;

        const fullProgramDataObject = {
          number: programInfoObject.number,
          originalCode: programInfoObject.currentCode,
          currentCode: programInfoObject.currentCode,
          printed: false,
          editorInfo: {},
          currentCodeUrl: `program.${playSpace}.${programInfoObject.number}.js`,
          currentCodeHash: '',
          debugUrl: `/api/spaces/${playSpace}/programs/${programInfoObject.number}/debugInfo`,
          claimUrl: `/api/spaces/${playSpace}/programs/${programInfoObject.number}/claim`,
          codeHasChanged: false,
          debugInfo: '{"logs":[]}'
        };

        // Convert to a pretty-printed JSON string
        const programDataString = JSON.stringify( fullProgramDataObject, null, 2 );
        fs.writeFileSync( filePath, fixEOL( programDataString ) );
      } );

      console.log( `  Getting projects in playSpace ${playSpace}` );

      const projectsSubdirectory = `${playSpaceSubdirectory}/projects`;
      if ( !fs.existsSync( projectsSubdirectory ) ) {
        fs.mkdirSync( projectsSubdirectory );
      }

      const projectInfo = await knex
        .select( [ 'projectName', 'projectData' ] )
        .from( 'creator-data' )
        .where( { spaceName: playSpace } );

      projectInfo.forEach( projectInfoObject => {
        console.log( `    Getting project "${projectInfoObject.projectName}"` );
        const filePath = `${projectsSubdirectory}/${projectInfoObject.projectName}.json`;

        let projectData = projectInfoObject.projectData;
        if ( typeof projectData !== 'string' ) {

          // Convert to a pretty-printed JSON string
          projectData = JSON.stringify( projectData, null, 2 );
        }

        fs.writeFileSync( filePath, fixEOL( projectData ) );
      } );
    }

    // Get all templates and save them.
    console.log( `  Getting templates...` );

    const templateInfo = await knex
      .select( [ 'name', 'description', 'keyWords', 'projectData', 'id', 'spaceName' ] )
      .from( 'creator-templates' )

    templateInfo.forEach( templateInfoObject => {

      // Write the template to a file
      console.log( `    Getting template "${templateInfoObject.name}"` );
      const filePath = `${templatesSubdirectory}/${sanitizeName( templateInfoObject.name )}.json`;

      const templateDataString = JSON.stringify( templateInfoObject, null, 2 );
      fs.writeFileSync( filePath, fixEOL( templateDataString ) );
    } );
  }
  catch( e ) {
    console.log( `  Error:  = ${e}` );
  }

  // Close the database connection.
  console.log( '  Terminating DB connection.' );
  await knex.destroy();
  console.log( 'Done.' );
} )();

/**
 * Helper function to extract the title from a string representing a paper program.  In paper programs, the first line
 * should be a comment with the title name.  If no title is found, a default string is returned.
 * @param {string} paperProgramCode
 * @returns {string}
 */
const extractTitleFromCode = paperProgramCode => {
  let endOfFirstLine = paperProgramCode.indexOf( '\n' );
  if ( endOfFirstLine === -1 ) {
    endOfFirstLine = paperProgramCode.length;
  }
  const firstLine = paperProgramCode.substring( 0, endOfFirstLine );
  let title = ( firstLine.match( /[A-Za-z0-9].*$/ ) || [] )[ 0 ];
  if ( title === undefined || title.length === 0 ) {
    title = '(no title found)';
  }
  return title;
};