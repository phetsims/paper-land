/**
 * Main react component for the Board page.
 */

import React, { useRef } from 'react';
import SceneryDisplay from '../common/SceneryDisplay.js';
import styles from './CreatorMain.css';
import CreatorModel from './model/CreatorModel.js';
import CreatorControls from './react/CreatorControls.js';
import SaveConfirmationDialog from './react/SaveConfirmationDialog.js';
import ErrorDialog from './react/ErrorDialog.js';
import CreatorView from './view/CreatorView.js';
import ViewConstants from './view/ViewConstants.js';

export default function CreatorMain( props ) {
  const scene = props.scene;

  // Handle any query parameters for this application
  const urlSearchParams = new URLSearchParams( window.location.search );
  const params = Object.fromEntries( urlSearchParams.entries() );
  window.dev = params.hasOwnProperty( 'dev' );

  // fundamental model and view for the editor
  const creatorModel = new CreatorModel();

  let creatorView = null;

  // A ref to the parent element of the React side of controls, so that we can detect when input
  // is going to those components and prevent pan/zoom unless interacting with the scenery display.
  const reactParentRef = useRef( null );

  // Sets the Display size and layout the view when the window size changes.
  const updateDisplaySize = ( display, width, height ) => {

    // scenery requires integer values for dimensions
    const displayWidth = Math.floor( width * 0.5 );
    const displayHeight = height;
    display.setWidthHeight( displayWidth, displayHeight );

    // wait for the creator view to be created (it requires the display to be constructed fully)
    if ( creatorView ) {
      creatorView.layout( displayWidth, displayHeight );
    }

    const displayBounds = new phet.dot.Bounds2( 0, 0, displayWidth, displayHeight );

    // set the bounds which accurately describe the panZoomListener targetNode, since it would otherwise be
    // inaccurate with the very large BarrierRectangle
    phet.scenery.animatedPanZoomSingleton.listener.setTargetBounds( displayBounds );

    // constrain the simulation pan bounds so that it cannot be moved off screen
    phet.scenery.animatedPanZoomSingleton.listener.setPanBounds( displayBounds );
  };

  // Adds an AnimatedPanZoomListener to this display
  const modifyDisplay = display => {

    // create the fundamental view and add it to the display
    creatorView = new CreatorView( creatorModel, display );
    scene.addChild( creatorView );

    phet.scenery.animatedPanZoomSingleton.initialize( creatorView.applicationLayerNode, {
      maxScale: 6
    } );
    display.addInputListener( phet.scenery.animatedPanZoomSingleton.listener );

    // TODO
    // workaround to get pan/zoom working outside of a sim - lots of things assume phet-io or
    // sim globals
    phet.joist.sim = {
      display: {},
      isSettingPhetioStateProperty: {
        value: false
      }
    };

    // TODO: Why is this needed? There is a place in AnimatedPanZoomListener where the phet-lib build
    // goes through phet.joist.display instead of phet.joist.sim._display
    phet.joist.display = phet.joist.sim;

    phet.axon.stepTimer.addListener( dt => {
      phet.scenery.animatedPanZoomSingleton.listener.step( dt );
    } );

    // TODO: Why do you have to set the scaleGestureTargetPosition first?
    phet.scenery.animatedPanZoomSingleton.listener.scaleGestureTargetPosition = new phet.dot.Vector2( 0, 0 );

    // in development mode, start zoomed out so that the entire scene is visible
    phet.scenery.animatedPanZoomSingleton.listener.setDestinationScale( window.dev ? 1 : 3 );

    // Prevent the scenery display from panning/zooming while interacting with the react form controls.
    window.addEventListener( 'click', event => {
      phet.scenery.globalKeyStateTracker.enabled = !( reactParentRef.current && reactParentRef.current.contains( event.target ) );
    }, true );
  };

  const stepFunction = dt => {
    if ( creatorView ) {
      creatorView.step( dt );
    }
  };

  // custom focus highlight colors for this display
  phet.scenery.HighlightOverlay.setInnerHighlightColor( ViewConstants.focusHighlightColor );
  phet.scenery.HighlightOverlay.setOuterHilightColor( ViewConstants.focusHighlightColor );
  phet.scenery.HighlightOverlay.setInnerGroupHighlightColor( ViewConstants.focusHighlightColor );
  phet.scenery.HighlightOverlay.setOuterGroupHighlightColor( ViewConstants.focusHighlightColor );

  return (
    <div>
      <div>
        <SaveConfirmationDialog
          creatorModel={creatorModel}
        ></SaveConfirmationDialog>
        <ErrorDialog
          creatorModel={creatorModel}
        ></ErrorDialog>
      </div>
      <div className={styles.rowContainer}>
        <div
          className={styles.displayColumn}>
          <SceneryDisplay
            scene={scene}
            displayClass={styles.displayPanel}
            panelClass={styles.panelClass}
            updateDisplaySize={updateDisplaySize}
            modifyDisplay={modifyDisplay}
            step={stepFunction}
          />
        </div>
        <div className={`${styles.rowSpacer} ${styles.panelClass}`}>
          <CreatorControls
            ref={reactParentRef}
            creatorModel={creatorModel}
          ></CreatorControls>
        </div>
      </div>
    </div>
  );
}