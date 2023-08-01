/**
 * A container for all view related components in a ProgramModel.
 */
import ComponentContainer from '../ComponentContainer.js';
import BackgroundViewComponent from './BackgroundViewComponent.js';
import DescriptionViewComponent from './DescriptionViewComponent.js';
import ImageViewComponent from './ImageViewComponent.js';
import SoundViewComponent from './SoundViewComponent.js';

export default class ProgramViewContainer extends ComponentContainer {
  constructor( programModel ) {
    super( programModel );

    // The collection of all sound views in this container
    this.soundViews = phet.axon.createObservableArray();

    // The collection of all description views in this container
    this.descriptionViews = phet.axon.createObservableArray();

    // The collection of all background views in this container
    this.backgroundViews = phet.axon.createObservableArray();

    // The collection of all image views in this container
    this.imageViews = phet.axon.createObservableArray();
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

  addBackgroundView( backgroundView ) {
    this.backgroundViews.push( backgroundView );
    this.addToAllComponents( backgroundView );
    this.registerChangeListeners( backgroundView, this.removeBackgroundView.bind( this ) );
  }

  removeBackgroundView( backgroundView ) {
    const backgroundViewIndex = this.backgroundViews.indexOf( backgroundView );
    assert && assert( backgroundViewIndex >= 0, 'BackgroundView not found' );
    this.backgroundViews.splice( backgroundViewIndex, 1 );
    this.removeFromAllComponents( backgroundView );
  }

  addImageView( imageView ) {
    this.imageViews.push( imageView );
    this.addToAllComponents( imageView );
    this.registerChangeListeners( imageView, this.removeImageView.bind( this ) );
  }

  removeImageView( imageView ) {
    const imageViewIndex = this.imageViews.indexOf( imageView );
    assert && assert( imageViewIndex >= 0, 'ImageView not found' );
    this.imageViews.splice( imageViewIndex, 1 );
    this.removeFromAllComponents( imageView );
  }

  save() {
    return {
      soundViews: this.soundViews.map( soundView => soundView.save() ),
      descriptionViews: this.descriptionViews.map( descriptionView => descriptionView.save() ),
      backgroundViews: this.backgroundViews.map( backgroundView => backgroundView.save() ),
      imageViews: this.imageViews.map( imageView => imageView.save() )
    };
  }

  /**
   * Loads all view components from the provided JSON object.
   */
  load( json ) {

    // Gracefully handle missing properties
    const soundViews = json.soundViews || [];
    const descriptionViews = json.descriptionViews || [];
    const backgroundViews = json.backgroundViews || [];
    const imageViews = json.imageViews || [];

    soundViews.forEach( soundViewJSON => {
      const soundView = SoundViewComponent.fromStateObject( soundViewJSON );
      this.addSoundView( soundView );
    } );
    descriptionViews.forEach( descriptionViewJSON => {
      const descriptionView = DescriptionViewComponent.fromStateObject( descriptionViewJSON );
      this.addDescriptionView( descriptionView );
    } );
    backgroundViews.forEach( backgroundViewJSON => {
      const backgroundView = BackgroundViewComponent.fromStateObject( backgroundViewJSON );
      this.addBackgroundView( backgroundView );
    } );
    imageViews.forEach( imageViewJSON => {
      const imageView = ImageViewComponent.fromStateObject( imageViewJSON );
      this.addImageView( imageView );
    } );
  }

  dispose() {
    this.soundViews.dispose();
    this.descriptionViews.dispose();
    this.allComponents.dispose();
    this.backgroundViews.dispose();
    this.imageViews.dispose();
  }
}