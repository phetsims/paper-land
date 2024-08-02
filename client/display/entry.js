/**
 * Entry-point file for the Sim Design Display, which is a scene graph based on the PhET libraries that uses PhET
 * components that can be manipulated using the paper programs.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Liam Mulhall (PhET Interactive Simulations)
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import DisplayMain from './DisplayMain.js';
import LocalStorageDisplayController from './LocalStorageDisplayController.js';

// So that the servers list is assigned to the namespace and available in program code.
import './displayBluetoothServers.js';

// Import components so they are available in the namespace
import './displayUtils.js';
import './connections/ConnectionElement.js';
import './connections/SingleChildConnectionElement.js';

// Create the root element for React.
const simDisplayDiv = document.getElementById( 'display-root-element' );
document.body.appendChild( simDisplayDiv );

// Create the root of the scene graph.
const scene = new phet.scenery.Node();

// Controls the state of the display when changes occur from paper events - which are communicated
// across local storage.
const localStorageDisplayController = new LocalStorageDisplayController( scene );

// Render the scene graph.  Once this is done it updates itself, so there is no other React-based rendering of this
// component.
ReactDOM.render(
  <DisplayMain
    scene={scene}
    displayConfigObject={localStorageDisplayController.displayConfigObject}
    updatePositionInterval={newValue => { localStorageDisplayController.updatePositionInterval( newValue ); }}
    updateRemovalDelay={newValue => { localStorageDisplayController.updateRemovalDelay( newValue ); }}
  ></DisplayMain>,
  simDisplayDiv
);

// Initialize sound production.
const TRUE_PROPERTY = new phet.axon.BooleanProperty( true );
const FALSE_PROPERTY = new phet.axon.BooleanProperty( false );
phet.tambo.soundManager.enabledProperty.value = true;
phet.tambo.soundManager.initialize( TRUE_PROPERTY, TRUE_PROPERTY, TRUE_PROPERTY, TRUE_PROPERTY, FALSE_PROPERTY );