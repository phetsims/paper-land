import ActiveEdit from '../model/ActiveEdit.js';
import EditType from '../model/EditType.js';
import ImageLoader from './ImageLoader.js';
import ViewConstants from './ViewConstants.js';

export default class ComponentListItemNode extends phet.scenery.Node {

  /**
   * @param {ProgramModel} program
   * @param {Component} component
   * @param programWidth
   * @param {Property<ActiveEdit|null>} activeEditProperty
   */
  constructor( program, component, programWidth, activeEditProperty ) {
    super();

    // @public (read-only) - to identify this ItemNode
    this.componentName = component.nameProperty.value;

    const highlightRectangle = new phet.scenery.Rectangle( 0, 0, 0, 0, {
      fill: 'yellow'
    } );
    this.addChild( highlightRectangle );

    const content = new phet.scenery.HBox( { spacing: 5 } );
    this.addChild( content );

    this.connectionCircle = new phet.scenery.Circle( 2, {
      stroke: 'black'
    } );

    const nameText = new phet.scenery.Text( this.componentName, {
      font: new phet.scenery.Font( { size: 7 } ),
      maxWidth: programWidth * 0.65
    } );
    const circleWithText = new phet.scenery.HBox( { spacing: 2, children: [ this.connectionCircle, nameText ] } );

    const itemButtons = new phet.scenery.HBox( {
      spacing: 5
    } );

    const layout = () => {

      // May not be finite while images are loading
      if ( content.bounds.isFinite() ) {
        highlightRectangle.setRect( 0, 0, content.width, content.height );
      }
    };

    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );
      const deleteButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => component.deleteEmitter.emit()
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      itemButtons.addChild( deleteButton );
      layout();
    } );

    ImageLoader.loadImage( 'media/images/pencil-white.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );

      const editButton = new phet.sun.RectangularPushButton( _.merge( {}, {

        // This button is hidden for now, until it is further supported.
        visible: false,

        content: imageNode,
        listener: () => {
          activeEditProperty.value = new ActiveEdit(
            program,
            EditType.COMPONENT,
            component
          );
        }
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      itemButtons.addChild( editButton );
      layout();
    } );

    content.children = [ circleWithText, itemButtons ];
    layout();

    activeEditProperty.link( activeEdit => {
      highlightRectangle.visible = activeEdit && activeEdit.component === component;
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