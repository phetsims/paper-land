/**
 * Visibility controls for components in the CreatorView.
 */

import ViewConstants from './ViewConstants.js';

export default class CreatorVisibilityControls extends phet.sun.Panel {
  constructor( visibilityModel ) {

    const items = [
      {
        property: visibilityModel.viewConnectionsVisibleProperty,
        createNode: () => { return new phet.scenery.Text( 'Model-View connections', ViewConstants.TEXT_OPTIONS ); }
      },
      {
        property: visibilityModel.controllerConnectionsVisibleProperty,
        createNode: () => { return new phet.scenery.Text( 'Controller-Model connections', ViewConstants.TEXT_OPTIONS ); }
      },
      {
        property: visibilityModel.derivedConnectionsVisibleProperty,
        createNode: () => { return new phet.scenery.Text( 'Derived Value connections', ViewConstants.TEXT_OPTIONS ); }
      },
      {
        property: visibilityModel.listenerConnectionsVisibleProperty,
        createNode: () => { return new phet.scenery.Text( 'Link connections', ViewConstants.TEXT_OPTIONS ); }
      }
    ];

    const content = new phet.sun.VerticalCheckboxGroup( items, {
      checkboxOptions: {
        checkboxColor: ViewConstants.textFillColor,
        checkboxColorBackground: ViewConstants.BACKGROUND_COLOR
      }
    } );
    super( content, {
      fill: ViewConstants.BACKGROUND_COLOR,
      lineWidth: 4
    } );
  }
}