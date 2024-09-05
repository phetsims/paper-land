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
   * @param {Property<boolean>} editEnabledProperty
   * @param {Emitter} confirmRequestEmitter
   */
  constructor( program, component, programWidth, activeEditProperty, editEnabledProperty, confirmRequestEmitter ) {
    super();

    // @public (read-only) - to identify this ItemNode
    this.componentName = component.nameProperty.value;

    const highlightRectangle = new phet.scenery.Rectangle( 0, 0, 0, 0, {
      fill: 'yellow'
    } );
    this.addChild( highlightRectangle );

    const content = new phet.scenery.Node();
    this.addChild( content );

    this.inputConnectionCircle = new phet.scenery.Circle( 2, {
      stroke: 'black'
    } );

    this.outputConnectionCircle = new phet.scenery.Circle( 2, {
      stroke: 'black'
    } );

    const nameText = new phet.scenery.Text( this.componentName, {
      font: new phet.scenery.Font( { size: 7 } ),
      maxWidth: programWidth * 0.55
    } );

    const itemButtons = new phet.scenery.HBox( {
      spacing: 5
    } );

    // updates when the name changes
    component.nameProperty.link( name => {
      nameText.string = name;
      this.componentName = name;
    } );

    const layout = () => {

      // May not be finite while images are loading
      if ( itemButtons.bounds.isFinite() && content.bounds.isFinite() ) {

        nameText.leftCenter = this.inputConnectionCircle.rightCenter.plusXY( 2, 0 );
        itemButtons.leftCenter = nameText.rightCenter.plusXY( 5, 0 );
        this.outputConnectionCircle.leftCenter = itemButtons.rightCenter.plusXY( 5, 0 );

        highlightRectangle.setRect( 0, 0, content.width, content.height );
        highlightRectangle.center = content.center;
      }
    };

    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );
      const deleteButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => {
          confirmRequestEmitter.emit( {
            message: `Are you sure you want to delete ${component.nameProperty.value}? This cannot be undone.`,
            action: () => {
              component.deleteEmitter.emit();
            }
          } );
        },
        enabledProperty: editEnabledProperty
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      itemButtons.addChild( deleteButton );
      layout();
    } );

    ImageLoader.loadImage( 'media/images/pencil-white.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.5
      } );

      const editButton = new phet.sun.RectangularPushButton( _.merge( {}, {
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

    content.children = [ this.inputConnectionCircle, nameText, itemButtons, this.outputConnectionCircle ];
    layout();

    activeEditProperty.link( activeEdit => {
      highlightRectangle.visible = activeEdit && activeEdit.component === component;
      layout();
    } );
  }

  /**
   * Computes the connection point for either the input or output circle in the global coordinate frame.
   */
  getGlobalConnectionPoint( isInput ) {
    const targetNode = isInput ? this.inputConnectionCircle : this.outputConnectionCircle;
    const globalCenter = targetNode.getGlobalBounds().center;
    const matrix = phet.scenery.animatedPanZoomSingleton.listener.matrixProperty.value.inverted();
    return matrix.timesVector2( globalCenter );
  }
}