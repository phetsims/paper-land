/**
 * A superclass for a "container" of components. Each ProgramModel will have several ComponentContainers,
 * one for each class of component that can be added to a program.
 *
 * @author Jesse Greenberg
 */

export default class ComponentContainer {
  constructor( programModel ) {

    this.programModel = programModel;

    // {ObservableArray<Component>} The collection of ALL components in this container. Subclasses will categorize
    // the components as they wish, but every single component should be in this list as well.
    this.allComponents = phet.axon.createObservableArray();
  }

  /**
   * Add a new component to the allComponents list.
   * @param {Component} component
   */
  addToAllComponents( component ) {

    // make sure that allComponents does not have a NamedProperty with the same name
    const componentExists = _.find( this.allComponents, existingComponent => {
      return existingComponent.name === component.nameProperty.value;
    } );
    if ( componentExists ) {
      throw new Error( 'Component with this name already exists. It must be unique.' );
    }

    this.allComponents.push( component );
  }

  /**
   * Removes the component from the collection of all components.
   */
  removeFromAllComponents( component ) {
    const allIndex = this.allComponents.indexOf( component );
    assert && assert( allIndex > -1, 'Property does not exist and cannot be removed.' );
    this.allComponents.splice( allIndex, 1 );
  }

  /**
   * Registers listeners to the deleteEmitter and editEmitter for a provided component to activate editing or removal
   * when the component is deleted or edited.
   *
   * @param component
   * @param removalListener - Specific work to remove the provided component
   */
  registerChangeListeners( component, removalListener ) {
    const deleteListener = () => {
      removalListener( component );
      component.deleteEmitter.removeListener( deleteListener );
    };
    component.deleteEmitter.addListener( deleteListener );
  }

  /**
   * Dispose components, making eligible for garbage collection.
   * @override
   */
  dispose() {

    // dispose of all components
    this.allComponents.forEach( component => {
      component.dispose();
    } );

    this.allComponents.dispose();
  }

}