const express = require( 'express' );
const restrictedSpacesList = require( './restrictedSpacesList.js' );
const fs = require( 'fs' );
const path = require( 'path' );
const multer = require( 'multer' );
const OpenAI = require( 'openai' );
const KnexDataService = require( './KnexDataService.js' );
const Constants = require( './Constants.js' );
const Utils = require( './Utils.js' );
const LocalFileDataService = require( './LocalFileDataService.js' );

const router = express.Router();
router.use( express.json() );
router.use( require( 'nocache' )() );

console.log( '---------------------------------------------------' );

// Determine how spaces and projects are saved and loaded. Local filesystem is the default. Providing
// STORAGE_TYPE=postgres in the .env file will use a PostgreSQL database instead. If using postgreSQL, also
// include a DATABASE_URL in the .env file to point to the database.
const usePostgres = process.env.STORAGE_TYPE === 'postgresql';

// Set a constant based on the .env file that will control whether access to restricted files will be allowed on the
// client side. If using local files, the user will have access to everything.
const ALLOW_ACCESS_TO_RESTRICTED_FILES = !usePostgres || process.env.ALLOW_ACCESS_TO_RESTRICTED_FILES === 'true';

let dataService = null;
if ( usePostgres ) {
  console.log( 'USING PostgreSQL STORAGE' );
  dataService = new KnexDataService( ALLOW_ACCESS_TO_RESTRICTED_FILES );
}
else {
  console.log( 'USING LOCAL STORAGE' );
  dataService = new LocalFileDataService( ALLOW_ACCESS_TO_RESTRICTED_FILES );
  dataService.copyDefaultData();
}
console.log( '---------------------------------------------------' );

// Storage managers for the image and sound uploads
const imageStorage = multer.diskStorage( {
  destination: ( req, file, cb ) => {
    cb( null, path.join( 'www', 'media', 'images', 'uploads' ) );
  },
  filename: ( req, file, cb ) => {
    cb( null, file.originalname );
  }
} );
const soundStorage = multer.diskStorage( {
  destination: ( req, file, cb ) => {
    cb( null, path.join( 'www', 'media', 'sounds', 'uploads' ) );
  },
  filename: ( req, file, cb ) => {
    cb( null, file.originalname );
  }
} );
const uploadImage = multer( { storage: imageStorage } );
const uploadSound = multer( { storage: soundStorage } );

/**
 * Get the current code for the specified space name and program number.
 * I believe this is what gets the code to run for the webworker (which is why
 * the format is different).
 */
router.get( '/program.:spaceName.:number.js', ( req, res ) => {
  const { spaceName, number } = req.params;
  dataService.getProgramCode( spaceName, number, res );
} );

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
 */
router.get( '/api/program-summary-list/:spacesList', ( req, res ) => {
  const { spacesList } = req.params;
  dataService.getProgramSummaryList( spacesList, res );
} );

/**
 * Gets a list of all spaces available in the database.
 */
router.get( '/api/spaces-list', ( req, res ) => {
  dataService.getSpacesList( res );
} );

// Get a list of all the spaces available in the DB that are NOT restricted to the current user.
router.get( '/api/spaces-list-not-restricted', ( req, res ) => {
  dataService.getUnrestrictedSpacesList( res );
} );

// Add a new space to the DB.
router.get( '/api/add-space/:newSpaceName', ( req, res ) => {
  console.log( `req.params.newSpaceName = ${req.params.newSpaceName}` );
  res.json( req.params );
} );

function getSpaceData( req, callback ) {
  const { spaceName } = req.params;
  dataService.getSpaceData( spaceName, callback );
}

router.get( '/api/spaces/:spaceName', ( req, res ) => {
  getSpaceData( req, spaceData => {
    res.json( spaceData );
  } );
} );

/**
 * Returns whether the provided space name is restricted. If the .env variable indicates full access, none of the
 * spaces are restricted.
 */
router.get( '/api/spaces/:spaceName/restricted', ( req, res ) => {
  const { spaceName } = req.params;
  res.json( { restricted: !ALLOW_ACCESS_TO_RESTRICTED_FILES && restrictedSpacesList.includes( spaceName ) } );
} );

/**
 * Adds a new program to the database, assigning it a new unique number for the spacename.
 *
 * @param spaceName - The space to save the program to.
 */
