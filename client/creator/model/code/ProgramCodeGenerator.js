import ControllerCodeGenerator from './ControllerCodeGenerator.js';
import ControllerComponentTemplates from './ControllerComponentTemplates.js';
import ListenerCodeGenerator from './ListenerCodeGenerator.js';
import ListenerComponentTemplates from './ListenerComponentTemplates.js';
import ModelComponentTemplates from './ModelTemplates.js';
import programTemplate from './programTemplate.js';
import ShapeCodeFunctions from './ShapeCodeFunctions.js';
import ViewCodeGenerator from './ViewCodeGenerator.js';
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
      PROGRAM_CHANGED_POSITION_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramChangedPosition' ),
      PROGRAM_MARKERS_ADDED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramMarkersAdded' ),
      PROGRAM_MARKERS_REMOVED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramMarkersRemoved' ),
      PROGRAM_MARKERS_CHANGED_POSITION_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramMarkersChangedPosition' ),
      PROGRAM_ADJACENT_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramAdjacent' ),
      PROGRAM_SEPARATED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramSeparated' )
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

      // For translation, we want to insert undefined so that there isn't an unexpected translation to the origin
      if ( placeholder === 'CENTER_X' || placeholder === 'CENTER_Y' ) {
        return data[ placeholder ] || 'undefined';
      }
      else {

        // Use the nullish coalescing operator to check if the value exists and is not null/undefined
        return data[ placeholder ] ?? '';
      }
    } );
  }

  /**
   * Given an array of depenency names for a component, turns it into a string that represents
   * an array of those strings. Useful for passing arguments to a multilink for generated code.
   *
   * [ 'bool', 'number', 'value' ] => "[ 'bool', 'number', 'value' ]"
   *
   * @param {string[]} dependencyNames
   * @returns {string}
   */
  static dependencyNamesArrayToCodeString( dependencyNames ) {
    return '[ ' + dependencyNames.map( name => `'${name}'` ).join( ', ' ) + ' ]';
  }

  /**
   * Given an array of dependency string names, returns a single string containing each name in quotes,
   * to be used in other code.
   *
   * [ 'bool', 'number', 'value' ] => "'bool', 'number', 'value'"
   *
   * @param {string[]} dependencyNames
   * @returns {string}
   */
  static dependencyNamesToStringList( dependencyNames ) {
    return dependencyNames.map( name => `'${name}'` ).join( ', ' );
  }

  /**
   * Converts an array of string names to a string that separates them by commas. Uesful
   * for code generation when dependency names are to be used in a callback function.
   *
   * [ 'bool', 'number', 'value' ] => "bool, number, value"
   *
   * @param {string[]} dependencyNames
   * @returns {string}
   */
  static dependencyNamesToArgumentsListString( dependencyNames ) {
    return dependencyNames.join( ', ' );
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
    const listenerCode = ProgramCodeGenerator.createProgramEventCodeForListenerComponent( program, eventName );
    const customCode = ProgramCodeGenerator.createProgramEventCodeForCustomCode( program, eventName );

    return ProgramCodeGenerator.combineCodeList( [ modelCode, viewCode, controllerCode, listenerCode, customCode ] );
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
        throw new Error( `${componentType} view is not supported yet for code generation` );
      }
      const template = ViewComponentTemplates[ componentType ][ eventName ];
      if ( template ) {
        const componentData = ProgramCodeGenerator.getViewComponentData( viewComponent );

        return ProgramCodeGenerator.fillInTemplate( template, {
          NAME: viewComponent.nameProperty.value,
          DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( viewComponent.modelComponentNames ),
          DEPENDENCY_ARGUMENTS: ProgramCodeGenerator.dependencyNamesToArgumentsListString( viewComponent.modelComponentNames ),
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
        throw new Error( `${componentType} controller is not supported yet for code generation.` );
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
   * Create program code for the listener components.
   */
  static createProgramEventCodeForListenerComponent( program, eventName ) {
    const codeList = program.listenerContainer.allComponents.map( listenerComponent => {
      const componentType = listenerComponent.constructor.name;

      if ( !ListenerComponentTemplates[ componentType ] ) {
        throw new Error( `${componentType} listener is not supported yet for code generation.` );
      }
      const template = ListenerComponentTemplates[ componentType ][ eventName ];
      if ( template ) {
        const componentData = ProgramCodeGenerator.getListenerComponentData( listenerComponent );
        const controlFunctions = ProgramCodeGenerator.combineCodeList( ListenerCodeGenerator.getComponentSetterFunctions( listenerComponent.controlledPropertyNames ) );

        return ProgramCodeGenerator.fillInTemplate( template, {
          NAME: listenerComponent.nameProperty.value,

          // the available functions to control existing model components
          CONTROL_FUNCTIONS: controlFunctions,

          // the function that the user wrote to change values
          CONTROL_FUNCTION: ProgramCodeGenerator.formatStringForMonaco( listenerComponent.controlFunctionString ),

          // additional component-specific data
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
   * Retrieve the custom code that the user may have written for a particular event type.
   */
  static createProgramEventCodeForCustomCode( program, eventName ) {
    let programCode = '';

    if ( eventName === 'onProgramAdded' ) {
      programCode = program.customCodeContainer.onProgramAddedCodeProperty.value;
    }
    else if ( eventName === 'onProgramRemoved' ) {
      programCode = program.customCodeContainer.onProgramRemovedCodeProperty.value;
    }
    else if ( eventName === 'onProgramChangedPosition' ) {
      programCode = program.customCodeContainer.onProgramChangedPositionCodeProperty.value;
    }
    else if ( eventName === 'onProgramMarkersAdded' ) {
      programCode = program.customCodeContainer.onProgramMarkersAddedCodeProperty.value;
    }
    else if ( eventName === 'onProgramMarkersRemoved' ) {
      programCode = program.customCodeContainer.onProgramMarkersRemovedCodeProperty.value;
    }
    else if ( eventName === 'onProgramMarkersChangedPosition' ) {
      programCode = program.customCodeContainer.onProgramMarkersChangedPositionCodeProperty.value;
    }
    else if ( eventName === 'onProgramAdjacent' ) {
      programCode = program.customCodeContainer.onProgramAdjacentCodeProperty.value;
    }
    else if ( eventName === 'onProgramSeparated' ) {
      programCode = program.customCodeContainer.onProgramSeparatedCodeProperty.value;
    }

    return programCode;
  }

  /**
   * Given a list of code for working with components, combine them all into
   * a single string separated by a new line.
   * @codeList {string[]}
   */
  static combineCodeList( codeList ) {

    // Don't add extra new lines for empty strings
    return codeList.filter( entry => entry !== '' ).join( '\n' );
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

        // wrap each value individually in quotes before comma separating for the validValues
        // option
        VALUES: modelComponent.values.map( value => `'${value}'` ).join( ', ' )
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
        FILE_NAME: viewComponent.soundFileName,
        LOOP: viewComponent.loop
      };
    }
    else if ( componentType === 'DescriptionViewComponent' ) {

      // No extra data for description components yet.
      data = {};
    }
    else if ( componentType === 'ShapeViewComponent' ) {

      // No extra data for shape components yet.
      data = {
        SHAPE_CREATOR_CODE: ShapeCodeFunctions.createShapeCodeFromOptions( viewComponent.nameProperty.value, viewComponent.defaultShapeOptions ),
        CONTROL_FUNCTIONS: ViewCodeGenerator.getSetterFunctionsForViewType( componentType, viewComponent.nameProperty.value ),
        FILL_COLOR: viewComponent.defaultShapeOptions.fill,
        STROKE_COLOR: viewComponent.defaultShapeOptions.stroke,
        LINE_WIDTH: viewComponent.defaultShapeOptions.lineWidth,

        // Node view options
        CENTER_X: viewComponent.defaultViewOptions.centerX,
        CENTER_Y: viewComponent.defaultViewOptions.centerY,
        SCALE: viewComponent.defaultViewOptions.scale,
        ROTATION: viewComponent.defaultViewOptions.rotation,
        OPACITY: viewComponent.defaultViewOptions.opacity
      };
    }
    else if ( componentType === 'TextViewComponent' ) {

      // no extra data for text components yet.
      data = {
        CONTROL_FUNCTIONS: ViewCodeGenerator.getSetterFunctionsForViewType( componentType )
      };
    }
    else if ( componentType === 'BackgroundViewComponent' ) {

      // No extra data for background components yet.
      data = {};
    }
    else if ( componentType === 'ImageViewComponent' ) {
      data = {
        FILE_NAME: viewComponent.imageFileName
      };
    }
    else {
      throw new Error( `View component ${componentType} is not supported yet for code generation.` );
    }

    return data;
  }

  static getListenerComponentData( listenerComponent ) {
    const componentType = listenerComponent.constructor.name;
    let data = {};

    if ( componentType === 'AnimationListenerComponent' ) {
      data = {
        COMPONENT_REFERENCES: ListenerCodeGenerator.getComponentReferences( listenerComponent.controlledPropertyNames ),
        DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( listenerComponent.controlledPropertyNames )
      };
    }
    else if ( componentType === 'MultilinkListenerComponent' ) {
      data = {
        DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( listenerComponent.dependencyNames ),
        DEPENDENCY_ARGUMENTS: ProgramCodeGenerator.dependencyNamesToArgumentsListString( listenerComponent.dependencyNames )
      };
    }
    else {
      throw new Error( 'Unknown component type for getting listener data.' );
    }

    return data;
  }

  static getControllerComponentData( controllerComponent ) {
    const componentType = controllerComponent.constructor.name;
    const controlledName = controllerComponent.namedProperty.nameProperty.value;
    let data = {};
    if ( componentType === 'NumberPropertyController' ) {
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getNumberControllerChangedPositionCode(
          controllerComponent.controlType,
          controllerComponent.relationshipControlType,
          controlledName
        )
      };
    }
    else if ( componentType === 'BooleanPropertyController' ) {

      // Different controller types will have different code for setting the value of the component.
      // Look up the code that should be used for each event for the provided control type.
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getBooleanControllerChangedPositionCode( controllerComponent.controlType, controlledName ),
        PROGRAM_MARKERS_ADDED_CODE: ControllerCodeGenerator.getBooleanControllerMarkersAddedCode( controllerComponent.controlType, controlledName ),
        PROGRAM_MARKERS_REMOVED_CODE: ControllerCodeGenerator.getBooleanControllerMarkersRemovedCode( controllerComponent.controlType, controlledName )
      };
    }
    else if ( componentType === 'Vector2PropertyController' ) {
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getVector2ControllerChangedPositionCode( controllerComponent.controlType, controlledName )
      };
    }
    else if ( componentType === 'EnumerationPropertyController' ) {
      const enumerationValues = controllerComponent.namedProperty.values;
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getEnumerationControllerChangedPositionCode( controllerComponent.controlType, controlledName, enumerationValues ),
        PROGRAM_MARKERS_ADDED_CODE: ControllerCodeGenerator.getEnumerationControllerMarkersChangedCode( controllerComponent.controlType, controlledName, enumerationValues ),
        PROGRAM_MARKERS_REMOVED_CODE: ControllerCodeGenerator.getEnumerationControllerMarkersChangedCode( controllerComponent.controlType, controlledName, enumerationValues )
      };
    }
    else {
      throw new Error( `Error generating code for controller ${componentType}` );
    }

    return data;
  }
}