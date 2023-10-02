const express = require( 'express' );
const crypto = require( 'crypto' );
const restrictedSpacesList = require( './restrictedSpacesList.js' );
const fs = require( 'fs' );
const path = require( 'path' );
const multer = require( 'multer' );
const OpenAI = require( 'openai' );

const router = express.Router();
router.use( express.json() );
router.use( require( 'nocache' )() );

const knex = require( 'knex' )( require( '../knexfile' )[ process.env.NODE_ENV || 'development' ] );

// Set a constant based on the .env file that will control whether access to restricted files will be allowed on the
// client side.
const ALLOW_ACCESS_TO_RESTRICTED_FILES = process.env.ALLOW_ACCESS_TO_RESTRICTED_FILES === 'true';

const editorHandleDuration = 1500;

// Response codes that may need to be handled
const SUCCESS = 200;
const SPACE_RESTRICTED = 401;
const PROJECT_ALREADY_EXISTS = 402;
const BAD_PARAMETERS = 403;
const PROJECT_DOES_NOT_EXIST = 404;

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
 */
router.get( '/program.:spaceName.:number.js', ( req, res ) => {
  const { spaceName, number } = req.params;
  knex
    .select( 'currentCode' )
    .from( 'programs' )
    .where( { spaceName, number } )
    .then( selectResult => {
      res.set( 'Content-Type', 'text/javascript;charset=UTF-8' );
      res.send( selectResult[ 0 ].currentCode );
    } );
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
    res.json( selectResult );
  } );
} );

// Get a list of all the spaces available in the DB.
router.get( '/api/spaces-list', ( req, res ) => {
  knex
    .distinct()
    .from( 'programs' )
    .pluck( 'spaceName' )
    .then( spaceNames => {
      res.json( spaceNames );
    } )
    .catch( error => {
      console.log( `Error getting spaces list: ${error}` );
    } );
} );

// Get a list of all the spaces available in the DB that are NOT restricted to the current user.
router.get( '/api/spaces-list-not-restricted', ( req, res ) => {
  knex
    .distinct()
    .from( 'programs' )
    .pluck( 'spaceName' )
    .then( spaceNames => {

      // filter out the restricted spaces
      const filteredSpaceNames = spaceNames.filter( spaceName => !restrictedSpacesList.includes( spaceName ) );
      res.json( filteredSpaceNames );
    } )
    .catch( error => {
      console.log( `Error getting spaces list: ${error}` );
    } );
} );

// Add a new space to the DB.
router.get( '/api/add-space/:newSpaceName', ( req, res ) => {
  console.log( `req.params.newSpaceName = ${req.params.newSpaceName}` );
  res.json( req.params );
} );

function getSpaceData( req, callback ) {
  const { spaceName } = req.params;
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
              claimed: !!( editorInfo.time && editorInfo.time + editorHandleDuration > Date.now() ),
              readOnly: !ALLOW_ACCESS_TO_RESTRICTED_FILES && restrictedSpacesList.includes( spaceName )
            },
            codeHasChanged: program.currentCode !== program.originalCode
          };
        } ),
        spaceName
      } );
    } );
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
const maxNumber = 8400 / 4;
router.post( '/api/spaces/:spaceName/programs', ( req, res ) => {
  const { spaceName } = req.params;

  // extract code from the request
  const { code } = req.body;
  if ( !code ) {
    res.status( 400 ).send( 'Missing "code"' );
  }

  knex
    .select( 'number' )
    .from( 'programs' )
    .where( { spaceName } )
    .then( selectResult => {
      const existingNumbers = selectResult.map( result => result.number );
      const potentialNumbers = [];
      for ( let i = 0; i < maxNumber; i++ ) {
        if ( !existingNumbers.includes( i ) ) {
          potentialNumbers.push( i );
        }
      }
      if ( potentialNumbers.length === 0 ) {
        res.status( 400 ).send( 'No more available numbers' );
      }
      const number = potentialNumbers[ Math.floor( Math.random() * potentialNumbers.length ) ];

      knex( 'programs' )
        .insert( {
          spaceName, number, originalCode: code, currentCode: code
        } )
        .then( () => {
          getSpaceData( req, spaceData => {
            res.json( { number, spaceData } );
          } );
        } );
    } );
} );

