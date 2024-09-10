/**
 * A CanvasNode that draws connections between components.
 */
import Utils from '../Utils.js';
import ViewConstants from './ViewConstants.js';

// A value to wrap the lineDashOffset so it doesn't grow forever.
const MAX_OFFSET = 1000;

class ConnectionsCanvasNode extends phet.scenery.CanvasNode {
  constructor( model, programNodes ) {
    super();

    this.model = model;
    this.programNodes = programNodes;
    this.visibilityModel = model.visibilityModel;
    this.activeEditProperty = model.activeEditProperty;

    // Each list of connections has two arrays - one for default connections, and another for connections that are
    // attached to the active edit (currently being edited). When there is an active edit, those connections are more
    // prominently displayed. Wehave to keep track of both lists so we can draw them separately (one stroke() for each).
    this.controllerConnections = [];
    this.activeControllerConnections = [];

    this.derivedPropertyConnections = [];
    this.activeDerivedPropertyConnections = [];

    this.viewConnections = [];
    this.activeViewConnections = [];

    this.linkConnections = [];
    this.activeLinkConnections = [];

    this.arrayConnections = [];
    this.activeArrayConnections = [];

    this.lineDashOffset = 0;
  }

  /**
   * Draw the list of connections to the canvas context.
   */
  drawConnectionList( context, connections, color, lineDash, lineWidth ) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    connections.forEach( connection => {
      this.drawConnection( context, connection );
    } );
    context.setLineDash( lineDash );
    context.stroke();
  }

  /**
   * Paints the grid lines on the canvas node.
   * @param {CanvasRenderingContext2D} context
   */
  paintCanvas( context ) {

    // TODO: Updating connections data is expensive, do that no events instead of every paint - or only
    // repaint on certain events

    context.save();
    context.lineCap = 'round';
    context.lineDashOffset = this.lineDashOffset;

    const activeEditComponent = this.activeEditProperty.value?.component;
    const innactiveLineWidth = activeEditComponent ? ViewConstants.INNACTIVE_EDIT_WIRE_LINE_WIDTH : ViewConstants.DEFAULT_WIRE_LINE_WIDTH;

    if ( this.visibilityModel.controllerConnectionsVisibleProperty.value ) {
      this.updateControllerConnections();

      // Draw controller connections
      this.drawConnectionList( context, this.controllerConnections, ViewConstants.CONTROLLER_WIRE_COLOR, ViewConstants.CONTROLLER_WIRE_LINE_DASH, innactiveLineWidth );
      this.drawConnectionList( context, this.activeControllerConnections, ViewConstants.CONTROLLER_WIRE_COLOR, ViewConstants.CONTROLLER_WIRE_LINE_DASH, 3 );
    }

    if ( this.visibilityModel.derivedConnectionsVisibleProperty.value ) {
      this.updateDerivedPropertyConnections();

      // Draw DerivedProperty connections
      this.drawConnectionList( context, this.derivedPropertyConnections, ViewConstants.DERIVED_WIRE_COLOR, ViewConstants.DERIVED_WIRE_LINE_DASH, innactiveLineWidth );
      this.drawConnectionList( context, this.activeDerivedPropertyConnections, ViewConstants.DERIVED_WIRE_COLOR, ViewConstants.DERIVED_WIRE_LINE_DASH, 3 );
    }

    if ( this.visibilityModel.viewConnectionsVisibleProperty.value ) {
      this.updateViewConnections();

      this.drawConnectionList( context, this.viewConnections, ViewConstants.VIEW_WIRE_COLOR, ViewConstants.VIEW_WIRE_LINE_DASH, innactiveLineWidth );
      this.drawConnectionList( context, this.activeViewConnections, ViewConstants.VIEW_WIRE_COLOR, ViewConstants.VIEW_WIRE_LINE_DASH, 3 );
    }

    if ( this.visibilityModel.listenerConnectionsVisibleProperty.value ) {
      this.updateListenerConnections();

      this.drawConnectionList( context, this.linkConnections, ViewConstants.LINK_WIRE_COLOR, ViewConstants.LINK_WIRE_LINE_DASH, innactiveLineWidth );
      this.drawConnectionList( context, this.activeLinkConnections, ViewConstants.LINK_WIRE_COLOR, ViewConstants.LINK_WIRE_LINE_DASH, 3 );
    }

    if ( this.visibilityModel.arrayConnectionsVisibleProperty.value ) {
      this.updateArrayConnections();

      this.drawConnectionList( context, this.arrayConnections, ViewConstants.ARRAY_WIRE_COLOR, ViewConstants.ARRAY_WIRE_LINE_DASH, innactiveLineWidth );
      this.drawConnectionList( context, this.activeArrayConnections, ViewConstants.ARRAY_WIRE_COLOR, ViewConstants.ARRAY_WIRE_LINE_DASH, 3 );
    }

    context.restore();
  }

  /**
   * Inspect the model for controller components and the components they control. Find their view components
   * to get the connection points to draw the wires.
   */
  updateControllerConnections() {
    this.controllerConnections = [];
    this.activeControllerConnections = [];

    // draw controller connections
    this.model.allControllerComponents.forEach( component => {
      const controllerName = component.nameProperty.value;
      const controlledName = component.namedProperty.nameProperty.value;

      let startPoint;
      let endPoint;
      let startComponent;
      let endComponent;
      let startProgramNode;

      // loop through all programNodes and find the one that has the controller
      this.programNodes.forEach( programNode => {
        programNode.model.controllerContainer.allComponents.forEach( controllerComponent => {
          if ( controllerComponent.nameProperty.value === controllerName ) {
            startPoint = programNode.getComponentListItemConnectionPoint( controllerName, false );
            startComponent = controllerComponent;
            startProgramNode = programNode;
          }
        } );
      } );

      // loop through all programNodes and find the one that has the controlled
      this.programNodes.forEach( programNode => {
        programNode.model.modelContainer.allComponents.forEach( modelComponent => {
          if ( modelComponent.nameProperty.value === controlledName ) {
            endPoint = programNode.getComponentListItemConnectionPoint( controlledName, true );
            endComponent = modelComponent;
          }
        } );
      } );

      if ( startPoint && endPoint ) {
        this.addConnectionToList( this.controllerConnections, this.activeControllerConnections, startComponent, endComponent, startPoint, endPoint, startProgramNode );
      }
    } );
  }

  /**
   * Adds a connection to a list. If there is an activeEdit with a component, and either start or end components are that component,
   * the connection will be added to a special list that will be drawn with different styling.
   *
   * @param connections - list of connections that connection will be added to
   * @param activeConnections - list of activeConnections the component will be added to if a component is active
   * @param startComponent - the start component of the connection
   * @param endComponent - the end component of the connection
   * @param startPoint - the start point of the connection
   * @param endPoint - the end point of the connection
   * @param startProgramNode - the program node that contains the start component
   */
  addConnectionToList( connections, activeConnections, startComponent, endComponent, startPoint, endPoint, startProgramNode ) {
    const activeEditComponent = this.activeEditProperty.value?.component;
    const globalStartProgramNodeOrigin = Utils.getPanZoomCorrectedPoint( startProgramNode.globalBounds.leftTop );

    if ( activeEditComponent === startComponent || activeEditComponent === endComponent ) {
      activeConnections.push( new Connection( startPoint, endPoint, globalStartProgramNodeOrigin ) );
    }
    else {
      connections.push( new Connection( startPoint, endPoint, globalStartProgramNodeOrigin ) );
    }
  }

  /**
   * Inspect the model and look for derived properties and dependencies. For each that we find, get the connection
   * point in the view to draw connection wires.
   */
  updateDerivedPropertyConnections() {
    this.derivedPropertyConnections = [];
    this.activeDerivedPropertyConnections = [];

    this.model.allModelComponents.forEach( component => {
      if ( component.propertyType === 'DerivedProperty' ) {
        const componentName = component.nameProperty.value;
        const dependencyNames = component.dependencyNames;

        let endPoint;
        let endComponent;

        // loop through all model components and find the dependency derived property start point
        // loop through all programNodes and find the one that has the controlled
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === componentName ) {
              endPoint = programNode.getComponentListItemConnectionPoint( componentName, true );
              endComponent = modelComponent;
            }
          } );
        } );

        // loop through programNodes and find the position for the corresponding Node
        const startObjects = [];
        dependencyNames.forEach( dependencyName => {
          this.programNodes.forEach( programNode => {
            programNode.model.modelContainer.allComponents.forEach( modelComponent => {
              if ( modelComponent.nameProperty.value === dependencyName ) {
                startObjects.push( {
                  startPoint: programNode.getComponentListItemConnectionPoint( dependencyName, false ),
                  startComponent: modelComponent,
                  startProgramNode: programNode
                } );
              }
            } );
          } );
        } );

        startObjects.forEach( object => {
          if ( object.startPoint && endPoint ) {
            this.addConnectionToList( this.derivedPropertyConnections, this.activeDerivedPropertyConnections, object.startComponent, endComponent, object.startPoint, endPoint, object.startProgramNode );
          }
        } );
      }
    } );
  }

  /**
   * Inspect the model for arrays and array items.
   */
  updateArrayConnections() {
    this.arrayConnections = [];
    this.activeArrayConnections = [];

    this.programNodes.forEach( programNode => {
      programNode.model.modelContainer.allComponents.forEach( component => {

        // Draws connections between array components and their added/removed item references.
        if ( component.propertyType === 'ObservableArray' ) {

          const componentName = component.nameProperty.value;
          const arrayPoint = programNode.getComponentListItemConnectionPoint( componentName, false );

          // The added/removed components may not be defined.
          const addedItemName = component.arrayAddedItemReference?.nameProperty.value;
          const removedItemName = component.arrayRemovedItemReference?.nameProperty.value;

          const addedItemPoint = programNode.getComponentListItemConnectionPoint( addedItemName, true );
          const removedItemPoint = programNode.getComponentListItemConnectionPoint( removedItemName, true );

          if ( addedItemPoint ) {
            this.addConnectionToList( this.arrayConnections, this.activeArrayConnections, component, component.arrayAddedItemReference, arrayPoint, addedItemPoint, programNode );
          }
          if ( removedItemPoint ) {
            this.addConnectionToList( this.arrayConnections, this.activeArrayConnections, component, component.arrayRemovedItemReference, arrayPoint, removedItemPoint, programNode );
          }
        }

        // Draws connections between array items, their components, and the array they belong to.
        if ( component.propertyType === 'ArrayItem' ) {

          // start by drawing connections between the components and this array item,
          // showing the components as used BY the item
          const componentName = component.nameProperty.value;
          const arrayItemPoint = programNode.getComponentListItemConnectionPoint( componentName, true );

          // We know that the array item will only include components from its own program,
          // so we don't have to loop through all OTHER ProgramNodes to find connection
          // points.
          component.itemSchema.forEach( entry => {
            const startPoint = programNode.getComponentListItemConnectionPoint( entry.component.nameProperty.value, false );
            if ( startPoint && arrayItemPoint ) {
              this.addConnectionToList( this.arrayConnections, this.activeArrayConnections, entry.component, component, startPoint, arrayItemPoint, programNode );
            }
          } );

          // now draw a connection between this item and the array it belongs to - it could be
          // on any other program, so we need to loop through all ProgramNodes
          this.programNodes.forEach( otherProgramNode => {
            otherProgramNode.model.modelContainer.allComponents.forEach( otherComponent => {
              if ( otherComponent.propertyType === 'ObservableArray' ) {

                // The arrayComponent may not be defined.
                const componentArrayName = component.arrayComponent?.nameProperty.value;
                if ( otherComponent.nameProperty.value === componentArrayName ) {
                  const arrayPoint = otherProgramNode.getComponentListItemConnectionPoint( componentArrayName, true );
                  if ( arrayPoint && arrayItemPoint ) {
                    this.addConnectionToList( this.arrayConnections, this.activeArrayConnections, otherComponent, component, arrayItemPoint, arrayPoint, programNode );
                  }
                }
              }
            } );
          } );
        }
      } );
    } );
  }

  /**
   * Inspect the model for view connections.
   */
  updateViewConnections() {
    this.viewConnections = [];
    this.activeViewConnections = [];

    this.model.allViewComponents.forEach( component => {
      const componentName = component.nameProperty.value;
      const dependencyNames = component.modelComponentNames;

      let endPoint;
      let endComponent;

      // get the location of the view component that we care about
      this.programNodes.forEach( programNode => {
        programNode.model.viewContainer.allComponents.forEach( modelComponent => {
          if ( modelComponent.nameProperty.value === componentName ) {
            endPoint = programNode.getComponentListItemConnectionPoint( componentName, true );
            endComponent = modelComponent;
          }
        } );
      } );

      // get the location of the model components that the view component is dependent on
      const startObjects = [];
      dependencyNames.forEach( dependencyName => {
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === dependencyName ) {
              startObjects.push( {
                startPoint: programNode.getComponentListItemConnectionPoint( dependencyName, false ),
                startComponent: modelComponent,
                startProgramNode: programNode
              } );
            }
          } );
        } );
      } );

      startObjects.forEach( startObject => {
        if ( startObject && endPoint ) {
          this.addConnectionToList( this.viewConnections, this.activeViewConnections, startObject.startComponent, endComponent, startObject.startPoint, endPoint, startObject.startProgramNode );
        }
      } );
    } );
  }

  /**
   * Inspect the model for listener connections.
   */
  updateListenerConnections() {

    // Link connetions will be drawn from the dependency Properties to the listener component, and from the listener
    // to the controlled components
    this.linkConnections = [];
    this.activeLinkConnections = [];

    this.model.allListenerComponents.forEach( component => {
      const componentName = component.nameProperty.value;
      const dependencyNames = component.dependencyNames;
      const controlledPropertyNames = component.controlledPropertyNames;

      // Look for the view point of the listener component
      let listenerComponentPoint;
      this.programNodes.forEach( programNode => {
        programNode.model.listenerContainer.allComponents.forEach( modelComponent => {
          if ( modelComponent.nameProperty.value === componentName ) {
            listenerComponentPoint = programNode.getComponentListItemConnectionPoint( componentName, false );
          }
        } );
      } );

      // Look for the view point of each controlled Property
      controlledPropertyNames.forEach( controlledPropertyName => {
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === controlledPropertyName ) {

              // view point of the controlled property
              const endPoint = programNode.getComponentListItemConnectionPoint( controlledPropertyName, true );

              if ( listenerComponentPoint && endPoint ) {
                this.linkConnections.push( {
                  start: listenerComponentPoint,
                  end: endPoint
                } );
              }
            }
          } );
        } );
      } );

      // Look for the view point of each dependency Property
      if ( dependencyNames ) {
        dependencyNames.forEach( dependencyName => {
          this.programNodes.forEach( programNode => {
            programNode.model.modelContainer.allComponents.forEach( modelComponent => {
              if ( modelComponent.nameProperty.value === dependencyName ) {

                // view point of the dependency
                const startPoint = programNode.getComponentListItemConnectionPoint( dependencyName, false );

                if ( startPoint && listenerComponentPoint ) {
                  this.linkConnections.push( {
                    start: startPoint,
                    end: listenerComponentPoint
                  } );
                }
              }
            } );
          } );
        } );
      }
    } );
  }

  /**
   * Draws a wire-like connection between two points.
   * @param {CanvasRenderingContext2D} context
   * @param {Object} connection - the connection to draw
   */
  drawConnection( context, connection ) {
    const start = connection.start;
    const end = connection.end;

    const startX = start.x;
    const endX = end.x;

    // So that when points are vertically aligned, lines don't overlap and become impossible to read. The offset is relative to the origin (top left) of the
    // program Node in its global coordinate frame so that the offset doesn't change as the program moves vertically. Components further down the program
    // will have a larger offset.
    const startProgramOriginY = connection.startProgramOrigin.y;
    const horizontalOffset = Math.max( ( start.y - startProgramOriginY ) / 3, 5 );

    const leftOfEndX = end.x - horizontalOffset;
    const leftOfEndY = end.y;

    // If the startX is to the left of the endX, just draw a line from start to end
    if ( startX < endX ) {
      context.moveTo( start.x, start.y );
      context.lineTo( end.x, end.y );
    }
    else {

      // create a zig-zag that moves around view components and is easy to see
      context.moveTo( start.x, start.y );

      // point just below the start point
      const cp1x = start.x;
      const cp1y = start.y + 8;
      context.lineTo( cp1x, cp1y );

      // point just below the start point and to the left of the program
      const cp2x = end.x - horizontalOffset;
      const cp2y = cp1y;
      context.lineTo( cp2x, cp2y );

      // point to the left of the end point (input)
      context.lineTo( leftOfEndX, leftOfEndY );

      // finish at the end point
      context.lineTo( end.x, end.y );
    }

    // draw the arrow head
    // Draw arrowhead
    const arrowSize = 12;
    const angle = Math.atan2( end.y - leftOfEndY, end.x - leftOfEndX );
    const angle1 = angle - Math.PI / 6;
    const angle2 = angle + Math.PI / 6;

    // Calculate arrowhead points
    const arrowX1 = end.x - arrowSize * Math.cos( angle1 );
    const arrowY1 = end.y - arrowSize * Math.sin( angle1 );
    const arrowX2 = end.x - arrowSize * Math.cos( angle2 );
    const arrowY2 = end.y - arrowSize * Math.sin( angle2 );

    context.moveTo( end.x, end.y );
    context.lineTo( arrowX1, arrowY1 );
    context.moveTo( end.x, end.y );
    context.lineTo( arrowX2, arrowY2 );
  }

  /**
   * Set the canvas bounds.
   * @param {number} width
   * @param {number} height
   */
  layout( width, height ) {
    this.setCanvasBounds( new phet.dot.Bounds2( 0, 0, width, height ) );
  }

  /**
   * Redraw in the animation frame.
   */
  step( dt ) {

    // Update the line dash offset to show direction flow in the animation frame.
    if ( Math.abs( this.lineDashOffset ) > MAX_OFFSET ) {
      this.lineDashOffset = 0;
    }

    // A negative offset makes it look like the curves are moving from start point to end point.
    this.lineDashOffset -= dt * 5;

    this.invalidatePaint();
  }
}

/**
 * Inner class representing a connection between two components that should be drawn, just containing the start point, end point, and an origin point for the
 * program containing the start point for the connection (component output).
 *
 * @param start - the start point of the connection (global coordinates)
 * @param end - the end point of the connection (global coordinates)
 * @param startProgramOrigin - the origin point of the program containing the start point (global coordinates)
 */
class Connection {
  constructor( start, end, startProgramOrigin ) {
    this.start = start;
    this.end = end;
    this.startProgramOrigin = startProgramOrigin;
  }
}

export default ConnectionsCanvasNode;