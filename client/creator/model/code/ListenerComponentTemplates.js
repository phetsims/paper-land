const ListenerComponentTemplates = {
  AnimationListenerComponent: {
    onProgramAdded: `
      const {{NAME}}AnimationListener = dt => {
      
        // listener only runs if all declared dependencies are available in the model
        if ( phet.paperLand.hasAllModelComponents( {{DEPENDENCY_NAMES_ARRAY}} ) ) {
               
          // A reference to the elapsed time so it is usable in the function
          const elapsedTime = phet.paperLand.elapsedTimeProperty.value;
          
          // references to each model component controlled by this listener
          {{COMPONENT_REFERENCES}}
        
          // the functions create in the local scope to manipulate the controlled components
          {{CONTROL_FUNCTIONS}}
          
          // the function that that the user wrote
          {{CONTROL_FUNCTION}} 
        }
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
      scratchpad.{{NAME}}MultilinkId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
      
        // We have behavior with components outside of the multilink that may not exist yet, we only do this
        // work if all are available
        if ( phet.paperLand.hasAllModelComponents( {{CONTROLLED_NAMES_ARRAY}} ) ) {
        
          // references to each model component controlled by this listener
          {{COMPONENT_REFERENCES}}
      
          // the functions that are available to the client from their selected dependencies
          {{CONTROL_FUNCTIONS}}
      
          // the code block that the user wrote to change controlled Properties
          {{CONTROL_FUNCTION}}   
        }
      } );
    `,
    onProgramRemoved: `
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}MultilinkId );
      delete scratchpad.{{NAME}}MultilinkId;
    `
  },
  BluetoothListenerComponent: {
    onProgramAdded: `
    
      if ( {{WRITE_TO_CHARACTERISTIC}} ) {

      }
      else {
      
        // Reading from the characteristic, in this case we are controlling other model components
        phet.paperLand.boardBluetoothServers.addCharacteristicListener(
          '{{SERVICE_ID}}',
          '{{CHARACTERISTIC_ID}}',
          deviceValue => {
          
            // references to each model component controlled by this listener
            {{COMPONENT_REFERENCES}}
          
            // the functions create in the local scope to manipulate the controlled components
            {{CONTROL_FUNCTIONS}}
            
            // the function that that the user wrote
            {{CONTROL_FUNCTION}} 
          }
        )
        .then( addedListener => {
          scratchpad.characteristicListener = addedListener;
        } )
        .catch( error => {
          phet.paperLand.console.error( error );
        } );
      }
    `,
    onProgramRemoved: `
     phet.paperLand.console.log( 'Removing a BLE component' );
     phet.paperLand.boardBluetoothServers.removeCharacteristicListener(
       '{{SERVICE_ID}}',
       '{{CHARACTERISTIC_ID}}',
       scratchpad.characteristicListener
     ).catch( error => {
       phet.paperLand.console.error( error );
     } );
    `
  }
};

export default ListenerComponentTemplates;