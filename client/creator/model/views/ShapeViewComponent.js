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
      rectWidth: 100,
      rectHeight: 50,

      // circle defaults
      circleRadius: 50,

      // ellipse defaults
      ellipseRadiusX: 100,
      ellipseRadiusY: 50,

      // line defaults
      lineStartX: 0,
      lineStartY: 0,
      lineEndX: 100,
      lineEndY: 100,

      // triangle defaults
      triangleBaseWidth: 100,
      triangleHeight: 100,

      // polygon defaults
      polygonPoints: [ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ], [ 0, 100 ] ]
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
        rectWidth: 100,
        rectHeight: 50,

        // circle defaults
        circleRadius: 50,

        // ellilpse defaults
        ellipseRadiusX: 100,
        ellipseRadiusY: 50,

        // line defaults
        lineStartX: 0,
        lineStartY: 0,
        lineEndX: 100,
        lineEndY: 100,

        // triangle defaults
        triangleBaseWidth: 100,
        triangleHeight: 100,

        // polygon defaults
        polygonPoints: [ [ 0, 0 ], [ 100, 0 ], [ 100, 100 ], [ 0, 100 ] ]
      }
    };
  }

  static SHAPE_TYPES = SHAPE_TYPES;
}