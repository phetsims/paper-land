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
      scratchpad.{{NAME}}SoundMultilink = phet.axon.Multilink.multilink( [{{DEPENDENCIES}}], ( {{DEPENDENCY_ARGUMENTS}} ) => {
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
      
      scratchpad.{{NAME}}SoundMultilink.dispose();
      delete scratchpad.{{NAME}}SoundMultilink;
    `
  },
  DescriptionViewComponent: {
    onProgramAdded: `
      // Speak the description whenever the dependencies change.
      const {{NAME}}DescriptionFunction = ( {{DEPENDENCY_ARGUMENTS}} ) => {
        {{CONTROL_FUNCTION}}
      }
      
      scratchpad.{{NAME}}DescriptionMultilink = phet.axon.Multilink.multilink( [{{DEPENDENCIES}}], ( {{DEPENDENCY_ARGUMENTS}} ) => {
        const descriptionString = {{NAME}}DescriptionFunction( {{DEPENDENCY_ARGUMENTS}} );
        phet.scenery.voicingUtteranceQueue.addToBack( descriptionString );
      } ); 
    `,
    onProgramRemoved: `
      // Remove the description multilink
      scratchpad.{{NAME}}DescriptionMultilink.dispose();
      delete scratchpad.{{NAME}}DescriptionMultilink;
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
      scratchpad.{{NAME}}BackgroundMultilink = phet.axon.Multilink.multilink( [{{DEPENDENCIES}}], ( {{DEPENDENCY_ARGUMENTS}} ) => {
        const backgroundColorString = {{NAME}}BackgroundFunction( {{DEPENDENCY_ARGUMENTS}} );
        {{NAME}}BackgroundRectangle.fill = backgroundColorString;
      } );
    `,
    onProgramRemoved: `
      // Remove the background rectangle from the view.
      sharedData.scene.removeChild( scratchpad.{{NAME}}BackgroundRectangle );
      delete scratchpad.{{NAME}}BackgroundRectangle;
    `
  }
};

export default ViewComponentTemplates;