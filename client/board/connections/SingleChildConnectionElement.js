/**
 * A ConnectionElement that can only have one child.
 */

import paperLand from './../paperLand.js';

import ConnectionElement from './ConnectionElement.js';

export default class SingleChildConnectionElement extends ConnectionElement {
  constructor() {
    super();
  }

  // Add a child (and its subtree) to this ConnectionElement, if there is not already a child
  addChild( element ) {
    if ( this.children.length === 0 ) {
      super.addChild( element );
    }
  }
}

// add this constructor to the paperLand namespace
paperLand.SingleChildConnectionElement = SingleChildConnectionElement;