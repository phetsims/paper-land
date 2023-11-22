/**
 * Collection of model components for a single program, with functions to create them.
 */
import { enforceKeys } from '../../utils.js';
import ComponentContainer from './ComponentContainer.js';
import NamedBooleanProperty from './NamedBooleanProperty.js';
import NamedBounds2Property from './NamedBounds2Property.js';
import NamedDerivedProperty from './NamedDerivedProperty.js';
import NamedEnumerationProperty from './NamedEnumerationProperty.js';
import NamedNumberProperty from './NamedNumberProperty.js';
import NamedObservableArray from './NamedObservableArray.js';
import NamedVector2Property from './NamedVector2Property.js';

export default class ProgramModelContainer extends ComponentContainer {
  constructor() {
    super();

    // {ObservableArray<NamedProperty>}
    this.namedBooleanProperties = phet.axon.createObservableArray();
    this.namedVector2Properties = phet.axon.createObservableArray();
    this.namedNumberProperties = phet.axon.createObservableArray();
    this.namedEnumerationProperties = phet.axon.createObservableArray();
    this.namedDerivedProperties = phet.axon.createObservableArray();
    this.namedBounds2Properties = phet.axon.createObservableArray();
    this.namedObservableArrays = phet.axon.createObservableArray();
  }

  /**
   * Creates a NamedProperty with the provided name and BooleanProperty for this model.
   * @param {string} name
   * @param {boolean} defaultValue
   */
  addBooleanProperty( name, defaultValue ) {
    const newNamedProperty = new NamedBooleanProperty( name, defaultValue );
    this.namedBooleanProperties.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeBooleanProperty.bind( this ) );
  }

  /**
   * Remove a NamedProperty for the provided BooleanProperty
   * @param namedProperty
   */
  removeBooleanProperty( namedProperty ) {
    const booleanIndex = this.namedBooleanProperties.indexOf( namedProperty );
    assert && assert( booleanIndex > -1, 'Property does not exist and cannot be removed.' );
    this.namedBooleanProperties.splice( booleanIndex, 1 );
    this.removeFromAllComponents( namedProperty );
  }

  /**
   * Creates a Vector2Property for the model.
   */
  addVector2Property( name, x, y ) {
    const newNamedProperty = new NamedVector2Property( name, x, y );
    this.namedVector2Properties.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeVector2Property.bind( this ) );
  }

  /**
   * Removes a Vector2Property from the model.
   */
  removeVector2Property( namedProperty ) {
    const index = this.namedVector2Properties.indexOf( namedProperty );
    assert && assert( index > -1, 'Property does not exist and cannot be removed.' );
    this.namedVector2Properties.splice( index, 1 );
    this.removeFromAllComponents( namedProperty );
  }

  /**
   * Add a new NamedBounds2Property to this container.
   */
  addBounds2Property( name, minX, minY, maxX, maxY ) {
    const newNamedProperty = new NamedBounds2Property( name, minX, minY, maxX, maxY );
    this.namedBounds2Properties.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeBounds2Property.bind( this ) );
  }

  /**
   * Removes a NamedBounds2Property from this container.
   */
  removeBounds2Property( namedProperty ) {
    const index = this.namedBounds2Properties.indexOf( namedProperty );
    assert && assert( index > -1, 'Property does not exist and cannot be removed.' );
    this.namedBounds2Properties.splice( index, 1 );
    this.removeFromAllComponents( namedProperty );
  }

  /**
   * Adds a NamedObservableArray to this container with the provided name.
   */
  addObservableArray( name ) {
    const newNamedProperty = new NamedObservableArray( name );
    this.namedObservableArrays.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeObservableArray.bind( this ) );
  }

  /**
   * Remove the NamedObservableArray component from this container.
   * @param namedObservableArray
   */
  removeObservableArray( namedObservableArray ) {
    const index = this.namedObservableArrays.indexOf( namedObservableArray );
    assert && assert( index > -1, 'Property does not exist and cannot be removed.' );
    this.namedObservableArrays.splice( index, 1 );
    this.removeFromAllComponents( namedObservableArray );
  }

  /**
   * Creates a NumberProperty for the model.
   *
   * @param {string} name - Name for the Property
   * @param {number} min - min for the range
   * @param {number} max - max for the range
   * @param {number} value - default value for the Property
   */
  addNumberProperty( name, min, max, value ) {
    const newNamedProperty = new NamedNumberProperty( name, min, max, value );
    this.namedNumberProperties.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeNumberProperty.bind( this ) );
  }

  /**
   * Removes a NamedProperty (with a NumberProperty) from this container.
   * @param namedProperty
   *
   * @public
   */
  removeNumberProperty( namedProperty ) {
    const index = this.namedNumberProperties.indexOf( namedProperty );
    assert && assert( index > -1, 'Property does not exist and cannot be removed.' );
    this.namedNumberProperties.splice( index, 1 );
    this.removeFromAllComponents( namedProperty );
  }

  /**
   * Adds a Property representing a list of possible values to the model. Its actually a StringProperty,
   * I couldn't think of a way to create a proper phet.phetCore.Enumeration from a list of provided values
   * at runtime.
   * @param {string} name - name for the NamedProperty
   * @param {string[]} values - list of possible enumeration values
   *
   * @public
   */
  addEnumerationProperty( name, values ) {
    const newNamedProperty = new NamedEnumerationProperty( name, values, values[ 0 ] );
    this.namedEnumerationProperties.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeEnumerationProperty.bind( this ) );
  }

  /**
   * Removes the provided EnumerationProperty from the container.
   *
   * @public
   */
  removeEnumerationProperty( namedProperty ) {
    const index = this.namedEnumerationProperties.indexOf( namedProperty );
    assert && assert( index > -1, 'Property does not exist and cannot be removed.' );
    this.namedEnumerationProperties.splice( index, 1 );
    this.removeFromAllComponents( namedProperty );
  }

  /**
   * Add a DerivedProperty to this model container.
   * @param {string} name
   * @param {NamedProperty[]} dependencies
   * @param {string} derivation - a string form of the code to run when any of the dependencies change
   */
  addDerivedProperty( name, dependencies, derivation ) {
    const newNamedProperty = new NamedDerivedProperty(
      name,
      dependencies,
      derivation
    );
    this.namedDerivedProperties.push( newNamedProperty );
    this.addToAllComponents( newNamedProperty );

    this.registerChangeListeners( newNamedProperty, this.removeDerivedProperty.bind( this ) );
  }

  /**
   * Removes the provided NamedProperty with a DerivedProperty from this container.
   */
  removeDerivedProperty( namedProperty ) {
    const index = this.namedDerivedProperties.indexOf( namedProperty );
    assert && assert( index > -1, 'Property does not exist and cannot be removed.' );
    this.namedDerivedProperties.splice( index, 1 );
    this.removeFromAllComponents( namedProperty );
  }

  /**
   * Converts this to a JSON object to save to a database.
   */
  save() {
    return {
      namedBooleanProperties: this.namedBooleanProperties.map( namedProperty => namedProperty.save() ),
      namedVector2Properties: this.namedVector2Properties.map( namedProperty => namedProperty.save() ),
      namedNumberProperties: this.namedNumberProperties.map( namedProperty => namedProperty.save() ),
      namedEnumerationProperties: this.namedEnumerationProperties.map( namedProperty => namedProperty.save() ),
      namedDerivedProperties: this.namedDerivedProperties.map( namedProperty => namedProperty.save() ),
      namedBounds2Properties: this.namedBounds2Properties.map( namedProperty => namedProperty.save() ),
      namedObservableArrays: this.namedObservableArrays.map( namedProperty => namedProperty.save() )
    };
  }

  /**
   * Load the model components that are dependencies for other components - they can exist
   * in isolation and must be available before creating DerivedProperty components.
   */
  loadDependencyModelComponents( stateObject ) {

    // We need to be graceful in loading, because
    const namedBooleanProperties = stateObject.namedBooleanProperties || [];
    const namedVector2Properties = stateObject.namedVector2Properties || [];
    const namedNumberProperties = stateObject.namedNumberProperties || [];
    const namedEnumerationProperties = stateObject.namedEnumerationProperties || [];
    const namedBounds2Properties = stateObject.namedBounds2Properties || [];
    const namedObservableArrays = stateObject.namedObservableArrays || [];

    namedBooleanProperties.forEach( namedBooleanPropertyData => {
      enforceKeys( namedBooleanPropertyData, [ 'name', 'defaultValue' ], `Error during load for BooleanProperty, ${namedBooleanPropertyData.name}` );
      this.addBooleanProperty(
        namedBooleanPropertyData.name,
        namedBooleanPropertyData.defaultValue
      );
    } );
    namedVector2Properties.forEach( namedVector2PropertyData => {
      enforceKeys( namedVector2PropertyData, [ 'name', 'defaultX', 'defaultY' ], `Error during load for Vector2Property, ${namedVector2PropertyData.name}` );
      this.addVector2Property(
        namedVector2PropertyData.name,
        namedVector2PropertyData.defaultX,
        namedVector2PropertyData.defaultY
      );
    } );
    namedNumberProperties.forEach( namedNumberPropertyData => {
      enforceKeys( namedNumberPropertyData, [ 'name', 'min', 'max', 'defaultValue' ], `Error during load for NumberProperty, ${namedNumberPropertyData.name}` );
      this.addNumberProperty(
        namedNumberPropertyData.name,
        namedNumberPropertyData.min,
        namedNumberPropertyData.max,
        namedNumberPropertyData.defaultValue
      );
    } );
    namedEnumerationProperties.forEach( namedEnumerationPropertyData => {
      enforceKeys( namedEnumerationPropertyData, [ 'name', 'values' ], `Error during load for EnumerationProperty, ${namedEnumerationPropertyData.name}` );
      this.addEnumerationProperty(
        namedEnumerationPropertyData.name,
        namedEnumerationPropertyData.values
      );
    } );
    namedBounds2Properties.forEach( namedBounds2PropertyData => {
      enforceKeys( namedBounds2PropertyData, [ 'name', 'defaultMinX', 'defaultMinY', 'defaultMaxX', 'defaultMaxY' ], `Error during load for Bounds2Property, ${namedBounds2PropertyData.name}` );
      this.addBounds2Property(
        namedBounds2PropertyData.name,
        namedBounds2PropertyData.defaultMinX,
        namedBounds2PropertyData.defaultMinY,
        namedBounds2PropertyData.defaultMaxX,
        namedBounds2PropertyData.defaultMaxY
      );
    } );
    namedObservableArrays.forEach( namedObservableArray => {
      this.addObservableArray( namedObservableArray.name );
    } );
  }

  /**
   * Load model components that are dependent on other model components that are already created.
   * @param {Object} state - state object from the database
   * @param {NamedProperty[]} allComponents - all NamedProperty components (across all programs)
   */
  loadDependentModelComponents( state, allComponents ) {

    // Add derived properties last, so that they can depend on other properties
    state.namedDerivedProperties.forEach( namedDerivedPropertyData => {
      const dependencyNames = namedDerivedPropertyData.dependencyNames;

      // Get all the instances of NamedProperty from the saved names
      const dependencies = [];
      dependencyNames.forEach( dependencyName => {
        const foundProperty = allComponents.find( namedProperty => namedProperty.nameProperty.value === dependencyName );
        dependencies.push( foundProperty );
      } );

      this.addDerivedProperty(
        namedDerivedPropertyData.name,
        dependencies,
        namedDerivedPropertyData.derivation
      );
    } );
  }

  /**
   * Make this container eligible for garbage collection by removing all NamedProperties
   * and disposing observable arrays.
   */
  dispose() {
    this.namedBooleanProperties.dispose();
    this.namedVector2Properties.dispose();
    this.namedNumberProperties.dispose();
    this.namedEnumerationProperties.dispose();
    this.namedDerivedProperties.dispose();
    this.namedBounds2Properties.dispose();

    super.dispose();
  }

  /**
   * After components have been renamed (likely from a rename), update all relationships between dependency
   * components, as well as references to the renamed variables in custom code. Note this operation is done
   * on a serialized object.
   *
   * @param modelContainerJSON - State object for a ProgramModelContainer.
   * @param {Record<string,string>} nameChangeMap - A map of the changed component names, oldName -> new name
   */
  static updateReferencesAfterRename( modelContainerJSON, nameChangeMap ) {

    // Update model components that are dependent on other model components (derived)
    for ( const key in modelContainerJSON ) {
      const components = modelContainerJSON[ key ];
      components.forEach( componentJSON => {
        if ( componentJSON.dependencyNames ) {

          // update the dependency to use the newly copied component if it exists
          componentJSON.dependencyNames = componentJSON.dependencyNames.map( dependencyName => {
            return nameChangeMap[ dependencyName ] || dependencyName;
          } );

          // update the derivation function to use the newly copied component if necessary
          for ( const name in nameChangeMap ) {
            const newName = nameChangeMap[ name ];
            componentJSON.derivation = componentJSON.derivation.replaceAll( name, newName );
          }
        }
      } );
    }
  }
}