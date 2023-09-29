import React from 'react';
import ComponentFunctionsList from './ComponentFunctionsList.js';

const NODE_COMPONENT_FUNCTIONS = [
  'setCenterX( number ) - A number. Sets the horizontal position in the board, in pixels.',
  'setCenterY( number ) - A number. Sets the vertical position in the board, in pixels.',
  'setLeft( number ) - A number. Sets the left edge of the component in the board, in pixels.',
  'setTop( number ) - A number. Sets the top edge of the component in the board, in pixels.',
  'setScale( number ) - A number. Sets the size, relative to 1.',
  'setRotation( number ) - A number. Sets the rotation in radians.',
  'setOpacity( number ) - A number between 0 and 1.',
  'setVisible( boolean ) - A boolean. Visible when true.',

  'unitBoundsToDisplayBounds( bounds ) - Converts bounds in unit (0-1) coordinates to display coordinates. Returns a new bounds.',
  'unitPositionToDisplayPosition( position ) - Converts a position in unit (0-1) coordinates to display coordinates. Returns a new position.'
];
export { NODE_COMPONENT_FUNCTIONS };

export default function NodeComponentFunctionsList( props ) {

  return (
    <>
      <ComponentFunctionsList
        functionsTitle='General view component functions'
        componentFunctions={NODE_COMPONENT_FUNCTIONS}
      ></ComponentFunctionsList>
    </>
  );
}