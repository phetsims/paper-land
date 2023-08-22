/**
 * Collection of all the controller components for a single program, with functions to create them.
 */
import ComponentContainer from './ComponentContainer.js';
import BooleanPropertyController from './controllers/BooleanPropertyController.js';
import EnumerationPropertyController from './controllers/EnumerationPropertyController.js';
import MultilinkListenerComponent from './controllers/MultilinkListenerComponent.js';
import NumberPropertyController from './controllers/NumberPropertyController.js';
import Vector2PropertyController from './controllers/Vector2PropertyController.js';

export default class ProgramControllerContainer extends ComponentContainer {
  constructor( programModel ) {
    super( programModel );

    // {ObservableArray<Vector2PropertyController}
    this.vector2PropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<BooleanPropertyController}
    this.booleanPropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<NumberPropertyController>}
    this.numberPropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<EnumerationPropertyController>
    this.enumerationPropertyControllers = phet.axon.createObservableArray();

    // {ObservableArray<MultilinkController>}
    this.multilinkPropertyController = phet.axon.createObservableArray();
  }

  /**
   * Adds a controller for a Vector2Property.
   * @param {Vector2PropertyController} vector2PropertyController
   */
  addVector2PropertyController( vector2PropertyController ) {
    this.vector2PropertyControllers.push( vector2PropertyController );
    this.addToAllComponents( vector2PropertyController );

    this.registerChangeListeners( vector2PropertyController, this.removeVector2PropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a Vector2Property.
   * @param {Vector2PropertyController} vector2PropertyController
   */
  removeVector2PropertyController( vector2PropertyController ) {
    this.vector2PropertyControllers.remove( vector2PropertyController );
    this.removeFromAllComponents( vector2PropertyController );
  }

  /**
   * Adds a 'controller' where you can write work to be done in a Multilink to control
   * other Properties
   */
  addMultilinkController( linkPropertyController ) {
    this.multilinkPropertyController.push( linkPropertyController );
    this.addToAllComponents( linkPropertyController );
    this.registerChangeListeners( linkPropertyController, this.removeMultilinkController.bind( this ) );
  }

  /**
   * Removes a controller for a 'link' controller.
   * @param linkPropertyController
   */
  removeMultilinkController( linkPropertyController ) {
    this.multilinkPropertyController.remove( linkPropertyController );
    this.removeFromAllComponents( linkPropertyController );
  }

  /**
   * Adds a controller for a BooleanProperty.
   * @param {BooleanPropertyController} booleanPropertyController
   */
  addBooleanPropertyController( booleanPropertyController ) {
    this.booleanPropertyControllers.push( booleanPropertyController );
    this.addToAllComponents( booleanPropertyController );

    this.registerChangeListeners( booleanPropertyController, this.removeBooleanPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a BooleanProperty.
   * @param {BooleanPropertyController} booleanPropertyController
   */
  removeBooleanPropertyController( booleanPropertyController ) {
    this.booleanPropertyControllers.remove( booleanPropertyController );
    this.removeFromAllComponents( booleanPropertyController );
  }

  /**
   * Adds a controller for a NumberProperty.
   * @param {NumberPropertyController} numberPropertyController
   */
  addNumberPropertyController( numberPropertyController ) {
    this.numberPropertyControllers.push( numberPropertyController );
    this.addToAllComponents( numberPropertyController );

    this.registerChangeListeners( numberPropertyController, this.removeNumberPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a NumberProperty.
   * @param {NumberPropertyController} numberPropertyController
   */
  removeNumberPropertyController( numberPropertyController ) {
    this.numberPropertyControllers.remove( numberPropertyController );
    this.removeFromAllComponents( numberPropertyController );
  }

  /**
   * Adds a controller for an EnumerationProperty.
   * @param {EnumerationPropertyController} enumerationPropertyController
   */
  addEnumerationPropertyController( enumerationPropertyController ) {
    this.enumerationPropertyControllers.push( enumerationPropertyController );
    this.addToAllComponents( enumerationPropertyController );

    this.registerChangeListeners( enumerationPropertyController, this.removeEnumerationPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for an EnumerationProperty from this container.
   * @param {EnumerationPropertyController} enumerationPropertyController
   */
  removeEnumerationPropertyController( enumerationPropertyController ) {
    this.enumerationPropertyControllers.remove( enumerationPropertyController );
    this.removeFromAllComponents( enumerationPropertyController );
  }

  /**
   * When a PropertyController emits that it is time to delete, we remove it from the model.
   * Also removes the PropertyController when its NamedProperty that it is controlling is removed.
   *
   * @param {PropertyController} propertyController
   * @param {function} removalListener - tear down work for a particular type of PropertyController
   *
   * @override
   */
  registerChangeListeners( propertyController, removalListener ) {
    const deleteListener = () => {
      removalListener( propertyController );
      propertyController.deleteEmitter.removeListener( deleteListener );
      propertyController.namedProperty.deleteEmitter.removeListener( deleteListener );
    };

    propertyController.deleteEmitter.addListener( deleteListener );
    propertyController.namedProperty.deleteEmitter.addListener( deleteListener );
  }

  save() {
    return {
      vector2PropertyControllers: this.vector2PropertyControllers.map( controller => controller.save() ),
      booleanPropertyControllers: this.booleanPropertyControllers.map( controller => controller.save() ),
      numberPropertyControllers: this.numberPropertyControllers.map( controller => controller.save() ),
      multilinkPropertyController: this.multilinkPropertyController.map( controller => controller.save() ),
      enumerationPropertyControllers: this.enumerationPropertyControllers.map( controller => controller.save() )
    };
  }

  load( savedData, namedProperties ) {

    savedData.vector2PropertyControllers.forEach( controllerData => {
      const controller = Vector2PropertyController.fromData( controllerData, namedProperties );
      this.addVector2PropertyController( controller );
    } );

    savedData.booleanPropertyControllers.forEach( controllerData => {
      const controller = BooleanPropertyController.fromData( controllerData, namedProperties );
      this.addBooleanPropertyController( controller );
    } );

    savedData.numberPropertyControllers.forEach( controllerData => {
      const controller = NumberPropertyController.fromData( controllerData, namedProperties );
      this.addNumberPropertyController( controller );
    } );

    savedData.enumerationPropertyControllers.forEach( controllerData => {
      const controller = EnumerationPropertyController.fromData( controllerData, namedProperties );
      this.addEnumerationPropertyController( controller );
    } );

    savedData.multilinkPropertyController.forEach( controllerData => {
      const controller = MultilinkListenerComponent.fromData( controllerData, namedProperties );
      this.addMultilinkController( controller );
    } );
  }

  dispose() {
    this.allComponents.forEach( component => component.dispose() );

    this.vector2PropertyControllers.dispose();
    this.booleanPropertyControllers.dispose();
    this.numberPropertyControllers.dispose();
    this.enumerationPropertyControllers.dispose();

    this.allComponents.dispose();
  }
}