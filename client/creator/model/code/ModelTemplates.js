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
  StringProperty: {
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
      scratchpad.{{NAME}}DerivedPropertyObserverId = phet.paperLand.addModelPropertyMultilink( [ {{DEPENDENCIES}} ], ( {{DEPENDENCY_ARGUMENTS}} ) => {
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
      phet.paperLand.removeModelPropertyMultilink( [ {{DEPENDENCIES}}], scratchpad.{{NAME}}DerivedPropertyObserverId );
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
  }
};

export default ModelComponentTemplates;