router.post( '/api/spaces/:spaceName/programs', ( req, res ) => {
  const { spaceName } = req.params;

  // extract code from the request
  const { code } = req.body;
  if ( !code ) {
    res.status( 400 ).send( 'Missing "code"' );
  }

  dataService.addNewProgram( spaceName, code, res );
} );

/**
 * Clears all programs in the selected space.
 */
router.post( '/api/spaces/:spaceName/programs/clear', ( req, res ) => {
  const { spaceName } = req.params;
  dataService.clearPrograms( spaceName, res );
} );

/**
 * Add a single program to the space, generally a premade program with implementation
 * data ready from Creator.
 */
router.post( '/api/spaces/:spaceName/programs/add-premade-program', ( req, res ) => {
  const { spaceName } = req.params;
  const { program } = req.body;

  if ( !program || !program.number || !program.code ) {
    res.status( 400 ).send( 'Missing program, number or code' );
  }

  dataService.addPremadeProgram( spaceName, program, res );
} );

/**
 * Sets the code strings provided in the request body to the specified space. BEWARE! This will
 * remove all existing programs in the space, making way for a new one.
 */
router.post( '/api/spaces/:spaceName/programs/set', ( req, res ) => {

  // const { spaceName } = req.params;
  //
  // // extract code from the request
  // const { programs } = req.body;
  // if ( !programs ) {
  //   res.status( 400 ).send( 'Missing "programs"' );
  // }
  //
  // // Given the programs, create objects that can can be used with .insert()
  // const programData = programs.map( program => {
  //   if ( !program.number ) {
  //     res.status( 400 ).send( 'Missing "number", is program data correct?' );
  //   }
  //   if ( !program.code ) {
  //     res.status( 400 ).send( 'Missing "code"' );
  //   }
  //
  //   return {
  //     spaceName: spaceName,
  //     number: program.number,
  //     originalCode: program.code,
  //     currentCode: program.code
  //   };
  // } );
  //
  // knex( 'programs' )
  //   .where( { spaceName } )
  //   .del()
  //   .then( () => {
  //     knex( 'programs' )
  //       .insert( programData )
  //       .then( () => {
  //         getSpaceData( req, spaceData => {
  //           res.json( { spaceData } );
  //         } );
  //       } );
  //   } );
} );

// Save the program with the provided number to the provided space.
router.put( '/api/spaces/:spaceName/programs/:number', ( req, res ) => {
  const { spaceName, number } = req.params;
  const { code } = req.body;
  if ( !code ) {
    res.status( 400 ).send( 'Missing "code"' );
  }
  dataService.saveProgramToSpace( spaceName, number, code, res );
} );


router.post( '/api/spaces/:spaceName/programs/:number/markPrinted', ( req, res ) => {
  const { spaceName, number } = req.params;
  const { printed } = req.body;
  if ( printed === undefined ) {
    res.status( 400 ).send( 'Missing "printed"' );
  }

  dataService.markPrinted( spaceName, number, printed, res );
} );

/**
 * Delete the specified program from the specified space.
 */
router.get( '/api/spaces/:spaceName/delete/:programNumber', ( req, res ) => {
  const { spaceName, programNumber } = req.params;
  dataService.deleteProgram( spaceName, programNumber, res );
} );

/**
 * Set the debug info for the program.
 */
router.put( '/api/spaces/:spaceName/programs/:number/debugInfo', ( req, res ) => {
  const { spaceName, number } = req.params;
  dataService.setDebugInfo( spaceName, number, req.body, res );
} );

router.post( '/api/spaces/:spaceName/programs/:number/claim', ( req, res ) => {
  const { spaceName, number } = req.params;
  dataService.claimProgram( spaceName, number, req, res );
} );

/**
 * Get the existing project names for the provided space name.
 */
router.get( '/api/creator/projectNames/:spaceName', ( req, res ) => {
  const { spaceName } = req.params;
  dataService.getProjectNames( spaceName, res );
} );

/**
 * Create a new project name at the provided space name.
 */
router.post( '/api/creator/projectNames/:spaceName/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;
  dataService.createProject( spaceName, projectName, res );
} );

/**
 * Copy a project from one space into another space. The source space/project are copied into the destination
 * space/project.
 */
router.post( '/api/creator/copyProject/:sourceSpaceName/:sourceProjectName/:destinationSpaceName/:destinationProjectName', ( req, res ) => {
  const {
    sourceSpaceName,
    sourceProjectName,
    destinationSpaceName,
    destinationProjectName
  } = req.params;

  dataService.copyProject( sourceSpaceName, sourceProjectName, destinationSpaceName, destinationProjectName, res );
} );

