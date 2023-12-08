import ViewConstants from './ViewConstants.js';

export default class ColumnDragThumb extends phet.scenery.Node {
  constructor( displayColumnWidthProperty ) {
    super();

    const thumb = new phet.scenery.Rectangle( 0, 0, 30, 100, {
      stroke: ViewConstants.focusHighlightColor,
      lineWidth: 4
    } );
    this.addChild( thumb );

    const dragListener = new phet.scenery.DragListener( {
      drag: event => {
        const valueRange = displayColumnWidthProperty.range;
        const proposedValue = Math.max( 0, Math.min( 1, event.pointer.point.x / window.innerWidth ) );
        displayColumnWidthProperty.set( valueRange.constrainValue( proposedValue ) );
      }
    } );
    thumb.addInputListener( dragListener );
  }
}