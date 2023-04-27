/**
 * Collection of Emitters that notify where there is some change to markers (added/removed/changed position).
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import paperLand from './paperLand.js';

const markersAddedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: Array } ] } );
const markersRemovedEmitter = new phet.axon.Emitter( { parameters: [ { valueType: Array } ] } );
const markersChangedPositionEmitter = new phet.axon.Emitter( { parameters: [ { valueType: Array } ] } );

// add to the paperLand namespace
paperLand.markersAddedEmitter = markersAddedEmitter;
paperLand.markersRemovedEmitter = markersRemovedEmitter;
paperLand.markersChangedPositionEmitter = markersChangedPositionEmitter;

export { markersAddedEmitter, markersRemovedEmitter, markersChangedPositionEmitter };