/**
 * Saves an empty project to the provided project.
 */
router.put( '/api/creator/clear/:spaceName/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;

  const projectData = {
    programs: []
  };
  if ( !projectData ) {
    res.status( 400 ).send( 'Missing project data' );
  }
  else {
    dataService.createEmptyProject( spaceName, projectName, projectData, res );
  }
} );

// We save projects by sending small chunks of data to reduce the payload. Chunks are stored here
// and then reassembled to save the data to the database.
const spaceChunkMap = {};

/**
 * Clears the chunks of data for a space. To be called by the client before starting a save
 * request so that no old data is send in a new request. (This should only be possible if
 * the user hits save twic while a save is already in progress).
 */
router.put( '/api/creator/chunk/:spaceName/clear', ( req, res ) => {
  const { spaceName } = req.params;

  // clear the chunk data as requested by the user to make sure that we don't have any lingering data
  spaceChunkMap[ spaceName ] = [];

  // send back an empty response
  res.json( {} );
} );

/**
 * Saves a chunk of program data for a project to the server at the provided space. The chunk
 * is saved to memory until all chunks are received and then the project data is saved to the
 * database.
 *
 * @param {string} spaceName - The name of the space to save the project to.
 * @param {string} projectName - The name of the project to save.
 *
 * req.body should have { programData: JSON, totalChunksCount: number }
 */
router.put( '/api/creator/chunk/:spaceName/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;

  // should have a programData and a totalChunksCount property
  const { programData, totalChunksCount } = req.body;

  // This is the first chunk we received for the space name, create a new collection
  if ( !spaceChunkMap[ spaceName ] ) {
    spaceChunkMap[ spaceName ] = [];
  }

  // Add the chunk to the collection
  spaceChunkMap[ spaceName ].push( programData );

  // If we have all the chunks, we can save the project data
  if ( spaceChunkMap[ spaceName ].length === totalChunksCount ) {
    const fullProjectData = {
      programs: spaceChunkMap[ spaceName ]
    };

    dataService.saveProjectData( spaceName, projectName, fullProjectData, () => {

      // clear the chunk data as we have saved the project data
      spaceChunkMap[ spaceName ] = [];
    }, res );
  }
  else {
    res.json( { status: 'CHUNK_ADDED', chunksReceived: spaceChunkMap[ spaceName ].length } );
  }
} );

/**
 * Save a new template to the templates table.
 */
router.put( '/api/creator/templates', ( req, res ) => {
  const {
    templateName,
    description,
    keyWords,
    projectData,
    spaceName
  } = req.body;

  if ( !templateName ) {
    res.status( 403 ).send( 'Missing template name' );
  }
  else if ( !projectData ) {
    res.status( 403 ).send( 'Missing project data' );
  }
  else {
    dataService.createTemplate( templateName, description, keyWords, projectData, spaceName, res );
  }
} );

/**
 * Update a Creator template with the provided id with the provided data.
 *
 * For some reason, I had to had a 'save' into the URL. I could not figure out why.
 * '/api/creator/templates/update' on its own did not work, the request would never get to this endpoint.
 */
router.put( 'api/creator/templates/use', ( req, res ) => {
  const {
    description,
    keyWords,
    projectData,
    templateName,
    templateId
  } = req.body;

  dataService.saveTemplate( templateName, description, keyWords, projectData, templateId, res );
} );

/**
 * Retrieve all templates from the templates table.
 * TODO: I believe this is unused. Remove soon if true.
 */
router.get( '/api/creator/all-templates', ( req, res ) => {
  dataService.getAllTemplates( res );
} );

/**
 * Get the templates that can be used in the provided space. Will include all global templates and the template
 * that are assigned to the provided space.
 */
router.get( '/api/creator/templates/use/:spaceName', ( req, res ) => {
  const { spaceName } = req.params;
  dataService.getUsableTemplates( spaceName, res );
} );

/**
 * Get the templates that can be edited in the provided space. If the user has full access, it will include all
 * global templates. Otherwise, it will include teh templates assigned to the provided spaceName, assuming that
 * the user has access to the space.
 */
router.get( '/api/creator/templates/edit/:spaceName', ( req, res ) => {
  const { spaceName } = req.params;
  dataService.getEditableTemplates( spaceName, ALLOW_ACCESS_TO_RESTRICTED_FILES, res );
} );

