/**
 * A container for all view related components in a ProgramModel.
 */
import { renameVariableInCode } from '../../../utils.js';
import ComponentContainer from '../ComponentContainer.js';
import BackgroundViewComponent from './BackgroundViewComponent.js';
import DescriptionViewComponent from './DescriptionViewComponent.js';
import ImageViewComponent from './ImageViewComponent.js';
import ShapeViewComponent from './ShapeViewComponent.js';
import SoundViewComponent from './SoundViewComponent.js';
import TextViewComponent from './TextViewComponent.js';

export default class ProgramViewContainer extends ComponentContainer {
  constructor( programModel ) {
    super( programModel );

    // The collection of all sound views in this container
    this.soundViews = phet.axon.createObservableArray();

    // The collection of all description views in this container
    this.descriptionViews = phet.axon.createObservableArray();

    // The collection of all text views in this container
    this.textViews = phet.axon.createObservableArray();

    // The collection of all background views in this container
    this.backgroundViews = phet.axon.createObservableArray();

    // The collection of all shape views in this container
    this.shapeViews = phet.axon.createObservableArray();

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
   * Adds a new shape view.
   * @param shapeView
   */
  addShapeView( shapeView ) {
    this.shapeViews.push( shapeView );
    this.addToAllComponents( shapeView );
    this.registerChangeListeners( shapeView, this.removeShapeView.bind( this ) );
  }

  /**
   * Removes a shape view from this container.
   * @param shapeView
   */
  removeShapeView( shapeView ) {
    const shapeViewIndex = this.shapeViews.indexOf( shapeView );
    assert && assert( shapeViewIndex >= 0, 'ShapeView not found' );
    this.shapeViews.splice( shapeViewIndex, 1 );
    this.removeFromAllComponents( shapeView );
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

  addTextView( textView ) {
    this.textViews.push( textView );
    this.addToAllComponents( textView );
    this.registerChangeListeners( textView, this.removeTextView.bind( this ) );
  }

  removeTextView( textView ) {
    const textViewIndex = this.textViews.indexOf( textView );
    assert && assert( textViewIndex >= 0, 'TextView not found' );
    this.textViews.splice( textViewIndex, 1 );
    this.removeFromAllComponents( textView );
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
      textViews: this.textViews.map( textView => textView.save() ),
      shapeViews: this.shapeViews.map( shapeView => shapeView.save() ),
      backgroundViews: this.backgroundViews.map( backgroundView => backgroundView.save() ),
      imageViews: this.imageViews.map( imageView => imageView.save() )
    };
  }

  /**
   * Loads all view components from the provided JSON object.
   */
  load( json, allComponents ) {

    // Gracefully handle missing properties
    const soundViews = json.soundViews || [];
    const descriptionViews = json.descriptionViews || [];
    const textViews = json.textViews || [];
    const shapeViews = json.shapeViews || [];
    const backgroundViews = json.backgroundViews || [];
    const imageViews = json.imageViews || [];

    soundViews.forEach( soundViewJSON => {
      const soundView = SoundViewComponent.fromStateObject( soundViewJSON, allComponents );
      this.addSoundView( soundView );
    } );
    descriptionViews.forEach( descriptionViewJSON => {
      const descriptionView = DescriptionViewComponent.fromStateObject( descriptionViewJSON, allComponents );
      this.addDescriptionView( descriptionView );
    } );
    textViews.forEach( textViewJSON => {
      const textView = TextViewComponent.fromStateObject( textViewJSON, allComponents );
      this.addTextView( textView );
    } );
    backgroundViews.forEach( backgroundViewJSON => {
      const backgroundView = BackgroundViewComponent.fromStateObject( backgroundViewJSON, allComponents );
      this.addBackgroundView( backgroundView );
    } );
    imageViews.forEach( imageViewJSON => {
      const imageView = ImageViewComponent.fromStateObject( imageViewJSON, allComponents );
      this.addImageView( imageView );
    } );
    shapeViews.forEach( shapeViewJSON => {
      const shapeView = ShapeViewComponent.fromStateObject( shapeViewJSON, allComponents );
      this.addShapeView( shapeView );
    } );
  }

  dispose() {
    this.soundViews.dispose();
    this.descriptionViews.dispose();
    this.allComponents.dispose();
    this.backgroundViews.dispose();
    this.shapeViews.dispose();
    this.imageViews.dispose();
  }

  /**
   * After components have been renamed (likely from a copy), update all relationships between dependency
   * components and this view component, as well as references to the renamed variables in custom code.
   * Note this operation is done on a serialized object.
   *
   * @param viewContainerJSON - State object for a ProgramViewContainer.
   * @param {Record<string,string>} nameChangeMap - A map of the changed component names, oldName -> new name
   */
  static updateReferencesAfterRename( viewContainerJSON, nameChangeMap ) {

    // update the view components so that they are dependent on the newly copied components
    for ( const key in viewContainerJSON ) {
      const componentObjects = viewContainerJSON[ key ];
      componentObjects.forEach( componentObject => {

        // update the dependency to use the newly copied component if it exists
        componentObject.modelComponentNames = componentObject.modelComponentNames.map( dependencyName => {
          return nameChangeMap[ dependencyName ] || dependencyName;
        } );

        // update references to the newly copied components
        componentObject.referenceComponentNames = componentObject.referenceComponentNames.map( referenceName => {
          return nameChangeMap[ referenceName ] || referenceName;
        } );

        // make sure that the referenceComponentNames are a subset of the modelComponentNames
        componentObject.referenceComponentNames.forEach( referenceName => {
          assert && assert( componentObject.modelComponentNames.includes( referenceName ), 'Reference component must be in the list of model components' );
        } );

        // update the derivation function to use the newly copied component if necessary
        for ( const name in nameChangeMap ) {
          const newName = nameChangeMap[ name ];
          componentObject.controlFunctionString = renameVariableInCode( componentObject.controlFunctionString, newName, name );
        }
      } );
    }
  }
}