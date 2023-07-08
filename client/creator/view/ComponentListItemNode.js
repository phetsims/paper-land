import ImageLoader from './ImageLoader.js';
import ViewConstants from './ViewConstants.js';

export default class ComponentListItemNode extends phet.scenery.Node {
  constructor( namedProperty, programWidth ) {
    super();

    // @public (read-only) - to identify this ItemNode
    this.componentName = namedProperty.name;

    const content = new phet.scenery.HBox( { spacing: 5 } );
    this.addChild( content );

    this.connectionCircle = new phet.scenery.Circle( 2, {
      stroke: 'black'
    } );

    const nameText = new phet.scenery.Text( namedProperty.name, {
      font: new phet.scenery.Font( { size: 7 } ),
      maxWidth: programWidth * 0.65
    } );
    const circleWithText = new phet.scenery.HBox( { spacing: 2, children: [ this.connectionCircle, nameText ] } );
    content.children = [ circleWithText ];

    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );
      const deleteButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => namedProperty.deleteEmitter.emit()
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      content.children = [ circleWithText, deleteButton ];
    } );
  }

  /**
   * The center of the connection point circle in the global coordinate frame.
   * @returns {phet.dot.Vector2}
   */
  getGlobalConnectionPoint() {
    const globalCenter = this.connectionCircle.getGlobalBounds().center;
    const matrix = phet.scenery.animatedPanZoomSingleton.listener.matrixProperty.value.inverted();
    return matrix.timesVector2( globalCenter );
  }
}