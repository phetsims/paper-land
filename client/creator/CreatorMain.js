/**
 * Main react component for the Board page.
 */

import React from 'react';
import SceneryDisplay from '../common/SceneryDisplay.js';
import styles from './CreatorMain.css';
import CreatorModel from './model/CreatorModel.js';
import CreatorControls from './react/CreatorControls.js';
import CreatorView from './view/CreatorView.js';
import ViewConstants from './view/ViewConstants.js';

export default function CreatorMain( props ) {
  const scene = props.scene;

  // fundamental model and view for the editor
  const creatorModel = new CreatorModel();

  let creatorView = null;

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
    phet.scenery.animatedPanZoomSingleton.listener.setDestinationScale( 3 );
  };

  // custom focus highlight colors for this display
  phet.scenery.HighlightOverlay.setInnerHighlightColor( ViewConstants.focusHighlightColor );
  phet.scenery.HighlightOverlay.setOuterHilightColor( ViewConstants.focusHighlightColor );
  phet.scenery.HighlightOverlay.setInnerGroupHighlightColor( ViewConstants.focusHighlightColor );
  phet.scenery.HighlightOverlay.setOuterGroupHighlightColor( ViewConstants.focusHighlightColor );

  return (
    <div>
      <div className={styles.rowContainer}>
        <div
          className={styles.displayColumn}>
          <SceneryDisplay
            scene={scene}
            displayClass={styles.displayPanel}
            panelClass={styles.panelClass}
            updateDisplaySize={updateDisplaySize}
            modifyDisplay={modifyDisplay}
          />
        </div>
        <div className={`${styles.rowSpacer} ${styles.panelClass}`}>
          <CreatorControls
            creatorModel={creatorModel}
          ></CreatorControls>
        </div>
      </div>
    </div>
  );
}