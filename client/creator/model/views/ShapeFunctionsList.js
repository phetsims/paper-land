/**
 * A component that lists out the various things you can do with a shape to change it with javascript
 * functions. Each supported shape type has a list of functions and those functions are visible when
 * the shape type is selected.
 */

import React from 'react';
import ComponentFunctionsList from '../../react/ComponentFunctionsList.js';
import NodeComponentFunctionsList from '../../react/NodeComponentFunctionsList.js';
import ShapeViewComponent from './ShapeViewComponent.js';

const SHAPE_COMPONENT_FUNCTIONS = [
  'setFill() - A CSS color string. Sets the fill color. Like "red" or "#ff0000".',
  'setStroke() - A CSS color string. Sets the stroke color. Like "black" or "#000000".',
  'setLineWidth() - A number. Sets the width of the stroke line in pixels.'
];

const RECTANGLE_COMPONENT_FUNCTIONS = [
  'setRectBounds() - Takes a bounds component. Sets the dimensions of the rectangle in pixels.',
];

const CIRCLE_COMPONENT_FUNCTIONS = [
  'setRadius() - A number. Sets the radius of the circle in pixels.'
];

const ELLIPSE_COMPONENT_FUNCTIONS = [
  'setRadiusX() - A number. Sets the x radius of the ellipse in pixels.',
  'setRadiusY() - A number. Sets the y radius of the ellipse in pixels.'
];

const LINE_COMPONENT_FUNCTIONS = [
  'setX1() - A number. Sets the x coordinate of the first point of the line in pixels.',
  'setY1() - A number. Sets the y coordinate of the first point of the line in pixels.',
  'setX2() - A number. Sets the x coordinate of the second point of the line in pixels.',
  'setY2() - A number. Sets the y coordinate of the second point of the line in pixels.'
];

const TRIANGLE_COMPONENT_FUNCTIONS = [
  'setBaseWidth() - A number. Sets the width of the triangle\'s base in pixels.',
  'setHeight() - A number. Sets the height of the triangle in pixels.'
];

const POLYGON_COMPONENT_FUNCTIONS = [
  'setPoints() - An array of points. Each point is a { x, y } pair. For example, [{x: 0, y:0}, {x: 100, y:0}, {x: 50, y: 100}] would be a triangle with vertices at (0, 0), (100, 0), and (50, 100). Values in pixels.'
];

export default function ShapeFunctionsList( props ) {
  const selectedShapeType = props.formData.defaultShapeOptions.shapeType;
  if ( !ShapeViewComponent.SHAPE_TYPES.includes( selectedShapeType ) ) {
    throw new Error( 'Invalid shape type.' );
  }
  return (
    <div>
      <NodeComponentFunctionsList/>
      <ComponentFunctionsList
        functionsTitle='Shape functions'
        componentFunctions={SHAPE_COMPONENT_FUNCTIONS}
      ></ComponentFunctionsList>
      {
        selectedShapeType === 'rectangle' ? (
          <ComponentFunctionsList
            functionsTitle='Rectangle functions'
            componentFunctions={RECTANGLE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'circle' ? (
          <ComponentFunctionsList
            functionsTitle='Circle functions'
            componentFunctions={CIRCLE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'ellipse' ? (
          <ComponentFunctionsList
            functionsTitle='Ellipse functions'
            componentFunctions={ELLIPSE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'line' ? (
          <ComponentFunctionsList
            functionsTitle='Line functions'
            componentFunctions={LINE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'triangle' ? (
          <ComponentFunctionsList
            functionsTitle='Triangle functions'
            componentFunctions={TRIANGLE_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : selectedShapeType === 'polygon' ? (
          <ComponentFunctionsList
            functionsTitle='Polygon functions'
            componentFunctions={POLYGON_COMPONENT_FUNCTIONS}
          ></ComponentFunctionsList>
        ) : <h3>Unsupported shape type</h3>
      }
    </div>
  );
}