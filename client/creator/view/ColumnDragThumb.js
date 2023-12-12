import ViewConstants from './ViewConstants.js';

// shape constants for the dots on the thumb to make it look draggable
const DOT_RADIUS = 3;
const DOT_SPACING = 10;
const DOT_COUNT = 4;
const DOT_COLUMS = 2;

export default class ColumnDragThumb extends phet.scenery.Node {
  constructor( displayColumnWidthProperty ) {
    super();

    const thumb = new phet.scenery.Rectangle( 0, 0, 45, 100, 5, 5, {
      fill: ViewConstants.buttonFillColor,
      stroke: ViewConstants.textFillColor,
      cursor: 'pointer'
    } );
    this.addChild( thumb );

    // small circles to make this look draggable
    const knobShape = new phet.kite.Shape();
    for ( let i = 0; i < DOT_COLUMS; i++ ) {
      for ( let j = 0; j < DOT_COUNT; j++ ) {
        knobShape.circle( i * DOT_SPACING, DOT_SPACING * j + DOT_RADIUS, DOT_RADIUS );
      }
    }
    const knobPath = new phet.scenery.Path( knobShape, {
      fill: ViewConstants.textFillColor
    } );
    this.addChild( knobPath );

    knobPath.center = thumb.center;

    const dragListener = new phet.scenery.DragListener( {
      drag: event => {
        const valueRange = displayColumnWidthProperty.range;

        // We use clientX and window.innerWidth instead of scenery information because the drag will
        // resize the display and the scenery.Pointer locations temporarily incorrect.
        const proposedValue = Math.max( 0, Math.min( 1, event.domEvent.clientX / window.innerWidth ) );
        displayColumnWidthProperty.set( valueRange.constrainValue( proposedValue ) );
      }
    } );
    thumb.addInputListener( dragListener );
  }
}