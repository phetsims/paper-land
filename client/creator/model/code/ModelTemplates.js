const ModelComponentTemplates = {
  BooleanProperty: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.BooleanProperty({{DEFAULT_VALUE}});
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  NumberProperty: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.NumberProperty( {{DEFAULT_VALUE}}, {
        range: new phet.dot.Range( {{MIN}}, {{MAX}} )
      });
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  StringProperty: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.StringProperty( '{{DEFAULT_VALUE}}' );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  Vector2Property: {
    onProgramAdded: `
      const {{NAME}} = new phet.dot.Vector2Property(
        new phet.dot.Vector2( {{DEFAULT_X}}, {{DEFAULT_Y}} )
      );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  EnumerationProperty: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.StringProperty( '{{DEFAULT_VALUE}}', {
        validValues: [ {{VALUES}} ]
      } );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  DerivedProperty: {
    onProgramAdded: `
      // DerivedProperties are actually implemented with Multilink for now because paper-land has a nice abstraction
      // for it.
      const {{NAME}} = new phet.axon.Property( null );
      scratchpad.{{NAME}}DerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( {{DEPENDENCIES}}, ( {{DEPENDENCY_ARGUMENTS}} ) => {
        const derivationFunction = () => {
        
          // should return a value based on the dependencies
          {{DERIVATION}}
        };
        {{NAME}}.value = derivationFunction();
      } );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `

      // remove the multilink updating the value    
      phet.paperLand.removeModelPropertyMultilink( {{DEPENDENCIES}}, scratchpad.{{NAME}}DerivedPropertyObserverId );
      delete scratchpad.{{NAME}}DerivedPropertyObserverId;
      
      // remove the derived Property from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  Bounds2Property: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.Property(
        new phet.dot.Bounds2( {{DEFAULT_MIN_X}}, {{DEFAULT_MIN_Y}}, {{DEFAULT_MAX_X}}, {{DEFAULT_MAX_Y}} )
      );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  ObservableArray: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.Property( [] );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  },
  ArrayItem: {
    onProgramAdded: `
      // The array item can be created when all entry data and the array itself are available in the model.
      scratchpad.{{NAME}}ItemObserverId = phet.paperLand.addMultiModelObserver(
        {{DEPENDENCY_NAMES_ARRAY}},
        ( {{DEPENDENCY_ARGUMENTS}} ) => {
        
          // Create the entry from the item schema.
          const {{ITEM_OBJECT_NAME}} = {{ITEM_OBJECT}};
        
          // Now that all dependencies are detected, this is where we may add the item for the first time.
          // If the model has a 'added' item reference, set this item to it.
          if ( phet.paperLand.getModelComponent( '{{ADDED_ITEM_REFERENCE_NAME}}' ) ) {
            phet.paperLand.getModelComponent( '{{ADDED_ITEM_REFERENCE_NAME}}' ).value = {{ITEM_OBJECT_NAME}};
          }
        
          // A callback that will replace the item in the array.
          scratchpad.replaceItem = () => {
          
            // A shallow copy of the array so that we can set it back to the Property and trigger listeners.
            const {{ARRAY_NAME}}Array = phet.paperLand.getModelComponent( '{{ARRAY_NAME}}' ).value.slice();
            
            const index = {{ARRAY_NAME}}Array.indexOf( scratchpad.item );
            if ( index > -1 ) {
              {{ARRAY_NAME}}Array.splice( index, 1 );
            }
            
            // Update the ItemObject values every time a component changes
            {{ITEM_OBJECT_UPDATE}}
            
            scratchpad.item = {{ITEM_OBJECT_NAME}};
            
            // Add the item to the array, inserting it into the same index as the previous item
            // to be less disruptive to the array data.
            {{ARRAY_NAME}}Array.splice( index, 0, scratchpad.item );
                        
            // Set the array back to the Property.
            phet.paperLand.getModelComponent( '{{ARRAY_NAME}}' ).value = {{ARRAY_NAME}}Array;
          };
        
          // For each linkable dependency, whenever the value changes we will recreate the item
          // and add it back to the array to trigger an array change so that the user can
          // easily register changes to the array in one place.
          {{DEPENDENCY_NAMES_ARRAY}}.forEach( dependencyName => {
          
            // Updating the array when the array itself is changed would be infinately reentrant.
            if ( dependencyName !== '{{ARRAY_NAME}}' ) {
              const dependency = phet.paperLand.getModelComponent( dependencyName );
              dependency.link( scratchpad.replaceItem );
            }
          } );
        },
        () => {
        
          // Remove the item from the array as soon as any dependencies are removed (if it is still in the array)
          const {{ARRAY_NAME}}Array = phet.paperLand.getModelComponent( '{{ARRAY_NAME}}' );
          if ( {{ARRAY_NAME}}Array ) {
            const arrayValue = {{ARRAY_NAME}}Array.value;
            
            const index = arrayValue.indexOf( scratchpad.item );
            if ( index > -1 ) {
              arrayValue.splice( index, 1 );
              
              // Set the Property to a new array so that listeners are triggered.
              phet.paperLand.getModelComponent( '{{ARRAY_NAME}}' ).value = arrayValue.slice();
              
              // Update the reference to the item that was just removed from the array, if the model has such a
              // component (it may have been removed by the user).
              if ( phet.paperLand.getModelComponent( '{{REMOVED_ITEM_REFERENCE_NAME}}' ) ) {
                phet.paperLand.getModelComponent( '{{REMOVED_ITEM_REFERENCE_NAME}}' ).value = scratchpad.item;
              }
            }
          }
          
          // detach listeners that will replace the item
          {{DEPENDENCY_NAMES_ARRAY}}.forEach( dependencyName => {
            const dependency = phet.paperLand.getModelComponent( dependencyName );
            if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
              dependency.unlink( scratchpad.replaceItem );
            }
          } );
        }
      ); 
    `,
    onProgramRemoved: `
      // If the item is in the array still, remove it.
      const {{ARRAY_NAME}}Array = phet.paperLand.getModelComponent( '{{ARRAY_NAME}}' );
      if ( {{ARRAY_NAME}}Array ) {
        const index = {{ARRAY_NAME}}Array.value.indexOf( scratchpad.item );
        if ( index > -1 ) {
          {{ARRAY_NAME}}Array.value.splice( index, 1 );
          
          // Set the Property to a new array so that listeners are triggered.
          phet.paperLand.getModelComponent( '{{ARRAY_NAME}}' ).value = {{ARRAY_NAME}}Array.value.slice();
          
          // Update the reference to the item that was just removed from the array, if the model has such a
          // component (it may have been removed by the user).
          if ( phet.paperLand.getModelComponent( '{{REMOVED_ITEM_REFERENCE_NAME}}' ) ) {
            phet.paperLand.getModelComponent( '{{REMOVED_ITEM_REFERENCE_NAME}}' ).value = scratchpad.item;
          }
        }
      }
      
      // detach listeners that will replace the item, if they are still on the dependencies
      {{DEPENDENCY_NAMES_ARRAY}}.forEach( dependencyName => {
        const dependency = phet.paperLand.getModelComponent( dependencyName );
        if ( dependency && dependency.hasListener( scratchpad.replaceItem ) ) {
          dependency.unlink( scratchpad.replaceItem );
        }
      } );
      
      // Detach the multiModelObserver listener.
      phet.paperLand.removeMultiModelObserver( {{DEPENDENCY_NAMES_ARRAY}}, scratchpad.{{NAME}}ItemObserverId );
    `
  },
  NamedArrayItemReference: {
    onProgramAdded: `
      const {{NAME}} = new phet.axon.Property( null );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
     // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  }
};

export default ModelComponentTemplates;