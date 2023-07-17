/**
 * Collection of model components for a single program, with functions to create them.
 */
import ComponentContainer from './ComponentContainer.js';
import NamedBooleanProperty from './NamedBooleanProperty.js';
import NamedDerivedProperty from './NamedDerivedProperty.js';
import NamedEnumerationProperty from './NamedEnumerationProperty.js';
import NamedNumberProperty from './NamedNumberProperty.js';
import NamedVector2Property from './NamedVector2Property.js';

export default class ProgramModelContainer extends ComponentContainer {
  constructor( programModel, activeEditProperty ) {
    super( programModel, activeEditProperty );

    // {ObservableArray<NamedProperty>}
    this.namedBooleanProperties = phet.axon.createObservableArray();
    this.namedVector2Properties = phet.axon.createObservableArray();
    this.namedNumberProperties = phet.axon.createObservableArray();
    this.namedEnumerationProperties = phet.axon.createObservableArray();
    this.namedDerivedProperties = phet.axon.createObservableArray();
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
      namedDerivedProperties: this.namedDerivedProperties.map( namedProperty => namedProperty.save() )
    };
  }

  /**
   * Load the model components that are dependencies for other components - they can exist
   * in isolation and must be available before creating DerivedProperty components.
   */
  loadDependencyModelComponents( stateObject ) {
    stateObject.namedBooleanProperties.forEach( namedBooleanPropertyData => {
      this.addBooleanProperty(
        namedBooleanPropertyData.name,
        namedBooleanPropertyData.defaultValue
      );
    } );
    stateObject.namedVector2Properties.forEach( namedVector2PropertyData => {
      this.addVector2Property(
        namedVector2PropertyData.name,
        namedVector2PropertyData.x,
        namedVector2PropertyData.y
      );
    } );
    stateObject.namedNumberProperties.forEach( namedNumberPropertyData => {
      this.addNumberProperty(
        namedNumberPropertyData.name,
        namedNumberPropertyData.min,
        namedNumberPropertyData.max,
        namedNumberPropertyData.defaultValue
      );
    } );
    stateObject.namedEnumerationProperties.forEach( namedEnumerationPropertyData => {
      this.addEnumerationProperty(
        namedEnumerationPropertyData.name,
        namedEnumerationPropertyData.values
      );
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
        const foundProperty = allComponents.find( namedProperty => namedProperty.name === dependencyName );
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

    super.dispose();
  }
}