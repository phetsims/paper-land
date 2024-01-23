const ViewComponentTemplates = {
  SoundViewComponent: {
    onProgramAdded: `
      const {{NAME}}WrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/{{FILE_NAME}}' );
      const {{NAME}}SoundClip = new phet.tambo.SoundClip( {{NAME}}WrappedAudioBuffer, {
        loop: {{LOOP}},
        initialOutputLevel: 0.5
       } );
      phet.tambo.soundManager.addSoundGenerator( {{NAME}}SoundClip );
      
      let {{NAME}}StopSoundTimeout = null;
      
      // as a safety measure, sound can only be played every 0.25 seconds
      let {{NAME}}LastPlayTime = phet.paperLand.elapsedTimeProperty.value;

      // Play the sound when any dependencies change value.
      scratchpad.{{NAME}}SoundMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
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
        
        // a function the user can call to play the sound
        const play = () => {
        
          // Play the sound - if looping, we don't want to start playing again if already playing. The sound
          // can only be played at a limited interval for safety.
          if ( ( !{{NAME}}SoundClip.isPlaying || !{{LOOP}} ) && phet.paperLand.elapsedTimeProperty.value - {{NAME}}LastPlayTime > 0.25 ) {
            {{NAME}}SoundClip.play();
            {{NAME}}LastPlayTime = phet.paperLand.elapsedTimeProperty.value;
            
            // Set a timer to turn off the sound when the value stops changing.
            if ( {{NAME}}StopSoundTimeout ){
              window.clearTimeout( {{NAME}}StopSoundTimeout );
            }
            
            // only stop if looping
            if ( {{LOOP}} ) {
              {{NAME}}StopSoundTimeout = window.setTimeout( () => {
                {{NAME}}SoundClip.stop();
              }, 5000 );
            }  
          }
        };
        
        const stop = () => {
          // Set a timer to turn off the sound when the value stops changing.
          if ( {{NAME}}StopSoundTimeout ){
            window.clearTimeout( {{NAME}}StopSoundTimeout );
          }
          {{NAME}}SoundClip.stop();
        };
        
        if ( {{AUTOPLAY}} ) {
          play();
        }
      
        {{CONTROL_FUNCTION}}
            
      } );       
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.{{NAME}}SoundClip = {{NAME}}SoundClip;
    `,
    onProgramRemoved: `
      phet.tambo.soundManager.removeSoundGenerator( scratchpad.{{NAME}}SoundClip );
      delete scratchpad.{{NAME}}SoundClip;
      
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}SoundMultilinkId );
      delete scratchpad.{{NAME}}SoundMultilinkId;
    `
  },
  DescriptionViewComponent: {
    onProgramAdded: `
      // Speak the description whenever the dependencies change.
      const {{NAME}}DescriptionFunction = ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        {{CONTROL_FUNCTIONS}}
      
        {{CONTROL_FUNCTION}}
      }
      
      // a reusable utterance for this description component so that only the latest value is spoken - in general
      // it should not cancel other Utterances in this context but it should cancel itself
      scratchpad.{{NAME}}DescriptionUtterance = new phet.utteranceQueue.Utterance( { announcerOptions: { cancelOther: false } } );
      
      scratchpad.{{NAME}}DescriptionMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {

        // Make sure there is a string to speak, including converting falsy values and numbers to a string       
        const descriptionResult = {{NAME}}DescriptionFunction( {{DEPENDENCY_ARGUMENTS}} );
        if ( descriptionResult && descriptionResult.toString ) {
          const descriptionString = descriptionResult.toString();
          if ( descriptionString && descriptionString.length > 0 ) {
            scratchpad.{{NAME}}DescriptionUtterance.alert = descriptionString;
            phet.scenery.voicingUtteranceQueue.addToBack( scratchpad.{{NAME}}DescriptionUtterance ); 
          }
        }
      }, { lazy: {{LAZY}} } ); 
    `,
    onProgramRemoved: `
      // Remove the description multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}DescriptionMultilinkId );
      delete scratchpad.{{NAME}}DescriptionMultilinkId;
      
      // Remove the utterance
      delete scratchpad.{{NAME}}DescriptionUtterance;
    `
  },
  TextViewComponent: {
    onProgramAdded: `
      // Create the text and add it to the view - using RichText for nice markup support.
      const {{NAME}}Text = new phet.scenery.RichText( '', { fill: 'white' } );
      
      sharedData.scene.addChild( {{NAME}}Text );
      scratchpad.{{NAME}}Text = {{NAME}}Text;
      
      // Update the text when a dependency changes.
      scratchpad.{{NAME}}TextMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // in a local scope, define the functions that the user can use to manipulate the text
        {{CONTROL_FUNCTIONS}}

        // the function that the user wrote to update the text      
        {{CONTROL_FUNCTION}}
      }, { otherProperties: [ phet.paperLand.displaySizeProperty ] } );
    `,
    onProgramRemoved: `
      // Remove the text from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}Text );
      delete scratchpad.{{NAME}}Text;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}TextMultilinkId );
      delete scratchpad.{{NAME}}TextMultilinkId;
    `
  },
  BackgroundViewComponent: {
    onProgramAdded: `
      // Create a background rectangle and add it to the view.
      const {{NAME}}BackgroundRectangle = new phet.scenery.Rectangle( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height, {
        fill: '{{FILL_COLOR}}'
      } );
      
      // If there are no dependencies for the background, add it to the view immediately. Otherwise, we will add it
      // once all dependencies are available.
      if ( {{DEPENDENCY_NAMES_ARRAY}}.length === 0 ) {
        sharedData.scene.addChild( {{NAME}}BackgroundRectangle );
        {{NAME}}BackgroundRectangle.moveToBack();
      }
      
      // Assign to the scratchpad so that we can remove it later.
      scratchpad.{{NAME}}BackgroundRectangle = {{NAME}}BackgroundRectangle;
  
      const {{NAME}}BackgroundColorDependencies = {{DEPENDENCY_NAMES_ARRAY}};

      // Get a new background color whenever a dependency changes. The control function should return a color string.
      const {{NAME}}BackgroundFunction = ( {{DEPENDENCY_ARGUMENTS}} ) => {
        {{CONTROL_FUNCTION}}
      }
      
      // Update the background rectangle whenever the dependencies change.
      scratchpad.{{NAME}}BackgroundMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        const backgroundColorString = {{NAME}}BackgroundFunction( {{DEPENDENCY_ARGUMENTS}} );
        
        // wait to add the background until all dependencies are available (only add this once)
        if ( scratchpad.{{NAME}}BackgroundRectangle.parents.length === 0 ) {
          sharedData.scene.addChild( {{NAME}}BackgroundRectangle );
          {{NAME}}BackgroundRectangle.moveToBack();
        }
        
        // the function may not be implemented
        if ( backgroundColorString ) {
          {{NAME}}BackgroundRectangle.fill = backgroundColorString;
        }
        
        {{NAME}}BackgroundRectangle.setRect( 0, 0, sharedData.displaySize.width, sharedData.displaySize.height );
      }, { otherProperties: [ phet.paperLand.displaySizeProperty ] } );
    `,
    onProgramRemoved: `
      // Remove the background rectangle from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}BackgroundRectangle );
      delete scratchpad.{{NAME}}BackgroundRectangle;
      
      // Remove the multilink if there were any dependencies
      if ( scratchpad.{{NAME}}BackgroundMultilinkId ) {
        phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}BackgroundMultilinkId );
        delete scratchpad.{{NAME}}BackgroundMultilinkId;
      }
    `
  },
  ImageViewComponent: {
    onProgramAdded: `
      // Create an image and add it to the view.
      let {{NAME}}ImageElement = document.createElement( 'img' );
      {{NAME}}ImageElement.src = 'media/images/{{FILE_NAME}}';
      const {{NAME}}Image = new phet.scenery.Image( {{NAME}}ImageElement );
      
      const {{NAME}}ImageLoadProperty = new phet.axon.Property( 0 );
      {{NAME}}ImageElement.addEventListener( 'load', () => { {{NAME}}ImageLoadProperty.value = {{NAME}}ImageLoadProperty.value + 1; } );
      
      sharedData.scene.addChild( {{NAME}}Image );
      scratchpad.{{NAME}}Image = {{NAME}}Image;
      
      // Update the image when a dependency changes, and redraw if the board resizes
      scratchpad.{{NAME}}ImageMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        
        // the functions that are available for this view type
        {{CONTROL_FUNCTIONS}}
      
        {{CONTROL_FUNCTION}}
      }, { otherProperties: [ phet.paperLand.displaySizeProperty, {{NAME}}ImageLoadProperty ] } );
    `,
    onProgramRemoved: `
      // Remove the image from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}Image );
      delete scratchpad.{{NAME}}Image;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}ImageMultilinkId );
      delete scratchpad.{{NAME}}ImageMultilinkId;
    `
  },
  ShapeViewComponent: {
    onProgramAdded: `

      // Create a shape with kite.
      {{SHAPE_CREATOR_CODE}}
      
      // create a path for the shape
      const {{NAME}}Path = new phet.scenery.Path( {{NAME}}Shape, {
        fill: '{{FILL_COLOR}}',
        stroke: '{{STROKE_COLOR}}',
        lineWidth: {{LINE_WIDTH}},
        
        // if initial position is zero, do not set that explicitly because it will break shape points 
        centerX: ('{{VIEW_UNITS}}' === 'model' && {{CENTER_X}}) ? phet.paperLand.utils.paperToBoardX( {{CENTER_X}}, sharedData.displaySize.width ) : {{CENTER_X}},
        centerY: ('{{VIEW_UNITS}}' === 'model' && {{CENTER_Y}}) ? phet.paperLand.utils.paperToBoardY( {{CENTER_Y}}, sharedData.displaySize.height) : {{CENTER_Y}},
        scale: {{SCALE}},
        rotation: {{ROTATION}},
        opacity: {{OPACITY}}
      } );
      
      // assign to scratchpad so that we can remove it later
      sharedData.scene.addChild( {{NAME}}Path );
      scratchpad.{{NAME}}Path = {{NAME}}Path;
      
      // Update the shape when a dependency changes.
      scratchpad.{{NAME}}PathMultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // We have to recreate the shape every change (especially important for a resize) - this is done first though
        // because the user control functions might change the shape further.
        {{SHAPE_CREATOR_CODE}}
        scratchpad.{{NAME}}Path.setShape( {{NAME}}Shape );
        
        // now mutate with options that might depend on the shape or layout changes (again, user might override this 
        // so do before the control function)
        scratchpad.{{NAME}}Path.mutate( {
          // if initial position is zero, do not set that explicitly because it will break shape points 
          centerX: ('{{VIEW_UNITS}}' === 'model' && {{CENTER_X}}) ? phet.paperLand.utils.paperToBoardX( {{CENTER_X}}, sharedData.displaySize.width ) : {{CENTER_X}},
          centerY: ('{{VIEW_UNITS}}' === 'model' && {{CENTER_Y}}) ? phet.paperLand.utils.paperToBoardY( {{CENTER_Y}}, sharedData.displaySize.height) : {{CENTER_Y}},
          scale: {{SCALE}},
          rotation: {{ROTATION}}
        } );
      
        // the functions that are available for this view type
        {{CONTROL_FUNCTIONS}}
        
        {{CONTROL_FUNCTION}}
      }, { otherProperties: [ phet.paperLand.displaySizeProperty ] } );
    `,
    onProgramRemoved: `
    
      // Remove the Path from the view
      sharedData.scene.removeChild( scratchpad.{{NAME}}Path );
      delete scratchpad.{{NAME}}Path;
      
      // Remove the multilink
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}PathMultilinkId );
      delete scratchpad.{{NAME}}PathMultilinkId;
    `
  }
};

export default ViewComponentTemplates;