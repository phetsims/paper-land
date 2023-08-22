const ListenerComponentTemplates = {
  AnimationListenerComponent: {
    onProgramAdded: `
      const {{NAME}}AnimationListener = dt => {
      
        // A reference to the elapsed time so it is usable in the function
        const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
      
        // the functions create in the local scope to manipulate the controlled components
        {{CONTROL_FUNCTIONS}}
        
        // the function that that the user wrote
        {{CONTROL_FUNCTION}}
      };
      scratchpad.{{NAME}}AnimationListener = {{NAME}}AnimationListener;
      
      // add the listener to the step timer
      phet.axon.stepTimer.addListener( {{NAME}}AnimationListener );
      
    `,
    onProgramRemoved: `
      phet.axon.stepTimer.removeListener( scratchpad.{{NAME}}AnimationListener );
      delete scratchpad.{{NAME}}AnimationListener;
    `
  }
};

export default ListenerComponentTemplates;