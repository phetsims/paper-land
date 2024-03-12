import React from 'react';

import { add, findProgramContainingMarker, rotateAboutXY } from '../utils';
import styles from './DebugProgram.css';
import DebugProgramCorner from './DebugProgramCorner.js';

// Maps corner strings to the index of points in the paper, for easy lookup when controlling points
// by a single corner
const cornerStringToPointsIndex = {
  tl: 0,
  tr: 1,
  br: 2,
  bl: 3
};

export default class CameraMain extends React.Component {
  constructor( props ) {
    super( props );

    const videoRatio = this.props.videoWidth / this.props.videoHeight;
    const bl = props.program.points[ 3 ];
    const br = props.program.points[ 2 ];
    bl.y *= videoRatio;
    br.y *= videoRatio;

    // It was much easier to draw an axis aligned div as the debugging program, and then apply
    // rotation to it with a css transform. So the program points without any rotation are saved
    // so that we can first draw the debugging program from these positions.
    this.pointsWithoutRotation = this.props.program.points.slice();

    // The markers that are on the program when the program is grabbed, so that they can be moved with the program
    // during dragging.
    this.attachedMarkersOnStart = [];

    this.state = {
      program: props.program,
      grabbed: false,
      cut: false,
      grabbedOffset: { x: 0, y: 0 },
      resizing: false,
      rotating: false,
      rotation: 0 // in radians
    };
  }

  /**
   * Sets the cut state the program. When cut, it is split into four pieces making it each corner its own draggable
   * component of the program. This lets you debug a program where changing the paper geometry impacts behavior.
   *
   * When the program is cut, it can no longer be resized or rotated.
   * @param {boolean} programCut
   */
  _setCutState = programCut => {

    const program = this.state.program;

    // Reset points relative to the top left corner after the operation so that corners match the debug program
    const tl = program.points[ 0 ];
    const tr = program.points[ 1 ];
    const br = program.points[ 2 ];
    const bl = program.points[ 3 ];

    const width = 0.2;
    const videoRatio = this.props.videoWidth / this.props.videoHeight;

    tr.x = tl.x + width;
    tr.y = tl.y;

    br.x = tr.x;
    br.y = tr.y + width * videoRatio;

    bl.x = tl.x;
    bl.y = tl.y + width * videoRatio;

    this.pointsWithoutRotation[ 0 ] = tl;
    this.pointsWithoutRotation[ 1 ] = tr;
    this.pointsWithoutRotation[ 2 ] = br;
    this.pointsWithoutRotation[ 3 ] = bl;

    this.setState( {
      cut: programCut,

      // program: program,

      // reset rotation after cutting
      rotation: 0
    } );
  };

  _onMouseEnter = () => {
    this.props.onMouseEnter();
  };

  _onMouseLeave = () => {
    if ( this.state.grabbed ) {return;}
    if ( this.state.resizing ) {return;}
    if ( this.state.rotating ) {return;}

    this.props.onRelease();
  };

  _onMouseDown = event => {
    if ( event.target === this._closeEl ) {
      this.props.remove();
      return;
    }
    const rect = this._el.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;

    // Resizing/rotating if clicking on the resize button. Event target may be hte button or its child icon image.
    const resizing = event.target === this._handleEl || event.target.parentElement === this._handleEl;
    const rotating = event.target === this._rotateEl || event.target.parentElement === this._rotateEl;
    const grabbed = !resizing && !rotating;

    // As we enter the grabbed state, find markers that are attached to this program so that they will be moved
    // with the paper.
    if ( grabbed ) {
      this.attachedMarkersOnStart = this.props.debugMarkers.filter( marker => !!findProgramContainingMarker( marker.position, [ this.state.program ] ) );
    }

    this.setState( {
      grabbed,
      rotating,
      resizing,
      grabbedOffset: { x, y }
    } );
    document.addEventListener( 'mouseup', this._onMouseUp, false );
    document.addEventListener( 'mousemove', this._onMouseMove, false );
  };

