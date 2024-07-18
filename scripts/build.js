/**
 * A general build script that will package the front end and back end into a build directory. It will also package
 * platform specific scripts that will install node_modules and start the server.
 *
 * Run this on a machine to share a build with someone else. They should be able to run the project on a machine
 * with the same architecture.
 *
 * General steps for the build are:
 * 1) Run build-react and build-server npm tasks
 * 2) Create a build directory
 * 3) Copy the contents of www directory into build. Copy the contents of server-dist directory into build/server.
 * 4) Create a .env file in the build directory with the necessary contents.
 * 5) Copy package.json into the build directory so we can use it to install node modules.
 * 6) Package the scripts that will be able to install node modules and start the server.
 */

// User can then run the packaged script to install node modules and start the server.

const { execSync } = require( 'child_process' );

// Run build-react and build-server npm tasks
try {
  console.log( 'Building the front end and server...' );

  execSync( 'npm run build-react', { stdio: 'inherit' } );
  execSync( 'npm run build-server', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to build React and server:', error );
  process.exit( 1 );
}

// Create a build directory
try {
  console.log( 'Creating build directory...' );

  // remove the old build directory if it exists
  execSync( 'rm -rf build', { stdio: 'inherit' } );

  execSync( 'mkdir build', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to create build directory:', error );
  process.exit( 1 );
}

// Copy the contents of www directory into build directory, and copy the contents of server-dist directory into
// build/server directory.
try {
  console.log( 'Copying files into build directory...' );

  execSync( 'cp -r www build', { stdio: 'inherit' } );
  execSync( 'cp -r server-dist build/server', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to copy files into build directory:', error );
  process.exit( 1 );
}

// Create a .env file in the build directory with the necessary contents. Use create-env-file.js to create the file.
try {
  console.log( 'Creating .env file...' );
  execSync( 'node scripts/create-env-file.js', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to create .env file:', error );
  process.exit( 1 );
}

// Copy package.json into the build directory so that we can use it to install node modules
try {
  console.log( 'Moving package.json into the build directory...' );
  execSync( 'cp package.json build', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to move package.json:', error );
  process.exit( 1 );
}

// Run the package scripts that will be able to install node modules and start the server.
try {
  console.log( 'Packaging the scripts that will install dependencies...' );
  execSync( 'cd pkg-setup && pkg .', { stdio: 'inherit' } );
  execSync( 'cd ..' );
}
catch( error ) {
  console.error( 'Failed to package scripts:', error );
  process.exit( 1 );
}

// Move the contents of the /dist directory (npm install executables) into the build directory.
try {
  console.log( 'Moving the packaged scripts into the build directory...' );
  execSync( 'mv dist/* build', { stdio: 'inherit' } );
}
catch( error ) {
  console.error( 'Failed to move the packaged scripts:', error );
  process.exit( 1 );
}

console.log( `

Build complete!
` );