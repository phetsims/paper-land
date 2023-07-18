import ModelComponentTemplates from './ModelTemplates.js';
import programTemplate from './programTemplate.js';
import ViewComponentTemplates from './ViewComponentTemplates.js';

export default class ProgramCodeGenerator {
  static convertToCode( program ) {
    const data = {
      TITLE: program.titleProperty.value,
      KEYWORDS: program.keywordsProperty.value,
      DESCRIPTION: program.descriptionProperty.value,
      PROGRAM_ADDED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramAdded' ),
      PROGRAM_REMOVED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramRemoved' ),
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
      return data[ placeholder ] || '';
    } );
  }

  static createProgramEventCode( program, eventName ) {

    const modelCode = ProgramCodeGenerator.createProgramEventCodeForModelComponent( program, eventName );
    const viewCode = ProgramCodeGenerator.createProgramEventCodeForViewComponent( program, eventName );

    return ProgramCodeGenerator.combineCodeList( [ modelCode, viewCode ] );
  }

  static createProgramEventCodeForModelComponent( program, eventName ) {

    // Convert each component to its onProgramAdded code
    // TODO: This will have to do independent, derived, controllers, views, in that order
    const codeList = program.modelContainer.allComponents.map( modelComponent => {
      const componentType = modelComponent.propertyType;
      const componentName = modelComponent.nameProperty.value;
      const componentData = ProgramCodeGenerator.getModelComponentData( modelComponent );

      if ( !ModelComponentTemplates[ componentType ] ) {
        throw new Error( 'Component type does not exist in templatesObject.' );
      }
      const template = ModelComponentTemplates[ componentType ][ eventName ];
      if ( !template ) {
        throw new Error( 'Event name does not exist in ModelComponentTemplates.' );
      }

      return ProgramCodeGenerator.fillInTemplate( template, {
        NAME: componentName,
        ...componentData
      } );
    } );

    return ProgramCodeGenerator.combineCodeList( codeList );
  }

  static createProgramEventCodeForViewComponent( program, eventName ) {
    const codeList = program.viewContainer.allComponents.map( viewComponent => {

      const componentType = viewComponent.constructor.name;

      if ( !ViewComponentTemplates[ componentType ] ) {
        throw new Error( 'Component type does not exist in ViewComponentTemplates.' );
      }
      const template = ViewComponentTemplates[ componentType ][ eventName ];
      if ( !template ) {
        throw new Error( 'Event name does not exist in ViewComponentTemplates.' );
      }

      const componentData = ProgramCodeGenerator.getViewComponentData( viewComponent );

      return ProgramCodeGenerator.fillInTemplate( template, {
        NAME: viewComponent.nameProperty.value,
        ...componentData
      } );
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
          return `phet.paperLand.getModelComponent( ${name} )`;
        } ).join( ', ' ),
        DEPENDENCY_ARGUMENTS: modelComponent.dependencyNames.map( name => {
          return name;
        } ).join( ', ' ),
        DERIVATION: modelComponent.derivation
      };
    }
    else if ( modelComponent.propertyType === 'Sound' ) {
      data = {
        FILE_NAME: modelComponent.soundUrl
      };
    }
    else {
      throw new Error( 'Could not get data for component propertyType' );
    }

    return data;
  }

  getViewComponentData( viewComponent ) {
    const componentType = viewComponent.constructor.name;
    let data = {};
    if ( componentType === 'SoundViewComponent' ) {
      data = {
        FILE_NAME: viewComponent.soundFileName,
        CONTROL_FUNCTION: viewComponent.controlFunctionString
      };
    }
    else {
      throw new Error( 'Could not get data for component type' );
    }

    return data;
  }
}