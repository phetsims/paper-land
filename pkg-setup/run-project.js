const { execSync } = require( 'child_process' );
const path = require( 'path' )
const commandExists = require( 'command-exists' );

// resolve the actual script path even when compiled with pkg (important for MacOS)
const scriptDir = path.dirname( process.execPath );

commandExists( 'node', ( err, commandExists ) => {
  if ( err ) {
    console.error( 'An error occurred while checking for Node.js.' );
  }
  else if ( !commandExists ) {
    console.error( 'Node.js is not installed. Please install Node.js from https://nodejs.org/' );
  }
  else {

    console.log( 'Curent working dir', process.cwd() );
    console.log( 'Executable path', process.execPath );
    console.log( 'Script dir', scriptDir );

    // Install dependencies
    try {
      console.log( 'Installing dependencies. This may take a few minutes the first time...' );

      execSync( 'npm install', {
        cwd: scriptDir,
        stdio: 'inherit'
      } );
    }
    catch( error ) {
      console.error( 'Failed to install dependencies:', error );
      process.exit( 1 );
    }

    // Start the project
    try {
      console.log( 'Starting the project...' );
      execSync( 'node server/entry-server.js', {
        cwd: scriptDir,
        stdio: 'inherit'
      } );
    }
    catch( error ) {
      console.error( 'Failed to start the project:', error );
      process.exit( 1 );
    }
  }
} );