/**
 * Sets the code strings provided in the request body to the specified space. BEWARE! This will
 * remove all existing programs in the space, making way for a new one.
 */
router.post( '/api/spaces/:spaceName/programs/set', ( req, res ) => {

  const { spaceName } = req.params;

  // extract code from the request
  const { programs } = req.body;
  if ( !programs ) {
    res.status( 400 ).send( 'Missing "programs"' );
  }

  // Given the programs, create objects that can can be used with .insert()
  const programData = programs.map( program => {
    if ( !program.number ) {
      res.status( 400 ).send( 'Missing "number", is program data correct?' );
    }
    if ( !program.code ) {
      res.status( 400 ).send( 'Missing "code"' );
    }

    return {
      spaceName: spaceName,
      number: program.number,
      originalCode: program.code,
      currentCode: program.code
    };
  } );

  knex( 'programs' )
    .where( { spaceName } )
    .del()
    .then( () => {
      knex( 'programs' )
        .insert( programData )
        .then( () => {
          getSpaceData( req, spaceData => {
            res.json( { spaceData } );
          } );
        } );
    } );
} );

// Create a new snippet
const maxSnippets = 500;
router.post( '/api/snippets', ( req, res ) => {
  const { snippetCode } = req.body;
  if ( !snippetCode ) {
    res.status( 400 ).send( 'Missing "code"' );
  }

  knex
    .select( 'number' )
    .from( 'snippets' )
    .then( selectResult => {
      const nextNumber = selectResult.length + 1;
      if ( nextNumber > maxSnippets ) {
        res.status( 400 ).send( `Cannot make any more snippets, max ${maxSnippets}` );
      }

      knex( 'snippets' )
        .insert( { number: nextNumber, code: snippetCode } )
        .then( () => {
          res.json( { number: nextNumber, snippetCode: snippetCode } );
        } );
    } );
} );

// Save the program with the provided number to the provided space.
router.put( '/api/spaces/:spaceName/programs/:number', ( req, res ) => {
  const { spaceName, number } = req.params;
  const { code } = req.body;
  if ( !code ) {
    res.status( 400 ).send( 'Missing "code"' );
  }

  knex( 'programs' )
    .update( { currentCode: code } )
    .where( { spaceName, number } )
    .then( () => {
      res.json( {} );
    } );
} );

// Get all code snippets in the database
router.get( '/api/snippets', ( req, res ) => {
  knex
    .select( [ 'code', 'number' ] )
    .from( 'snippets' )
    .then( selectResult => {
      res.json( { snippets: selectResult } );
    } );
} );

// Save the snippet of the provided number
router.put( '/api/snippets/:number', ( req, res ) => {

  const { number } = req.params;
  const { snippetCode } = req.body;
  if ( !snippetCode ) {
    res.status( 400 ).send( 'Missing "snippetCode"' );
  }

  knex( 'snippets' )
    .update( { code: snippetCode } )
    .where( { number } )
    .then( () => {
      res.json( {} );
    } );
} );

router.post( '/api/spaces/:spaceName/programs/:number/markPrinted', ( req, res ) => {
  const { spaceName, number } = req.params;
  const { printed } = req.body;
  if ( printed === undefined ) {
    res.status( 400 ).send( 'Missing "printed"' );
  }

  knex( 'programs' )
    .update( { printed } )
    .where( { spaceName, number } )
    .then( () => {
      getSpaceData( req, spaceData => {
        res.json( spaceData );
      } );
    } );
} );

/**
 * Delete the specified program from the specified space.
 */
router.get( '/api/spaces/:spaceName/delete/:programNumber', ( req, res ) => {
  const { spaceName, programNumber } = req.params;
  knex( 'programs' )
    .where( { spaceName, number: programNumber } )
    .del()
    .then( numberOfProgramsDeleted => {
      res.json( { numberOfProgramsDeleted } );
    } );
} );

