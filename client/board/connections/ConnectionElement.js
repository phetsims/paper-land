/**
 * A base class for an element that can be connected to others in a tree like data structure.
 */

import paperLand from './../paperLand.js';

export default class ConnectionElement {
  constructor() {
    this.children = [];
    this.parent = null;

    this.subtreeChangedEmitter = new phet.axon.Emitter();

    this._elementData = null;
  }

  /**
   * Set some data on this connection element.
   * @param elementData
   */
  setElementData( elementData ) {
    this._elementData = elementData;
  }

  /**
   * Get the assigned element data on this connection element.
   */
  getElementData() {
    return this._elementData;
  }

  // Add a child (and its subtree) to this ConnectionElement
  addChild( element ) {

    // only add as a child if the other element has not been added and if this element
    // is not already a child (easy to happen with whisker connections)
    if ( element.parent === null && !element.children.includes( this ) ) {
      this.children.push( element );
      element.parent = this;

      // Walk up the tree and notify ancestors that the subtree has changed
      element.walkUpTree( ancestor => {
        ancestor.subtreeChangedEmitter.emit();
      } );
    }
  }

  // Remove a child (and its subtree) from this connectionElement
  removeChild( element ) {
    const indexOfElement = this.children.indexOf( element );
    if ( indexOfElement > -1 ) {
      this.children.splice( indexOfElement, 1 );

      // Walk up the tree and notify ancestors that the subtree has changed
      element.walkUpTree( ancestor => {
        ancestor.subtreeChangedEmitter.emit();
      } );

      element.parent = null;
    }
  }

  /**
   * Recursively walk towards the root, calling the provided callbacks. Callbacks start on the parent, and do not
   * include this element.
   * @param {(element: ConnectionElement) => void} callback
   */
  walkUpTree( callback ) {
    if ( this.parent ) {
      callback( this.parent );
      this.parent.walkUpTree( callback );
    }
  }

  /**
   * Recursively walk down the tree, calling the provided callbacks. Callbacks start on the children, and do not
   * include this element.
   * @param {(element: ConnectionElement) => void} callback
   */
  walkDownTree( callback ) {
    this.children.forEach( child => {
      callback( child );
      child.walkDownTree( callback );
    } );
  }

  /**
   * Detach from the graph entirely, removing self from parents and removing any children
   */
  dispose() {

    // remove self from any parents
    if ( this.parent ) {
      this.parent.removeChild( this );
    }

    // remove any children
    this.children.forEach( child => {
      this.removeChild( child );
    } );
  }
}

// add this constructor to the paperLand namespace
paperLand.ConnectionElement = ConnectionElement;