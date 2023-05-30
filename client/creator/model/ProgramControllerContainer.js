/**
 * Collection of all the controller components for a single program, with functions to create them.
 */

export default class ProgramControllerContainer {
  constructor() {

    // {ObservableArray<Vector2PropertyController}
    this.vector2PropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<BooleanPropertyController}
    this.booleanPropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<NumberPropertyController>}
    this.numberPropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<EnumerationPropertyController>
    this.enumerationPropertyControllers = phet.axon.createObservableArray();

    this.allComponents = phet.axon.createObservableArray();
  }

  /**
   * Adds a controller for a Vector2Property.
   * @param {Vector2PropertyController} vector2PropertyController
   */
  addVector2PropertyController( vector2PropertyController ) {
    this.vector2PropertyControllers.push( vector2PropertyController );
    this.allComponents.push( vector2PropertyController );

    this.registerDeleteListener( vector2PropertyController, this.removeVector2PropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a Vector2Property.
   * @param {Vector2PropertyController} vector2PropertyController
   */
  removeVector2PropertyController( vector2PropertyController ) {
    this.vector2PropertyControllers.remove( vector2PropertyController );
    this.allComponents.remove( vector2PropertyController );
  }

  /**
   * Adds a controller for a BooleanProperty.
   * @param {BooleanPropertyController} booleanPropertyController
   */
  addBooleanPropertyController( booleanPropertyController ) {
    this.booleanPropertyControllers.push( booleanPropertyController );
    this.allComponents.push( booleanPropertyController );

    this.registerDeleteListener( booleanPropertyController, this.removeBooleanPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a BooleanProperty.
   * @param {BooleanPropertyController} booleanPropertyController
   */
  removeBooleanPropertyController( booleanPropertyController ) {
    this.booleanPropertyControllers.remove( booleanPropertyController );
    this.allComponents.remove( booleanPropertyController );
  }

  /**
   * Adds a controller for a NumberProperty.
   * @param {NumberPropertyController} numberPropertyController
   */
  addNumberPropertyController( numberPropertyController ) {
    this.numberPropertyControllers.push( numberPropertyController );
    this.allComponents.push( numberPropertyController );

    this.registerDeleteListener( numberPropertyController, this.removeNumberPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a NumberProperty.
   * @param {NumberPropertyController} numberPropertyController
   */
  removeNumberPropertyController( numberPropertyController ) {
    this.numberPropertyControllers.remove( numberPropertyController );
    this.allComponents.remove( numberPropertyController );
  }

  /**
   * Adds a controller for an EnumerationProperty.
   * @param {EnumerationPropertyController} enumerationPropertyController
   */
  addEnumerationPropertyController( enumerationPropertyController ) {
    this.enumerationPropertyControllers.push( enumerationPropertyController );
    this.allComponents.push( enumerationPropertyController );

    this.registerDeleteListener( enumerationPropertyController, this.removeEnumerationPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for an EnumerationProperty from this container.
   * @param {EnumerationPropertyController} enumerationPropertyController
   */
  removeEnumerationPropertyController( enumerationPropertyController ) {
    this.enumerationPropertyControllers.remove( enumerationPropertyController );
    this.allComponents.remove( enumerationPropertyController );
  }

  /**
   * When a PropertyController emits that it is time to delete, we remove it from the model.
   * Also removes the PropertyController when its NamedProperty that it is controlling is removed.
   *
   * @param {PropertyController} propertyController
   * @param {function} removalListener - tear down work for a particular type of PropertyController
   */
  registerDeleteListener( propertyController, removalListener ) {
    const deleteListener = () => {
      removalListener( propertyController );
      propertyController.deleteEmitter.removeListener( deleteListener );
      propertyController.namedProperty.deleteEmitter.removeListener( deleteListener );
    };
    propertyController.deleteEmitter.addListener( deleteListener );
    propertyController.namedProperty.deleteEmitter.addListener( deleteListener );
  }
}