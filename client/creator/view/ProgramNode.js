import ActiveEdit from '../model/ActiveEdit.js';
import EditType from '../model/EditType.js';
import ComponentListItemNode from './ComponentListItemNode.js';
import ImageLoader from './ImageLoader.js';
import ViewConstants from './ViewConstants.js';

// default dimensions of a paper, though it may change as components are added
const WIDTH = 150;
const DEFAULT_HEIGHT = 180;

// margins for UI components within the program
const MARGIN = 2;
const BACKGROUND_LINE_WIDTH = 1;
const SEPARATOR_LINE_WIDTH = WIDTH - MARGIN - BACKGROUND_LINE_WIDTH;

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
   * @param {Property<null|ActiveEdit>} activeEditProperty
   */
  constructor( model, activeEditProperty ) {
    super();
    this.model = model;

    // {ComponentListItemNode[]} - Reference to all list item nodes so we can get positioning and connection points
    this.allListItemNodes = [];

    this.background = new phet.scenery.Rectangle( 0, 0, WIDTH, DEFAULT_HEIGHT, {
      lineWidth: BACKGROUND_LINE_WIDTH,
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
      align: 'left',
      spacing: MARGIN
    } );

    this.topSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
    } );

    // A separator after the model components
    this.modelSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
    } );

    this.controllerComponentList = new phet.scenery.VBox( {
      align: 'left',
      spacing: MARGIN
    } );

    // A separator after the controller components
    this.controllerSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
    } );

    this.viewComponentList = new phet.scenery.VBox( {
      align: 'left',
      spacing: MARGIN
    } );

    this.viewSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
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

    this.allComponentsVBox = new phet.scenery.VBox( {
      spacing: MARGIN * 2,
      align: 'left',
      children: [
        this.topSeparator,
        this.modelComponentList,
        this.modelSeparator,
        this.controllerComponentList,
        this.controllerSeparator,
        this.viewComponentList,
        this.viewSeparator
      ]
    } );

    // A parent is made eagerly for the button, which won't be available intil the image
    // is loaded. But it is ready for use immediately.
    this.deleteButtonParent = new phet.scenery.Node();
    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.7
      } );
      const button = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => model.deleteEmitter.emit()
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      this.deleteButtonParent.addChild( button );
      this.layout();
    } );


    // rendering order
    this.addChild( this.background );
    this.addChild( this.programNumber );
    this.addChild( this.titleText );
    this.addChild( this.deleteButtonParent );
    this.addChild( this.allComponentsVBox );
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
      }
    } );
    this.addInputListener( dragListener );

    // Don't pan the view with the dragged program, I find that annoying in this context.
    dragListener.setCreatePanTargetBounds( () => { return null; } );

    const registerComponentListListener = ( observableArray, parentNode ) => {
      observableArray.elementAddedEmitter.addListener( addedComponent => {
        const newItemNode = new ComponentListItemNode( model, addedComponent, WIDTH, model.activeEditProperty );
        parentNode.addChild( newItemNode );

        this.allListItemNodes.push( newItemNode );

        // the trashcan icon is loaded asynchronously, so we need to wait for it to load before we can layout
        const boundLayout = this.layout.bind( this );
        newItemNode.boundsProperty.lazyLink( boundLayout );

        // remove and dispose of the view component when the model component is removed
        const removalListener = removedComponent => {
          if ( addedComponent === removedComponent ) {
            parentNode.removeChild( newItemNode );
            this.allListItemNodes.splice( this.allListItemNodes.indexOf( newItemNode ), 1 );
            newItemNode.boundsProperty.unlink( boundLayout );
            newItemNode.dispose();

            observableArray.elementRemovedEmitter.removeListener( removalListener );

            this.layout();
          }
        };
        observableArray.elementRemovedEmitter.addListener( removalListener );

        this.layout();
      } );
    };

    registerComponentListListener( model.modelContainer.allComponents, this.modelComponentList );
    registerComponentListListener( model.controllerContainer.allComponents, this.controllerComponentList );
    registerComponentListListener( model.viewContainer.allComponents, this.viewComponentList );

    // collection of components that will contribute to layout bounds, to easily calculate height
    this.allComponents = [
      this.programNumber,
      this.titleText,
      this.allComponentsVBox,
      this.createListenerButton,
      this.createComponentButton
    ];

    // initial layout
    this.layout();
  }

  getComponentListItemConnectionPoint( componentName ) {
    const componentListItemNode = _.find( this.allListItemNodes, componentListItemNode => {
      return componentListItemNode.componentName === componentName;
    } );
    return componentListItemNode ? componentListItemNode.getGlobalConnectionPoint() : null;
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

    // Visibility of lists toggles visibility of separators (scenery dynamic layout feature)
    this.modelSeparator.visible = this.modelComponentList.children.length > 0;
    this.controllerSeparator.visible = this.controllerComponentList.children.length > 0;
    this.viewSeparator.visible = this.viewComponentList.children.length > 0;

    this.programNumber.leftTop = this.background.leftTop.plusXY( MARGIN, MARGIN );
    this.titleText.leftTop = this.programNumber.leftBottom.plusXY( 0, MARGIN );
    this.deleteButtonParent.rightTop = this.background.rightTop.plusXY( -MARGIN, MARGIN );
    this.allComponentsVBox.leftTop = this.titleText.leftBottom.plusXY( 0, MARGIN );
    this.createListenerButton.centerBottom = this.background.centerBottom.plusXY( 0, -MARGIN );
    this.createComponentButton.centerBottom = this.createListenerButton.centerTop.minusXY( 0, MARGIN );
  }
}