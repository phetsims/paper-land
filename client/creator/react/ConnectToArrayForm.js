/**
 * A form that lets you connect model components in from the current program to an array in the model.
 * You populate an array by adding key/value pairs to an object. The key is the name you want to assign
 * to the component, and the value is the component itself. The object is then added to the array when
 * a program is added to the playground, and removed when the program is removed.
 */

import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

export default function ConnectToArrayForm() {

  // State for a collection of key/value pairs that will be added to the array
  const [ keyValuePairs, setKeyValuePairs ] = useState( [] );

  return <p>Connect to array</p>;
}