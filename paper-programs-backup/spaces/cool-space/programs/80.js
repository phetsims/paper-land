// Bounds
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const leftTopBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 0.33, 0.33 )
      );
      phet.paperLand.addModelComponent( 'leftTopBounds', leftTopBounds );
    

      const centerTopBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0.33, 0, 0.66, 0.33 )
      );
      phet.paperLand.addModelComponent( 'centerTopBounds', centerTopBounds );
    

      const rightTopBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0.66, 0, 1, 0.33 )
      );
      phet.paperLand.addModelComponent( 'rightTopBounds', rightTopBounds );
    

      const leftCenterBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0.33, 0.33, 0.66 )
      );
      phet.paperLand.addModelComponent( 'leftCenterBounds', leftCenterBounds );
    

      const centerBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0.33, 0.33, 0.66, 0.66 )
      );
      phet.paperLand.addModelComponent( 'centerBounds', centerBounds );
    

      const rightCenterBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0.66, 0.33, 1, 0.66 )
      );
      phet.paperLand.addModelComponent( 'rightCenterBounds', rightCenterBounds );
    

      const leftBottomBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0.66, 0.33, 1 )
      );
      phet.paperLand.addModelComponent( 'leftBottomBounds', leftBottomBounds );
    

      const centerBottomBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0.33, 0.66, 0.66, 1 )
      );
      phet.paperLand.addModelComponent( 'centerBottomBounds', centerBottomBounds );
    

      const rightBottomBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0.66, 0.66, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'rightBottomBounds', rightBottomBounds );
    


      // Create a shape with kite.
      const leftTopViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const leftTopViewPath = new phet.scenery.Path( leftTopViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( leftTopViewPath );
      scratchpad.leftTopViewPath = leftTopViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.leftTopViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'leftTopBounds' ], ( leftTopBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const leftTopViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.leftTopViewPath.setShape( leftTopViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.leftTopViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        leftTopViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        leftTopViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        leftTopViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        leftTopViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        leftTopViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        leftTopViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        leftTopViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        leftTopViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        leftTopViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        leftTopViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const leftTopViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( leftTopViewPath.localBounds.width || 1 ) / ( leftTopViewPath.localBounds.height || 1 );

        const scaleX = leftTopViewPathViewBounds.width / ( leftTopViewPath.localBounds.width || 1 );
        const scaleY = leftTopViewPathViewBounds.height / ( leftTopViewPath.localBounds.height || 1 );

        if ( stretch ) {
          leftTopViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          leftTopViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        leftTopViewPath.center = leftTopViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          leftTopViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          leftTopViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          leftTopViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          leftTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          leftTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          leftTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          leftTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          leftTopViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          leftTopViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          leftTopViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( leftTopBounds );
setFill( 'rgba(255, 0, 0, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const centerTopViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const centerTopViewPath = new phet.scenery.Path( centerTopViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( centerTopViewPath );
      scratchpad.centerTopViewPath = centerTopViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.centerTopViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'centerTopBounds' ], ( centerTopBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const centerTopViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.centerTopViewPath.setShape( centerTopViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.centerTopViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        centerTopViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        centerTopViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        centerTopViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        centerTopViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        centerTopViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        centerTopViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        centerTopViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        centerTopViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        centerTopViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        centerTopViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const centerTopViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( centerTopViewPath.localBounds.width || 1 ) / ( centerTopViewPath.localBounds.height || 1 );

        const scaleX = centerTopViewPathViewBounds.width / ( centerTopViewPath.localBounds.width || 1 );
        const scaleY = centerTopViewPathViewBounds.height / ( centerTopViewPath.localBounds.height || 1 );

        if ( stretch ) {
          centerTopViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          centerTopViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        centerTopViewPath.center = centerTopViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          centerTopViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          centerTopViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          centerTopViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          centerTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          centerTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          centerTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          centerTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          centerTopViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          centerTopViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          centerTopViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( centerTopBounds );
setFill( 'rgba(0, 0, 255, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const rightTopViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const rightTopViewPath = new phet.scenery.Path( rightTopViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( rightTopViewPath );
      scratchpad.rightTopViewPath = rightTopViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.rightTopViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'rightTopBounds' ], ( rightTopBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const rightTopViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.rightTopViewPath.setShape( rightTopViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.rightTopViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        rightTopViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        rightTopViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        rightTopViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        rightTopViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        rightTopViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        rightTopViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        rightTopViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        rightTopViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        rightTopViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        rightTopViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const rightTopViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( rightTopViewPath.localBounds.width || 1 ) / ( rightTopViewPath.localBounds.height || 1 );

        const scaleX = rightTopViewPathViewBounds.width / ( rightTopViewPath.localBounds.width || 1 );
        const scaleY = rightTopViewPathViewBounds.height / ( rightTopViewPath.localBounds.height || 1 );

        if ( stretch ) {
          rightTopViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          rightTopViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        rightTopViewPath.center = rightTopViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          rightTopViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          rightTopViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          rightTopViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          rightTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          rightTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          rightTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          rightTopViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          rightTopViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          rightTopViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          rightTopViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( rightTopBounds );
setFill( 'rgba(0, 128, 0, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const leftCenterViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const leftCenterViewPath = new phet.scenery.Path( leftCenterViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( leftCenterViewPath );
      scratchpad.leftCenterViewPath = leftCenterViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.leftCenterViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'leftCenterBounds' ], ( leftCenterBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const leftCenterViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.leftCenterViewPath.setShape( leftCenterViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.leftCenterViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        leftCenterViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        leftCenterViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        leftCenterViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        leftCenterViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        leftCenterViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        leftCenterViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        leftCenterViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        leftCenterViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        leftCenterViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        leftCenterViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const leftCenterViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( leftCenterViewPath.localBounds.width || 1 ) / ( leftCenterViewPath.localBounds.height || 1 );

        const scaleX = leftCenterViewPathViewBounds.width / ( leftCenterViewPath.localBounds.width || 1 );
        const scaleY = leftCenterViewPathViewBounds.height / ( leftCenterViewPath.localBounds.height || 1 );

        if ( stretch ) {
          leftCenterViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          leftCenterViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        leftCenterViewPath.center = leftCenterViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          leftCenterViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          leftCenterViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          leftCenterViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          leftCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          leftCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          leftCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          leftCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          leftCenterViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          leftCenterViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          leftCenterViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( leftCenterBounds );
setFill( 'rgba(255, 255, 0, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const centerViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const centerViewPath = new phet.scenery.Path( centerViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( centerViewPath );
      scratchpad.centerViewPath = centerViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.centerViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'centerBounds' ], ( centerBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const centerViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.centerViewPath.setShape( centerViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.centerViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        centerViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        centerViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        centerViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        centerViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        centerViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        centerViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        centerViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        centerViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        centerViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        centerViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const centerViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( centerViewPath.localBounds.width || 1 ) / ( centerViewPath.localBounds.height || 1 );

        const scaleX = centerViewPathViewBounds.width / ( centerViewPath.localBounds.width || 1 );
        const scaleY = centerViewPathViewBounds.height / ( centerViewPath.localBounds.height || 1 );

        if ( stretch ) {
          centerViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          centerViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        centerViewPath.center = centerViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          centerViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          centerViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          centerViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          centerViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          centerViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          centerViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          centerViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          centerViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          centerViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          centerViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( centerBounds );
setFill( 'rgba(128, 0, 128, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const rightCenterViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const rightCenterViewPath = new phet.scenery.Path( rightCenterViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( rightCenterViewPath );
      scratchpad.rightCenterViewPath = rightCenterViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.rightCenterViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'rightCenterBounds' ], ( rightCenterBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const rightCenterViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.rightCenterViewPath.setShape( rightCenterViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.rightCenterViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        rightCenterViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        rightCenterViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        rightCenterViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        rightCenterViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        rightCenterViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        rightCenterViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        rightCenterViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        rightCenterViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        rightCenterViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        rightCenterViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const rightCenterViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( rightCenterViewPath.localBounds.width || 1 ) / ( rightCenterViewPath.localBounds.height || 1 );

        const scaleX = rightCenterViewPathViewBounds.width / ( rightCenterViewPath.localBounds.width || 1 );
        const scaleY = rightCenterViewPathViewBounds.height / ( rightCenterViewPath.localBounds.height || 1 );

        if ( stretch ) {
          rightCenterViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          rightCenterViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        rightCenterViewPath.center = rightCenterViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          rightCenterViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          rightCenterViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          rightCenterViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          rightCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          rightCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          rightCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          rightCenterViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          rightCenterViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          rightCenterViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          rightCenterViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( rightCenterBounds );
setFill( 'rgba(255, 165, 0, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const leftBottomViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const leftBottomViewPath = new phet.scenery.Path( leftBottomViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( leftBottomViewPath );
      scratchpad.leftBottomViewPath = leftBottomViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.leftBottomViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'leftBottomBounds' ], ( leftBottomBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const leftBottomViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.leftBottomViewPath.setShape( leftBottomViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.leftBottomViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        leftBottomViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        leftBottomViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        leftBottomViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        leftBottomViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        leftBottomViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        leftBottomViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        leftBottomViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        leftBottomViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        leftBottomViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        leftBottomViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const leftBottomViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( leftBottomViewPath.localBounds.width || 1 ) / ( leftBottomViewPath.localBounds.height || 1 );

        const scaleX = leftBottomViewPathViewBounds.width / ( leftBottomViewPath.localBounds.width || 1 );
        const scaleY = leftBottomViewPathViewBounds.height / ( leftBottomViewPath.localBounds.height || 1 );

        if ( stretch ) {
          leftBottomViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          leftBottomViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        leftBottomViewPath.center = leftBottomViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          leftBottomViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          leftBottomViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          leftBottomViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          leftBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          leftBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          leftBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          leftBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          leftBottomViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          leftBottomViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          leftBottomViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( leftBottomBounds );
setFill( 'rgba(255, 192, 203, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const centerBottomViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const centerBottomViewPath = new phet.scenery.Path( centerBottomViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( centerBottomViewPath );
      scratchpad.centerBottomViewPath = centerBottomViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.centerBottomViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'centerBottomBounds' ], ( centerBottomBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const centerBottomViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.centerBottomViewPath.setShape( centerBottomViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.centerBottomViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        centerBottomViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        centerBottomViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        centerBottomViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        centerBottomViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        centerBottomViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        centerBottomViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        centerBottomViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        centerBottomViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        centerBottomViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        centerBottomViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const centerBottomViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( centerBottomViewPath.localBounds.width || 1 ) / ( centerBottomViewPath.localBounds.height || 1 );

        const scaleX = centerBottomViewPathViewBounds.width / ( centerBottomViewPath.localBounds.width || 1 );
        const scaleY = centerBottomViewPathViewBounds.height / ( centerBottomViewPath.localBounds.height || 1 );

        if ( stretch ) {
          centerBottomViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          centerBottomViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        centerBottomViewPath.center = centerBottomViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          centerBottomViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          centerBottomViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          centerBottomViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          centerBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          centerBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          centerBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          centerBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          centerBottomViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          centerBottomViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          centerBottomViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( centerBottomBounds );
setFill( 'rgba(165, 42, 42, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    


      // Create a shape with kite.
      const rightBottomViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
      
      // create a path for the shape
      const rightBottomViewPath = new phet.scenery.Path( rightBottomViewShape, {
        fill: 'lightblue',
        stroke: 'red',
        lineWidth: 1,
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
        centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
        scale: 1,
        rotation: 0,
        opacity: 1
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( rightBottomViewPath );
      scratchpad.rightBottomViewPath = rightBottomViewPath;
      
      // Update the shape when a dependency changes.
      scratchpad.rightBottomViewPathMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'rightBottomBounds' ], ( rightBottomBounds ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        const rightBottomViewShape = phet.kite.Shape.rectangle( 0, 0, phet.paperLand.utils.paperToBoardX( 0.5, sharedData.displaySize.width ), phet.paperLand.utils.paperToBoardY( 0.5, sharedData.displaySize.height ) )
        scratchpad.rightBottomViewPath.setShape( rightBottomViewShape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.rightBottomViewPath.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardX( undefined, sharedData.displaySize.width ) : undefined,
          centerY: ('model' === 'model' && undefined) ? phet.paperLand.utils.paperToBoardY( undefined, sharedData.displaySize.height) : undefined,
          scale: 1,
          rotation: 0
        } );
      
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        rightBottomViewPath.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        rightBottomViewPath.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        rightBottomViewPath.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        rightBottomViewPath.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        rightBottomViewPath.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        rightBottomViewPath.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        rightBottomViewPath.visible = visible;
      };
      
      const moveToFront = () => {
        rightBottomViewPath.moveToFront();
      };
      
      const moveToBack = () => {
        rightBottomViewPath.moveToBack();
      };
      
      const setRotation = ( rotation ) => {
        rightBottomViewPath.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const rightBottomViewPathViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( rightBottomViewPath.localBounds.width || 1 ) / ( rightBottomViewPath.localBounds.height || 1 );

        const scaleX = rightBottomViewPathViewBounds.width / ( rightBottomViewPath.localBounds.width || 1 );
        const scaleY = rightBottomViewPathViewBounds.height / ( rightBottomViewPath.localBounds.height || 1 );

        if ( stretch ) {
          rightBottomViewPath.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          rightBottomViewPath.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        rightBottomViewPath.center = rightBottomViewPathViewBounds.center;
      };
      

        const setStroke = ( color ) => {
          rightBottomViewPath.stroke = color;
        };
        
        const setLineWidth = ( width ) => {
          rightBottomViewPath.lineWidth = width;
        };
        
        const setFill = ( color ) => {
          rightBottomViewPath.fill = color;
        };
        
        // for a line
        const setX1 = ( newX1 ) => {
          x1 = phet.paperLand.utils.paperToBoardX( newX1, sharedData.displaySize.width );
          rightBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY1 = ( newY1 ) => {
          y1 = phet.paperLand.utils.paperToBoardY( newY1, sharedData.displaySize.height );
          rightBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };

        const setX2 = ( newX2 ) => {
          x2 = phet.paperLand.utils.paperToBoardX( newX2, sharedData.displaySize.width );
          rightBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        const setY2 = ( newY2 ) => {
          y2 = phet.paperLand.utils.paperToBoardY( newY2, sharedData.displaySize.height );
          rightBottomViewPath.shape = phet.kite.Shape.lineSegment( x1, y1, x2, y2 );
        };
        
        // for a circle
        const setRadius = ( radius ) => {
          // since this is a Path and not a Circle, we need to recreate the shape
          rightBottomViewPath.shape = phet.kite.Shape.circle( phet.paperLand.utils.paperToBoardX( radius, sharedData.displaySize.width ) );
        };
        
        // for a rectangle
        const setRectBounds = ( bounds ) => {
          const transformedBounds = unitBoundsToDisplayBounds( bounds );
          rightBottomViewPath.shape = phet.kite.Shape.bounds( transformedBounds );
        };
        
        // for a polygon
        const setPoints = ( points ) => {
          const transformedPoints = points.map( thisPoint => unitPositionToDisplayPosition( thisPoint ) );
          rightBottomViewPath.shape = phet.kite.Shape.polygon( transformedPoints );
        };
        
        // bring in the reference components so they are available in the control function
        
        
        setRectBounds( rightBottomBounds );
setFill( 'rgba(128, 128, 128, 0.5)' );
      }, {
        otherProperties: [ phet.paperLand.displaySizeProperty ],
        otherReferences: [  ]
      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'leftTopBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'centerTopBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'rightTopBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'leftCenterBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'centerBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'rightCenterBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'leftBottomBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'centerBottomBounds' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'rightBottomBounds' );
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.leftTopViewPath );
      delete scratchpad.leftTopViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'leftTopBounds' ], scratchpad.leftTopViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.leftTopViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.centerTopViewPath );
      delete scratchpad.centerTopViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'centerTopBounds' ], scratchpad.centerTopViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.centerTopViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.rightTopViewPath );
      delete scratchpad.rightTopViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'rightTopBounds' ], scratchpad.rightTopViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.rightTopViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.leftCenterViewPath );
      delete scratchpad.leftCenterViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'leftCenterBounds' ], scratchpad.leftCenterViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.leftCenterViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.centerViewPath );
      delete scratchpad.centerViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'centerBounds' ], scratchpad.centerViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.centerViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.rightCenterViewPath );
      delete scratchpad.rightCenterViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'rightCenterBounds' ], scratchpad.rightCenterViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.rightCenterViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.leftBottomViewPath );
      delete scratchpad.leftBottomViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'leftBottomBounds' ], scratchpad.leftBottomViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.leftBottomViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.centerBottomViewPath );
      delete scratchpad.centerBottomViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'centerBottomBounds' ], scratchpad.centerBottomViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.centerBottomViewPathMultilinkId;
    

    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.rightBottomViewPath );
      delete scratchpad.rightBottomViewPath;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'rightBottomBounds' ], scratchpad.rightBottomViewPathMultilinkId, {
        otherReferences: [  ]
      } );
      delete scratchpad.rightBottomViewPathMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
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
  ctx.fillText('Bounds', canvas.width / 2, canvas.height / 2 + 20);
})();
