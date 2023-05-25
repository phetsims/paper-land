import ActiveEdit from '../model/ActiveEdit.js';
import EditType from '../model/EditType.js';
import ViewConstants from './ViewConstants.js';

// margins for UI components within the program
const MARGIN = 2;

const WIDTH = 70;

const BUTTON_OPTIONS = _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {

  font: ViewConstants.PROGRAM_FONT,
  minWidth: WIDTH - 5,
  minHeight: 10,
  maxHeight: 10,
  maxTextWidth: WIDTH - 20,
  xMargin: 3,
  yMargin: 0
} );

export default class ProgramNode extends phet.scenery.Node {

  /**
   * @param {ProgramModel} model
   * @param {Bounds2} deleteAreaGlobalBounds - The global bounds of the delete area - when program is released over
   *                                           these bounds it is removed.
   * @param {Property<null|ActiveEdit>} activeEditProperty
   */
  constructor( model, deleteAreaGlobalBounds, activeEditProperty ) {
    super();

    const background = new phet.scenery.Rectangle( 0, 0, WIDTH, 90, {
      fill: 'white',
      stroke: 'black'
    } );

    const titleText = new phet.scenery.Text( '', {
      maxWidth: background.width - 5
    } );
    const programNumber = new phet.scenery.Text( model.number, {
      maxWidth: background.width - 5
    } );

    // Creates a new "component"
    const createComponentButton = new phet.sun.TextPushButton( 'Create Component', _.merge( {}, BUTTON_OPTIONS, {
      listener: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.COMPONENT );
      }
    } ) );

    // Creates a new "listener" to a paper event
    const createListenerButton = new phet.sun.TextPushButton( 'Create Listener', _.merge( {}, BUTTON_OPTIONS, {
      listener: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.LISTENER );
      }
    } ) );

    // rendering order
    this.addChild( background );
    this.addChild( programNumber );
    this.addChild( titleText );
    this.addChild( createComponentButton );
    this.addChild( createListenerButton );

    // layout
    programNumber.leftTop = background.leftTop.plusXY( MARGIN, MARGIN );
    titleText.leftTop = programNumber.leftBottom.plusXY( 0, MARGIN );
    createListenerButton.centerBottom = background.centerBottom.plusXY( 0, -MARGIN );
    createComponentButton.centerBottom = createListenerButton.centerTop.minusXY( 0, MARGIN );

    // listeners
    model.positionProperty.link( position => {
      this.leftTop = position;
    } );

    model.titleProperty.link( title => {
      titleText.string = title;
    } );

    const dragListener = new phet.scenery.DragListener( {
      positionProperty: model.positionProperty,
      start: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.METADATA );
      },
      drag: () => {

        if ( this.globalBounds.intersectsBounds( deleteAreaGlobalBounds ) ) {
          background.stroke = ViewConstants.ERROR_COLOR;
        }
        else {
          background.stroke = 'black';
        }
      },
      end: () => {
        if ( this.globalBounds.intersectsBounds( deleteAreaGlobalBounds ) ) {
          model.deleteEmitter.emit();
        }
      }
    } );
    this.addInputListener( dragListener );

    // Don't pan the view with the dragged program, I find that annoying in this context and prevents dragging programs
    // to the delete area.
    dragListener.setCreatePanTargetBounds( () => { return null; } );
  }
}