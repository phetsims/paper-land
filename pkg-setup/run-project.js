const { execSync } = require( 'child_process' );
// const fs = require('fs');
// const path = require('path')

// Install dependencies
try {
  console.log( 'Installing dependencies. This may take a few minutes the first time...' );

  // log the current directory
  console.log( __dirname );
  execSync( 'npm install', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to install dependencies:', error );
  process.exit( 1 );
}

// Start the project
try {
  console.log( 'Starting the project...' );
  execSync( 'npm run start', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to start the project:', error );
  process.exit( 1 );
}