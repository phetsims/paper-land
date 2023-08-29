const ListenerComponentTemplates = {
  AnimationListenerComponent: {
    onProgramAdded: `
      const {{NAME}}AnimationListener = dt => {
      
        // A reference to the elapsed time so it is usable in the function
        const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
        
        // references to each model component controlled by this listener
        {{COMPONENT_REFERENCES}}
      
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
  },
  MultilinkListenerComponent: {
    onProgramAdded: `
      scratchpad.{{NAME}}MultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // the functions that are available to the client from their selected dependencies
        {{CONTROL_FUNCTIONS}}
      
        // the code block that the user wrote to change controlled Properties
        {{CONTROL_FUNCTION}}
      } );
    `,
    onProgramRemoved: `
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES}}, scratchpad.{{NAME}}MultilinkId );
      delete scratchpad.{{NAME}}MultilinkId;
    `
  }
};

export default ListenerComponentTemplates;