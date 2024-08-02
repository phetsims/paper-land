/**
 * Loads a config file from the root directory. The config file is expected to be a JSON file. We cannot use
 * require( config.json ) because the config file cannot be bundled. Need to read with fs.
 *
 * In order to read with fs, node 16+ is required with pkg (see package.json in pkg-setup).
 */

const fs = require( 'fs' );
const path = require( 'path' );

function loadConfig() {
  try {
    const configPath = path.resolve( __dirname, '../config.json' );
    const rawConfig = fs.readFileSync( configPath, 'utf-8' );
    return JSON.parse( rawConfig );
  }
  catch( error ) {
    console.error( 'Error reading config.json:', error );
    return {};
  }
}

module.exports = loadConfig;