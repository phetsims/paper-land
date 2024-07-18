const { execSync } = require( 'child_process' );
// const fs = require('fs');
const path = require( 'path' )
//
// resolve the actual script path even when compiled with pkg
const scriptPath = process.cwd();
const scriptDir = path.join( scriptPath, path.dirname( process.execPath ) );

console.log( 'Curent working dir', process.cwd() );
console.log( 'Executable path', process.execPath );
console.log( 'Script dir', scriptDir );

// // Install dependencies
// try {
//   console.log( 'Installing dependencies. This may take a few minutes the first time...' );
//
//   // log the current directory
//   console.log( 'exec path' );
//   console.log( process.execPath );
//   execSync( 'npm install', {
//     stdio: 'inherit'
//   } );
// }
// catch( error ) {
//   console.error( 'Failed to install dependencies:', error );
//   process.exit( 1 );
// }

// Start the project
try {
  console.log( 'Starting the project...' );
  execSync( 'node server/entry-server.js', { stdio: 'inherit' } );

  // execSync( 'npm run start', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to start the project:', error );
  process.exit( 1 );
}