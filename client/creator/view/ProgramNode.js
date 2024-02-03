import ActiveEdit from '../model/ActiveEdit.js';
import EditType from '../model/EditType.js';
import ComponentListItemNode from './ComponentListItemNode.js';
import CustomExpandCollapseButton from './CustomExpandCollapseButton.js';
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
   * @param {Property<Bounds2>} availableBoundsProperty - total space available for programs
   * @param {Emitter} confirmRequestEmitter - for requesting confirmation from the user to delete this program
   */
  constructor( model, activeEditProperty, editEnabledProperty, availableBoundsProperty, confirmRequestEmitter ) {
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
      },
      enabledProperty: editEnabledProperty
    } ) );

    // Expands/collapses the program
    this.expandCollapseButton = new CustomExpandCollapseButton( model.expandedProperty );

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

    this.createButtonsVBox = new phet.scenery.VBox( {
      spacing: MARGIN,
      align: 'center',

      children: [
        this.createComponentButton,
        this.createListenerButton
      ]
    } );

    this.deleteButton = null;
    this.copyButton = null;
    this.customCodeIcon = null;

    // rendering order
    this.addChild( this.background );
    this.addChild( this.programNumber );
    this.addChild( this.titleText );
    this.addChild( this.allComponentsVBox );
    this.addChild( this.createButtonsVBox );
    this.addChild( this.expandCollapseButton );

    // collection of components that will contribute to layout bounds, to easily calculate height
    this.allComponents = [
      this.programNumber,
      this.titleText,
      this.allComponentsVBox,
      this.createButtonsVBox
    ];

    // Load after components needed for layout are set up.
    ImageLoader.loadImage( 'media/images/trash3-red.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.7
      } );
      this.deleteButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => {
          confirmRequestEmitter.emit( {
            message: `Are you sure you want to delete program ${model.numberProperty.value}? This cannot be undone.`,
            action: () => {
              model.deleteEmitter.emit();
            }
          } );
        },
        enabledProperty: editEnabledProperty
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      this.addChild( this.deleteButton );
      this.allComponents.push( this.deleteButton );

      this.layout();
    } );

    ImageLoader.loadImage( 'media/images/copy.svg', imageElement => {
      const imageNode = new phet.scenery.Image( imageElement, {
        scale: 0.7
      } );
      this.copyButton = new phet.sun.RectangularPushButton( _.merge( {}, {
        content: imageNode,
        listener: () => model.copyEmitter.emit(),
        enabledProperty: editEnabledProperty
      }, ViewConstants.RECTANGULAR_BUTTON_OPTIONS ) );

      this.addChild( this.copyButton );
      this.allComponents.push( this.copyButton );

      this.layout();
    } );

    ImageLoader.loadImage( 'media/images/magic-wand.svg', imageElement => {
      this.customCodeIcon = new phet.scenery.Image( imageElement, {
        scale: 1.3
      } );

      model.customCodeContainer.hasCustomCodeProperty.link( hasCustomCode => {
        this.customCodeIcon.visible = hasCustomCode;
        this.layout();
      } );

      // Place at the front of this HBox so that the icon comes first
      this.createButtonsVBox.insertChild( 0, this.customCodeIcon );
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
      },
      drag: () => {

        // Limit dragging to the available bounds
        this.keepInBounds( availableBoundsProperty.value );
      }
    } );
    this.addInputListener( dragListener );

    // Move this Node to the front after interaction with any of its components (so can't be in DragListener start)
    this.addInputListener( {
      down: () => {
        this.moveToFront();
      }
    } );

    // Don't pan the view with the dragged program, I find that annoying in this context.
    dragListener.setCreatePanTargetBounds( () => { return null; } );

    const registerComponentListListener = ( observableArray, parentNode ) => {
      observableArray.elementAddedEmitter.addListener( addedComponent => {
        const newItemNode = new ComponentListItemNode( model, addedComponent, WIDTH, model.activeEditProperty, editEnabledProperty, confirmRequestEmitter );
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

    model.expandedProperty.link( expanded => {

      this.allComponentsVBox.visible = expanded;
      this.createButtonsVBox.visible = expanded;
      this.layout();

      // make sure that the node is still in bounds after the layout
      this.keepInBounds( availableBoundsProperty.value );
    } );

    registerComponentListListener( model.modelContainer.allComponents, this.modelComponentList );
    registerComponentListListener( model.controllerContainer.allComponents, this.controllerComponentList );
    registerComponentListListener( model.viewContainer.allComponents, this.viewComponentList );
    registerComponentListListener( model.listenerContainer.allComponents, this.controllerComponentList );

    // initial layout
    this.layout();
  }

  /**
   * Keep this ProgramNode within the available bounds.
   */
  keepInBounds( availableBounds ) {
    const thisBounds = this.bounds;
    const newX = phet.dot.Utils.clamp( thisBounds.left, availableBounds.left, availableBounds.right - thisBounds.width );
    const newY = phet.dot.Utils.clamp( thisBounds.top, availableBounds.top, availableBounds.bottom - thisBounds.height );
    this.model.positionProperty.value = new phet.dot.Vector2( newX, newY );
  }

  /**
   * Returns the point in global coordinates where the 'connection point' is. This is where a displayed connection
   * wire should be placed. If the component name is not on this ProgramNode, null is returned.
   */
  getComponentListItemConnectionPoint( componentName ) {
    const componentListItemNode = _.find( this.allListItemNodes, componentListItemNode => {
      return componentListItemNode.componentName === componentName;
    } );

    let connectionPoint = null;
    if ( componentListItemNode ) {
      if ( this.model.expandedProperty.value ) {

        // the component is on this program, so return the global connection point - if the program is expanded then
        // we return the connection point in the global coordinate frame.
        connectionPoint = componentListItemNode.getGlobalConnectionPoint();
      }
      else {

        // the component is on this program, so return the global connection point - if the program is collapsed then
        connectionPoint = this.getGlobalTitleConnectionPoint();
      }
    }

    return connectionPoint;
  }

  /**
   * The connection point at the title of this program - used for all component connections on this program
   * when the program is collapsed.
   */
  getGlobalTitleConnectionPoint() {
    const globalTitleConnectionPoint = this.titleText.globalBounds.leftCenter;
    const panZoomMatrix = phet.scenery.animatedPanZoomSingleton.listener.matrixProperty.value.inverted();
    return panZoomMatrix.timesVector2( globalTitleConnectionPoint );
  }

  /**
   * Return the total height needed to fit the components in the provided list into a vertical layout container,
   * assuming that they are all stacked vertically with MARGIN between them.
   */
  getHeightForComponents( componentsList ) {
    return componentsList.reduce( ( accumulator, component ) => {
      const componentHeight = Math.max( 0, component.height );
      return accumulator + componentHeight + ( MARGIN * 2 );
    }, 0 );
  }

  /**
   * Layout for components that appear in the page.
   */
  layout() {

    if ( this.model.expandedProperty.value ) {

      // Make sure the rectangle is big enough for everything.
      const totalHeight = this.getHeightForComponents( this.allComponents );
      const backgroundHeight = Math.max( totalHeight, DEFAULT_HEIGHT );
      this.background.setRectHeight( backgroundHeight );
    }
    else {

      // When collapsed, we just display the title, number, and top buttons - at this time the top buttons are aligned
      // with the program number so we only have to consider the height of the title and number.
      const totalHeight = this.getHeightForComponents( [
        this.programNumber,
        this.titleText
      ] );

      // a little extra margin looks nicer in this collapsed state
      this.background.setRectHeight( totalHeight + OUTER_MARGIN * 2 );
    }

    // we cannot layout until all images are loaded
    if ( this.deleteButton && this.copyButton && this.customCodeIcon ) {
      this.expandCollapseButton.leftTop = this.background.leftTop.plusXY( OUTER_MARGIN, OUTER_MARGIN );
      this.programNumber.leftCenter = this.expandCollapseButton.rightCenter.plusXY( 5, 0 );
      this.titleText.leftTop = this.expandCollapseButton.leftBottom.plusXY( 0, MARGIN );
      this.deleteButton.rightTop = this.background.rightTop.plusXY( -OUTER_MARGIN, OUTER_MARGIN );
      this.copyButton.rightTop = this.deleteButton.leftTop.minusXY( 5, 0 );
      this.allComponentsVBox.leftTop = this.titleText.leftBottom.plusXY( 0, MARGIN );
      this.createButtonsVBox.centerBottom = this.background.centerBottom.plusXY( 0, -OUTER_MARGIN );
      this.customCodeIcon.centerBottom = this.createButtonsVBox.centerTop.minusXY( 0, MARGIN );
    }
  }
}