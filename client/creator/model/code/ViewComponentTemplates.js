const ViewComponentTemplates = {
  SoundViewComponent: {
    onProgramAdded: `
      const {{NAME}}WrappedAudioBuffer = createAndLoadWrappedAudioBuffer( 'media/sounds/{{FILE_NAME}}' );
  
      const {{NAME}}SoundClip = new phet.tambo.SoundClip( wrappedAudioBuffer );
      phet.tambo.soundManager.addSoundGenerator( soundClip );

      // Multilink to the dependency Properties so that the sound plays
      // when any of them change
      phet.axon.Multilink.multilink( [{{DEPENDENCIES}}], ( {{ARGUMENTS}} ) => {
        {{CALLBACK}}( {{ARGUMENTS}} );
        
        // Play the sound        
      } );       
      
      setTimeout( () => {
        soundClip.play();
      }, 1000 );
      
      // Assign the sound to the scratchpad so that we can remove it later
      scratchpad.{{NAME}}SoundClip = {{NAME}}SoundClip;
    `,
    onProgramRemoved: `
      phet.tambo.soundManager.removeSoundGenerator( scratchpad.{{NAME}}SoundClip );
      delete scratchpad.{{NAME}}SoundClip
    `
  }
};

export default ViewComponentTemplates;