/**
 * A model that has state for visibility of various components in the Creator view (mostly
 * scenery side).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

export default class CreatorVisibilityModel {
  constructor() {

    // Visibility state for the types of connections
    this.viewConnectionsVisibleProperty = new phet.axon.BooleanProperty( true );
    this.controllerConnectionsVisibleProperty = new phet.axon.BooleanProperty( true );
    this.listenerConnectionsVisibleProperty = new phet.axon.BooleanProperty( false );
    this.derivedConnectionsVisibleProperty = new phet.axon.BooleanProperty( false );

    // Displays connections between array items and their arrays and components that
    // are inside the array items.
    this.arrayConnectionsVisibleProperty = new phet.axon.BooleanProperty( false );
  }
}