  _onMouseUp = () => {
    this.setState( { grabbed: false, resizing: false, rotating: false } );
    document.removeEventListener( 'mouseup', this._onMouseUp, false );
    document.removeEventListener( 'mousemove', this._onMouseMove, false );

    // clear attached debug markers
    this.attachedMarkersOnStart = [];
  };

  _onMouseMove = event => {
    const rect = this._el.getBoundingClientRect();

    // dimensions of the video window
    const parentRect = this._parentEl.parentElement.getBoundingClientRect();
    const program = this.state.program;

    if ( this.state.grabbed ) {

      const x = event.clientX - rect.x - this.state.grabbedOffset.x;
      const y = event.clientY - rect.y - this.state.grabbedOffset.y;

      const normx = x / parentRect.width;
      const normy = y / parentRect.height;

      // save points without rotation for rendering
      this.pointsWithoutRotation = this.pointsWithoutRotation.map( point => add( point, { x: normx, y: normy } ) );

      // apply the translation to program points for the model
      program.points = program.points.map( point => add( point, { x: normx, y: normy } ) );

      // Move any markers that were on this program at the start of drag
      this.attachedMarkersOnStart.forEach( marker => {
        marker.position = add( marker.position, { x: normx, y: normy } );
      } );
    }

    if ( this.state.resizing ) {
      const tr = this.pointsWithoutRotation[ 1 ];
      const br = this.pointsWithoutRotation[ 2 ];
      const bl = this.pointsWithoutRotation[ 3 ];

      const x = event.clientX - parentRect.x;
      const y = event.clientY - parentRect.y;

      const normx = x / parentRect.width;
      const normy = y / parentRect.height;
      tr.x = normx;
      br.x = normx;
      br.y = normy;
      bl.y = normy;

      // the resized program without any rotation
      program.points = this.pointsWithoutRotation.slice();

      // with new dimensions set, we can apply rotation to them
      program.points = this.getRotatedPoints( program.points, this.state.rotation );
    }

    let angle = this.state.rotation;
    if ( this.state.rotating ) {

      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;

      const x = event.clientX - parentRect.x;
      const y = event.clientY - parentRect.y;

      const dx = x - centerX;
      const dy = y - centerY;

      angle = Math.atan2( dy, dx ) + Math.PI / 2;

      const angleDelta = angle - this.state.rotation;
      program.points = this.getRotatedPoints( program.points, angleDelta );
    }

    this.setState( { program: program, rotation: angle } );
  };

  getRotatedPoints( normalizedPoints, angle ) {
    if ( this._el ) {

      // should be dimensions of the camera view
      const parentRect = this._parentEl.parentElement.getBoundingClientRect();

      // center of the program in normalized coordinates
      const centerX = this.programTl.x + this.programWidth / 2;
      const centerY = this.programTl.y + this.programHeight / 2;

      // transform to parent DOM coordinate frame
      const centerXInParentFrame = centerX * parentRect.width;
      const centerYInParentFrame = centerY * parentRect.height;

      return normalizedPoints.map( point => {
        const pointInParentFrame = { x: point.x * parentRect.width, y: point.y * parentRect.height };
        const rotated = rotateAboutXY( pointInParentFrame, centerXInParentFrame, centerYInParentFrame, angle );

        return {
          x: rotated.x / parentRect.width,
          y: rotated.y / parentRect.height
        };
      } );
    }
    else {
      return normalizedPoints;
    }
  }

  updateProgramFromCorner( cornerString, x, y ) {
    const index = cornerStringToPointsIndex[ cornerString ];
    this.props.program.points[ index ] = { x, y };
    this.pointsWithoutRotation[ index ] = { x, y };
    this.setState( { program: this.state.program } );
  }

