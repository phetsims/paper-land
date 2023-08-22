class ListenerCodeGenerator {

  static getComponentSetterFunctions( controlledPropertyNames ) {
    return controlledPropertyNames.map( controlledPropertyName => {

      // component name with a capital letter.
      const controlledPropertyNameCapitalized = controlledPropertyName.charAt( 0 ).toUpperCase() + controlledPropertyName.slice( 1 );

      return `const set${controlledPropertyNameCapitalized} = newValue => {
        phet.paperLand.getModelComponent( '${controlledPropertyName}' ).value = newValue;  
      }
      `;
    } );
  }
}

export default ListenerCodeGenerator;