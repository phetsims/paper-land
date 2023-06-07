/**
 * Entry-point file for the Sim Design Board, which is a scene graph based on the PhET libraries that uses PhET
 * components that can be manipulated using the paper programs.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import AIHarnessMain from './AIHarnessMain.js';

// Create the root element for React.
const simDisplayDiv = document.getElementById( 'creator-root-element' );
document.body.appendChild( simDisplayDiv );

// Create the root of the scene graph.
const scene = new phet.scenery.Node();

ReactDOM.render(
  <AIHarnessMain scene={scene}></AIHarnessMain>,
  simDisplayDiv
);