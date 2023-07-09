/**
 * A container for all view related components in a ProgramModel.
 */
import SoundViewComponent from './SoundViewComponent.js';

export default class ProgramViewContainer {
  constructor() {

    // The collection of all sound views in this container
    this.soundViews = phet.axon.createObservableArray();

    // The collection of all components in this container
    this.allComponents = phet.axon.createObservableArray();
  }

  /**
   * Adds a new sound view.
   */
  addSoundView( soundView ) {
    this.soundViews.push( soundView );
    this.allComponents.push( soundView );
    this.registerDeleteListener( soundView, this.removeSoundView.bind( this ) );
  }

  /**
   * Removes a sound view.
   */
  removeSoundView( soundView ) {
    const soundViewIndex = this.soundViews.indexOf( soundView );
    assert && assert( soundViewIndex >= 0, 'SoundView not found' );
    this.soundViews.splice( soundViewIndex, 1 );
    this.removeFromAllComponents( soundView );
  }

  /**
   * Adds a listener that will remove the component when it is time to delete it.
   */
  registerDeleteListener( component, removalListener ) {
    const deleteListener = () => {
      removalListener( component );
      component.deleteEmitter.removeListener( deleteListener );
    };
    component.deleteEmitter.addListener( deleteListener );
  }

  /**
   * Removes the view component from the collective list of all components.
   * @param component
   */
  removeFromAllComponents( component ) {
    const componentIndex = this.allComponents.indexOf( component );
    assert && assert( componentIndex >= 0, 'Component not found' );
    this.allComponents.splice( componentIndex, 1 );
  }

  save() {
    return {
      soundViews: this.soundViews.map( soundView => soundView.save() )
    };
  }

  /**
   * Loads all view components from the provided JSON object.
   */
  load( json ) {
    json.soundViews.forEach( soundViewJSON => {
      const soundView = new SoundViewComponent(
        soundViewJSON.name,
        soundViewJSON.modelComponentNames,
        soundViewJSON.controlFunctionString,
        soundViewJSON.soundFileName
      );
      this.addSoundView( soundView );
    } );
  }

  dispose() {
    this.soundViews.dispose();
    this.allComponents.dispose();
  }
}