/**
 * Delete the template from the templates table with the provided name.
 */
router.get( '/api/creator/templates/delete/:templateName', ( req, res ) => {
  const { templateName } = req.params;
  dataService.deleteTemplate( templateName, res );
} );

/**
 * Just returns true if the user has access to restricted spaces, which is controlled by a value in the
 * .env file.
 *
 * Lets front end code know if there is access to restricted files.
 */
router.get( '/api/creator/can-access-restricted-files', ( req, res ) => {
  res.json( { canAccess: ALLOW_ACCESS_TO_RESTRICTED_FILES } );
} );

/**
 * Returns true if the user has access to the provide space.
 */
router.get( '/api/creator/can-access-space/:spaceName', ( req, res ) => {
  const { spaceName } = req.params;
  res.json( { canAccess: Utils.canAccessSpace( spaceName ) } );
} );

/**
 * Get the project data at the provided space and project name. The space and project names are provided as query
 * parameters.
 *
 * @param spaceName - The name of the space to get the project data from.
 * @param projectName - The name of the project to get the data from.
 */
router.get( '/api/creator/data', ( req, res ) => {
  const spaceName = req.query.spaceName;
  const projectName = req.query.projectName;
  dataService.getProjectData( spaceName, projectName, res );
} );

/**
 * Delete the specified project at the provided space name. The project and space names must be
 * provided as query parameters.
 */
router.get( '/api/creator/projects/delete', ( req, res ) => {
  const spaceName = req.query.spaceName;
  const projectName = req.query.projectName;
  dataService.deleteProject( spaceName, projectName, res );
} );

/**
 * Gets the list of sound files available to use.
 */
router.get( '/api/creator/soundFiles', ( req, res ) => {
  const soundDirectories = [ './www/media/sounds', './www/media/sounds/uploads' ];

  // use fs to get the list of files in the imageDirectories
  const soundFiles = soundDirectories.reduce( ( accumulator, soundDirectory ) => {
    const files = fs.readdirSync( soundDirectory );
    const filtered = files.filter( file => {
      const extension = path.extname( file ).toLowerCase();
      return [ '.mp3', '.wav', '.ogg' ].includes( extension );
    } );

    // if from the uplaods directory, prepend the directory name
    if ( soundDirectory === './www/media/sounds/uploads' ) {
      return accumulator.concat( filtered.map( file => `/uploads/${file}` ) );
    }
    else {
      return accumulator.concat( filtered );
    }
  }, [] );

  res.json( { soundFiles: soundFiles } );
} );

/**
 * Gets the list of image files available to use.
 */
router.get( '/api/creator/imageFiles', ( req, res ) => {
  const imageDirectories = [ './www/media/images', './www/media/images/uploads' ];

  // use fs to get the list of files in the imageDirectories
  const imageFiles = imageDirectories.reduce( ( accumulator, imageDirectory ) => {
    const files = fs.readdirSync( imageDirectory );
    const filtered = files.filter( file => {
      const extension = path.extname( file ).toLowerCase();
      return [ '.jpg', '.jpeg', '.png', '.gif' ].includes( extension );
    } );

    // if from the uplaods directory, prepend the directory name
    if ( imageDirectory === './www/media/images/uploads' ) {
      return accumulator.concat( filtered.map( file => `/uploads/${file}` ) );
    }
    else {
      return accumulator.concat( filtered );
    }
  }, [] );

  res.json( { imageFiles: imageFiles } );
} );

/**
 * Upload an image file to the server so that it can be used in various applications.
 */
router.post( '/api/creator/uploadImage', uploadImage.single( 'file' ), async ( req, res ) => {

  // Check if a file was provided
  if ( !req.file ) {
    throw new Error( 'No file provided' );
  }

  // Multer should have been successful in the upload if we made it to this point.
  try {

    // Respond with a success message and the location/name of the file
    res.status( 200 ).json( {
      message: 'File uploaded and processed successfully',
      imageFileName: `/uploads/${req.file.originalname}`
    } );
  }
  catch( error ) {
    console.error( 'Error processing the uploaded file:', error );
    res.status( 500 ).json( { message: 'Failed to process the uploaded file' } );
  }
} );

/**
 * Upload a sound file to the server so that it can be used in various applications.
 */
