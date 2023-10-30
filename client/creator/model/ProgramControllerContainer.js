/**
 * Collection of all the controller components for a single program, with functions to create them.
 */
import ComponentContainer from './ComponentContainer.js';
import BooleanPropertyController from './controllers/BooleanPropertyController.js';
import BoundsPropertyController from './controllers/BoundsPropertyController.js';
import EnumerationPropertyController from './controllers/EnumerationPropertyController.js';
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

    // {ObservableArray<BoundsPropertyController>}
    this.boundsPropertyControllers = phet.axon.createObservableArray();
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
   * Adds a controller for a NamedBounds2Property.
   * @param {BoundsPropertyController} boundsPropertyController
   */
  addBoundsPropertyController( boundsPropertyController ) {
    this.boundsPropertyControllers.push( boundsPropertyController );
    this.addToAllComponents( boundsPropertyController );

    this.registerChangeListeners( boundsPropertyController, this.removeBoundsPropertyController.bind( this ) );
  }

  /**
   * Removes a controller for a NamedBounds2Property from this container.
   */
  removeBoundsPropertyController( boundsPropertyController ) {
    this.boundsPropertyControllers.remove( boundsPropertyController );
    this.removeFromAllComponents( boundsPropertyController );
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
      boundsPropertyControllers: this.boundsPropertyControllers.map( controller => controller.save() ),
      booleanPropertyControllers: this.booleanPropertyControllers.map( controller => controller.save() ),
      numberPropertyControllers: this.numberPropertyControllers.map( controller => controller.save() ),
      enumerationPropertyControllers: this.enumerationPropertyControllers.map( controller => controller.save() )
    };
  }

  /**
   * Copy all controller components from another component to this container. Unique names are
   * given to the copies to avoid conflicts. If model components were copied with the copy request,
   * the copied controller will control the copied model component instead of the original.
   *
   * NOTE: If a controlled model component is copied, we do NOT currently create a copy of the controller
   * unless we are duplicating both the model and the controller. This is because many controller types can only
   * have one controlled model component.
   *
   * @param {*} otherContainerJSON - the saved state of another container, from ProgramContainer.save()
   * @param {function} getUniqueCopyName - function that returns a unique name for a component
   * @param {NamedProperty[]} allModelComponents - all the NamedProperties in the model
   * @param {Map<string, string>} newModelNames - map of old model component names to new model component names
   */
  copyComponentsFromOther( otherContainerJSON, getUniqueCopyName, allModelComponents, newModelNames ) {

    // Include the model components that were renamed during this copy so we know how to
    // whether to set dependencies on new copies or the original components.
    const nameChangeMap = _.merge( {}, newModelNames );

    // Update names so that they are unique.
    for ( const key in otherContainerJSON ) {
      const components = otherContainerJSON[ key ];

      components.forEach( componentObject => {
        const originalName = componentObject.name;
        componentObject.name = getUniqueCopyName( originalName );
        nameChangeMap[ originalName ] = componentObject.name;
      } );
    }

    // Update dependency relationships for newly copied components
    for ( const key in otherContainerJSON ) {
      const componentObjects = otherContainerJSON[ key ];
      componentObjects.forEach( componentObject => {

        // update the dependency to use the newly copied component if it exists
        componentObject.controlledComponentName = nameChangeMap[ componentObject.controlledComponentName ] || componentObject.controlledComponentName;
      } );
    }

    this.load( otherContainerJSON, allModelComponents );
  }

  load( savedData, namedProperties ) {

    // in case the saved state doesn't have a particular set of controllers
    savedData.vector2PropertyControllers = savedData.vector2PropertyControllers || [];
    savedData.boundsPropertyControllers = savedData.boundsPropertyControllers || [];
    savedData.booleanPropertyControllers = savedData.booleanPropertyControllers || [];
    savedData.numberPropertyControllers = savedData.numberPropertyControllers || [];
    savedData.enumerationPropertyControllers = savedData.enumerationPropertyControllers || [];

    savedData.vector2PropertyControllers.forEach( controllerData => {
      const controller = Vector2PropertyController.fromData( controllerData, namedProperties );
      this.addVector2PropertyController( controller );
    } );

    savedData.boundsPropertyControllers.forEach( controllerData => {
      const controller = BoundsPropertyController.fromData( controllerData, namedProperties );
      this.addBoundsPropertyController( controller );
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
  }

  dispose() {
    this.allComponents.forEach( component => component.dispose() );

    this.vector2PropertyControllers.dispose();
    this.booleanPropertyControllers.dispose();
    this.numberPropertyControllers.dispose();
    this.boundsPropertyControllers.dispose();
    this.enumerationPropertyControllers.dispose();

    this.allComponents.dispose();
  }
}