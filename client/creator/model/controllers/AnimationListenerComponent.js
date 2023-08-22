/**
 * A class for the animation listener component. Although it may not do much more than
 * a ListenerComponent, a subclass helps us distinguish this listener from others.
 */

import Component from '../Component.js';
import ListenerComponent from './ListenerComponent.js';

export default class AnimationListenerComponent extends ListenerComponent {
  constructor( name, controlledProperties, controlFunctionString ) {
    super( name, controlledProperties, controlFunctionString );
  }

  static fromData( data, namedProperties ) {
    const controlledProperties = Component.findComponentsByName( namedProperties, data.controlledPropertyNames );
    if ( controlledProperties.length < 1 ) {
      throw new Error( 'Could not find controlled properties for MultilinkController.' );
    }

    return new AnimationListenerComponent( data.name, controlledProperties, data.controlFunctionString );
  }
}