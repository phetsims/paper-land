require( 'dotenv' ).config();

console.log( 'Running in ' + ( process.env.MODE || 'development' ) + ' mode' + '\n' );
if ( process.env.MODE === 'production' ) {
  require( './main' );
}
else {
  const nodemon = require( 'nodemon' );
  const path = require( 'path' );
  nodemon( {
    script: path.join( __dirname, 'main.js' ),
    watch: __dirname,
    ignore: [
      '**/server/data/*'
    ]
  } );
}