router.post( '/api/creator/uploadSound', uploadSound.single( 'file' ), async ( req, res ) => {

  // Check if a file was provided
  if ( !req.file ) {
    throw new Error( 'No file provided' );
  }

  // Multer should have been successful in the upload if we made it to this point.
  try {

    // Respond with a success message and the location/name of the file
    res.status( 200 ).json( {
      message: 'File uploaded and processed successfully',
      soundFileName: `/uploads/${req.file.originalname}`
    } );
  }
  catch( error ) {
    console.error( 'Error processing the uploaded file:', error );
    res.status( 500 ).json( { message: 'Failed to process the uploaded file' } );
  }
} );

/**
 * An endpoint for maintenance on creator project JSON in the database schema. Change the implementation of this
 * function as needed to handle your needs. You can call this from the Chrome developer console with something like
 * this:
 *
 fetch(new URL( `api/creator/maintenance/updateSchema`, window.location.origin ).toString(), {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({ key1: 'value1', key2: 'value2'})
 })
 .then(response => response.json())
 .then(data => console.log(data))
 .catch(error => console.error('Error:', error));
 */
router.post( '/api/creator/maintenance/updateSchema', ( req, res ) => {
  //
  // function modifyProjectData( oldData ) {
  //
  //   // create a copy of the data
  //   const newData = { ...oldData };
  //
  //   if ( newData.programs ) {
  //     newData.programs.forEach( programData => {
  //       programData.modelContainer.namedBounds2Properties = [];
  //     } );
  //   }
  //
  //   return newData;
  // }
  //
  // // For every project in creator-data, update the project data to a modified JSON object.
  // knex
  //   .select( [ 'projectData', 'spaceName', 'projectName' ] )
  //   .from( 'creator-data' )
  //   .then( selectResult => {
  //     if ( selectResult.length === 0 ) {
  //       return res.status( 404 ).json( { error: 'No projects found' } );
  //     }
  //
  //     // Process each project's data
  //     const updatedProjects = selectResult.map( project => {
  //       const oldData = project.projectData;
  //       console.log( project.spaceName, project.projectName );
  //
  //       // Modify the oldData to create the newData
  //       const newData = modifyProjectData( oldData );
  //
  //       // Return an object with the id and the modified data
  //       return {
  //         spaceName: project.spaceName,
  //         projectName: project.projectName,
  //         projectData: newData
  //       };
  //     } );
  //
  //     // Update the records in the 'creator-data' table
  //     const updatePromises = updatedProjects.map( updatedProject => {
  //       console.log( updatedProject.spaceName, updatedProject.projectName );
  //
  //       return knex( 'creator-data' )
  //         .update( { projectData: updatedProject.projectData } )
  //         .where( { spaceName: updatedProject.spaceName, projectName: updatedProject.projectName } );
  //     } );
  //
  //     // Execute all update queries using Promise.all
  //     return Promise.all( updatePromises );
  //   } )
  //   .then( () => {
  //     res.json( { message: 'Schema update completed' } );
  //   } )
  //   .catch( error => {
  //     console.error( 'Error:', error );
  //     res.status( 500 ).json( { error: 'Internal server error' } );
  //   } );
} );

//--------------------------------------------------------------------------------------------------
// Routes for the OpenAI API
//--------------------------------------------------------------------------------------------------
const openAIRouter = express.Router();
openAIRouter.use( express.json() );
openAIRouter.use( require( 'nocache' )() );

// The default value for apiKey is process.env["OPENAI_API_KEY"], which is what we use.
const openai = new OpenAI( {
  apiKey: process.env.OPENAI_API_KEY || 'no-available-key'
} );

// Make a post to the OpenAI router. Recall that the path through this router is /openai.
openAIRouter.post( '/', async ( req, res ) => {

  const promptString = req.body.promptString;

  try {
    if ( !process.env.OPENAI_API_KEY ) {
      throw new Error( 'No OpenAI API key available.' );
    }

    const completion = await openai.chat.completions.create( {
      messages: [ { role: 'user', content: promptString } ],

      // slower, more expensive, but better - OpenAI claims this version of gpt-4
      // has less 'laziness'.
      model: 'gpt-4-0125-preview'

      // faster
      // model: 'gpt-3.5-turbo'
    } );

    const response = completion.choices[ 0 ];

    res.json( { response: response } );
  }
  catch( error ) {
    if ( error.response ) {
      res.json( error.response.data );
    }
    else {
      res.json( { error: error.message } );
    }
  }
} );

module.exports = { router, openAIRouter };