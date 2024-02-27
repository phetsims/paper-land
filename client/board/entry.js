/**
 * Entry-point file for the Sim Design Board, which is a scene graph based on the PhET libraries that uses PhET
 * components that can be manipulated using the paper programs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Liam Mulhall (PhET Interactive Simulations)
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import BoardMain from './BoardMain.js';
import LocalStorageBoardController from './LocalStorageBoardController.js';

// Import components so they are available in the namespace
import './boardUtils.js';
import './connections/ConnectionElement.js';
import './connections/SingleChildConnectionElement.js';

// Create the root element for React.
const simDisplayDiv = document.getElementById( 'board-root-element' );
document.body.appendChild( simDisplayDiv );

// Create the root of the scene graph.
const scene = new phet.scenery.Node();

const localStorageBoardController = new LocalStorageBoardController( scene );

// Render the scene graph.  Once this is done it updates itself, so there is no other React-based rendering of this
// component.
ReactDOM.render(
  <BoardMain
    scene={scene}
    boardConfigObject={localStorageBoardController.boardConfigObject}
    updatePositionInterval={newValue => { localStorageBoardController.updatePositionInterval( newValue ); }}
    updateRemovalDelay={newValue => { localStorageBoardController.updateRemovalDelay( newValue ); }}
  ></BoardMain>,
  simDisplayDiv
);

// Initialize sound production.
const TRUE_PROPERTY = new phet.axon.BooleanProperty( true );
const FALSE_PROPERTY = new phet.axon.BooleanProperty( false );
phet.tambo.soundManager.enabledProperty.value = true;
phet.tambo.soundManager.initialize( TRUE_PROPERTY, TRUE_PROPERTY, TRUE_PROPERTY, TRUE_PROPERTY, FALSE_PROPERTY );

/**
 * Create an instance of WrappedAudioBuffer and return it, and start the process of decoding the audio file from the
 * provided path and load it into the buffer when complete.  Instances of WrappedAudioBuffer are often needed for
 * creating sounds using the tambo library.
 * TODO: Move this into a namespace like window.paperLand or window.phet.paperLand if retained.
 * @param {string} pathToAudioFile
 */
const createAndLoadWrappedAudioBuffer = pathToAudioFile => {
  const wrappedAudioBuffer = new phet.tambo.WrappedAudioBuffer();

  window.fetch( pathToAudioFile )
    .then( response => response.arrayBuffer() )
    .then( arrayBuffer => phet.tambo.phetAudioContext.decodeAudioData( arrayBuffer ) )
    .then( audioBuffer => {
      wrappedAudioBuffer.audioBufferProperty.value = audioBuffer;
    } );

  return wrappedAudioBuffer;
};

// This is here to prevent the IDE from marking the function as unused.  We need this, because the function is only
// used by the paper programs.
if ( !createAndLoadWrappedAudioBuffer ) {
  console.warn( 'createAndLoadWrappedAudioBuffer not defined' );
}