// Copyright 2023, University of Colorado Boulder

/**
 * The main view component for the Creator app. Displays paper programs and their relationships.
 */

import DeleteProgramAreaNode from './DeleteProgramAreaNode.js';
import ProgramNode from './ProgramNode.js';
import ViewConstants from './ViewConstants.js';

export default class CreatorView extends phet.scenery.Node {

  /**
   * @param {CreatorModel} model
   * @param {scenery.Display} display
   */
  constructor( model, display ) {
    super();

    // The control layer will NOT zoom
    const controlLayerNode = new phet.scenery.Node();

    // @public (read-only) - for the AnimatedPanZoomListener
    this.applicationLayerNode = new phet.scenery.Node();

    // @public (reado-only) - All program views will be layered inside of this Node
    const programLayerNode = new phet.scenery.Node();

    this.newProgramButton = new phet.sun.TextPushButton( 'New Program', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        model.createProgram( this.applicationLayerNode.globalToLocalPoint( this.newProgramButton.leftBottom ) );
      }
    } ) );
    this.saveSystemButton = new phet.sun.TextPushButton( 'Save System', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        const json = model.save();
        console.log( json );

        // send data to the db
      }
    } ) );
    this.sendToPaperLandButton = new phet.sun.TextPushButton( 'Send to Paper Land', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        console.log( 'send data to paper land to create programs' );
      }
    } ) );

    this.deleteProgramArea = new DeleteProgramAreaNode();

    // rendering order
    this.addChild( this.applicationLayerNode );
    this.addChild( controlLayerNode );

    this.applicationLayerNode.addChild( programLayerNode );

    controlLayerNode.addChild( this.newProgramButton );
    controlLayerNode.addChild( this.saveSystemButton );
    controlLayerNode.addChild( this.sendToPaperLandButton );
    controlLayerNode.addChild( this.deleteProgramArea );

    // Creates a ProgramNode when it is added
    model.programAddedEmitter.addListener( newProgram => {
      const newProgramNode = new ProgramNode( newProgram, this.deleteProgramArea.globalBounds, model.activeEditProperty );
      programLayerNode.addChild( newProgramNode );

      // removes the ProgramNode and related listeners when the program is removed
      const removalListener = removedProgram => {
        if ( removedProgram === newProgram ) {

          // clear any selected programs
          model.activeEditProperty.value = null;

          // remove view components
          programLayerNode.removeChild( newProgramNode );
          newProgramNode.dispose();

          // remove event listeners
          model.programRemovedEmitter.removeListener( removalListener );
        }
      };
      model.programRemovedEmitter.addListener( removalListener );
    } );

    display.addInputListener( {
      down: event => {

        if ( !_.some( event.trail.nodes, node => node instanceof ProgramNode ) ) {
          model.activeEditProperty.value = null;
        }
      }
    } );
  }

  /**
   * Updates the layout of this view component.
   * @param {number} width - total available width for the view
   * @param {number} height - total available height for the view
   */
  layout( width, height ) {
    this.newProgramButton.leftTop = new phet.dot.Vector2( 5, 5 );
    this.saveSystemButton.rightTop = new phet.dot.Vector2( width - 10, 5 );
    this.sendToPaperLandButton.rightTop = this.saveSystemButton.rightBottom.plusXY( 0, 5 );
    this.deleteProgramArea.rightBottom = new phet.dot.Vector2( width - 10, height - 10 );
  }
}