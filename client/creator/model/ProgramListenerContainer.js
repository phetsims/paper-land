import ComponentContainer from './ComponentContainer.js';
import MultilinkListenerComponent from './controllers/MultilinkListenerComponent.js';

export default class ProgramListenerContainer extends ComponentContainer {
  constructor( programModel ) {
    super( programModel );

    // the collection of all link listeners in this container
    this.linkListeners = phet.axon.createObservableArray();
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
   * Save this instance to a serialized JSON for save/load.
   */
  save() {
    return {
      linkListeners: this.linkListeners.map( linkListener => linkListener.save() )
    };
  }

  /**
   * Load an instance of a ProgramListenerContainer from a serialized JSON.
   */
  load( json, allComponents ) {
    const linkListeners = json.linkListeners || [];

    linkListeners.forEach( linkListenerJSON => {
      const linkListener = MultilinkListenerComponent.fromStateObject( linkListenerJSON, allComponents );
      this.addLinkListener( linkListener );
    } );
  }
}