import React from 'react';
import ComponentFunctionsList from './ComponentFunctionsList.js';

const NODE_COMPONENT_FUNCTIONS = [
  'setCenterX() - A number. Sets the horizontal position in the board.',
  'setCenterY() - A number. Sets the vertical position in the board.',
  'setScale() - A number. Sets the size, relative to 1.',
  'setRotation() - A number. Sets the rotation in radians.',
  'setOpacity() - A number between 0 and 1.',
  'setVisible() - A boolean. Visible when true.'
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