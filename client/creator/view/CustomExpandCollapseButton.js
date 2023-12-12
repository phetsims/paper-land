/**
 * A button that expands/collapses some content. Custom from PhET's button in sun because that button does not allow
 * for customization of size/color/shape/etc.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ViewConstants from './ViewConstants.js';

export default class CustomExpandCollapseButton extends phet.scenery.Node {
  constructor( expandedProperty ) {
    super();

    // By inspection, this makes the button match the size of others on a ProgramNode.
    const symbolLength = 11;

    const plusSymbolShape = new phet.kite.Shape()
      .moveTo( symbolLength / 2, 0 )
      .lineTo( symbolLength / 2, symbolLength )
      .moveTo( 0, symbolLength / 2 )
      .lineTo( symbolLength, symbolLength / 2 );

    const minusSymbolShape = new phet.kite.Shape()
      .moveTo( -symbolLength / 2, 0 )
      .lineTo( symbolLength / 2, 0 );

    const symbolOptions = {
      lineWidth: 2,
      stroke: 'white',
      centerX: symbolLength / 2,
      centerY: symbolLength / 2
    };

    const plusSymbol = new phet.scenery.Path( plusSymbolShape, symbolOptions );
    const minusSymbol = new phet.scenery.Path( minusSymbolShape, symbolOptions );

    const toggleNode = new phet.sun.ToggleNode( expandedProperty, [
      {
        value: false,
        createNode: () => plusSymbol
      },
      {
        value: true,
        createNode: () => minusSymbol
      }
    ] );

    const pushButton = new phet.sun.RectangularPushButton( _.merge( {}, {
      content: toggleNode,
      listener: () => {
        expandedProperty.value = !expandedProperty.value;
      }
    }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );
    this.addChild( pushButton );
  }
}