import React from 'react';
import ComponentFunctionsList from './ComponentFunctionsList.js';

const NODE_COMPONENT_FUNCTIONS = [
  'setCenterX( number ) - A number. Sets the horizontal position in the board.',
  'setCenterY( number ) - A number. Sets the vertical position in the board.',
  'setLeft( number ) - A number. Sets the left edge of the component in the board.',
  'setTop( number ) - A number. Sets the top edge of the component in the board.',
  'setScale( number ) - A number. Sets the size, relative to 1.',
  'setRotation( number ) - A number. Sets the rotation in radians.',
  'setOpacity( number ) - A number between 0 and 1.',
  'setVisible( boolean ) - A boolean. Visible when true.',
  'moveToFront() - Moves this view component in front of all others.',
  'moveToBack() - Moves this view component behind all others.',
  'matchBounds( bounds, stretch ) - Scale and move the component so that it is the same size and centered in the provided bounds. If stretch is true, the component will be stretched in x and y. If stretch is false, the component will keep its aspect ratio. Do not use this with setCenterX, setCenterY, and setScale.',

  'unitBoundsToDisplayBounds( bounds ) - Converts bounds in unit (0-1) coordinates to display coordinates (pixels). Returns a new bounds.',
  'unitPositionToDisplayPosition( position ) - Converts a position in unit (0-1) coordinates to display coordinates (pixels). Returns a new position.'
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