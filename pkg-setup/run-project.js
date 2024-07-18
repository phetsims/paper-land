const spawn = require( 'cross-spawn' );

function runCommand( command, args ) {
  return new Promise( ( resolve, reject ) => {
    const child = spawn( command, args, { stdio: 'inherit' } );

    child.on( 'close', ( code ) => {
      if ( code !== 0 ) {
        reject( new Error( `Command "${command} ${args.join( ' ' )}" failed with exit code ${code}` ) );
      }
      else {
        resolve();
      }
    } );
  } );
}

async function main() {
  try {
    console.log( 'Installing dependencies. This may take a few minutes the first time...' );
    await runCommand( 'npm', [ 'install' ] );

    console.log( 'Starting the project...' );
    await runCommand( 'npm', [ 'run', 'start' ] );
  }
  catch( error ) {
    console.error( error.message );
    process.exit( 1 );
  }
}

main();


// const { execSync } = require( 'child_process' );
//
// // Install dependencies
// try {
//   console.log( 'Installing dependencies. This may take a few minutes the first time...' );
//
//   // log the current directory
//   execSync( 'npm install', { stdio: 'inherit' } );
// }
// catch( error ) {
//   console.error( 'Failed to install dependencies:', error );
//   process.exit( 1 );
// }
//
// // Start the project
// try {
//   console.log( 'Starting the project...' );
//   execSync( 'npm run start', { stdio: 'inherit' } );
// }
// catch( error ) {
//   console.error( 'Failed to start the project:', error );
//   process.exit( 1 );
// }