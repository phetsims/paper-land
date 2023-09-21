// Light Source
// Keywords: 
// =============================== //
// Program Dependencies: N/A
// Recommended Programs: 
// Program Description: This is the source of light. All programs touching this one
// or connected to other light programs in the chain will light up themselves.

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

    // black background so it is easier to see light
    scratchpad.backgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height, {
      fill: 'black'
    } );
    sharedData.scene.addChild( scratchpad.backgroundRectangle );
    scratchpad.backgroundRectangle.moveToBack();

    // Create a Scenery image node for a light and add it to the scene
    const onImageElement = document.createElement( 'img' );
    onImageElement.setAttribute( 'src', 'media/images/on-bulb.png' );
    const onImageNode = new phet.scenery.Image( onImageElement, {
      maxWidth: 120
    } );
    sharedData.scene.addChild( onImageNode );
    scratchpad.onImageNode = onImageNode;

    // A data structure to help represent a connected tree of elements
    class ConnectionElement {

      // @param {boolean} - is this the root element?
      constructor( isRoot ) {
        this.children = [];
        this.parent = null;

        // A flag to indicate this is the root of the tree
        this.isRoot = isRoot;

        // This will change with connection to the root, but root element is always lit
        this.isLitProperty = new phet.axon.BooleanProperty( isRoot );
      }

      // Add a child (and its subtree) to this ConnectionElement
      addChild( element ) {

        // only add as a child if the other element has not been added and if it this element 
        // is not already a child (easy to happen with whisker connections)
        if ( element.parent === null && !element.children.includes( this ) ) {
          this.children.push( element );
          element.parent = this;

          // update lit status for entire subtree on this connection
          element.setLit( this.isLitProperty.value );
        }
      }

      // Remove a child (and its subtree) from this connectionElement
      removeChild( element ) {
        const indexOfElement = this.children.indexOf( element );
        if ( indexOfElement > -1 ) {
          this.children.splice( indexOfElement, 1 );

          element.parent = null;

          // The child is removed from a parent - it is only lit if it is somehow still 
          // connected to the root
          element.setLit( element.isConnectedToSource() );
        }
      }

      // Detach from the graph entirely, removing self from parents and removing any children
      dispose() {

        // remove self from any parents
        if ( this.parent ) {
          this.parent.removeChild( this );
        }

        // remove any children
        this.children.forEach( child => {
          this.removeChild( child );
        } );
      }

      // Set the lit status for this element and all its descendants.
      setLit( lit ) {
        this.isLitProperty.value = lit;

        // recursively update all children.
        this.children.forEach( child => {
           child.setLit( lit );
        } );
      }

      // Returns true if this element is connected through parents to a light source
      isConnectedToSource() {
        if ( this.parent === null ) {
          return this.isRoot;
        }
        else {

          // recursively look up the tree
          return this.parent.isConnectedToSource();
        }
      }
    }

    // Add the ConnectionElement constructor to the model so it can be used when available
    phet.paperLand.addModelComponent( 'connectionElementConstructor', ConnectionElement );

    const rootElement = new ConnectionElement( true );
    phet.paperLand.addModelComponent( 'rootElement', rootElement );

    // Add this element to the program data itself so that adjacent programs can find it
    phet.paperLand.setProgramData( paperProgramNumber, 'connectionElement', rootElement );
  };

  const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
    sharedData.scene.removeChild( scratchpad.onImageNode );
    delete scratchpad.onImageNode;

    sharedData.scene.removeChild( scratchpad.backgroundRectangle );
    delete scratchpad.backgroundRectangle;

    phet.paperLand.removeModelComponent( 'rootElement' );

    phet.paperLand.removeModelComponent( 'connectionElementConstructor' );
  };

  const onProgramAdjacent = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} ${direction} of ${programNumber}` );
  };

  const onProgramSeparated = ( programNumber, otherProgramNumber, direction, scratchpad, sharedData ) => {
    phet.paperLand.console.log( `${otherProgramNumber} detached from ${programNumber} ${direction}` );
  };

  // Called when the program moves.
  const onProgramChangedPosition = ( paperProgramNumber, positionPoints, scratchpad, sharedData ) => {

    // Center the image based on the position of the paper.
    const paperCenterX = ( positionPoints[0].x + positionPoints[1].x ) / 2;
    const paperCenterY = ( positionPoints[0].y + positionPoints[2].y ) / 2;
    scratchpad.onImageNode.centerX = paperCenterX * sharedData.displaySize.width;
    scratchpad.onImageNode.centerY = paperCenterY * sharedData.displaySize.height;
  };

  // Add the state change handler defined above as data for this paper.
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString()
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
  ctx.fillText('Whisker A', canvas.width / 2, canvas.height / 2 - 10);

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get('supporterCanvas');
  const supporterCtx = supporterCanvas.getContext('2d');
})();

