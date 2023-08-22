/**
 * A model that has state for visibility of various components in the Creator view (mostly
 * scenery side).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

export default class CreatorVisibilityModel {
  constructor() {

    // Visibility state for the types of connections
    this.derivedConnectionsVisibleProperty = new phet.axon.BooleanProperty( true );
    this.viewConnectionsVisibleProperty = new phet.axon.BooleanProperty( true );
    this.controllerConnectionsVisibleProperty = new phet.axon.BooleanProperty( true );
    this.listenerConnectionsVisibleProperty = new phet.axon.BooleanProperty( true );
  }
}