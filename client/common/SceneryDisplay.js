/**
 * SceneryDisplay is a React component that returns a div that contains a Scenery display.
 */

import React, { useEffect } from 'react';

const SceneryDisplay = props => {

  // This useEffect hook runs once after the component is rendered.  Effectively, this creates a Scenery display and
  // adds it to the div that was created when this element was initially rendered.
  useEffect( () => {

    // Create the scenery display.
    const sceneryDisplayDomElement = document.getElementById( 'scenery-display' );

    // styling for the root DOM element - style before giving to scenery so Display can
    // get accurate width/height
    // sceneryDisplayDomElement.classList.add( props.displayClass );
    sceneryDisplayDomElement.classList.add( props.panelClass );

    const sceneryDisplay = new phet.scenery.Display( props.scene, {

      // In order to support UI controls outside the Display (other react components), scenery can
      // only add event listeners to its DOM element. However, that means that some scenery features
      // like supporting drag events outside the display will not work well.
      listenToOnlyElement: true,

      container: sceneryDisplayDomElement
    } );

    // Optional modifications to the created display for subclasses
    props.modifyDisplay( sceneryDisplay );

    window.addEventListener( 'resize', event => {
      props.updateDisplaySize( sceneryDisplay, window.innerWidth, window.innerHeight );
    } );
    props.updateDisplaySize( sceneryDisplay, window.innerWidth, window.innerHeight );

    // Make the scenery display interactive.
    sceneryDisplay.initializeEvents();

    // scenery workaround for consistent requestAnimationFrame
    phet.scenery.Utils.polyfillRequestAnimationFrame();

    // Makes text selectable (useful for copying text from the console) - Scenery applies CSS to
    // make it better for interactive content but that is interfering with this use case.
    // WARNING: If this causes problems for the Display, remove it.
    document.onselectstart = null;

    // set up animation - This takes an optional callback( dt ) if needed at some point
    sceneryDisplay.updateOnRequestAnimationFrame( dt => {
      if ( props.step ) {
        props.step( dt );
      }
    } );

    // a property that indicates if the browser tab is visible
    const browserTabVisibleProperty = new phet.axon.Property( true );
    document.addEventListener( 'visibilitychange', () => {
      browserTabVisibleProperty.set( document.visibilityState === 'visible' );
    }, false );

    // initialize Voicing
    phet.scenery.voicingManager.initialize( phet.scenery.Display.userGestureEmitter, {

      // Voicing is only allowed when this tab is visible
      speechAllowedProperty: browserTabVisibleProperty
    } );
    phet.scenery.voicingUtteranceQueue.enabled = true;
    phet.scenery.voicingManager.enabledProperty.value = true; // TODO: Why can't this use a setter?
    phet.scenery.voicingManager.respectResponseCollectorProperties = false;

    // Set the first voice according to PhET's preferred english voices
    phet.scenery.voicingManager.voicesProperty.link( voices => {
      if ( voices.length > 0 ) {
        phet.scenery.voicingManager.voiceProperty.value = phet.scenery.voicingManager.getEnglishPrioritizedVoices()[ 0 ];
      }
    } );

    // All responses are enabled by default
    phet.utteranceQueue.responseCollector.nameResponsesEnabledProperty.value = true;
    phet.utteranceQueue.responseCollector.objectResponsesEnabledProperty.value = true;
    phet.utteranceQueue.responseCollector.contextResponsesEnabledProperty.value = true;
    phet.utteranceQueue.responseCollector.hintResponsesEnabledProperty.value = true;
  }, [] );

  return <div id='scenery-display'></div>;
};

export default SceneryDisplay;