/**
 * Creates a .env file in the output build directory with the necessary content.
 */

const fs = require( 'fs' );
const path = require( 'path' );

// Define the destination directory
const destDir = path.join( __dirname, '..', 'build' );

// Check if the destination directory exists, and exit if it doesn't
if ( !fs.existsSync( destDir ) ) {
  console.error( 'Destination directory does not exist:', destDir );
  process.exit( 1 );
}

// Define the .env file content
const envContent = `
# This is the port that the server will run on. Change if you have another server already running on this port.
PORT=3000

# process.env.NODE_ENV has many platform quirks, so we use our own variable - uncomment to set to production
# NOTE: production mode requires a build to serve files without webpack middleware. See package.json
# build commands.
# NOTE: The sharable build REQUIRES production mode to be set to run the application correctly.
MODE=production

# 'local' or 'postgresql'
STORAGE_TYPE=local

# URL to a remote postgresql database. If provided, set STORAGE_TYPE=postgresql.
# DATABASE_URL=''

# Uncomment to allow access to 'restricted' files
# ALLOW_ACCESS_TO_RESTRICTED_FILES=true

# OpenAI API keys for the GPT integration. Uncomment and fill in with your own keys.
# OPENAI_API_KEY=''
# OPENAI_ORGANIZATION=''
`;

// Create the .env file with the defined content
fs.writeFileSync( path.join( destDir, '.env' ), envContent.trim() );
console.log( '.env file has been created and placed in', destDir );