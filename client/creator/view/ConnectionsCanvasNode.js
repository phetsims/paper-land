/**
 * A CanvasNode that draws connections between components.
 */
import ViewConstants from './ViewConstants.js';

// A value to wrap the lineDashOffset so it doesn't grow forever.
const MAX_OFFSET = 1000;

class ConnectionsCanvasNode extends phet.scenery.CanvasNode {
  constructor( model, programNodes ) {
    super();

    this.model = model;
    this.programNodes = programNodes;
    this.visibilityModel = model.visibilityModel;

    this.controllerConnections = [];
    this.derivedPropertyConnections = [];
    this.viewConnections = [];

    this.lineDashOffset = 0;
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

    if ( this.visibilityModel.controllerConnectionsVisibleProperty.value ) {
      this.updateControllerConnections();

      // Draw controller connections
      context.beginPath();
      context.strokeStyle = ViewConstants.CONTROLLER_WIRE_COLOR;
      this.controllerConnections.forEach( connection => {
        this.drawConnection( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.CONTROLLER_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.derivedConnectionsVisibleProperty.value ) {
      this.updateDerivedPropertyConnections();

      // Draw DerivedProperty connections
      context.beginPath();
      context.strokeStyle = ViewConstants.DERIVED_WIRE_COLOR;
      this.derivedPropertyConnections.forEach( connection => {
        this.drawConnection( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.DERIVED_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.viewConnectionsVisibleProperty.value ) {
      this.updateViewConnections();

      context.beginPath();
      context.strokeStyle = ViewConstants.VIEW_WIRE_COLOR;
      this.viewConnections.forEach( connection => {
        this.drawConnection( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.VIEW_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.listenerConnectionsVisibleProperty.value ) {
      this.updateListenerConnections();

      context.beginPath();
      context.strokeStyle = ViewConstants.LINK_WIRE_COLOR;
      this.linkConnections.forEach( connection => {
        this.drawConnection( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.LINK_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.arrayConnectionsVisibleProperty.value ) {
      this.updateArrayConnections();

      context.beginPath();
      context.strokeStyle = ViewConstants.ARRAY_WIRE_COLOR;
      this.arrayConnections.forEach( connection => {
        this.drawConnection( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.ARRAY_WIRE_LINE_DASH );
      context.stroke();
    }

    context.restore();
  }

  /**
   * Inspect the model for controller components and the components they control. Find their view components
   * to get the connection points to draw the wires.
   */
  updateControllerConnections() {
    this.controllerConnections = [];

    // draw controller connections
    this.model.allControllerComponents.forEach( component => {
      const controllerName = component.nameProperty.value;
      const controlledName = component.namedProperty.nameProperty.value;

      let startPoint;
      let endPoint;

      // loop through all programNodes and find the one that has the controller
      this.programNodes.forEach( programNode => {
        programNode.model.controllerContainer.allComponents.forEach( controllerComponent => {
          if ( controllerComponent.nameProperty.value === controllerName ) {
            startPoint = programNode.getComponentListItemConnectionPoint( controllerName, false );
          }
        } );
      } );

      // loop through all programNodes and find the one that has the controlled
      this.programNodes.forEach( programNode => {
        programNode.model.modelContainer.allComponents.forEach( modelComponent => {
          if ( modelComponent.nameProperty.value === controlledName ) {
            endPoint = programNode.getComponentListItemConnectionPoint( controlledName, true );
          }
        } );
      } );

      if ( startPoint && endPoint ) {
        this.controllerConnections.push( { start: startPoint, end: endPoint } );
      }
    } );
  }

  /**
   * Inspect the model and look for derived properties and dependencies. For each that we find, get the connection
   * point in the view to draw connection wires.
   */
  updateDerivedPropertyConnections() {
    this.derivedPropertyConnections = [];

    this.model.allModelComponents.forEach( component => {
      if ( component.propertyType === 'DerivedProperty' ) {
        const componentName = component.nameProperty.value;
        const dependencyNames = component.dependencyNames;

        let endPoint;

        // loop through all model components and find the dependency derived property start point
        // loop through all programNodes and find the one that has the controlled
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === componentName ) {
              endPoint = programNode.getComponentListItemConnectionPoint( componentName, true );
            }
          } );
        } );

        // loop through programNodes and find the position for the corresponding Node
        const startPoints = [];
        dependencyNames.forEach( dependencyName => {
          this.programNodes.forEach( programNode => {
            programNode.model.modelContainer.allComponents.forEach( modelComponent => {
              if ( modelComponent.nameProperty.value === dependencyName ) {
                startPoints.push( programNode.getComponentListItemConnectionPoint( dependencyName, false ) );
              }
            } );
          } );
        } );

        startPoints.forEach( startPoint => {
          if ( startPoint && endPoint ) {
            this.derivedPropertyConnections.push( { start: startPoint, end: endPoint } );
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
            this.arrayConnections.push( { start: arrayPoint, end: addedItemPoint } );
          }
          if ( removedItemPoint ) {
            this.arrayConnections.push( { start: arrayPoint, end: removedItemPoint } );
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
              this.arrayConnections.push( { start: startPoint, end: arrayItemPoint } );
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
                    this.arrayConnections.push( { start: arrayItemPoint, end: arrayPoint } );
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

    this.model.allViewComponents.forEach( component => {
      const componentName = component.nameProperty.value;
      const dependencyNames = component.modelComponentNames;

      let endPoint;

      // get the location of the view component that we care about
      this.programNodes.forEach( programNode => {
        programNode.model.viewContainer.allComponents.forEach( modelComponent => {
          if ( modelComponent.nameProperty.value === componentName ) {
            endPoint = programNode.getComponentListItemConnectionPoint( componentName, true );
          }
        } );
      } );

      // get the location of the model components that the view component is dependent on
      const startPoints = [];
      dependencyNames.forEach( dependencyName => {
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === dependencyName ) {
              startPoints.push( programNode.getComponentListItemConnectionPoint( dependencyName, false ) );
            }
          } );
        } );
      } );

      startPoints.forEach( startPoint => {
        if ( startPoint && endPoint ) {
          this.viewConnections.push( { start: startPoint, end: endPoint } );
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
   * @param {Vector2} start - the output for one connection
   * @param {Vector2} end - the input for another connection
   */
  drawConnection( context, start, end ) {

    const startX = start.x;
    const endX = end.x;

    // so that when points are vertically aligned, lines don't overlap and become impossible to read
    const horizontalOffset = Math.max( start.y / 7 - 20, 10 );

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
      const cp1y = start.y + 10;
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

export default ConnectionsCanvasNode;