// Spider and web
// Keywords: markers, image, demo, example
// =============================== //
// Program Dependencies: N/A
// Recommended Programs:
// Program Description: An example program that watches for all detected markers. Draws a spider on 
//                      the program and creates a "web" between all markers that surround the spider.

importScripts('paper.js');

(async () => {

  //----------------------------------------------------------------------
  // Board code
  //----------------------------------------------------------------------

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get('number');

  // Called when the program is detected or changed.
  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // A parent Node for all lines of the web (added before the spider image so it is behind)
    scratchpad.allLinesNode = new phet.scenery.Node();
    sharedData.scene.addChild( scratchpad.allLinesNode );

    // Create a Scenery image node for a spider and add it to the scene
    const imageElement = document.createElement( 'img' );
    imageElement.setAttribute( 'src', 'media/images/spider.png' );
    const imageNode = new phet.scenery.Image( imageElement, {
      maxWidth: 140
    } );
    sharedData.scene.addChild( imageNode );
    scratchpad.imageNode = imageNode;

    // To be called when we detect a change to global markers (add, remove, move)
    scratchpad.redrawWeb = () => {

      // Remove all of the previous web lines
      scratchpad.allLinesNode.removeAllChildren();

      // To create the web, draw a line between every single detected marker
      sharedData.allMarkers.forEach( markerA => {
        sharedData.allMarkers.forEach( markerB => {

          // Don't draw a line between the same marker
          if ( markerA !== markerB ) {
            const p1 = new phet.dot.Vector2(
              markerA.position.x * sharedData.displaySize.width,
              markerA.position.y * sharedData.displaySize.height 
            );
            const p2 = new phet.dot.Vector2(
              markerB.position.x * sharedData.displaySize.width,
              markerB.position.y * sharedData.displaySize.height 
            );

            const line = new phet.scenery.Line( p1, p2, { stroke: 'rgb(90,114,120)', lineWidth: 1.5 } );
            scratchpad.allLinesNode.addChild( line );
          }
        } );
      } );
    };

    // NOTE: These callbacks provide an array of markers that were specifically added/removed/changed. But they are not
    // used in this demo. In this example we just draw lines between every single detected marker (accessed through
    // sharedData.allMarkers).
    phet.paperLand.markersAddedEmitter.addListener( scratchpad.redrawWeb );
    phet.paperLand.markersRemovedEmitter.addListener( scratchpad.redrawWeb );
    phet.paperLand.markersChangedPositionEmitter.addListener( scratchpad.redrawWeb );

    // redraw markers right away when the progrma is added
    scratchpad.redrawWeb();
  };

  // Called when the program moves.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {

    // Center the image based on the position of the paper.
    const paperCenterX = ( positionPoints[0].x + positionPoints[1].x ) / 2;
    const paperCenterY = ( positionPoints[0].y + positionPoints[2].y ) / 2;
    scratchpad.imageNode.centerX = paperCenterX * sharedData.displaySize.width;
    scratchpad.imageNode.centerY = paperCenterY * sharedData.displaySize.height;
  };


  // Called when the program is changed or no longer detected.
  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    sharedData.scene.removeChild( scratchpad.imageNode );
    scratchpad.imageNode = null;

    sharedData.scene.removeChild( scratchpad.allLinesNode );
    delete scratchpad.allLinesNode;

    phet.paperLand.markersAddedEmitter.removeListener( scratchpad.redrawWeb );
    phet.paperLand.markersRemovedEmitter.removeListener( scratchpad.redrawWeb );
    phet.paperLand.markersChangedPositionEmitter.removeListener( scratchpad.redrawWeb );
    delete scratchpad.redrawWeb;
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
      }
    }
  } );

  //----------------------------------------------------------------------
  // Projector code
  //----------------------------------------------------------------------

  const canvas = await paper.get('canvas');

  // Draw "Hello world" on the canvas.
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('Toggle', canvas.width / 2, canvas.height / 2 - 10);
})();