  render() {

    // normalized positions, axis aligned
    const tl = this.pointsWithoutRotation[ 0 ];
    const tr = this.pointsWithoutRotation[ 1 ];
    const br = this.pointsWithoutRotation[ 2 ];
    const bl = this.pointsWithoutRotation[ 3 ];

    const width = br.x - tl.x;
    const height = br.y - tl.y;

    this.programWidth = width;
    this.programHeight = height;

    this.programTl = tl;

    return (
      <div ref={el => ( this._parentEl = el )}>
        <div
          ref={el => ( this._el = el )}
          onMouseDown={this._onMouseDown}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onDrag={this._onDrag}
          className={styles.program}

          // when the program is cut, we will show a representation of the 4 corners instead
          hidden={this.state.cut}
          style={{
            position: 'absolute',
            left: `${tl.x * 100}%`,
            top: `${tl.y * 100}%`,
            width: `${width * 100}%`,
            height: `${height * 100}%`,

            // apply rotation after drawing an axis aligned div
            transform: `rotate(${this.state.rotation}rad)`
          }}
        >
          <h3 className={styles.programNumber}>#{this.state.program.number}</h3>
          <p>{this.state.program.programName}</p>

          {/*<div ref={el => ( this._rotateEl = el )} className={styles.rotateHandle}/>*/}
          <button ref={el => ( this._rotateEl = el )} className={styles.rotateButton}>
            <img className={styles.buttonIcon} src={'media/images/arrows-spin.svg'} alt={'Rotate Program'}/>
          </button>
          <button ref={el => ( this._handleEl = el )} className={styles.resizeButton}>
            <img className={styles.buttonIcon} src={'media/images/resize-white.svg'} alt={'Resize Program'}/>
          </button>
          <button onClick={() => this.props.remove()} className={styles.closeButton}>
            <img className={styles.buttonIcon} src={'media/images/trash3.svg'} alt={'Delete Program'}/>
          </button>
          <button onClick={() => this._setCutState( true )} className={styles.cutButton}>
            <img className={styles.buttonIcon} src={'media/images/scissors.svg'} alt={'Cut Program'}/>
          </button>
        </div>

        <div hidden={!this.state.cut}>
          <DebugProgramCorner
            removeProgram={this.props.remove}
            programNumber={this.state.program.number}
            programCorner={'tl'}
            cornerPosition={{ x: tl.x, y: tl.y }}
            getCameraWindowElement={() => this._parentEl && this._parentEl.parentElement}
            updateProgramCornerPosition={( x, y ) => {
              this.updateProgramFromCorner( 'tl', x, y );
            }}
          ></DebugProgramCorner>
          <DebugProgramCorner
            programNumber={this.state.program.number}
            programCorner={'tr'}
            cornerPosition={{ x: tr.x, y: tr.y }}
            getCameraWindowElement={() => this._parentEl && this._parentEl.parentElement}
            updateProgramCornerPosition={( x, y ) => {
              this.updateProgramFromCorner( 'tr', x, y );
            }}
          ></DebugProgramCorner>
          <DebugProgramCorner
            programNumber={this.state.program.number}
            programCorner={'br'}
            cornerPosition={{ x: br.x, y: br.y }}
            getCameraWindowElement={() => this._parentEl && this._parentEl.parentElement}
            updateProgramCornerPosition={( x, y ) => {
              this.updateProgramFromCorner( 'br', x, y );
            }}
          ></DebugProgramCorner>
          <DebugProgramCorner
            programNumber={this.state.program.number}
            collapseProgram={() => this._setCutState( false )}
            programCorner={'bl'}
            cornerPosition={{ x: bl.x, y: bl.y }}
            getCameraWindowElement={() => this._parentEl && this._parentEl.parentElement}
            updateProgramCornerPosition={( x, y ) => {
              this.updateProgramFromCorner( 'bl', x, y );
            }}
          ></DebugProgramCorner>
        </div>
      </div>
    );
  }
}