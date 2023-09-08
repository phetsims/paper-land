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
      const {{NAME}} = new phet.axon.DerivedProperty(
        [ {{DEPENDENCIES}} ],
        ( {{DEPENDENCY_ARGUMENTS}} ) => {
          {{DERIVATION}}
        }
      );
      phet.paperLand.addModelComponent( '{{NAME}}', {{NAME}} );
    `,
    onProgramRemoved: `
    
      // Dispose of the component, so that it is no longer linked to other Properties.
      phet.paperLand.getModelComponent( '{{NAME}}' ).dispose();
      
      // Remove the component from the model
      phet.paperLand.removeModelComponent( '{{NAME}}' );
    `
  }
};

export default ModelComponentTemplates;