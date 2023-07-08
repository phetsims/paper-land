// Copyright 2023, University of Colorado Boulder

/**
 * The main view component for the Creator app. Displays paper programs and their relationships.
 */

import xhr from 'xhr';
import ConnectionsCanvasNode from './ConnectionsCanvasNode.js';
import DeleteProgramAreaNode from './DeleteProgramAreaNode.js';
import ProgramNode from './ProgramNode.js';
import SavedRectangle from './SavedRectangle.js';
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

    // Fades in using twixt when the system is successfully saved to the database
    this.savedRectangle = new SavedRectangle();

    // {ProgramNode[]} - Reference to all program nodes, so we can get positioning and connection points
    this.allProgramNodes = [];

    // Displays connections between all programs
    this.connectionsNode = new ConnectionsCanvasNode( model, this.allProgramNodes );

    this.newProgramButton = new phet.sun.TextPushButton( 'New Program', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        model.createProgram( this.applicationLayerNode.globalToLocalPoint( this.newProgramButton.leftBottom ) );
      }
    } ) );
    this.saveSystemButton = new phet.sun.TextPushButton( 'Save System', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        const json = model.save();

        const url = new URL( `api/creator/${model.spaceNameProperty.value}/${model.systemNameProperty.value}`, window.location.origin ).toString();
        xhr.put( url, { json: { systemData: json } }, ( error, response ) => {
          if ( error ) {
            console.error( error );
          }
          else {
            this.savedRectangle.showSaved();
          }
        } );
      }
    } ) );
    this.sendToPaperLandButton = new phet.sun.TextPushButton( 'Send to Playground', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        console.log( 'send data to paper land to create programs' );
      }
    } ) );

    this.deleteProgramArea = new DeleteProgramAreaNode();

    // rendering order
    this.addChild( this.applicationLayerNode );
    this.addChild( controlLayerNode );

    this.applicationLayerNode.addChild( programLayerNode );
    this.applicationLayerNode.addChild( this.connectionsNode );

    controlLayerNode.addChild( this.newProgramButton );
    controlLayerNode.addChild( this.saveSystemButton );
    controlLayerNode.addChild( this.sendToPaperLandButton );
    controlLayerNode.addChild( this.savedRectangle );
    controlLayerNode.addChild( this.deleteProgramArea );

    // Creates a ProgramNode when it is added
    model.programAddedEmitter.addListener( newProgram => {
      const newProgramNode = new ProgramNode( newProgram, this.deleteProgramArea.globalBounds, model.activeEditProperty );
      this.allProgramNodes.push( newProgramNode );
      programLayerNode.addChild( newProgramNode );

      // removes the ProgramNode and related listeners when the program is removed
      const removalListener = removedProgram => {
        if ( removedProgram === newProgram ) {

          // clear any selected programs
          model.activeEditProperty.value = null;

          // remove view components
          programLayerNode.removeChild( newProgramNode );
          this.allProgramNodes.splice( this.allProgramNodes.indexOf( newProgramNode ), 1 );
          newProgramNode.dispose();

          // remove event listeners
          model.programRemovedEmitter.removeListener( removalListener );
        }
      };
      model.programRemovedEmitter.addListener( removalListener );
    } );

    // When the space or system names are changed, we try to load the new system. If either are empty,
    // we clear model programs and disable the save/send buttons.
    const updateSystem = () => {
      if ( model.spaceNameProperty.value && model.systemNameProperty.value ) {
        const url = new URL( `api/creator/${model.spaceNameProperty.value}/${model.systemNameProperty.value}`, window.location.origin ).toString();
        xhr.get( url, { json: true }, ( error, response, body ) => {
          if ( error ) {
            console.error( error );
          }
          else {
            model.load( body.systemData );

            // pan to the first program so something is in view
            if ( programLayerNode.children.length > 0 ) {
              phet.scenery.animatedPanZoomSingleton.listener.panToNode( programLayerNode.children[ 0 ] );
            }
          }
        } );

        this.saveSystemButton.enabled = true;
        this.sendToPaperLandButton.enabled = true;
        this.newProgramButton.enabled = true;
      }
      else {
        model.clear();

        this.saveSystemButton.enabled = false;
        this.sendToPaperLandButton.enabled = false;
        this.newProgramButton.enabled = false;
      }
    };
    phet.axon.Multilink.multilink( [ model.spaceNameProperty, model.systemNameProperty ], updateSystem );

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
    this.savedRectangle.rightCenter = this.saveSystemButton.leftCenter.plusXY( -5, 0 );

    this.connectionsNode.layout( width, height );
  }

  step( dt ) {
    this.connectionsNode.step( dt );
  }
}