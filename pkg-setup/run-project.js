const { execSync } = require( 'child_process' );
// const fs = require('fs');
// const path = require('path')

// Install dependencies
try {
  console.log( 'Installing dependencies...' );
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

// // Open in Chrome or print a warning if not available
// ( async () => {
//   try {
//     console.log( 'Opening project in Chrome...' );
//     await open( 'http://localhost:3000', { app: { name: open.apps.chrome } } );
//   }
//   catch( error ) {
//     console.warn( 'Chrome is not available. Please open your browser and navigate to http://localhost:YOUR_PORT manually.' );
//   }
// } )();