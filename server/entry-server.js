require( './create-config-json.js' );

const loadConfig = require( './loadConfig.js' );
const config = loadConfig();

console.log( 'Running in ' + ( config.MODE || 'development' ) + ' mode' + '\n' );
if ( config.MODE === 'production' ) {
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