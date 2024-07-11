/**
 * Entry point for the Electron application.
 * This file initializes the main window and starts the server process.
 * It handles application events such as window creation, app activation, and quitting.
 *
 * @author Jesse Greenberg
 */

const { app, BrowserWindow } = require( 'electron' );
const path = require( 'path' );
const { spawn } = require( 'child_process' );
require( 'dotenv' ).config(); // Load environment variables from .env

let mainWindow;
let serverProcess;

/**
 * Function to create the main browser window.
 * Sets the window dimensions and loads the React app.
 */
function createWindow() {
  mainWindow = new BrowserWindow( {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  } );

  // Load your React app
  mainWindow.loadURL( `http://localhost:${process.env.PORT || 3000}` );

  mainWindow.on( 'closed', function() {
    mainWindow = null;
  } );
}

// Event: App ready
app.on( 'ready', () => {

  // Start the server
  serverProcess = spawn( 'node', [ path.join( __dirname, './server-dist/server.js' ) ] );

  // Log server stdout
  serverProcess.stdout.on( 'data', ( data ) => {
    console.log( `stdout: ${data}` );
  } );

  // Log server stderr
  serverProcess.stderr.on( 'data', ( data ) => {
    console.error( `stderr: ${data}` );
  } );

  // Log server process close
  serverProcess.on( 'close', ( code ) => {
    console.log( `Server process exited with code ${code}` );
  } );

  // Create the Electron window
  createWindow();
} );

// Event: All windows closed
app.on( 'window-all-closed', function() {
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
} );

// Event: App activated (macOS specific handling)
app.on( 'activate', function() {
  if ( mainWindow === null ) {
    createWindow();
  }
} );

// Event: App will quit
app.on( 'will-quit', () => {
  if ( serverProcess ) {
    serverProcess.kill();
  }
} );