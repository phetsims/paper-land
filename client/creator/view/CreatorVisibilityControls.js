/**
 * Visibility controls for components in the CreatorView.
 */

import ViewConstants from './ViewConstants.js';

export default class CreatorVisibilityControls extends phet.sun.Panel {
  constructor( visibilityModel ) {

    const label = new phet.scenery.Text( 'Connections', ViewConstants.TEXT_OPTIONS_LARGE );

    const createLabel = ( text, color, lineDash ) => {
      return new phet.scenery.HBox( {
        spacing: 10,
        children: [
          new phet.scenery.Text( text, ViewConstants.TEXT_OPTIONS ),
          new phet.scenery.Line( 0, 0, 36, 0, { stroke: color, lineWidth: 2, lineDash: lineDash } )
        ]
      } );
    };

    const items = [
      {
        property: visibilityModel.viewConnectionsVisibleProperty,
        createNode: () => { return createLabel( 'Model-View', ViewConstants.VIEW_WIRE_COLOR, ViewConstants.VIEW_WIRE_LINE_DASH ); }
      },
      {
        property: visibilityModel.controllerConnectionsVisibleProperty,
        createNode: () => { return createLabel( 'Controller-Model', ViewConstants.CONTROLLER_WIRE_COLOR, ViewConstants.CONTROLLER_WIRE_LINE_DASH ); }
      },
      {
        property: visibilityModel.derivedConnectionsVisibleProperty,
        createNode: () => { return createLabel( 'Derived Value', ViewConstants.DERIVED_WIRE_COLOR, ViewConstants.DERIVED_WIRE_LINE_DASH ); }
      },
      {
        property: visibilityModel.listenerConnectionsVisibleProperty,
        createNode: () => { return createLabel( 'Link', ViewConstants.LINK_WIRE_COLOR, ViewConstants.LINK_WIRE_LINE_DASH ); }
      },
      {
        property: visibilityModel.arrayConnectionsVisibleProperty,
        createNode: () => { return createLabel( 'Array', ViewConstants.ARRAY_WIRE_COLOR, ViewConstants.ARRAY_WIRE_LINE_DASH ); }
      }
    ];

    const checkboxes = new phet.sun.VerticalCheckboxGroup( items, {
      checkboxOptions: {
        checkboxColor: ViewConstants.textFillColor,
        checkboxColorBackground: ViewConstants.BACKGROUND_COLOR
      }
    } );

    const content = new phet.scenery.VBox( {
      spacing: 15,
      children: [ label, checkboxes ],
      align: 'center'
    } );

    super( content, {
      fill: ViewConstants.BACKGROUND_COLOR,
      xMargin: 10,
      yMargin: 10,
      lineWidth: 4
    } );
  }
}