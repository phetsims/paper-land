/**
 * The Webpack configuration for server-side code related to paper land.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

const path = require( 'path' );
const nodeExternals = require( 'webpack-node-externals' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const webpack = require( 'webpack' );

module.exports = {
  entry: './server/entry-server.js', // Assuming this is your server's entry point
  target: 'node',
  externals: [ nodeExternals() ], // Exclude node_modules
  output: {
    path: path.resolve( __dirname, 'server-dist' ),
    filename: 'entry-server.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [

    // Do not bundle the local config into the build!
    new webpack.IgnorePlugin( {
      resourceRegExp: /config\.json$/
    } ),

    // Copies the default data to the server-dist so it is available in the package.
    new CopyWebpackPlugin(
      [
        { from: path.resolve( __dirname, 'server/default-data' ), to: path.resolve( __dirname, 'server-dist/default-data' ) }
      ] )
  ],
  resolve: {
    extensions: [ '.js', '.json' ] // Automatically resolve these extensions
  },
  mode: 'development' // or 'production'
};