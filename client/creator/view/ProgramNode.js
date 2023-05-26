import ActiveEdit from '../model/ActiveEdit.js';
import EditType from '../model/EditType.js';
import ComponentListItemNode from './ComponentListItemNode.js';
import ViewConstants from './ViewConstants.js';

// margins for UI components within the program
const MARGIN = 2;

// default dimensions of a paper, though it may change as components are added
const WIDTH = 70;
const DEFAULT_HEIGHT = 90;

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

    this.background = new phet.scenery.Rectangle( 0, 0, WIDTH, DEFAULT_HEIGHT, {
      fill: 'white',
      stroke: 'black'
    } );

    this.titleText = new phet.scenery.Text( '', {
      maxWidth: this.background.width - 5
    } );
    this.programNumber = new phet.scenery.Text( model.number, {
      maxWidth: this.background.width - 5
    } );

    // Displays all of the model components of this program
    this.modelComponentList = new phet.scenery.VBox( {
      spacing: MARGIN
    } );

    // Creates a new "component"
    this.createComponentButton = new phet.sun.TextPushButton( 'Create Component', _.merge( {}, BUTTON_OPTIONS, {
      listener: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.COMPONENT );
      }
    } ) );

    // Creates a new "listener" to a paper event
    this.createListenerButton = new phet.sun.TextPushButton( 'Create Listener', _.merge( {}, BUTTON_OPTIONS, {
      listener: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.LISTENER );
      }
    } ) );

    // rendering order
    this.addChild( this.background );
    this.addChild( this.programNumber );
    this.addChild( this.titleText );
    this.addChild( this.modelComponentList );
    this.addChild( this.createComponentButton );
    this.addChild( this.createListenerButton );

    // listeners
    model.positionProperty.link( position => {
      this.leftTop = position;
    } );

    model.titleProperty.link( title => {
      this.titleText.string = title;
    } );

    const dragListener = new phet.scenery.DragListener( {
      positionProperty: model.positionProperty,
      start: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.METADATA );
      },
      drag: () => {

        if ( this.globalBounds.intersectsBounds( deleteAreaGlobalBounds ) ) {
          this.background.stroke = ViewConstants.ERROR_COLOR;
        }
        else {
          this.background.stroke = 'black';
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

    model.modelContainer.allComponents.elementAddedEmitter.addListener( addedNamedProperty => {
      const newItemNode = new ComponentListItemNode( addedNamedProperty, WIDTH );
      this.modelComponentList.addChild( newItemNode );

      // remove and dispose of the view component when it is removed
      const removalListener = removedNamedProperty => {
        if ( addedNamedProperty === removedNamedProperty ) {
          this.modelComponentList.removeChild( newItemNode );
          newItemNode.dispose();

          model.modelContainer.allComponents.elementRemovedEmitter.removeListener( removalListener );

          this.layout();
        }
      };
      model.modelContainer.allComponents.elementRemovedEmitter.addListener( removalListener );

      this.layout();
    } );

    // collection of components that will contribute to layout bounds
    this.allComponents = [ this.programNumber, this.titleText, this.modelComponentList, this.createListenerButton, this.createComponentButton ];

    // initial layout
    this.layout();
  }

  /**
   * Layout for components that appear in the page.
   */
  layout() {

    // Make sure the retangle is big enough for everything.
    const totalHeight = this.allComponents.reduce( ( accumulator, component ) => {
      const componentHeight = Math.max( 0, component.height );
      return accumulator + componentHeight + ( MARGIN * 2 );
    }, 0 );
    const backgroundHeight = Math.max( totalHeight, DEFAULT_HEIGHT );
    this.background.setRectHeight( backgroundHeight );

    this.programNumber.leftTop = this.background.leftTop.plusXY( MARGIN, MARGIN );
    this.titleText.leftTop = this.programNumber.leftBottom.plusXY( 0, MARGIN );
    this.modelComponentList.leftTop = this.titleText.leftBottom.plusXY( 0, MARGIN );
    this.createListenerButton.centerBottom = this.background.centerBottom.plusXY( 0, -MARGIN );
    this.createComponentButton.centerBottom = this.createListenerButton.centerTop.minusXY( 0, MARGIN );
  }
}