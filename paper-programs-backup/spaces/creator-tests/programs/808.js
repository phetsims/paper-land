// Movable Image
// Keywords: 
// Description: 

importScripts('paper.js');

(async () => {

  const onProgramAdded = ( paperNumber, scratchpad, sharedData ) => {
    
      const imagePosition = new phet.dot.Vector2Property(
        new phet.dot.Vector2( 0, 0 )
      );
      phet.paperLand.addModelComponent( 'imagePosition', imagePosition );
    

      const imageRotation = new phet.axon.NumberProperty( 0, {
        range: new phet.dot.Range( 0, 6.28 )
      });
      phet.paperLand.addModelComponent( 'imageRotation', imageRotation );
    

      const imageScale = new phet.axon.NumberProperty( 1, {
        range: new phet.dot.Range( 0.1, 2 )
      });
      phet.paperLand.addModelComponent( 'imageScale', imageScale );
    

      const pageBounds = new phet.axon.Property(
        new phet.dot.Bounds2( 0, 0, 1, 1 )
      );
      phet.paperLand.addModelComponent( 'pageBounds', pageBounds );
    

      // Create an image and add it to the view.
      let imageViewImageElement = document.createElement( 'img' );
      imageViewImageElement.src = 'media/images/sub.png';
      const imageViewImage = new phet.scenery.Image( imageViewImageElement );
      
      sharedData.scene.addChild( imageViewImage );
      scratchpad.imageViewImage = imageViewImage;
      
      // Update the image when a dependency changes.
      scratchpad.imageViewImageMultilinkId = phet.paperLand.addModelPropertyMultilink( [ 'imageRotation', 'pageBounds' ], ( imageRotation, pageBounds ) => {
        
        // the functions that are available for this view type
        
      const unitBoundsToDisplayBounds = ( bounds ) => {
        return phet.paperLand.utils.paperToBoardBounds( bounds, sharedData.displaySize.width, sharedData.displaySize.height );
      };
      
      const unitPositionToDisplayPosition = ( position ) => {
        return phet.paperLand.utils.paperToBoardCoordinates( position, sharedData.displaySize.width, sharedData.displaySize.height );
      };
    
      const setCenterX = ( x ) => {
        imageViewImage.centerX = phet.paperLand.utils.paperToBoardX( x, sharedData.displaySize.width );
      };
      
      const setCenterY = ( y ) => {
        imageViewImage.centerY = phet.paperLand.utils.paperToBoardY( y, sharedData.displaySize.height );
      };
      
      const setLeft = ( left ) => {
        imageViewImage.left = phet.paperLand.utils.paperToBoardX( left, sharedData.displaySize.width );
      };
      
      const setTop = ( top ) => {
        imageViewImage.top = phet.paperLand.utils.paperToBoardY( top, sharedData.displaySize.height );
      };
      
      const setScale = ( scale ) => {
        imageViewImage.setScaleMagnitude( scale );
      };
      
      const setOpacity = ( opacity ) => {
        imageViewImage.opacity = opacity;
      };
      
      const setVisible = ( visible ) => {
        imageViewImage.visible = visible;
      };
      
      const moveToFront = () => {
        imageViewImage.moveToFront();
      };
      
      const setRotation = ( rotation ) => {
        imageViewImage.rotation = rotation;
      };

      // Set the scale in X and Y and the       
      const matchBounds = ( bounds, stretch ) => {
      
        // Find the scale to apply to the x and y dimensions so that the component bounds match the provided bounds
        const imageViewImageViewBounds = phet.paperLand.utils.paperToBoardBounds(bounds, sharedData.displaySize.width, sharedData.displaySize.height);

        // local bounds may be zero as things load
        // const aspectRatio = ( imageViewImage.localBounds.width || 1 ) / ( imageViewImage.localBounds.height || 1 );

        const scaleX = imageViewImageViewBounds.width / ( imageViewImage.localBounds.width || 1 );
        const scaleY = imageViewImageViewBounds.height / ( imageViewImage.localBounds.height || 1 );

        if ( stretch ) {
          imageViewImage.setScaleMagnitude(scaleX, scaleY);
        }
        else {
        
          // Scale by the minimum of the x and y scale factors, preserving the aspect ratio
          imageViewImage.setScaleMagnitude( Math.min( scaleX, scaleY ) );
        }        

        // Now put the component in the center of the bounds
        imageViewImage.center = imageViewImageViewBounds.center;
      };
      

        const setImage = imageName => {
          let imageViewImageImageElement = document.createElement( 'img' );
          imageViewImageImageElement.src = 'media/images/' + imageName;
          imageViewImage.image = imageViewImageImageElement;
        };
      
      
        matchBounds( pageBounds, true );

// Sets the rotation from the model component
setRotation( imageRotation );


      } );
    
  };

  const onProgramRemoved = ( paperNumber, scratchpad, sharedData ) => {
    
      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'imagePosition' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'imageRotation' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'imageScale' );
    

      // Remove the component from the model
      phet.paperLand.removeModelComponent( 'pageBounds' );
    

      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.imageViewImage );
      delete scratchpad.imageViewImage;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( [ 'imageRotation', 'pageBounds' ], scratchpad.imageViewImageMultilinkId );
      delete scratchpad.imageViewImageMultilinkId;
    
  };

  const onProgramChangedPosition = ( paperNumber, points, scratchpad, sharedData ) => {
    
    const modelProperty2 = phet.paperLand.getModelComponent( 'pageBounds' );
    if ( modelProperty2 ) {
      modelProperty2.value = phet.paperLand.utils.getAbsolutePaperBounds( points );
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
  ctx.fillText('Movable Image', canvas.width / 2, canvas.height / 2 + 20);
})();
