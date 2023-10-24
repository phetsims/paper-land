import Component from '../Component.js';
import NodeViewComponent from './NodeViewComponent.js';

// The types of shapes you can create
const SHAPE_TYPES = [
  'circle',
  'ellipse',
  'line',
  'triangle',
  'rectangle',
  'polygon'
];

export default class ShapeViewComponent extends NodeViewComponent {
  constructor( name, modelComponents, controlFunctionString, providedOptions ) {

    const shapeOptions = {
      shapeType: 'rectangle',
      fill: '#007BFF', // electric blu,
      stroke: '#001F3F', // navy blu,
      lineWidth: 1,

      // The following are options that will be specific to certain kinds of shapes.  Putting them all
      // here instead of creating subclasses for each shape type greatly simplifies the application
      // implementation for now.  If this gets too complex, we can revisit.

      // rectangle defaults
      rectWidth: 0.5,
      rectHeight: 0.25,

      // circle defaults
      circleRadius: 0.2,

      // ellipse defaults
      ellipseRadiusX: 0.3,
      ellipseRadiusY: 0.15,

      // line defaults
      lineStartX: 0,
      lineStartY: 0,
      lineEndX: 0.5,
      lineEndY: 0.5,

      // triangle defaults
      triangleBaseWidth: 0.2,
      triangleHeight: 0.3,

      // polygon defaults
      polygonPoints: [ [ 0, 0 ], [ 0.1, 0 ], [ 0.1, 0.1 ], [ 0, 0.1 ] ]
    };
    const options = _.merge( {}, shapeOptions, providedOptions );
    super( name, modelComponents, controlFunctionString, options );

    if ( !SHAPE_TYPES.includes( options.shapeType ) ) {
      throw new Error( `ShapeViewComponent: shapeType must be one of ${SHAPE_TYPES}` );
    }

    // save just the options for this type of view component (supertype options wilbe be saved elsewhere)
    this.defaultShapeOptions = _.pick( options, Object.keys( shapeOptions ) );
  }

  save() {
    return {
      ...super.save(),
      defaultShapeOptions: this.defaultShapeOptions
    };
  }

  static fromStateObject( stateObject, allComponents ) {
    const dependencies = Component.findComponentsByName( allComponents, stateObject.modelComponentNames );
    return new ShapeViewComponent(
      stateObject.name,
      dependencies,
      stateObject.controlFunctionString,
      {
        ...stateObject.defaultViewOptions,
        ...stateObject.defaultShapeOptions
      }
    );
  }

  static getStateSchema() {
    return {
      ...NodeViewComponent.getStateSchema(),
      defaultShapeOptions: {
        shapeType: 'rectangle',
        fill: '#007BFF',
        stroke: '#001F3F',
        lineWidth: 1,

        // rectangle
        rectWidth: 0.5,
        rectHeight: 0.5,

        // circle defaults
        circleRadius: 0.5,

        // ellilpse defaults
        ellipseRadiusX: 0.3,
        ellipseRadiusY: 0.15,

        // line defaults
        lineStartX: 0,
        lineStartY: 0,
        lineEndX: 0.3,
        lineEndY: 0.3,

        // triangle defaults
        triangleBaseWidth: 0.1,
        triangleHeight: 0.3,

        // polygon defaults
        polygonPoints: [ [ 0, 0 ], [ 0.1, 0 ], [ 0.1, 0.1 ], [ 0, 0.1 ] ]
      }
    };
  }

  static SHAPE_TYPES = SHAPE_TYPES;
}