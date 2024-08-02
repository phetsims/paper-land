/**
 * Creates a config.json file in the output build directory with the necessary content. Will populate with
 * either development or production in the MODE field based on the argument provided. For example:
 *
 * node create-config-json.js
 * or
 * node create-config-json.js production
 */

const fs = require( 'fs' );
const path = require( 'path' );


// Will be in development or build mode, depending on provided arguments
const mode = process.argv[ 2 ] || 'development';

// Define the destination directory - in development mode it is put in the root directory, for the build
// it is put in the build directory
const destDir = mode === 'development' ? path.join( __dirname, '..' ) : path.join( __dirname, '..', 'build' );

// Check if the destination directory exists, and exit if it doesn't
if ( !fs.existsSync( destDir ) ) {
  console.error( 'Destination directory does not exist:', destDir );
  process.exit( 1 );
}

// If the config file already exists, exit gracefully so other steps can be taken.
if ( fs.existsSync( path.join( destDir, 'config.json' ) ) ) {
  console.log( 'config.json file already exists in', destDir );
}
else {

  // Define the json contents
  const envContent = `{
  "_port_comment": "This is the port that the server will run on. Change if you have another server already running on this port.",
  "PORT": 3000,
  
  "_mode_comment_1": "process.env.NODE_ENV has many platform quirks, so we use our own variable - uncomment to set to production",
  "_mode_comment_2": "use 'development' or 'production'",
  "_mode_note_1": "production mode requires a build to serve files without webpack middleware. See package.json build commands.",
  "_mode_note_2": "The sharable build REQUIRES production mode to be set to run the application correctly.",
  "MODE": "${mode}",
  
  "_storage_type_comment": "'local' or 'postgresql'",
  "STORAGE_TYPE": "local",
  
  "_database_url_comment": "URL to a remote postgresql database. If provided, set STORAGE_TYPE=postgresql.",
  "DATABASE_URL": "",
  
  "_allow_access_comment": "Uncomment to allow access to 'restricted' files",
  "ALLOW_ACCESS_TO_RESTRICTED_FILES": true,
  
  "_openai_keys_comment": "OpenAI API keys for the GPT integration. Uncomment and fill in with your own keys.",
  "OPENAI_API_KEY": "",
  "OPENAI_ORGANIZATION": ""
}`;

  // Create the config.json file with the defined content
  fs.writeFileSync( path.join( destDir, 'config.json' ), envContent.trim() );
  console.log( 'config.json file has been created and placed in', destDir );
}