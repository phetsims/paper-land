/**
 * The main file for code generation. Converts a program into a string of code that can be run in the Paper Land.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ControllerCodeGenerator from './ControllerCodeGenerator.js';
import ControllerComponentTemplates from './ControllerComponentTemplates.js';
import ListenerCodeGenerator from './ListenerCodeGenerator.js';
import ListenerComponentTemplates from './ListenerComponentTemplates.js';
import ModelComponentTemplates from './ModelTemplates.js';
import ProgramCodeValidator from './ProgramCodeValidator.js';
import programTemplate from './programTemplate.js';
import ShapeCodeFunctions from './ShapeCodeFunctions.js';
import ViewCodeGenerator from './ViewCodeGenerator.js';
import ViewComponentTemplates from './ViewComponentTemplates.js';

export default class ProgramCodeGenerator {
  static async convertToCode( program ) {
    const data = {

      // metadata
      TITLE: ProgramCodeGenerator.replaceNewLinesForCodeComments( program.titleProperty.value ),
      KEYWORDS: ProgramCodeGenerator.replaceNewLinesForCodeComments( program.keywordsProperty.value ),
      DESCRIPTION: ProgramCodeGenerator.replaceNewLinesForCodeComments( program.descriptionProperty.value ),
      TOP_WHISKER_LENGTH: program.topWhiskerLengthProperty.value,
      RIGHT_WHISKER_LENGTH: program.rightWhiskerLengthProperty.value,
      BOTTOM_WHISKER_LENGTH: program.bottomWhiskerLengthProperty.value,
      LEFT_WHISKER_LENGTH: program.leftWhiskerLengthProperty.value,
      NUMBER: program.number,
      NAME: program.titleProperty.value,

      // generated code for components
      PROGRAM_ADDED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramAdded' ),
      PROGRAM_REMOVED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramRemoved' ),
      PROGRAM_CHANGED_POSITION_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramChangedPosition' ),
      PROGRAM_MARKERS_ADDED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramMarkersAdded' ),
      PROGRAM_MARKERS_REMOVED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramMarkersRemoved' ),
      PROGRAM_MARKERS_CHANGED_POSITION_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramMarkersChangedPosition' ),
      PROGRAM_ADJACENT_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramAdjacent' ),
      PROGRAM_SEPARATED_CODE: ProgramCodeGenerator.createProgramEventCode( program, 'onProgramSeparated' )
    };

    const generatedCode = ProgramCodeGenerator.fillInTemplate( programTemplate, data );

    // Use acorn to look for syntax errors before returning the generated code.
    try {
      await ProgramCodeValidator.validate( generatedCode, program.number );
      return generatedCode;
    }
    catch( error ) {
      console.log( generatedCode );
      throw new Error( error.message );
    }
  }

  /**
   * Given a string that has line breaks in code comments, pad the line breaks with
   * forward slashes so that the content doesn't leave the code comment.
   * This function assumes that the input string starts with a comment.
   * @param string
   */
  static replaceNewLinesForCodeComments( string ) {

    // Split the string into lines
    const lines = string.split( '\n' );

    // Map each line to ensure it starts with '// '
    return lines.map( ( line, index ) => {

      // Don't add '// ' to the first line as it's assumed to already be a comment
      if ( index === 0 ) {
        return line;
      }

      // Add '// ' to the beginning of each subsequent line
      return '// ' + line;
    } ).join( '\n' );
  }

  /**
   * Given a placeholder value, this is the default value we will fall back to in case the user provided
   * an empty or bad value.
   *
   * In general, we shouldn't hit this case and validation in the form should prevent a user from entering an
   * invalid value. But this supports a graceful fallback.
   *
   * TODO: Consider moving this to the components themselves?
   * TODO: Consider factoring out the placeholder names into constants or a map.
   */
  static getDefaultValueForPlaceholder( placeholder ) {
    if ( placeholder === 'CENTER_X' || placeholder === 'CENTER_Y' ) {

      // For translation, we want to insert undefined so that there isn't an unexpected translation to the origin
      return 'undefined';
    }
    else if ( placeholder === 'SCALE' || placeholder === 'OPACITY' ) {
      return 1;
    }
    else if ( placeholder === 'ROTATION' ) {
      return 0;
    }
    else {

      // For all other templates (mostly non-Node options), we will just use an empty string
      return '';
    }
  }

  /**
   * Fill in the template with teh data. The template is expected to have
   * variables surrounded by double curly braces, e.g. {{VARIABLE_NAME}}. The
   * data is a map of variable names to values. Variable names in the data
   */
  static fillInTemplate( template, data ) {
    return template.replace( /\{\{(\w+)\}\}/g, ( match, placeholder ) => {
      const defaultValue = ProgramCodeGenerator.getDefaultValueForPlaceholder( placeholder );

      if ( defaultValue ) {

        // There is a default value for empty and falsey values, so use that
        return data[ placeholder ] || defaultValue;
      }
      else {

        // Use the nullish coalescing operator to check if the value exists and is not null/undefined (letting 0
        // and falsy values through)
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

        // Distribute model components into reference components and dependencies. Reference components
        // are available as references but are not dependencies of the multilink. The dependencies are
        // all the model components that are not reference components.
        const referenceNames = viewComponent.referenceComponentNames;
        const dependencyNames = viewComponent.modelComponentNames.filter( name => !referenceNames.includes( name ) );

        // Convert the referenceNames into a series of const variable declarations
        const referenceNamesCode = referenceNames.map( name => `const ${name} = phet.paperLand.getModelComponent('${name}').value;` ).join( '\n' );

        const usableControlFunction = ProgramCodeGenerator.modifyControlFunction( viewComponent.controlFunctionString );

        return ProgramCodeGenerator.fillInTemplate( template, {
          NAME: viewComponent.nameProperty.value,
          DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( dependencyNames ),
          DEPENDENCY_ARGUMENTS: ProgramCodeGenerator.dependencyNamesToArgumentsListString( dependencyNames ),
          REFERENCE_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( referenceNames ),
          REFERENCE_DECLARATIONS: referenceNamesCode,
          CONTROL_FUNCTION: ProgramCodeGenerator.formatStringForMonaco( usableControlFunction ),
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

    return this.formatStringForMonaco( programCode );
  }

  /**
   * This function does a bit of extra work around the control function provided by the user. For example,
   * we need setImage view function to be async, but we don't force the user to write await in their code.
   * Instead, await is added here.
   *
   * @param controlFunctionString
   * @return {string}
   */
  static modifyControlFunction( controlFunctionString ) {

    // Add an await before each of the user's setImage calls so that we wait for the image to load before
    // doing other work like positioning it.
    return controlFunctionString.replace( /setImage/g, 'await setImage' );
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
    else if ( modelComponent.propertyType === 'Bounds2Property' ) {
      data = {
        DEFAULT_MIN_X: modelComponent.defaultMinX,
        DEFAULT_MIN_Y: modelComponent.defaultMinY,
        DEFAULT_MAX_X: modelComponent.defaultMaxX,
        DEFAULT_MAX_Y: modelComponent.defaultMaxY
      };
    }
    else if ( modelComponent.propertyType === 'EnumerationProperty' ) {
      data = {
        DEFAULT_VALUE: modelComponent.defaultValue,

        // wrap each value individually in quotes before comma separating for the validValues
        // option
        VALUES: modelComponent.values.map( value => `'${value}'` ).join( ', ' )
      };
    }
    else if ( modelComponent.propertyType === 'DerivedProperty' ) {
      data = {

        // Each dependency name, wrapped in the getter that will return a Property instance in a comma separated list
        DEPENDENCIES: ProgramCodeGenerator.dependencyNamesArrayToCodeString( modelComponent.dependencyNames ),
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
    else if ( modelComponent.propertyType === 'ObservableArray' ) {

      // No extra data for observable arrays yet.
      data = {};
    }
    else if ( modelComponent.propertyType === 'ArrayItem' ) {

      // All names of the model components that are added to the array in an object.
      const dependencyNames = modelComponent.itemSchema.map( item => item.component.nameProperty.value );

      // Add the array itself as a dependency so that items are added when the array is available.
      const arrayComponent = modelComponent.arrayComponent;
      if ( !arrayComponent ) {
        throw new Error( `ArrayItem ${modelComponent.nameProperty.value} does not have an array component.` );
      }

      const arrayName = arrayComponent.nameProperty.value;
      dependencyNames.push( arrayName );

      const arrayAddedItemReferenceName = arrayComponent.arrayAddedItemReference ? arrayComponent.arrayAddedItemReference.nameProperty.value : '';
      const arrayRemovedItemReferenceName = arrayComponent.arrayRemovedItemReference ? arrayComponent.arrayRemovedItemReference.nameProperty.value : '';

      // Create the key-value pair object as a string that will actually be put into the array.
      let itemDataString = '{ \n';
      modelComponent.itemSchema.forEach( ( item, index ) => {
        const itemComponentName = item.component.nameProperty.value;

        // Add a reference to the latest value so we can use it in the getter - this needs to be updated every time
        // ANY depdendent component changes, so that the getter always returns the latest value. We cannot use
        // the getter directly because the model component may be removed and we still need the last value for
        // those callbacks.
        itemDataString += `_latest_${item.entryName}: phet.paperLand.getModelComponent('${itemComponentName}').value,\n`;

        // Define the getter for the property
        itemDataString += `get ${item.entryName}() { return this._latest_${item.entryName}; },\n`;

        // Define the setter for the property
        itemDataString += `set ${item.entryName}(newValue) { phet.paperLand.getModelComponent('${itemComponentName}').value = newValue; }`;

        if ( index < modelComponent.itemSchema.length - 1 ) {
          itemDataString += ',';
        }
        itemDataString += '\n';
      } );
      itemDataString += ' }';


      const itemObjectName = `${modelComponent.nameProperty.value}ItemObject`;

      let updateItemDataString = '';
      modelComponent.itemSchema.forEach( ( item, index ) => {
        const itemComponentName = item.component.nameProperty.value;
        updateItemDataString += `${itemObjectName}._latest_${item.entryName} = phet.paperLand.getModelComponent('${itemComponentName}').value;\n`;
      } );

      data = {
        DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( dependencyNames ),
        DEPENDENCY_ARGUMENTS: ProgramCodeGenerator.dependencyNamesToArgumentsListString( dependencyNames ),
        ITEM_OBJECT_NAME: itemObjectName,
        ITEM_OBJECT: itemDataString,
        ITEM_OBJECT_UPDATE: updateItemDataString,
        ARRAY_NAME: arrayName,
        ADDED_ITEM_REFERENCE_NAME: arrayAddedItemReferenceName,
        REMOVED_ITEM_REFERENCE_NAME: arrayRemovedItemReferenceName
      };
    }
    else if ( modelComponent.propertyType === 'NamedArrayItemReference' ) {

      // No data for the array item reference
      data = {};
    }
    else if ( modelComponent.propertyType === 'StringProperty' ) {

      // The string component just has a default value
      data = {
        DEFAULT_VALUE: modelComponent.defaultValue
      };
    }
    else {
      throw new Error( `Could not get model data for component ${modelComponent.propertyType} during code generation.` );
    }

    return data;
  }

  static formatFileNameForCode( fileName ) {

    // Remove a leading '/' if it is there, we fill in the path in the template
    return fileName.startsWith( '/' ) ? fileName.slice( 1 ) : fileName;
  }

  static getViewComponentData( viewComponent ) {
    const componentType = viewComponent.constructor.name;
    let data = {};
    if ( componentType === 'SoundViewComponent' ) {
      const soundFileName = ProgramCodeGenerator.formatFileNameForCode( viewComponent.soundFileName );
      data = {
        FILE_NAME: soundFileName,
        LOOP: viewComponent.loop,
        AUTOPLAY: viewComponent.autoplay
      };
    }
    else if ( componentType === 'SpeechViewComponent' ) {

      // If lazy, we wait to speak something until the paper is added.
      data = {
        LAZY: viewComponent.lazyLink,
        CONTROL_FUNCTIONS: ViewCodeGenerator.getSetterFunctionsForViewType( componentType, viewComponent.nameProperty.value, {} )
      };
    }
    else if ( componentType === 'ShapeViewComponent' ) {

      // The line component does not support centering options. If the line is centered the end point positions
      // are complicated and confusing to set in the control function.
      const skipCenterOptions = viewComponent.defaultShapeOptions.shapeType === 'line';

      data = {
        SHAPE_CREATOR_CODE: ShapeCodeFunctions.createShapeCodeFromOptions( viewComponent.nameProperty.value, viewComponent.defaultShapeOptions, viewComponent.defaultViewOptions ),
        CONTROL_FUNCTIONS: ViewCodeGenerator.getSetterFunctionsForViewType( componentType, viewComponent.nameProperty.value, viewComponent.defaultViewOptions ),
        FILL_COLOR: viewComponent.defaultShapeOptions.fill,
        STROKE_COLOR: viewComponent.defaultShapeOptions.stroke,
        LINE_WIDTH: viewComponent.defaultShapeOptions.lineWidth,

        // Node view options
        CENTER_X: skipCenterOptions ? 'undefined' : viewComponent.defaultViewOptions.centerX,
        CENTER_Y: skipCenterOptions ? 'undefined' : viewComponent.defaultViewOptions.centerY,
        SCALE: viewComponent.defaultViewOptions.scale,
        ROTATION: viewComponent.defaultViewOptions.rotation,
        OPACITY: viewComponent.defaultViewOptions.opacity,
        VIEW_UNITS: viewComponent.defaultViewOptions.viewUnits
      };
    }
    else if ( componentType === 'TextViewComponent' ) {
      data = {
        CONTROL_FUNCTIONS: ViewCodeGenerator.getSetterFunctionsForViewType( componentType, viewComponent.nameProperty.value, viewComponent.defaultViewOptions || {} )
      };
    }
    else if ( componentType === 'BackgroundViewComponent' ) {

      // No extra data for background components yet.
      data = {
        FILL_COLOR: viewComponent.fillColor
      };
    }
    else if ( componentType === 'ImageViewComponent' ) {
      data = {
        FILE_NAME: ProgramCodeGenerator.formatFileNameForCode( viewComponent.imageFileName ),
        CONTROL_FUNCTIONS: ViewCodeGenerator.getSetterFunctionsForViewType( componentType, viewComponent.nameProperty.value, viewComponent.defaultViewOptions )
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

      // The components that should be used by the multilink but are not added as Multilink dependencies
      const referenceComponentNames = listenerComponent.referenceComponentNames;

      // The actual multilink dependencies are the component dependencies list without the referenceComponentNames
      const dependencyNames = listenerComponent.dependencyNames.filter( name => !referenceComponentNames.includes( name ) );

      // The controlled component names should be included in the reference components, so that their current values
      // can be used in the callback.
      const fullListOfReferenceNames = referenceComponentNames.concat( listenerComponent.controlledPropertyNames );


      data = {

        // The block of code that will get references to all model components that are not actual dependencies
        // of the multilink (reference components and controlled components)
        COMPONENT_REFERENCES: ListenerCodeGenerator.getComponentReferences( fullListOfReferenceNames ),

        // The combined list of names that must be present to use the callback, but aren't included in multilink
        // dependencies, so the generated code needs to manually verify that all of these are present
        CONTROLLED_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( fullListOfReferenceNames ),

        // The dependencies will be made available by the multilink dependency names arguments.
        DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( dependencyNames ),
        DEPENDENCY_ARGUMENTS: ProgramCodeGenerator.dependencyNamesToArgumentsListString( dependencyNames )
      };
    }
    else if ( componentType === 'BluetoothListenerComponent' ) {

      // The components that should be used by the multilink but are not added as Multilink dependencies
      const referenceComponentNames = listenerComponent.referenceComponentNames;

      // The actual multilink dependencies are the component dependencies list without the referenceComponentNames
      const dependencyNames = listenerComponent.dependencyNames.filter( name => !referenceComponentNames.includes( name ) );

      // The controlled component names should be included in the reference components, so that their current values
      // can be used in the callback.
      const fullListOfReferenceNames = referenceComponentNames.concat( listenerComponent.controlledPropertyNames );

      // Make sure that the list is unique (there may be overlap between controlledPropertyNames and
      // referenceComponentNames
      const uniqueListOfReferenceNames = [ ...new Set( fullListOfReferenceNames ) ];

      data = {
        DEPENDENCY_NAMES_ARRAY: ProgramCodeGenerator.dependencyNamesArrayToCodeString( dependencyNames ),
        DEPENDENCY_ARGUMENTS: ProgramCodeGenerator.dependencyNamesToArgumentsListString( dependencyNames ),

        // The block of code that actually gets the the controlled components from paper playground
        CONTROLLED_REFERENCES: ListenerCodeGenerator.getComponentReferences( uniqueListOfReferenceNames ),

        // A code block that gets the actual references to "reference" model components from the paper playground
        // model - these are compnoents that are used in the control function but are not dependencies of the
        // multilink.
        COMPONENT_REFERENCES: ListenerCodeGenerator.getComponentReferences( uniqueListOfReferenceNames ),

        // The list of references, so that the generated code can check that all of these are present before
        // running the control function. We don't get that for free since they are not dependencies of the multilink.
        COMPONENT_REFERENCES_NAMES: ProgramCodeGenerator.dependencyNamesArrayToCodeString( uniqueListOfReferenceNames ),

        // Read or write to the BLE characteristics?
        WRITE_TO_CHARACTERISTIC: listenerComponent.writeToCharacteristic,

        // Selected service and characteristic IDs for the device
        SERVICE_ID: listenerComponent.serviceId,
        CHARACTERISTIC_ID: listenerComponent.characteristicId
      };
    }
    else {
      throw new Error( 'Unknown component type for getting listener data.' );
    }

    return data;
  }

  static getControllerComponentData( controllerComponent ) {
    const componentName = controllerComponent.nameProperty.value;
    const componentType = controllerComponent.constructor.name;
    const controlledName = controllerComponent.namedProperty.nameProperty.value;

    let data = {};
    if ( componentType === 'NumberPropertyController' ) {
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getNumberControllerChangedPositionCode(
          controllerComponent.selectedControlTypeFamily,
          controllerComponent.controlType,
          controllerComponent.relationshipControlType,
          controlledName
        ),
        PROGRAM_MARKERS_ADDED_CODE: ControllerCodeGenerator.getNumberControllerMarkersAddedCode(
          controllerComponent.selectedControlTypeFamily,
          controllerComponent.controlType,
          controllerComponent.relationshipControlType,
          controlledName,
          controllerComponent.markerColor
        ),
        PROGRAM_MARKERS_REMOVED_CODE: ControllerCodeGenerator.getNumberControllerMarkersRemovedCode(
          controllerComponent.selectedControlTypeFamily,
          controllerComponent.controlType,
          controllerComponent.relationshipControlType,
          controlledName,
          controllerComponent.markerColor
        ),
        PROGRAM_MARKERS_CHANGED_POSITION_CODE: ControllerCodeGenerator.getNumberControllerMarkersChangedPositionCode(
          controllerComponent.selectedControlTypeFamily,
          controllerComponent.controlType,
          controllerComponent.relationshipControlType,
          controlledName,
          controllerComponent.markerColor
        ),
        PROGRAM_ADDED_CODE: ControllerCodeGenerator.getNumberControllerProgramAddedCode(
          componentName,
          controllerComponent.selectedControlTypeFamily,
          controllerComponent.controlType,
          controlledName,
          controllerComponent.markerColor
        ),
        PROGRAM_REMOVED_CODE: ControllerCodeGenerator.getNumberControllerProgramRemovedCode(
          componentName,
          controllerComponent.selectedControlTypeFamily,
          controllerComponent.controlType
        )
      };
    }
    else if ( componentType === 'BoundsPropertyController' ) {
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getBoundsControllerChangedPositionCode( controllerComponent.controlType, controlledName )
      };
    }
    else if ( componentType === 'BooleanPropertyController' ) {

      // Different controller types will have different code for setting the value of the component.
      // Look up the code that should be used for each event for the provided control type.
      data = {
        PROGRAM_CHANGED_POSITION_CODE: ControllerCodeGenerator.getBooleanControllerChangedPositionCode( controllerComponent.controlType, controlledName ),
        PROGRAM_MARKERS_ADDED_CODE: ControllerCodeGenerator.getBooleanControllerMarkersAddedCode( controllerComponent.controlType, controlledName, controllerComponent.markerColor ),
        PROGRAM_MARKERS_REMOVED_CODE: ControllerCodeGenerator.getBooleanControllerMarkersRemovedCode( controllerComponent.controlType, controlledName, controllerComponent.markerColor ),
        PROGRAM_ADJACENT_CODE: ControllerCodeGenerator.getBooleanControllerAdjacentCode( controllerComponent.controlType, controlledName, controllerComponent.whiskerConfiguration.otherPaperNumber ),
        PROGRAM_SEPARATED_CODE: ControllerCodeGenerator.getBooleanControllerSeparatedCode( controllerComponent.controlType, controlledName, controllerComponent.whiskerConfiguration.otherPaperNumber )
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