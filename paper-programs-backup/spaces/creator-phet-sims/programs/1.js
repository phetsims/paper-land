// Vertex A
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const vertexA = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'vertexA', vertexA );
    

      const vertexABounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'vertexABounds', vertexABounds );
    


      // Create a shape with kite.
      const vertexARectShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToDisplayX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToDisplayY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const vertexARectPath = new phet.scenery.Path( vertexARectShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToDisplayX( 0.5, sharedData.displaySize.width ) : 0.5,
        centerY: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToDisplayY( 0.5, sharedData.displaySize.height) : 0.5,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( vertexARectPath );
      scratchpad.vertexARectPath = vertexARectPath;
      
      // Update the shape when a dependency changes.
      scratchpad.vertexARectPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'vertexABounds' ], ( vertexABounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const vertexARectShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToDisplayX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToDisplayY( 0.5, sharedData.displaySize.height ) )
        scratchpad.vertexARectPath.setShape( vertexARectShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.vertexARectPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToDisplayX( 0.5, sharedData.displaySize.width ) : 0.5,
          centerY: ('model' === 'model' && 0.5) ? phet.paperLand.utils.paperToDisplayY( 0.5, sharedData.displaySize.height) : 0.5,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToDisplayBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToDisplayCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        vertexARectPath.centerX = phet.paperLand.utils.paperToDisplayX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        vertexARectPath.centerY = phet.paperLand.utils.paperToDisplayY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        vertexARectPath.left = phet.paperLand.utils.paperToDisplayX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        vertexARectPath.top = phet.paperLand.utils.paperToDisplayY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        vertexARectPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        vertexARectPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        vertexARectPath.visible = visible;
      };
      
      const moveToFront = () => {
        vertexARectPath.moveToFront();
      };
      
      const moveToBack = () => {
        vertexARectPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        vertexARectPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const vertexARectPathViewBounds = phet.paperLand.utils.paperToDisplayBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( vertexARectPath.localBounds.width || 1 ) / ( vertexARectPath.localBounds.height || 1 );

        const scaleX = vertexARectPathViewBounds.width / ( vertexARectPath.localBounds.width || 1 );
        const scaleY = vertexARectPathViewBounds.height / ( vertexARectPath.localBounds.height || 1 );

        if ( stretch ) {
          vertexARectPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          vertexARectPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        vertexARectPath.center = vertexARectPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          vertexARectPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          vertexARectPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          vertexARectPath.fill = color;
        };
        
        // for a line - Beware that the x/y variables are declared via the ShapeCodeFunctions!
        const setX1 = ( newX1 ) => {
          vertexARect_x1 = phet.paperLand.utils.paperToDisplayX( newX1, sharedData.displaySize.width );
          vertexARectPath.shape = phet.kite.Shape.lineSegment( vertexARect_x1, vertexARect_y1, vertexARect_x2, vertexARect_y2 );
        };
        
        const setY1 = ( newY1 ) => {
          vertexARect_y1 = phet.paperLand.utils.paperToDisplayY( newY1, sharedData.displaySize.height );
          vertexARectPath.shape = phet.kite.Shape.lineSegment( vertexARect_x1, vertexARect_y1, vertexARect_x2, vertexARect_y2 );
        };

        const setX2 = ( newX2 ) => {
          vertexARect_x2 = phet.paperLand.utils.paperToDisplayX( newX2, sharedData.displaySize.width );
          vertexARectPath.shape = phet.kite.Shape.lineSegment( vertexARect_x1, vertexARect_y1, vertexARect_x2, vertexARect_y2 );
        };
        
        const setY2 = ( newY2 ) => {
          vertexARect_y2 = phet.paperLand.utils.paperToDisplayY( newY2, sharedData.displaySize.height );
          vertexARectPath.shape = phet.kite.Shape.lineSegment( vertexARect_x1, vertexARect_y1, vertexARect_x2, vertexARect_y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          vertexARectPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToDisplayX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          vertexARectPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          vertexARectPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds(vertexABounds);
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'vertexA' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'vertexABounds' );
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.vertexARectPath );
      delete scratchpad.vertexARectPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'vertexABounds' ], scratchpad.vertexARectPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.vertexARectPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty8 = phet.paperLand.getModelComponent( 'vertexA' );
    if ( modelProperty8 ) {
      modelProperty8.value = phet.paperLand.utils.getProgramCenter( points );
    }

    const modelProperty9 = phet.paperLand.getModelComponent( 'vertexABounds' );
    if ( modelProperty9 ) {
      modelProperty9.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
    }
  };
  
  const onProgramMarkersAdded = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersRemoved = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramMarkersChangedPosition = ( paperNumber, points, scratchpad, sharedData, markers ) => {
    
  };
  
  const onProgramAdjacent = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };
  
  const onProgramSeparated = ( paperNumber, otherPaperNumber, direction, scratchpad, sharedData ) => {
    
  };

  await paper.set( 'data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
        onProgramRemoved: onProgramRemoved.toString(),
        onProgramChangedPosition: onProgramChangedPosition.toString(),
        onProgramMarkersAdded: onProgramMarkersAdded.toString(),
        onProgramMarkersRemoved: onProgramMarkersRemoved.toString(),
        onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString(),
        onProgramAdjacent: onProgramAdjacent.toString(),
        onProgramSeparated: onProgramSeparated.toString(),
      },
      customWhiskerLengths: {
        top: 0.2,
        right: 0.2,
        bottom: 0.2,
        left: 0.2
      }
    }
  } );
  
  // PROJECTOR CODE //
  // Get a canvas object for this paper to draw something to the Projector.
  const canvas = await paper.get('canvas');

  // Draw the name of the program to the projector
  const ctx = canvas.getContext('2d');
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillText('', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Vertex A', canvas.width / 2, canvas.height / 2 + 20);
})();
