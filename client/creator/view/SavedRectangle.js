/**
 * A scenery-style 'saved' icon that fades in and out when a successful save happens.
 *
 * @author Jesse Greenberg
 */

import ViewConstants from './ViewConstants.js';

export default class SavedRectangle extends phet.scenery.Rectangle {
  constructor( providedOptions ) {
    const options = _.merge( {
      message: 'Saved ✓'
    }, providedOptions );

    super( 0, 0, 0, 0, 5, 5, { fill: ViewConstants.SAVED_COLOR } );

    this.savedText = new phet.scenery.Text( '', {
      font: ViewConstants.TEXT_FONT
    } );
    this.addChild( this.savedText );

    this.setMessage( options.message );

    // references to active animations so they can be stopped if necessary
    this.inAnimation = null;
    this.outAnimation = null;

    // initially, opacity is zero
    this.opacity = 0;
  }

  // Update the displayed message and surrounding rectangle bounds. After updating the message
  // you may need to update layout for this component within its parent.
  setMessage( message ) {
    this.savedText.string = message;
    this.setRectBounds( this.savedText.bounds.dilatedXY( 30, 10 ) );
  }

  /**
   * Use twixt to fade in and out the saved rectangle when a successful save happens.
   */
  showSaved() {
    this.inAnimation && this.inAnimation.stop();
    this.outAnimation && this.outAnimation.stop();

    this.inAnimation = new phet.twixt.Animation( {
      property: this.opacityProperty,
      duration: 0.5,
      to: 1,
      easing: phet.twixt.Easing.QUADRATIC_IN_OUT
    } );

    this.outAnimation = new phet.twixt.Animation( {
      property: this.opacityProperty,
      duration: 0.5,
      to: 0,
      delay: 2,
      easing: phet.twixt.Easing.QUADRATIC_IN_OUT
    } );

    this.inAnimation.then( this.outAnimation );
    this.inAnimation.start();
  }
}