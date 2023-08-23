const ViewComponentTemplates = {
  SoundViewComponent: {
    onProgramAdded: `
      const {{NAME}}WrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/{{FILE_NAME}}' );
      const {{NAME}}SoundClip = new phet.tambo.SoundClip( {{NAME}}WrappedAudioBuffer, {
        loop: true
       } );
      phet.tambo.soundManager.addSoundGenerator( {{NAME}}SoundClip );
      
      let {{NAME}}StopSoundTimeout = null;

      // Play the sound when any dependencies change value.
      scratchpad.{{NAME}}SoundMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        // in a local scope, define the functions that the user can use to manipulate the sound
        const setOutputLevel = ( level ) => {
        
          // As a safety measure, don't let the user set a level below zero and above 2.
          const outputLevel = Math.max( 0, Math.min( 2, level ) );
          {{NAME}}SoundClip.outputLevel = outputLevel;
        };
        const setPlaybackRate = ( rate ) => {
        
          // As a safety measure, the playback rate cannot go below zero.
          const playbackRate = Math.max( 0, rate );
          {{NAME}}SoundClip.setPlaybackRate( playbackRate );
        };
      
        {{CONTROL_FUNCTION}}
        
        // Play the sound
        if ( !{{NAME}}SoundClip.isPlaying ) {
          {{NAME}}SoundClip.play();
        }
        
        // Set a timer to turn off the sound when the value stops changing.
        if ( {{NAME}}StopSoundTimeout ){
          window.clearTimeout( {{NAME}}StopSoundTimeout );
        }
        {{NAME}}StopSoundTimeout = window.setTimeout( () => {
          {{NAME}}SoundClip.stop();
        }, 5000 );        
      } );       
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.{{NAME}}SoundClip = {{NAME}}SoundClip;
    `,
    onProgramRemoved: `
      phet.tambo.soundManager.removeSoundGenerator( scratchpad.{{NAME}}SoundClip );
      delete scratchpad.{{NAME}}SoundClip;
      
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, scratchpad.{{NAME}}SoundMultilinkId );
      delete scratchpad.{{NAME}}SoundMultilinkId;
    `
  },
  DescriptionViewComponent: {
    onProgramAdded: `
      // Speak the description whenever the dependencies change.
      const {{NAME}}DescriptionFunction = ( {{DEPENDENCY_ARGUMENTS}} ) => {
        {{CONTROL_FUNCTION}}
      }
      
      scratchpad.{{NAME}}DescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        const descriptionString = {{NAME}}DescriptionFunction( {{DEPENDENCY_ARGUMENTS}} );
        phet.scenery.voicingUtteranceQueue.addToBack( descriptionString );
      } ); 
    `,
    onProgramRemoved: `
      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, scratchpad.{{NAME}}DescriptionMultilinkId );
      delete scratchpad.{{NAME}}DescriptionMultilinkId;
    `
  },
  TextViewComponent: {
    onProgramAdded: `
      // Create the text and add it to the view.
      const {{NAME}}Text = new phet.scenery.Text( '', { stroke: 'white' } );
      
      sharedData.scene.addChild( {{NAME}}Text );
      scratchpad.{{NAME}}Text = {{NAME}}Text;
      
      // Update the text when a dependency changes.
      scratchpad.{{NAME}}TextMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        const setString = ( string ) => {
          {{NAME}}Text.string = string;
        };
        
        const setCenterX = ( x ) => {
          {{NAME}}Text.centerX = x;
        };
        
        const setCenterY = ( y ) => {
          {{NAME}}Text.centerY = y;
        };
        
        const setFontSize = ( size ) => {
          {{NAME}}Text.fontSize = size;
        };
        
        const setTextColor = ( color ) => {
          {{NAME}}Text.fill = color;
        };
        
        const setFontFamily = ( family ) => {
          {{NAME}}Text.fontFamily = family;
        };
      
        {{CONTROL_FUNCTION}}
      } );
    `,
    onProgramRemoved: `
      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}Text );
      delete scratchpad.{{NAME}}Text;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, scratchpad.{{NAME}}TextMultilinkId );
      delete scratchpad.{{NAME}}TextMultilinkId;
    `
  },
  BackgroundViewComponent: {
    onProgramAdded: `
      // Create a background rectangle and add it to the view.
      const {{NAME}}BackgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height );
      sharedData.scene.addChild( {{NAME}}BackgroundRectangle );
      {{NAME}}BackgroundRectangle.moveToBack();
      
      // Assign to the scratchpad so that we can remove it later.
      scratchpad.{{NAME}}BackgroundRectangle = {{NAME}}BackgroundRectangle;
      
      // Get a new background color whenever a dependency changes. The control function should return a color string.
      const {{NAME}}BackgroundFunction = ( {{DEPENDENCY_ARGUMENTS}} ) => {
        {{CONTROL_FUNCTION}}
      }
      
      // Update the background rectangle whenever the dependencies change.
      scratchpad.{{NAME}}BackgroundMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        const backgroundColorString = {{NAME}}BackgroundFunction( {{DEPENDENCY_ARGUMENTS}} );
        {{NAME}}BackgroundRectangle.fill = backgroundColorString;
      } );
    `,
    onProgramRemoved: `
      // Remove the background rectangle from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}BackgroundRectangle );
      delete scratchpad.{{NAME}}BackgroundRectangle;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, {{NAME}}BackgroundMultilinkId );
      delete scratchpad.{{NAME}}BackgroundMultilinkId;
    `
  },
  ImageViewComponent: {
    onProgramAdded: `
      // Create an image and add it to the view.
      const {{NAME}}ImageElement = document.createElement( 'img' );
      {{NAME}}ImageElement.src = 'media/images/{{FILE_NAME}}';
      const {{NAME}}Image = new phet.scenery.Image( {{NAME}}ImageElement );
      
      sharedData.scene.addChild( {{NAME}}Image );
      scratchpad.{{NAME}}Image = {{NAME}}Image;
      
      // Update the image when a dependency changes.
      scratchpad.{{NAME}}ImageMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        // in a local scope, define the functions that the user can use to manipulate the sound
        const setCenter = ( position ) => {
          {{NAME}}Image.center = position;
        };
        const setScale = ( scale ) => {
          {{NAME}}Image.setScaleMagnitude( scale );
        };
      
        {{CONTROL_FUNCTION}}
      } );
    `,
    onProgramRemoved: `
      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}Image );
      delete scratchpad.{{NAME}}Image;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, scratchpad.{{NAME}}ImageMultilinkId );
      delete scratchpad.{{NAME}}ImageMultilinkId;
    `
  },
  ShapeViewComponent: {
    onProgramAdded: `

      // Create a shape with kite.
      const {{NAME}}Shape = {{SHAPE_CREATOR_CODE}}
      
      // create a path for the shape
      const {{NAME}}Path = new phet.scenery.Path( {{NAME}}Shape, {
        fill: '{{FILL_COLOR}}',
        stroke: '{{STROKE_COLOR}}',
        lineWidth: {{LINE_WIDTH}},
        
        centerX: {{CENTER_X}},
        centerY: {{CENTER_Y}},
        scale: {{SCALE}},
        rotation: {{ROTATION}},
        opacity: {{OPACITY}}
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( {{NAME}}Path );
      scratchpad.{{NAME}}Path = {{NAME}}Path;
      
      // Update the shape when a dependency changes.
      scratchpad.{{NAME}}PathMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        const setCenterX = ( x ) => {
          {{NAME}}Path.centerX = x;
        };
        
        const setCenterY = ( y ) => {
          {{NAME}}Path.centerY = y;
        };
        {{CONTROL_FUNCTION}}
      } );
    `,
    onProgramRemoved: `
    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.{{NAME}}Path );
      delete scratchpad.{{NAME}}Path;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, scratchpad.{{NAME}}PathMultilinkId );
      delete scratchpad.{{NAME}}PathMultilinkId;
    `
  }
};

export default ViewComponentTemplates;