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
      fill: ViewConstants.buttonDisabledColor,
      stroke: 'black'
    } );
    this.addChild( panel );

    // Initially hidden until the client requests it.
    this.hide();
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}