router.put( '/api/spaces/:spaceName/programs/:number/debugInfo', ( req, res ) => {
  const { spaceName, number } = req.params;

  knex( 'programs' )
    .update( { debugInfo: JSON.stringify( req.body ) } )
    .where( { spaceName, number } )
    .then( () => {
      res.json( {} );
    } );
} );

router.post( '/api/spaces/:spaceName/programs/:number/claim', ( req, res ) => {
  const { spaceName, number } = req.params;

  knex
    .select( [ 'debugInfo', 'editorInfo' ] )
    .from( 'programs' )
    .where( { spaceName, number } )
    .then( selectResult => {
      if ( selectResult.length === 0 ) {
        res.status( 404 );
      }
      const editorInfo = JSON.parse( selectResult[ 0 ].editorInfo || '{}' );
      if (
        editorInfo.time &&
        editorInfo.time + editorHandleDuration > Date.now() &&
        editorInfo.editorId !== req.body.editorId
      ) {
        res.status( 400 );
        res.json( {} );
      }
      else {
        knex( 'programs' )
          .update( { editorInfo: JSON.stringify( { ...req.body, time: Date.now() } ) } )
          .where( { spaceName, number } )
          .then( () => {
            res.json( {
              debugInfo: JSON.parse( selectResult[ 0 ].debugInfo || '{}' ),
              editorInfo
            } );
          } );
      }
    } );
} );

/**
 * Get the existing project names for the provided space name.
 */
router.get( '/api/creator/projectNames/:spaceName', ( req, res ) => {
  const { spaceName } = req.params;
  knex
    .select( 'projectName' )
    .from( 'creator-data' )
    .where( { spaceName } )
    .then( selectResult => {
      res.json( { projectNames: selectResult.map( resultObject => resultObject.projectName ) } );
    } );
} );

/**
 * Create a new project name at the provided space name.
 */
router.post( '/api/creator/projectNames/:spaceName/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;

  knex
    .select( 'projectName' )
    .from( 'creator-data' )
    .where( { spaceName } )
    .then( selectResult => {
      const existingNames = selectResult.map( result => result.projectName );

      console.log( 'EXISTING NAMES', existingNames );
      if ( existingNames.includes( projectName ) ) {
        res.status( 400 ).send( 'Name already exists for this space.' );
      }
      else {
        knex( 'creator-data' )
          .insert( {
            spaceName, projectName, projectData: {}, editing: false
          } )
          .then( () => {
            res.json( { projectName: projectName } );
          } );
      }
    } );
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

  knex
    .select( 'projectData' )
    .from( 'creator-data' )
    .where( { spaceName: sourceSpaceName, projectName: sourceProjectName } )
    .then( sourceProjectResult => {
      if ( sourceProjectResult.length === 0 ) {
        res.status( PROJECT_DOES_NOT_EXIST ).send( 'Source project does not exist' );
      }
      else {
        knex
          .select( 'projectName' )
          .from( 'creator-data' )
          .where( { spaceName: destinationSpaceName } )
          .then( destinationSpaceResult => {
            const existingNames = destinationSpaceResult.map( result => result.projectName );
            if ( existingNames.includes( destinationProjectName ) ) {
              res.status( PROJECT_ALREADY_EXISTS ).send( 'Destination project already exists' );
            }
            else if ( restrictedSpacesList.includes( destinationSpaceName ) ) {
              res.status( SPACE_RESTRICTED ).send( 'Destination space is restricted' );
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
                  res.status( SUCCESS ).json( {} );
                } );
            }
          } );
      }
    } );
} );

/**
 * Save the project data to the provided space and project name.
 */
router.put( '/api/creator/:spaceName/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;
  const { projectData } = req.body;
  if ( !projectData ) {
    res.status( 400 ).send( 'Missing project data' );
  }
  else {
    knex( 'creator-data' )
      .update( { projectData: projectData } )
      .where( { spaceName, projectName } )
      .then( () => {
        res.json( {} );
      } );
  }
} );

