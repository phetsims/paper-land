/**
 * Main react component for the Board page.
 */

import React, { useRef } from 'react';
import SceneryDisplay from '../common/SceneryDisplay.js';
import styles from './CreatorMain.css';
import CreatorModel from './model/CreatorModel.js';
import CreatorControls from './react/CreatorControls.js';
import ErrorDialog from './react/ErrorDialog.js';
import SaveConfirmationDialog from './react/SaveConfirmationDialog.js';
import CreatorView from './view/CreatorView.js';
import ViewConstants from './view/ViewConstants.js';

export default function CreatorMain( props ) {
  const scene = props.scene;

  // Handle any query parameters for this application
  const urlSearchParams = new URLSearchParams( window.location.search );
  const params = Object.fromEntries( urlSearchParams.entries() );
  window.dev = params.hasOwnProperty( 'dev' );
  window.createTemplates = params.hasOwnProperty( 'createTemplates' );

  // fundamental model and view for the editor
  const creatorModel = new CreatorModel();

  let creatorView = null;

  // A ref to the parent element of the React side of controls, so that we can detect when input
  // is going to those components and prevent pan/zoom unless interacting with the scenery display.
  const reactParentRef = useRef( null );

  // The width of the display column, as a fraction of the total width - the rest of the screen will be used
  // for the form controls (React).
  const displayColumnWidthProperty = new phet.axon.NumberProperty( 0.5, {
    range: new phet.dot.Range( 0.25, 0.75 )
  } );

  // A ref to each of the HTML elements that contain the scenery display and the React controls. This
  // way we can update layout with JavaScript when the displayColumnWidthProperty changes.
  const displayColumnRef = useRef( null );
  const reactColumnRef = useRef( null );

  // useEffect( () => {
  //
  //   // THIS FUNCTION IS BEING CALLED BUT DOESN"T UPDATE THE LAYOUT LIKE I EXPECT
  //   const updateLayout = displayWidth => {
  //     // displayColumnRef.current.style.flex = displayWidth;
  //     // reactColumnRef.current.style.flex = 1 - displayWidth;
  //
  //     displayColumnRef.current.style.flex = `0 0 ${displayWidth * 100}%`; // Assuming displayWidth is a fraction
  //     reactColumnRef.current.style.flex = `0 0 ${( 1 - displayWidth ) * 100}%`;
  //
  //     // update the display layout after the columns adjust
  //     updateDisplaySize( creatorView.display, window.innerWidth, window.innerHeight );
  //
  //     console.log( displayColumnRef.current.style.flex );
  //   };
  //
  //   displayColumnWidthProperty.link( updateLayout );
  //
  //   return function cleanup() {
  //     displayColumnWidthProperty.unlink( updateLayout );
  //   };
  // } );

  // Sets the Display size and layout the view when the window size changes.
  const updateDisplaySize = ( display, width, height ) => {

    // scenery requires integer values for dimensions
    const displayWidth = Math.floor( width * displayColumnWidthProperty.value );
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
    creatorView = new CreatorView( creatorModel, display, displayColumnWidthProperty );
    scene.addChild( creatorView );

    phet.scenery.animatedPanZoomSingleton.initialize( creatorView.applicationLayerNode, {
      maxScale: 6
    } );
    display.addInputListener( phet.scenery.animatedPanZoomSingleton.listener );

    // THIS FUNCTION IS BEING CALLED BUT DOESN"T UPDATE THE LAYOUT LIKE I EXPECT
    const updateLayout = displayWidth => {
      console.log( displayWidth, 1 - displayWidth );

      // update the display layout after the columns adjust
      updateDisplaySize( display, window.innerWidth, window.innerHeight );

      displayColumnRef.current.style.flex = displayWidth;
      reactColumnRef.current.style.flex = 1 - displayWidth;

      // displayColumnRef.current.style.flex = `0 0 ${displayWidth * 100}%`; // Assuming displayWidth is a fraction
      // reactColumnRef.current.style.flex = `0 0 ${( 1 - displayWidth ) * 100}%`;
    };

    displayColumnWidthProperty.link( updateLayout );

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
          className={styles.displayColumn}
          ref={displayColumnRef}
        >
          <SceneryDisplay
            scene={scene}
            displayClass={styles.displayPanel}
            panelClass={styles.panelClass}
            updateDisplaySize={updateDisplaySize}
            modifyDisplay={modifyDisplay}
            step={stepFunction}
          />
        </div>
        <div
          className={`${styles.reactColumn} ${styles.panelClass}`}
          ref={reactColumnRef}
        >
          <CreatorControls
            ref={reactParentRef}
            creatorModel={creatorModel}
          ></CreatorControls>
        </div>
      </div>
    </div>
  );
}