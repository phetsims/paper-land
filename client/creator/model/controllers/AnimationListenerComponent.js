/**
 * A class for the animation listener component. Although it may not do much more than
 * a ListenerComponent, a subclass helps us distinguish this listener from others.
 */

import ListenerComponent from './ListenerComponent.js';

export default class AnimationListenerComponent extends ListenerComponent {
  constructor( name, controlledProperties, controlFunctionString ) {
    super( name, controlledProperties, controlFunctionString );
  }
}