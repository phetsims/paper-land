const ControllerComponentTemplates = {
  NumberPropertyController: {
    onProgramChangedPosition: `
       const modelProperty = phet.paperLand.getModelComponent( '{{CONTROLLED_NAME}}' );
       if ( modelProperty ) {
         const range = modelProperty.range;
         const value = modelProperty.value;
         
         // This gives us the normalized value of the control method, which will be between
         // zero and one. Can multiply by the range of model values to determine the
         // resultant model value.
         const controlValue = {{GET_CONTROL_VALUE}}
         modelProperty.value = range.min + controlValue * ( range.max - range.min );
       } 
    `
  }
};

export default ControllerComponentTemplates;