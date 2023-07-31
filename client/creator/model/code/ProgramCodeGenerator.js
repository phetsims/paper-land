import ControllerCodeGenerator from './ControllerCodeGenerator.js';
import ControllerComponentTemplates from './ControllerComponentTemplates.js';
import ModelComponentTemplates from './ModelTemplates.js';
import programTemplate from './programTemplate.js';
import ViewComponentTemplates from './ViewComponentTemplates.js';

export default class ProgramCodeGenerator {
  static convertToCode( program ) {
    const data = {
      TITLE: program.titleProperty.value,
      KEYWORDS: program.keywordsProperty.value,
      DESCRIPTION: program.descriptionProperty.value,
      NUMBER: program.number,
      NAME: program.titleProperty.value,
      PROGRAM_ADDED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramAdded' ),
      PROGRAM_REMOVED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramRemoved' ),
      PROGRAM_CHANGED_POSITION_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramChangedPosition' )
    };

    return ProgramCodeGenerator.fillInTemplate( programTemplate, data );
  }

  /**
   * Fill in the template with teh data. The template is expected to have
   * variables surrounded by double curly braces, e.g. {{VARIABLE_NAME}}. The
   * data is a map of variable names to values. Variable names in the data
   */
  static fillInTemplate( template, data ) {
    return template.replace( /\{\{(\w+)\}\}/g, ( match, placeholder ) => {

      // Use the nullish coalescing operator to check if the value exists and is not null/undefined
      return data[ placeholder ] ?? '';
    } );
  }

  /**
   * Format the provided string for the Monaco editor. The output of monaco includes `\r\n` for newlines, but
   * if the \r is included in an INPUT string for a monaco editor, the React component breaks.
   * TODO: Could also add more prettify here too?
   *
   * @param codeString
   */
  static formatStringForMonaco( codeString ) {
    return codeString.replace( /\r\n/g, '\n' );
  }

  static createProgramEventCode( program, eventName ) {

    const modelCode = ProgramCodeGenerator.createProgramEventCodeForModelComponent( program, eventName );
    const viewCode = ProgramCodeGenerator.createProgramEventCodeForViewComponent( program, eventName );
    const controllerCode = ProgramCodeGenerator.createProgramEventCodeForControllerComponent( program, eventName );

    return ProgramCodeGenerator.combineCodeList( [ modelCode, viewCode, controllerCode ] );
  }

  static createProgramEventCodeForModelComponent( program, eventName ) {

    // Convert each component to its onProgramAdded code
    // TODO: This will have to do independent, derived, controllers, views, in that order
    const codeList = program.modelContainer.allComponents.map( modelComponent => {
      const componentType = modelComponent.propertyType;
      const componentName = modelComponent.nameProperty.value;
      const componentData = ProgramCodeGenerator.getModelComponentData( modelComponent );

      if ( !ModelComponentTemplates[ componentType ] ) {
        throw new Error( `${componentType} is not a supported model component for code generation.` );
      }
      const template = ModelComponentTemplates[ componentType ][ eventName ];
      if ( template ) {
        return ProgramCodeGenerator.fillInTemplate( template, {
          NAME: componentName,
          ...componentData
        } );
      }
      else {
        return '';
      }
    } );

    return ProgramCodeGenerator.combineCodeList( codeList );
  }

  static createProgramEventCodeForViewComponent( program, eventName ) {
    const codeList = program.viewContainer.allComponents.map( viewComponent => {

      const componentType = viewComponent.constructor.name;

      if ( !ViewComponentTemplates[ componentType ] ) {
        throw new Error( `${componentType} is not supported yet for code generation` );
      }
      const template = ViewComponentTemplates[ componentType ][ eventName ];
      if ( template ) {
        const componentData = ProgramCodeGenerator.getViewComponentData( viewComponent );

        return ProgramCodeGenerator.fillInTemplate( template, {
          NAME: viewComponent.nameProperty.value,
          DEPENDENCIES: viewComponent.modelComponentNames.map( name => {
            return `phet.paperLand.getModelComponent( '${name}' )`;
          } ).join( ', ' ),
          DEPENDENCY_ARGUMENTS: viewComponent.modelComponentNames.map( name => {
            return name;
          } ).join( ', ' ),
          CONTROL_FUNCTION: ProgramCodeGenerator.formatStringForMonaco( viewComponent.controlFunctionString ),
          ...componentData
        } );
      }
      else {
        return '';
      }
    } );

    return ProgramCodeGenerator.combineCodeList( codeList );
  }

