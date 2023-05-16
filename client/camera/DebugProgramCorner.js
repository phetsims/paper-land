/**
 * When a DebugProgram is cut, it will turn into 4 DebugProgramCorners that can be dragged in the camera view.
 * This is the view element to support that.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import React from 'react';
import styles from './DebugProgram.css';

export default class DebugProgramCorner extends React.Component {
  constructor( props ) {
    super( props );

    // {function|null} - if provided, a button will be included on this corner that
    // fully removes the program
    this.removeProgram = props.removeProgram;

    // {function|null} - if provided, a button will be included on this corner that
    // will recombine the program into one
    this.collapseProgram = props.collapseProgram;

    // {number} - the number of this program
    this.programNumber = props.programNumber;

    // {string} - tl | bl | tr | br - label for this corner
    this.programCorner = props.programCorner;

    // {(() => DOMElement)|undefined} - A reference to the element of the camera view, for bounds calculations
    // while dragging
    this.getCameraWindowElement = props.getCameraWindowElement;

    // {function(x, y)} - called when the corner is dragged, in this function you should set the program
    // points as desired. (x,y) are the corner points in the normalized coordinates relative to the camera
    // frame.
    this.updateProgramCornerPosition = this.props.updateProgramCornerPosition;

    // A reference to this DOM element, to support drag and drop
    this._el = null;

    this.state = {

      // is it grabbed by a mouse?
      grabbed: false,

      // Mouse offset on initial press for intuitive dragging
      grabbedOffset: { x: 0, y: 0 }
    };
  }

  /**
   * Handle the down event. Deletes the program if target is the close button. Otherwise begins drag
   * events on this element.
   */
  _onMouseDown = event => {
    if ( event.target === this._closeEl ) {
      this.removeProgram();
      return;
    }

    const rect = this._el.getBoundingClientRect();
    const x = event.clientX - rect.x - rect.width / 2;
    const y = event.clientY - rect.y - rect.width / 2;

    this.setState( {
      grabbed: true,
      grabbedOffset: { x, y }
    } );
    document.addEventListener( 'mouseup', this._onMouseUp, false );
    document.addEventListener( 'mousemove', this._onMouseMove, false );
  };

  /**
   * Releases this element when the mouse goes up.
   */
  _onMouseUp = () => {
    this.setState( { grabbed: false } );
    document.removeEventListener( 'mouseup', this._onMouseUp, false );
    document.removeEventListener( 'mousemove', this._onMouseMove, false );
  };

  /**
   * If grabbed, moves this corner and updates the program position at this corner.
   */
  _onMouseMove = event => {
    if ( this.state.grabbed && this.getCameraWindowElement && this.getCameraWindowElement() ) {
      const rect = this._el.getBoundingClientRect();

      // dimensions of the video window
      const parentRect = this.getCameraWindowElement().getBoundingClientRect();

      const x = event.clientX - this.props.cornerPosition.x - this.state.grabbedOffset.x;
      const y = event.clientY - this.props.cornerPosition.y - ( rect.height / 2 ) - this.state.grabbedOffset.y;

      const normx = x / parentRect.width;
      const normy = y / parentRect.height;

      this.updateProgramCornerPosition( normx, normy );
    }
  };

  /**
   * React rendering.
   */
  render() {

    const cameraWindowElement = this.getCameraWindowElement();
    let width = 0;
    let left = this.props.cornerPosition.x;
    let top = this.props.cornerPosition.y;
    if ( cameraWindowElement ) {
      const boundingRect = cameraWindowElement.getBoundingClientRect();
      width = boundingRect.width * 0.1;

      left = this.props.cornerPosition.x * boundingRect.width - width / 2;
      top = this.props.cornerPosition.y * boundingRect.height - width / 2;
    }

    return (
      <div
        ref={el => ( this._el = el )}
        className={styles.program}
        onMouseDown={this._onMouseDown}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${width}px`
        }}
      >
        <div className={styles.programCornerLabels}>
          <h3 className={styles.programCornerNumber}>#{this.programNumber}</h3>
          <p className={styles.programCornerNumber}>{this.programCorner}</p>
        </div>

        {this.removeProgram ? (
          <div ref={el => ( this._closeEl = el )} className={styles.closeButton}/>
        ) : ( '' )}
        {this.collapseProgram ? (
          <button onClick={() => this.collapseProgram() } className={styles.cutButton}>
            <img src={'media/images/collapse.svg'} alt={'Combine Program'}/>
          </button>
        ) : ( '' )}
      </div>
    );
  }
}