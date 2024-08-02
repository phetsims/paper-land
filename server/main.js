const express = require( 'express' );
const path = require( 'path' );
const { router, openAIRouter } = require( './api.js' );

// A config should have been created by now, so we can require it.
const loadConfig = require( './loadConfig.js' );
const config = loadConfig();

express.static.mime.types.wasm = 'application/wasm';

process.on( 'unhandledRejection', error => {
  console.error( 'unhandledRejection', error.message );
} );

const app = express();
app.use( require( 'morgan' )( 'short' ) );

// From the original project, used to enforce https for heroku deployments. But it doesn't work well
// with production mode generally. It isn't needed anymore, but I'm leaving it here for reference.
// app.use( require( 'heroku-ssl-redirect' )( [ 'production' ] ) );

app.use( express.static( path.join( __dirname, '..', 'www' ) ) );
app.use( '/', router );
app.use( '/openai', openAIRouter );

// In development, start the webpack middleware which will compile the React app and serve it from the client
// directory instead of the build (www) directory.
if ( config.MODE !== 'production' ) {
  const compiler = require( 'webpack' )( require( '../webpack.config.js' ) );
  app.use( require( 'webpack-dev-middleware' )( compiler ) );
}

const port = config.PORT || 3000;
app.listen( port, () => console.log( `
Listening on port ${port}!

Paper Playground is ready to use. Navigate to http://localhost:${port} in Chrome or Edge.

Close this window to terminate Paper Playground.

` ) );