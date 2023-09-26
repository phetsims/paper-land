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

// margin between all components in the program and the background rectangle
const OUTER_MARGIN = 5;
const BACKGROUND_LINE_WIDTH = 1;
const SEPARATOR_LINE_WIDTH = WIDTH - OUTER_MARGIN * 2 - BACKGROUND_LINE_WIDTH * 2;

const TITLE_FONT = new phet.scenery.Font( { size: 12 } );
const HEADING_FONT = new phet.scenery.Font( { size: 9 } );

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
   * @param {Property<boolean>} editEnabledProperty
   */
  constructor( model, activeEditProperty, editEnabledProperty ) {
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
      maxWidth: this.background.width - 5,
      font: TITLE_FONT
    } );
    this.programNumber = new phet.scenery.Text( model.numberProperty.value, {
      maxWidth: this.background.width - 5,
      font: TITLE_FONT
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

    this.modelHeading = new phet.scenery.Text( 'Model', {
      font: HEADING_FONT
    } );

    this.controllerComponentList = new phet.scenery.VBox( {
      align: 'left',
      spacing: MARGIN
    } );

    // A separator after the controller components
    this.controllerSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
    } );

    this.controllerHeading = new phet.scenery.Text( 'Controller', {
      font: HEADING_FONT
    } );

    this.viewComponentList = new phet.scenery.VBox( {
      align: 'left',
      spacing: MARGIN
    } );

    this.viewSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
    } );

    this.viewHeading = new phet.scenery.Text( 'View', {
      font: HEADING_FONT
    } );

    this.listenerSeparator = new phet.scenery.Line( 0, 0, SEPARATOR_LINE_WIDTH, 0, {
      stroke: 'rgb(100,100,100)'
    } );

    this.listenerHeading = new phet.scenery.Text( 'Listener', {
      font: HEADING_FONT
    } );

    // Creates a new "component"
    this.createComponentButton = new phet.sun.TextPushButton( 'Create Component', _.merge( {}, BUTTON_OPTIONS, {
      listener: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.COMPONENT );
      },
      enabledProperty: editEnabledProperty
    } ) );

    // Creates a new "listener" to a paper event
    this.createListenerButton = new phet.sun.TextPushButton( 'Custom Code', _.merge( {}, BUTTON_OPTIONS, {
      listener: () => {
        activeEditProperty.value = new ActiveEdit( model, EditType.CUSTOM_CODE );
      }
    } ) );

    this.allComponentsVBox = new phet.scenery.VBox( {
      spacing: MARGIN * 2,
      align: 'left',
      children: [
        this.topSeparator,

        this.modelHeading,
        this.modelComponentList,
        this.modelSeparator,

        this.controllerHeading,
        this.controllerComponentList,
        this.controllerSeparator,

        this.viewHeading,
        this.viewComponentList,
        this.viewSeparator
      ]
    } );

    // A parent is made eagerly for components with images, which won't be available intil the image
    // is loaded. But the parent is ready for layout immediately
    this.deleteButtonParent = new phet.scenery.Node();
    this.customCodeIconParent = new phet.scenery.Node();

    // rendering order
    this.addChild( this.background );
    this.addChild( this.programNumber );
    this.addChild( this.titleText );
    this.addChild( this.deleteButtonParent );
    this.addChild( this.allComponentsVBox );
    this.addChild( this.customCodeIconParent );
    this.addChild( this.createComponentButton );
    this.addChild( this.createListenerButton );

    // collection of components that will contribute to layout bounds, to easily calculate height
    this.allComponents = [
      this.programNumber,
      this.titleText,
      this.deleteButtonParent,
      this.allComponentsVBox,
      this.customCodeIconParent,
      this.createListenerButton,
      this.createComponentButton
    ];

    // Load after components needed for layout are set up.
    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.7
      } );
      const button = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => model.deleteEmitter.emit(),
        enabledProperty: editEnabledProperty
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      this.deleteButtonParent.addChild( button );
      this.layout();
    } );

    ImageLoader.loadImage( 'media/images/magic-wand.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 1.3
      } );

      this.customCodeIconParent.addChild( imageNode );
      this.layout();
    } );

    // listeners
    model.positionProperty.link( position => {
      this.leftTop = position;
    } );

    model.titleProperty.link( title => {
      this.titleText.string = title;
    } );

    model.numberProperty.link( number => {
      this.programNumber.string = number;
    } );

    model.customCodeContainer.hasCustomCodeProperty.link( hasCustomCode => {
      this.customCodeIconParent.visible = hasCustomCode;
    } );

    // When the ActiveEdit is working with this program, draw a highlight indicator around this rectangle
    activeEditProperty.link( activeEdit => {
      if ( activeEdit && activeEdit.program && activeEdit.program.numberProperty.value === model.numberProperty.value ) {
        this.background.lineWidth = 5;
        this.background.lineDash = [ 10, 5 ];
        this.background.stroke = '#6C8EAC';
      }
      else {
        this.background.lineWidth = 1;
        this.background.lineDash = [];
        this.background.stroke = 'black';
      }
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
        const newItemNode = new ComponentListItemNode( model, addedComponent, WIDTH, model.activeEditProperty, editEnabledProperty );
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
    registerComponentListListener( model.listenerContainer.allComponents, this.controllerComponentList );

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

    this.programNumber.leftTop = this.background.leftTop.plusXY( OUTER_MARGIN, OUTER_MARGIN );
    this.titleText.leftTop = this.programNumber.leftBottom.plusXY( 0, MARGIN );
    this.deleteButtonParent.rightTop = this.background.rightTop.plusXY( -OUTER_MARGIN, OUTER_MARGIN );
    this.allComponentsVBox.leftTop = this.titleText.leftBottom.plusXY( 0, MARGIN );
    this.createListenerButton.centerBottom = this.background.centerBottom.plusXY( 0, -OUTER_MARGIN );
    this.createComponentButton.centerBottom = this.createListenerButton.centerTop.minusXY( 0, MARGIN );
    this.customCodeIconParent.centerBottom = this.createComponentButton.centerTop.minusXY( 0, MARGIN );
  }
}