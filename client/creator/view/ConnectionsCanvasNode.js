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
        this.drawCurve( context, connection.start, connection.end );
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
        this.drawCurve( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.DERIVED_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.viewConnectionsVisibleProperty.value ) {
      this.updateViewConnections();

      context.beginPath();
      context.strokeStyle = ViewConstants.VIEW_WIRE_COLOR;
      this.viewConnections.forEach( connection => {
        this.drawCurve( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.VIEW_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.listenerConnectionsVisibleProperty.value ) {
      this.updateListenerConnections();

      context.beginPath();
      context.strokeStyle = ViewConstants.LINK_WIRE_COLOR;
      this.linkConnections.forEach( connection => {
        this.drawCurve( context, connection.start, connection.end );
      } );
      context.setLineDash( ViewConstants.LINK_WIRE_LINE_DASH );
      context.stroke();
    }

    if ( this.visibilityModel.arrayConnectionsVisibleProperty.value ) {
      this.updateArrayConnections();

      context.beginPath();
      context.strokeStyle = ViewConstants.ARRAY_WIRE_COLOR;
      this.arrayConnections.forEach( connection => {
        this.drawCurve( context, connection.start, connection.end );
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
            startPoint = programNode.getComponentListItemConnectionPoint( controllerName );
          }
        } );
      } );

      // loop through all programNodes and find the one that has the controlled
      this.programNodes.forEach( programNode => {
        programNode.model.modelContainer.allComponents.forEach( modelComponent => {
          if ( modelComponent.nameProperty.value === controlledName ) {
            endPoint = programNode.getComponentListItemConnectionPoint( controlledName );
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
              endPoint = programNode.getComponentListItemConnectionPoint( componentName );
            }
          } );
        } );

        // loop through programNodes and find the position for the corresponding Node
        const startPoints = [];
        dependencyNames.forEach( dependencyName => {
          this.programNodes.forEach( programNode => {
            programNode.model.modelContainer.allComponents.forEach( modelComponent => {
              if ( modelComponent.nameProperty.value === dependencyName ) {
                startPoints.push( programNode.getComponentListItemConnectionPoint( dependencyName ) );
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
          const arrayPoint = programNode.getComponentListItemConnectionPoint( componentName );

          // The added/removed components may not be defined.
          const addedItemName = component.arrayAddedItemReference?.nameProperty.value;
          const removedItemName = component.arrayRemovedItemReference?.nameProperty.value;

          const addedItemPoint = programNode.getComponentListItemConnectionPoint( addedItemName );
          const removedItemPoint = programNode.getComponentListItemConnectionPoint( removedItemName );

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
          const arrayItemPoint = programNode.getComponentListItemConnectionPoint( componentName );

          // We know that the array item will only include components from its own program,
          // so we don't have to loop through all OTHER ProgramNodes to find connection
          // points.
          component.itemSchema.forEach( entry => {
            const startPoint = programNode.getComponentListItemConnectionPoint( entry.component.nameProperty.value );
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
                  const arrayPoint = otherProgramNode.getComponentListItemConnectionPoint( componentArrayName );
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
            endPoint = programNode.getComponentListItemConnectionPoint( componentName );
          }
        } );
      } );

      // get the location of the model components that the view component is dependent on
      const startPoints = [];
      dependencyNames.forEach( dependencyName => {
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === dependencyName ) {
              startPoints.push( programNode.getComponentListItemConnectionPoint( dependencyName ) );
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
            listenerComponentPoint = programNode.getComponentListItemConnectionPoint( componentName );
          }
        } );
      } );

      // Look for the view point of each controlled Property
      controlledPropertyNames.forEach( controlledPropertyName => {
        this.programNodes.forEach( programNode => {
          programNode.model.modelContainer.allComponents.forEach( modelComponent => {
            if ( modelComponent.nameProperty.value === controlledPropertyName ) {

              // view point of the controlled property
              const endPoint = programNode.getComponentListItemConnectionPoint( controlledPropertyName );

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
                const startPoint = programNode.getComponentListItemConnectionPoint( dependencyName );

                if ( startPoint && listenerComponentPoint ) {
                  this.linkConnections.push( {
                    start: programNode.getComponentListItemConnectionPoint( dependencyName ),
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
   * Draws a wire-like curve between two points, using bezier curves.
   * @param {CanvasRenderingContext2D} context
   * @param {Vector2} start
   * @param {Vector2} end
   */
  drawCurve( context, start, end ) {

    // draw the curve
    const dy = Math.abs( end.y - start.y );

    // so that when points are vertically aligned, the curve bows out wider for a more natural look
    const horizontalOffset = Math.max( dy * 0.5, 25 );

    const cp1x = start.x - horizontalOffset;
    const cp1y = start.y;
    const cp2x = end.x - horizontalOffset;
    const cp2y = end.y;

    context.moveTo( start.x, start.y );
    context.bezierCurveTo( cp1x, cp1y, cp2x, cp2y, end.x, end.y );

    // draw the arrow head
    // Draw arrowhead
    const arrowSize = 12;
    const angle = Math.atan2( end.y - cp2y, end.x - cp2x );
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