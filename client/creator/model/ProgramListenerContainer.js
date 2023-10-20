import ComponentContainer from './ComponentContainer.js';
import AnimationListenerComponent from './controllers/AnimationListenerComponent.js';
import MultilinkListenerComponent from './controllers/MultilinkListenerComponent.js';

export default class ProgramListenerContainer extends ComponentContainer {
  constructor( programModel ) {
    super( programModel );

    // the collection of all link listeners in this container
    this.linkListeners = phet.axon.createObservableArray();

    // the collection of all animation listeners in this container
    this.animationListeners = phet.axon.createObservableArray();
  }

  /**
   * Add a link listener to this container.
   */
  addLinkListener( linkListener ) {
    this.linkListeners.push( linkListener );
    this.addToAllComponents( linkListener );
    this.registerChangeListeners( linkListener, this.removeLinkListener.bind( this ) );
  }

  /**
   * Remove a link listener from this container.
   */
  removeLinkListener( linkListener ) {
    const linkListenerIndex = this.linkListeners.indexOf( linkListener );
    assert && assert( linkListenerIndex >= 0, 'LinkListener not found' );
    this.linkListeners.splice( linkListenerIndex, 1 );
    this.removeFromAllComponents( linkListener );
  }

  /**
   * Add an animation listener to this container.
   */
  addAnimationListener( animationListener ) {
    this.animationListeners.push( animationListener );
    this.addToAllComponents( animationListener );
    this.registerChangeListeners( animationListener, this.removeAnimationListener.bind( this ) );
  }

  /**
   * Remove an animation listener from this container.
   */
  removeAnimationListener( animationListener ) {
    const animationListenerIndex = this.animationListeners.indexOf( animationListener );
    assert && assert( animationListenerIndex >= 0, 'AnimationListener not found' );
    this.animationListeners.splice( animationListenerIndex, 1 );
    this.removeFromAllComponents( animationListener );
  }

  /**
   * Save this instance to a serialized JSON for save/load.
   */
  save() {
    return {
      linkListeners: this.linkListeners.map( linkListener => linkListener.save() ),
      animationListeners: this.animationListeners.map( animationListener => animationListener.save() )
    };
  }

  copyComponentsFromOther( otherContainer, getUniqueCopyName, allModelComponents, newModelNames ) {

    // We can use the saved state to easily copy components. From this data we can update names
    // and dependencies before loading the new components to this container as copies.
    const stateObject = otherContainer.save();

    // Include the model components that were renamed during this copy so we know how to
    // whether to set dependencies on new copies or the original components.
    const nameChangeMap = _.merge( {}, newModelNames );

    for ( const key in stateObject ) {
      const components = stateObject[ key ];

      components.forEach( componentStateObject => {
        const originalName = componentStateObject.name;
        componentStateObject.name = getUniqueCopyName( originalName );
        nameChangeMap[ originalName ] = componentStateObject.name;
      } );
    }

    // Update dependency relationships and references in custom code.
    for ( const key in stateObject ) {
      const componentObjects = stateObject[ key ];
      componentObjects.forEach( componentObject => {

        // update the "controlled" components to use the newly copied component if necessary
        componentObject.controlledPropertyNames = componentObject.controlledPropertyNames.map( dependencyName => {
          return nameChangeMap[ dependencyName ] || dependencyName;
        } );

        // update the "dependencies" to use the newly copied component if necessary for controller components
        // that have dependencies (currently the MultilinkListenerComponent)
        if ( componentObject.dependencyNames ) {
          componentObject.dependencyNames = componentObject.dependencyNames.map( dependencyName => {
            return nameChangeMap[ dependencyName ] || dependencyName;
          } );
        }

        // update the derivation function to use the newly copied component if necessary
        for ( const name in nameChangeMap ) {
          const newName = nameChangeMap[ name ];
          componentObject.controlFunctionString = componentObject.controlFunctionString.replaceAll( name, newName );
        }
      } );
    }

    this.load( stateObject, allModelComponents );
  }

  /**
   * Load an instance of a ProgramListenerContainer from a serialized JSON.
   */
  load( json, allComponents ) {
    const linkListeners = json.linkListeners || [];
    const animationListeners = json.animationListeners || [];

    linkListeners.forEach( linkListenerJSON => {
      const linkListener = MultilinkListenerComponent.fromData( linkListenerJSON, allComponents );
      this.addLinkListener( linkListener );
    } );
    animationListeners.forEach( animationListenerJSON => {
      const animationListener = AnimationListenerComponent.fromData( animationListenerJSON, allComponents );
      this.addAnimationListener( animationListener );
    } );
  }
}