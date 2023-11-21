// Copyright 2023, University of Colorado Boulder

/**
 * The main view component for the Creator app. Displays paper programs and their relationships.
 */

import xhr from 'xhr';
import ConnectionsCanvasNode from './ConnectionsCanvasNode.js';
import CreatorVisibilityControls from './CreatorVisibilityControls.js';
import ProgramNode from './ProgramNode.js';
import RestrictedWarningNode from './RestrictedWarningNode.js';
import SavedRectangle from './SavedRectangle.js';
import ViewConstants from './ViewConstants.js';

export default class CreatorView extends phet.scenery.Node {

  /**
   * @param {CreatorModel} model
   * @param {scenery.Display} display
   */
  constructor( model, display ) {
    super();

    // @private
    this.model = model;

    // Property with the available width/height of the view
    this.availableBoundsProperty = new phet.axon.Property( new phet.dot.Bounds2( 0, 0, 0, 0 ) );

    // Editing of components is enabled when the space is not restricted
    const editEnabledProperty = phet.axon.DerivedProperty.not( model.spaceRestrictedProperty );

    // The control layer will NOT zoom
    const controlLayerNode = new phet.scenery.Node();

    // @public (read-only) - for the AnimatedPanZoomListener
    this.applicationLayerNode = new phet.scenery.Node();

    // @public (reado-only) - All program views will be layered inside of this Node
    const programLayerNode = new phet.scenery.Node();

    // Fades in using twixt when the project is successfully saved to the database
    this.savedRectangle = new SavedRectangle();

    this.sendSuccessRectangle = new SavedRectangle( { message: 'Sent ✓' } );

    // Fades in to show a success message whenever some kind of successful action is completed.
    this.successRectangle = new SavedRectangle( { message: 'Success ✓' } );

    this.visibilityControls = new CreatorVisibilityControls( model.visibilityModel );

    // {ProgramNode[]} - Reference to all program nodes, so we can get positioning and connection points
    this.allProgramNodes = [];

    // Displays connections between all programs
    this.connectionsNode = new ConnectionsCanvasNode( model, this.allProgramNodes );

    // Displays a warning when we are in "readonly" mode.
    this.restrictedWarningNode = new RestrictedWarningNode();

    this.newProgramButton = new phet.sun.TextPushButton( 'New Empty Program', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        model.createProgram( this.applicationLayerNode.globalToLocalPoint( this.newProgramButton.leftBottom ) );
      }
    } ) );
    this.newProgramFromTemplateButton = new phet.sun.TextPushButton( 'Create from Template', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {

        model.creatingFromTemplateProperty.value = true;

        // clear the active edit because we are entering a new mode of creating
        model.activeEditProperty.value = null;
      }
    } ) );
    this.saveProjectButton = new phet.sun.TextPushButton( 'Save Project', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: async () => {
        model.serverRequestInProgressProperty.value = true;
        await model.sendSaveRequest();
        model.serverRequestInProgressProperty.value = false;
      }
    } ) );
    this.sendToPaperLandButton = new phet.sun.TextPushButton( 'Send to Playground', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        model.sendRequestedEmitter.emit();
      }
    } ) );
    this.saveProjectJSONButton = new phet.sun.TextPushButton( 'Download Project', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        model.sendDownloadJSONRequest();
      }
    } ) );
    this.loadProjectJSONButton = new phet.sun.TextPushButton( 'Load Project', _.merge( {}, ViewConstants.TEXT_BUTTON_OPTIONS, {
      listener: () => {
        model.sendLoadJSONRequest();
      }
    } ) );

    // Buttons are not usable until save/send operations receive a response from the server
    model.serverRequestInProgressProperty.link( inProgress => {
      this.saveProjectButton.enabled = !inProgress;
      this.sendToPaperLandButton.enabled = !inProgress;
    } );

    // rendering order
    this.addChild( this.applicationLayerNode );
    this.addChild( controlLayerNode );

    this.applicationLayerNode.addChild( programLayerNode );
    this.applicationLayerNode.addChild( this.connectionsNode );

    controlLayerNode.addChild( this.newProgramButton );
    controlLayerNode.addChild( this.newProgramFromTemplateButton );
    controlLayerNode.addChild( this.saveProjectButton );
    controlLayerNode.addChild( this.sendToPaperLandButton );
    controlLayerNode.addChild( this.saveProjectJSONButton );
    controlLayerNode.addChild( this.loadProjectJSONButton );
    controlLayerNode.addChild( this.savedRectangle );
    controlLayerNode.addChild( this.sendSuccessRectangle );
    controlLayerNode.addChild( this.successRectangle );
    controlLayerNode.addChild( this.visibilityControls );
    controlLayerNode.addChild( this.restrictedWarningNode );

    // Creates a ProgramNode when it is added
    model.programAddedEmitter.addListener( newProgram => {
      const newProgramNode = new ProgramNode( newProgram, model.activeEditProperty, editEnabledProperty, this.availableBoundsProperty );
      this.allProgramNodes.push( newProgramNode );
      programLayerNode.addChild( newProgramNode );

      // Whenever a program has been added we need to make sure that it is within the available bounds
      this.constrainProgramsToBounds();

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

    // When the space or project names are changed, we try to load the new project. If either are empty,
    // we clear model programs and disable the save/send buttons.
    const updateProject = () => {
      if ( model.spaceNameProperty.value && model.projectNameProperty.value ) {
        const url = new URL( `api/creator/${model.spaceNameProperty.value}/${model.projectNameProperty.value}`, window.location.origin ).toString();
        xhr.get( url, { json: true }, ( error, response, body ) => {
          if ( error ) {
            console.error( error );
          }
          else {
            try {
              model.load( body.projectData );
            }
            catch( error ) {
              model.errorOccurredEmitter.emit( 'Error loading project: ' + error.message );
            }
          }
        } );

        // You can only save or create programs if the space is not restricted
        this.saveProjectButton.enabled = editEnabledProperty.value;
        this.newProgramButton.enabled = editEnabledProperty.value;
        this.newProgramFromTemplateButton.enabled = editEnabledProperty.value;
        this.sendToPaperLandButton.enabled = true;
      }
      else {
        model.clear();

        this.saveProjectButton.enabled = false;
        this.sendToPaperLandButton.enabled = false;
        this.newProgramButton.enabled = false;
        this.newProgramFromTemplateButton.enabled = false;
      }
    };
    phet.axon.Multilink.multilink( [ model.spaceNameProperty, model.projectNameProperty, editEnabledProperty ], updateProject );

    // Whenever the model reloads, pan to the first program so there is something in view (if there is one)
    model.loadCompleteEmitter.addListener( () => {
      if ( programLayerNode.children.length > 0 ) {

        // make sure that all programs are within bounds
        this.constrainProgramsToBounds();

        // pan to a node so something is in view
        phet.scenery.animatedPanZoomSingleton.listener.panToNode( programLayerNode.children[ 0 ] );
      }
    } );

    display.addInputListener( {
      down: event => {

        // no longer creating from template since the user has clicked on something else
        model.creatingFromTemplateProperty.value = false;

        if ( !_.some( event.trail.nodes, node => node instanceof ProgramNode ) ) {
          model.activeEditProperty.value = null;
        }
      }
    } );

    // Show the warning node when the space becomes restricted.
    model.spaceRestrictedProperty.link( spaceRestricted => {
      if ( spaceRestricted ) {
        this.restrictedWarningNode.show();
      }
      else {
        this.restrictedWarningNode.hide();
      }
    } );

    // Display the success message whenever a save is successful.
    model.saveSuccessfulEmitter.addListener( () => {
      this.savedRectangle.showSaved();
    } );

    model.sendSuccessfulEmitter.addListener( () => {
      this.sendSuccessRectangle.showSaved();
    } );

    model.successOccurredEmitter.addListener( message => {

      // display the message and adjust layout after the rectangle bounds change
      this.successRectangle.setMessage( message );
      this.successRectangle.centerTop = new phet.dot.Vector2( this.availableBoundsProperty.value.width / 2, 5 );

      this.successRectangle.showSaved();
    } );
  }

  /**
   * Updates the layout of this view component.
   * @param {number} width - total available width for the view
   * @param {number} height - total available height for the view
   */
  layout( width, height ) {
    this.availableBoundsProperty.value = new phet.dot.Bounds2( 0, 0, width, height );

    this.newProgramFromTemplateButton.leftTop = new phet.dot.Vector2( 5, 5 );
    this.newProgramButton.leftTop = this.newProgramFromTemplateButton.leftBottom.plusXY( 0, 5 );

    this.saveProjectButton.rightTop = new phet.dot.Vector2( width - 10, 5 );
    this.sendToPaperLandButton.rightTop = this.saveProjectButton.rightBottom.plusXY( 0, 5 );
    this.saveProjectJSONButton.rightTop = this.sendToPaperLandButton.rightBottom.plusXY( 0, 5 );
    this.loadProjectJSONButton.rightTop = this.saveProjectJSONButton.rightBottom.plusXY( 0, 5 );
    this.savedRectangle.rightCenter = this.saveProjectButton.leftCenter.plusXY( -5, 0 );
    this.sendSuccessRectangle.rightCenter = this.sendToPaperLandButton.leftCenter.plusXY( -5, 0 );
    this.successRectangle.centerTop = new phet.dot.Vector2( width / 2, 5 );
    this.visibilityControls.leftBottom = new phet.dot.Vector2( 5, height - 10 );

    this.restrictedWarningNode.leftCenter = this.newProgramButton.rightCenter.plusXY( 5, 0 );

    this.connectionsNode.layout( width, height );

    // Make sure that all of the program Nodes are contained in the available bounds
    this.constrainProgramsToBounds();

  }

  /**
   * Makes sure that the programs stay within the available bounds. This is used on load when programs are first added
   * and when the screen is resized, to make sure that programs don't go off screen.
   */
  constrainProgramsToBounds() {
    const bounds = this.availableBoundsProperty.value;
    if ( bounds.isFinite() ) {
      this.model.programs.forEach( program => {
        const currentLeft = program.positionProperty.value.x;
        const currentTop = program.positionProperty.value.y;

        // Shifted by arbitrary view amounts so that they can still be grabbed and pulled into view if they
        // are off-screen.
        const newLeft = phet.dot.Utils.clamp( currentLeft, bounds.minX, bounds.maxX - 100 );
        const newTop = phet.dot.Utils.clamp( currentTop, bounds.minY, bounds.maxY - 100 );
        program.positionProperty.value = new phet.dot.Vector2( newLeft, newTop );
      } );
    }
  }

  step( dt ) {
    this.connectionsNode.step( dt );
  }
}