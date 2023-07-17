import ImageLoader from './ImageLoader.js';
import ViewConstants from './ViewConstants.js';

export default class ComponentListItemNode extends phet.scenery.Node {

  /**
   *
   * @param {Component} component
   * @param programWidth
   */
  constructor( component, programWidth ) {
    super();

    // @public (read-only) - to identify this ItemNode
    this.componentName = component.name;

    const content = new phet.scenery.HBox( { spacing: 5 } );
    this.addChild( content );

    this.connectionCircle = new phet.scenery.Circle( 2, {
      stroke: 'black'
    } );

    const nameText = new phet.scenery.Text( component.name, {
      font: new phet.scenery.Font( { size: 7 } ),
      maxWidth: programWidth * 0.65
    } );
    const circleWithText = new phet.scenery.HBox( { spacing: 2, children: [ this.connectionCircle, nameText ] } );

    const itemButtons = new phet.scenery.HBox( {
      spacing: 5
    } );

    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );
      const deleteButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => component.deleteEmitter.emit()
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      itemButtons.addChild( deleteButton );
    } );

    ImageLoader.loadImage( 'media/images/pencil-white.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );

      const editButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => component.editEmitter.emit()
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      itemButtons.addChild( editButton );
    } );

    content.children = [ circleWithText, itemButtons ];
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