/**
 * Get the project data at the provided space and project name.
 */
router.get( '/api/creator/:spaceName/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;
  knex
    .select( 'projectData' )
    .from( 'creator-data' )
    .where( { spaceName, projectName } )
    .then( selectResult => {
      if ( selectResult.length === 0 ) {
        res.status( 404 );
      }
      else {
        res.json( { projectData: selectResult[ 0 ].projectData } );
      }
    } );
} );

/**
 * Delete the specified project at the provided space name.
 */
router.get( '/api/creator/:spaceName/delete/:projectName', ( req, res ) => {
  const { spaceName, projectName } = req.params;
  knex( 'creator-data' )
    .where( { spaceName, projectName: projectName } )
    .del()
    .then( numberOfProgramsDeleted => {
      res.json( { numberOfProgramsDeleted } );
    } );
} );

/**
 * Gets the list of sound files available to use.
 */
router.get( '/api/creator/soundFiles', ( req, res ) => {

  // use fs to get the list of files in the www/media/sounds directory
  fs.readdir( './www/media/sounds', ( err, files ) => {
    if ( err ) {
      res.status( 500 ).send( 'Error reading sound files' );
    }
    else {
      const soundFiles = files.filter( file => {
        const extension = path.extname( file ).toLowerCase();
        return [ '.mp3', '.wav', '.ogg' ].includes( extension );
      } );
      res.json( { soundFiles: soundFiles } );
    }
  } );
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

  //
  // // use fs to get the list of files in the www/media/images directory
  // fs.readdir( './www/media/images', ( err, files ) => {
  //   if ( err ) {
  //     res.status( 500 ).send( 'Error reading image files' );
  //   }
  //   else {
  //     const imageFiles = files.filter( file => {
  //       const extension = path.extname( file ).toLowerCase();
  //       return [ '.jpg', '.jpeg', '.png' ].includes( extension );
  //     } );
  //
  //     res.json( { imageFiles: imageFiles } );
  //   }
  // } );
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

  function modifyProjectData( oldData ) {

    // create a copy of the data
    const newData = { ...oldData };

    if ( newData.programs ) {
      newData.programs.forEach( programData => {
        programData.modelContainer.namedBounds2Properties = [];
      } );
    }

    return newData;
  }

  // For every project in creator-data, update the project data to a modified JSON object.
  knex
    .select( [ 'projectData', 'spaceName', 'projectName' ] )
    .from( 'creator-data' )
    .then( selectResult => {
      if ( selectResult.length === 0 ) {
        return res.status( 404 ).json( { error: 'No projects found' } );
      }

      // Process each project's data
      const updatedProjects = selectResult.map( project => {
        const oldData = project.projectData;
        console.log( project.spaceName, project.projectName );

        // Modify the oldData to create the newData
        const newData = modifyProjectData( oldData );

        // Return an object with the id and the modified data
        return {
          spaceName: project.spaceName,
          projectName: project.projectName,
          projectData: newData
        };
      } );

      // Update the records in the 'creator-data' table
      const updatePromises = updatedProjects.map( updatedProject => {
        console.log( updatedProject.spaceName, updatedProject.projectName );

        return knex( 'creator-data' )
          .update( { projectData: updatedProject.projectData } )
          .where( { spaceName: updatedProject.spaceName, projectName: updatedProject.projectName } );
      } );

      // Execute all update queries using Promise.all
      return Promise.all( updatePromises );
    } )
    .then( () => {
      res.json( { message: 'Schema update completed' } );
    } )
    .catch( error => {
      console.error( 'Error:', error );
      res.status( 500 ).json( { error: 'Internal server error' } );
    } );
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
    console.log( process.env.OPENAI_API_KEY );

    const completion = await openai.chat.completions.create( {
      messages: [ { role: 'user', content: promptString } ],

      // slow but maybe better?
      // model: 'gpt-4'

      // faster
      model: 'gpt-3.5-turbo'
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