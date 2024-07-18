const fs = require( 'fs' );
const archiver = require( 'archiver' );
const path = require( 'path' );

function zipDirectory( sourceDir, outPath, excludeDirs = [] ) {
  const output = fs.createWriteStream( outPath );
  const archive = archiver( 'zip' );

  output.on( 'close', () => {
    console.log( `Zipped ${archive.pointer()} total bytes` );
    console.log( 'Archiver has been finalized and the output file descriptor has closed.' );
  } );

  archive.on( 'error', ( err ) => {
    throw err;
  } );

  archive.pipe( output );

  const excludePaths = excludeDirs.map( dir => `${dir}/**` );

  // Use `withoutDir` to avoid including the parent directory in the zip
  archive.glob( '**/*', { cwd: sourceDir, ignore: excludePaths } );

  archive.finalize();
}

// Example usage
const sourceDir = path.join( __dirname, '..' ); // This navigates up one level to 'paper-land'
const outPath = path.join( __dirname, '..', 'archive.zip' ); // Creates the zip file in the 'paper-land' directory
const excludeDirs = [
  'node_modules',
  'out',
  'paper-programs-backup',
  'pkg-setup',
  '.babel-cache',
  '.github'
];

zipDirectory( sourceDir, outPath, excludeDirs );