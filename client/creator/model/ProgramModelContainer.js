/**
 * Collection of model components for a single program, with functions to create them.
 */
import NamedProperty from './NamedProperty.js';

export default class ProgramModelContainer {
  constructor() {

    // {ObservableArray<NamedProperty>}
    this.namedBooleanProperties = phet.axon.createObservableArray();
    this.namedVector2Properties = phet.axon.createObservableArray();
    this.namedNumberProperties = phet.axon.createObservableArray();
    this.namedEnumerationProperties = phet.axon.createObservableArray();

    // {ObservableArray<NamedProperty> - the collection of ALL NamedProperties in this container
    // so we can easily operate on all of them at once.
    this.allComponents = phet.axon.createObservableArray();
  }

  /**
   * Creates a NamedProperty with the provided name and BooleanProperty for this model.
   * @param {string} name
   * @param {boolean} defaultValue
   */
  addBooleanProperty( name, defaultValue ) {
    const newNamedProperty = new NamedProperty( name, new phet.axon.BooleanProperty( defaultValue ) );
    this.namedBooleanProperties.push( newNamedProperty );
    this.allComponents.push( newNamedProperty );

    this.registerDeleteListener( newNamedProperty, this.removeBooleanProperty.bind( this ) );
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
    const newNamedProperty = new NamedProperty( name, new phet.dot.Vector2Property( new phet.dot.Vector2( x, y ) ) );
    this.namedVector2Properties.push( newNamedProperty );
    this.allComponents.push( newNamedProperty );

    this.registerDeleteListener( newNamedProperty, this.removeVector2Property.bind( this ) );
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
    const newNamedProperty = new NamedProperty( name, new phet.axon.NumberProperty( value, {
      range: new phet.dot.Range( min, max )
    } ) );
    this.namedNumberProperties.push( newNamedProperty );
    this.allComponents.push( newNamedProperty );

    this.registerDeleteListener( newNamedProperty, this.removeNumberProperty.bind( this ) );
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
    const newNamedProperty = new NamedProperty( name, new phet.axon.StringProperty( values[ 0 ], {
      validValues: values
    } ) );
    this.namedEnumerationProperties.push( newNamedProperty );
    this.allComponents.push( newNamedProperty );

    this.registerDeleteListener( newNamedProperty, this.removeEnumerationProperty.bind( this ) );
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
   * Removes the NamedProperty from the collection of all components.
   * @private
   */
  removeFromAllComponents( namedProperty ) {
    const allIndex = this.allComponents.indexOf( namedProperty );
    assert && assert( allIndex > -1, 'Property does not exist and cannot be removed.' );
    this.allComponents.splice( allIndex, 1 );
  }

  /**
   * Registers a listener to the deleteEmitter of the provided NamedProperty so it can
   * be removed from the model when we receive that event.
   * @param namedProperty - NamedProperty to remove
   * @param removalListener - Specific work to remove the provided
   */
  registerDeleteListener( namedProperty, removalListener ) {
    const deleteListener = () => {
      removalListener( namedProperty );
      namedProperty.deleteEmitter.removeListener( deleteListener );
    };
    namedProperty.deleteEmitter.addListener( deleteListener );
  }

  /**
   * Make this container eligible for garbage collection by removing all NamedProperties
   * and disposing observable arrays.
   */
  dispose() {

    // dispose of all components
    this.allComponents.forEach( namedProperty => {
      namedProperty.dispose();
    } );

    this.namedBooleanProperties.dispose();
    this.allComponents.dispose();
  }
}