  static createProgramEventCodeForControllerComponent( program, eventName ) {
    const codeList = program.controllerContainer.allComponents.map( controllerComponent => {
      const componentType = controllerComponent.constructor.name;

      if ( !ControllerComponentTemplates[ componentType ] ) {
        throw new Error( `${componentType} is not supported yet for code generation.` );
      }
      const template = ControllerComponentTemplates[ componentType ][ eventName ];
      if ( template ) {
        const componentData = ProgramCodeGenerator.getControllerComponentData( controllerComponent );
        return ProgramCodeGenerator.fillInTemplate( template, {
          NAME: controllerComponent.nameProperty.value,
          CONTROLLED_NAME: controllerComponent.namedProperty.nameProperty.value,
          ...componentData

        } );
      }
      else {
        return '';
      }
    } );

    return ProgramCodeGenerator.combineCodeList( codeList );
  }

  /**
   * Given a list of code for working with components, combine them all into
   * a single string separated by a new line.
   * @codeList {string[]}
   */
  static combineCodeList( codeList ) {
    return codeList.join( '\n' );
  }

  /**
   * Get an object for a template fillin operation with keys and values that are specific to the component type.
   */
  static getModelComponentData( modelComponent ) {
    let data = {};
    if ( modelComponent.propertyType === 'BooleanProperty' ) {
      data = {
        DEFAULT_VALUE: modelComponent.defaultValue
      };
    }
    else if ( modelComponent.propertyType === 'NumberProperty' ) {
      data = {
        DEFAULT_VALUE: modelComponent.defaultValue,
        MIN: modelComponent.min,
        MAX: modelComponent.max
      };
    }
    else if ( modelComponent.propertyType === 'Vector2Property' ) {
      data = {
        DEFAULT_X: modelComponent.defaultX,
        DEFAULT_Y: modelComponent.defaultY
      };
    }
    else if ( modelComponent.propertyType === 'StringProperty' ) {
      data = {
        DEFAULT_VALUE: modelComponent.defaultValue,
        VALUES: modelComponent.values.join( ', ' )
      };
    }
    else if ( modelComponent.propertyType === 'DerivedProperty' ) {
      data = {

        // Each dependency name, wrapped in the getter that will return a Property instance in
        // a comma separated list - the template will wrap this in array brackets
        DEPENDENCIES: modelComponent.dependencyNames.map( name => {
          return `phet.paperLand.getModelComponent( '${name}' )`;
        } ).join( ', ' ),
        DEPENDENCY_ARGUMENTS: modelComponent.dependencyNames.map( name => {
          return name;
        } ).join( ', ' ),
        DERIVATION: ProgramCodeGenerator.formatStringForMonaco( modelComponent.derivation )
      };
    }
    else if ( modelComponent.propertyType === 'Sound' ) {
      data = {
        FILE_NAME: modelComponent.soundUrl
      };
    }
    else {
      throw new Error( `Could not get model data for component ${modelComponent.propertyType} during code generation.` );
    }

    return data;
  }

  static getViewComponentData( viewComponent ) {
    const componentType = viewComponent.constructor.name;
    let data = {};
    if ( componentType === 'SoundViewComponent' ) {
      data = {
        FILE_NAME: viewComponent.soundFileName
      };
    }
    else if ( componentType === 'DescriptionViewComponent' ) {

      // No extra data for description components yet.
      data = {};
    }
    else {
      throw new Error( `View component ${componentType} is not supported yet for code generation.` );
    }

    return data;
  }

  static getControllerComponentData( controllerComponent ) {
    const componentType = controllerComponent.constructor.name;
    let data = {};
    if ( componentType === 'NumberPropertyController' ) {
      data = {
        GET_CONTROL_VALUE: ControllerCodeGenerator.getNumberControllerValueGetter( controllerComponent.controlType )
      };
    }
    else {
      throw new Error( `Error generating code for controller ${componentType}` );
    }

    return data;
  }
}