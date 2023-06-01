import ImageLoader from './ImageLoader.js';
import ViewConstants from '../../common/ViewConstants.js';

export default class ComponentListItemNode extends phet.scenery.Node {
  constructor( namedProperty, programWidth ) {
    super();

    const content = new phet.scenery.HBox( { spacing: 5 } );
    this.addChild( content );

    const nameText = new phet.scenery.Text( namedProperty.name, {
      font: new phet.scenery.Font( { size: 7 } ),
      maxWidth: programWidth * 0.65
    } );
    content.children = [ nameText ];

    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );
      const deleteButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => namedProperty.deleteEmitter.emit()
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      content.children = [ nameText, deleteButton ];
    } );
  }
}