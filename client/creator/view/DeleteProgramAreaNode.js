import ImageLoader from './ImageLoader.js';
import ViewConstants from '../../common/ViewConstants.js';

export default class DeleteProgramAreaNode extends phet.scenery.Node {
  constructor() {
    super();

    const outlineRectangle = new phet.scenery.Rectangle( 0, 0, 120, 120, {
      stroke: ViewConstants.ERROR_COLOR,
      fill: ViewConstants.BACKGROUND_COLOR.withAlpha( 0.6 )
    } );
    this.addChild( outlineRectangle );

    ImageLoader.loadImage( 'media/images/trash3.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 5,
        center: outlineRectangle.center
      } );
      this.addChild( imageNode );
    } );

    this.addInputListener( {
      down: event => {
        console.log( 'herlly' );
      }
    } );
  }
}