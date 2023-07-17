/**
 * A container for all view related components in a ProgramModel.
 */
import ComponentContainer from '../ComponentContainer.js';
import DescriptionViewComponent from './DescriptionViewComponent.js';
import SoundViewComponent from './SoundViewComponent.js';

export default class ProgramViewContainer extends ComponentContainer {
  constructor( programModel ) {
    super( programModel );

    // The collection of all sound views in this container
    this.soundViews = phet.axon.createObservableArray();

    // The collection of all description views in this container
    this.descriptionViews = phet.axon.createObservableArray();
  }

  /**
   * Adds a new sound view.
   */
  addSoundView( soundView ) {
    this.soundViews.push( soundView );
    this.addToAllComponents( soundView );
    this.registerChangeListeners( soundView, this.removeSoundView.bind( this ) );
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
   * Adds a new description view.
   */
  addDescriptionView( descriptionView ) {
    this.descriptionViews.push( descriptionView );
    this.addToAllComponents( descriptionView );
    this.registerChangeListeners( descriptionView, this.removeDescriptionView.bind( this ) );
  }

  /**
   * Removes a description view.
   */
  removeDescriptionView( descriptionView ) {
    const descriptionViewIndex = this.descriptionViews.indexOf( descriptionView );
    assert && assert( descriptionViewIndex >= 0, 'DescriptionView not found' );
    this.descriptionViews.splice( descriptionViewIndex, 1 );
    this.removeFromAllComponents( descriptionView );
  }

  save() {
    return {
      soundViews: this.soundViews.map( soundView => soundView.save() ),
      descriptionViews: this.descriptionViews.map( descriptionView => descriptionView.save() )
    };
  }

  /**
   * Loads all view components from the provided JSON object.
   */
  load( json ) {
    json.soundViews.forEach( soundViewJSON => {
      const soundView = SoundViewComponent.fromStateObject( soundViewJSON );
      this.addSoundView( soundView );
    } );
    json.descriptionViews.forEach( descriptionViewJSON => {
      const descriptionView = DescriptionViewComponent.fromStateObject( descriptionViewJSON );
      this.addDescriptionView( descriptionView );
    } );
  }

  dispose() {
    this.soundViews.dispose();
    this.descriptionViews.dispose();
    this.allComponents.dispose();
  }
}