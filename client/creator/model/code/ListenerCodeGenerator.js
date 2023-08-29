class ListenerCodeGenerator {

  static getComponentSetterFunctions( controlledPropertyNames ) {
    return controlledPropertyNames.map( controlledPropertyName => {

      // component name with a capital letter.
      const controlledPropertyNameCapitalized = controlledPropertyName.charAt( 0 ).toUpperCase() + controlledPropertyName.slice( 1 );

      return `const set${controlledPropertyNameCapitalized} = newValue => {
        const modelComponent = phet.paperLand.getModelComponent( '${controlledPropertyName}' );
        modelComponent.value = newValue;  
      }
      `;
    } );
  }

  static getComponentReferences( controlledPropertyNames ) {
    return controlledPropertyNames.map( controlledPropertyName => {
      return `const ${controlledPropertyName} = phet.paperLand.getModelComponent( '${controlledPropertyName}' ).value;`;
    } ).join( '\n' );
  }
}

export default ListenerCodeGenerator;