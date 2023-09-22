/**
 * A Node that displays a warning when the space is "read-only", so it is clear that the user cannot make any changes.
 */

import ViewConstants from './ViewConstants.js';

export default class RestrictedWarningNode extends phet.scenery.Node {
  constructor() {
    super();

    const warningText = new phet.scenery.Text( 'This space is read-only.', {
      font: ViewConstants.TEXT_FONT_LARGE,
      fill: ViewConstants.ERROR_COLOR
    } );
    this.addChild( warningText );

    const panel = new phet.sun.Panel( warningText, {
      fill: ViewConstants.BACKGROUND_COLOR,
      stroke: 'black'
    } );
    this.addChild( panel );

    // Set up tween animation
    this.inAnimation = new phet.twixt.Animation( {
      property: warningText.opacityProperty,
      duration: 0.5,
      to: 1,
      easing: phet.twixt.Easing.QUADRATIC_IN_OUT
    } );

    this.outAnimation = new phet.twixt.Animation( {
      property: warningText.opacityProperty,
      duration: 0.5,
      to: 0.75,
      delay: 2,
      easing: phet.twixt.Easing.QUADRATIC_IN_OUT
    } );

    // These animations will chain
    this.inAnimation.then( this.outAnimation ).then( this.inAnimation );

    // Initially hidden until the client requests it.
    this.hide();
  }

  show() {
    this.visible = true;

    this.inAnimation.stop();
    this.outAnimation.stop();

    this.inAnimation.start();
  }

  hide() {
    this.visible = false;

    this.inAnimation.stop();
    this.outAnimation.stop();
  }
}