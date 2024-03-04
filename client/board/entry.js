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

// Controls the state of the board when changes occur from paper events - which are communicated
// across local storage.
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