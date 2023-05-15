# Board API

## Introduction

This API allows you to create PhET library components from paper program code. These components and functions are used
to create and modify elements on the Board page.

This API is a layer on top of PhET's libraries and the original API from paper programs. For more detailed information
about the most heavily used PhET libraries, see

- https://github.com/phetsims/scenery (Interactive graphics library)
- https://github.com/phetsims/axon (Observable component library)
- https://github.com/phetsims/sun (UI component library)

Please see https://github.com/janpaul123/paperprograms/blob/master/docs/api.md for the paper programs API.

Paper Land functions encourage the MVC software design pattern. Please
see [mvc.md](https://github.com/phetsims/paper-land/blob/master/docs/use/mvc.md) for more information.

---

## Paper Event Functions

This section is for the most fundamental paper program functions. These functions are event listeners for the events (
changes) that can happen to a paper. Add and write code inside these functions to do work when an event occurs. Paper
events include the following:

- paper added
- paper removed
- paper moved
- paper gained markers
- paper lost markers
- paper markers moved

To create a listener, a function is created and assigned to a variable. Then, it is passed as a string to the paper
data. See examples below.

---

### ```onProgramAdded( paperProgramNumber, scratchpad, sharedData )```

The function called when your program is detected by the camera.

#### Arguments

- `{number}` `paperProgramNumber` - The number of the paper program.
- `{Object}` `scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.
  Assign variables to this object to use the same variable in more than one function.
- `{Object}` `sharedData` - A JavaScript object with global variables of paper-land. See {{Link to sharedData
  description}}.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
  phet.paperLand.console.log( 'Program was added.' );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString()
    }
  }
} );
```

---

### ```onProgramRemoved( paperProgramNumber, scratchpad, sharedData )```

The function called when your program is no longer detected by the camera.

#### Arguments

- `{number}` `paperProgramNumber` - The number of the paper program.
- `{Object}` `scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.
  Assign
  variables to this object to use the same variable in more than one function.
- `{Object}` `sharedData` - A JavaScript object with global variables of paper-land. See {{Link to sharedData
  description}}.

#### Example

```js
const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  phet.paperLand.console.log( 'Program was removed.' );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

---

### ```onProgramChangedPosition( paperProgramNumber, paperPoints, scratchpad, sharedData )```

The function called when your program changes position (move or rotate).

#### Arguments

- `{number}` `paperProgramNumber` - The number of the paper program.
- `{{x: number, y: number}[]}` `paperPoints` - Array of points, one for each corner of the paper. Order is left top,
  right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- `{Object}` `scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.
  Assign
  variables to this object to use the same variable in more than one function.
- `{Object}` `sharedData` - A JavaScript object with global variables of paper-land. See {{Link to sharedData
  description}}.

#### Example

```js
const onProgramChangedPosition = ( paperProgramNumber, paperPoints, scratchpad, sharedData ) => {
  phet.paperLand.console.log( 'Program changed position.' );
  phet.paperLand.console.log( 'Left top corner at:', paperPoints[ 0 ] );
  phet.paperLand.console.log( 'Right bottom corner at:', paperPoints[ 2 ] );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramChangedPosition: onProgramChangedPosition.toString()
    }
  }
} );
```

---

### ```onProgramMarkersAdded( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram )```

The function called when one or more markers are placed inside a program.

#### Arguments

- `{number}` `paperProgramNumber` - The number of the paper program.
- `{{x: number, y: number}[]}` `paperPoints` - Array of points, one for each corner of the paper. Order is left top,
  right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- `{Object}` `scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.
  Assign
  variables to this object to use the same variable in more than one function.
- `{Object}` `sharedData` - A JavaScript object with global variables of paper-land. See {{Link to sharedData
  description}}.
- `{Object[]}` `markersOnProgram` - A list of all the markers on the program.
  See [Markers API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points) for information
  on each marker.

#### Example

```js
const onProgramMarkersAdded = ( paperProgramNumber, scratchpad, sharedData, currentMarkers ) => {
  phet.paperLand.console.log( `Markers added to program. ${currentMarkers.length} markers currently on program.` );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramMarkersAdded: onProgramMarkersAdded.toString()
    }
  }
} );
```

---

### ```onProgramMarkersRemoved( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram )```

The function called when one or more markers are removed from a program.

#### Arguments

- `{number}` `paperProgramNumber` - The number of the paper program.
- `{{x: number, y: number}[]}` `paperPoints` - Array of points, one for each corner of the paper. Order is left top,
  right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- `{Object}` `scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.
  Assign
  variables to this object to use the same variable in more than one function.
- `{Object}` `sharedData` - A JavaScript object with global variables of paper-land. See {{Link to sharedData
  description}}.
- `{Object[]}` `markersOnProgram` - A list of all the markers on the program.
  See [Markers API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points) for information
  on each marker.

#### Example

```js
const onProgramMarkersRemoved = ( paperProgramNumber, scratchpad, sharedData, currentMarkers ) => {
  phet.paperLand.console.log( `Markers removed from program. ${currentMarkers.length} markers currently on program.` );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramMarkersRemoved: onProgramMarkersRemoved.toString()
    }
  }
} );
```

---

### ```onProgramMarkersChangedPosition( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram )```

The function called when one or more markers change their position on this program.

#### Arguments

- `{number}` `paperProgramNumber` - The number of the paper program.
- `{{x: number, y: number}[]}` `paperPoints` - Array of points, one for each corner of the paper. Order is left top,
  right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- `{Object}` `scratchpad` - A JavaScript object that is unique to the program but shared between all event listeners.
  Assign
  variables to this object to use the same variable in more than one function.
- `{Object}` `sharedData` - A JavaScript object with global variables of paper-land. See {{Link to sharedData
  description}}.
- `{Object[]}` `markersOnProgram` - A list of all the markers on the program.
  See [Markers API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points) for information
  on each marker.

#### Example

```js
const onProgramMarkersChangedPosition = ( paperProgramNumber, scratchpad, sharedData, currentMarkers ) => {
  // Assuming there is only one marker on the paper. positionOnPaper is the normalized position of the marker
  // relative to the paper origin.
  if ( currentMarkers[ 0 ] && currentMarkers[ 0 ].positionOnPaper ) {
    const positionOnPaper = currentMarkers[ 0 ].positionOnPaper;
    phet.paperLand.console.log( `Markers moved within this program. Marker now at ${positionOnPaper.x}, ${positionOnPaper.y}` );
  }
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramMarkersChangedPosition: onProgramMarkersChangedPosition.toString()
    }
  }
} );
```

### Shared Data (`sharedData`)

Most Paper event functions have an argument called `sharedData`. It is a JavaScript object with important information
that is shared between all programs.

```js
sharedData = {

  // A reference to the entire model. See {{LINK TO MODEL SECTION}}
  model: boardModel,
  
  // A reference to the root Node of the view. See {{LINK TO VIEW SECTION}}
  scene: scene,
  
  // The size of the Board display, in view coordinates.
  displaySize: DISPLAY_SIZE,
  
  // All markers currently detected by the camera. See https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points
  allMarkers: allMarkers
};
```

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

  // get a reference to a component in the model
  const gravityProperty = sharedData.model.get( 'gravityProperty' );\
  phet.paperLand.console.log( `${gravityProperty.value} is the value of gravity.` );
  
  // add a circle to the display view, in the center of the display
  sharedData.addChild( new phet.scenery.Circle( 75, {
    fill: 'red',
    centerX: sharedData.displaySize.width / 2,
    centerY: sharedData.displaySize.height / 2
  } );
  
  // print all the markers detected by the camera
  phet.paperLand.console.log( `${sharedData.allMarkers.length} markers detected.` );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString(),
    }
  }
} );
```

---

## Marker Event Functions

This sections shows listener functions you can add when a marker is added, removed, or moved in the entire camera space.
If you are interested events when a marker is added to a specific paper, see the examples in the Paper Event Functions
section.
To create a listener, a function is created and assigned to the scratchpad in onProgramAdded. The listener
is then removed in onProgramRemoved.

---

### ```paperLand.markersAddedEmitter```

Emits an event when a new marker is detected by the camera.

#### Callback Arguments

- `{Object[]}` `addedMarkers` - A list of the added markers.
  See [Markers API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points) for information
  on each marker.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

  // create the listener and add it to the scratchpad so it can be removed later
  scratchpad.markersAddedListener = markers => {
    phet.paperLand.console.log( `New markers detected by camera. ${markers.length} markers added.` );
  }
  
  // add the listener to the Emitter
  phet.paperLand.markersAddedEmitter.addListener( scratchpad.markersAddedListener );
};

const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

  // remove the listener from the Emitter
  phet.paperLand.markersAddedEmitter.removeListener( scratchpad.markersAddedListener );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString(),
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

---

### ```paperLand.markersRemovedEmitter```

Emits an event when new markers are removed from the camera.

#### Callback Arguments

- `{Object[]}` `removedMarkers` - A list of the removed markers.
  See [Markers API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points) for information
  on each marker.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
  
  // create the listener, assign it to the scratchpad
  scratchpad.markersRemovedListener = markers => {
    phet.paperLand.console.log( `Markers removed from camera. ${markers.length} markers removed.` );
  }
  
  // add the listener to the Emitter
  phet.paperLand.markersRemovedEmitter.addListener( scratchpad.markersRemovedListener );
};

const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

  // remove the listener from the Emitter
  phet.paperLand.markersRemovedEmitter.removeListener( scratchpad.markersRemovedListener );
}

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString(),
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

---

### ```paperLand.markersChangedPositionEmitter```

Emits an event when markers change position in the camera view.

#### Callback Arguments

- `{Object[]}` `changedMarkers` - A list of the markers that have changed position.
  See [Markers API](https://github.com/janpaul123/paperprograms/blob/master/docs/api.md#marker-points) for information
  on each marker.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {
  scratchpad.markersChangedPositionListener = markers => {
    phet.paperLand.console.log( `Markers moved. ${markers.length} markers changed their position.` );
  }
  
  phet.paperLand.markersChangedPositionEmitter.addListener( scratchpad.markersChangedPositionListener );
};

const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  phet.paperLand.markersChangedPositionEmitter.removeListener( scratchpad.markersChangedPositionListener );
}

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString(),
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

## Board Model (`boardModel`)

The `boardModel` is
a [JavaScript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). You can
create and add components to the `boardModel` in your program code. Map keys are strings - the name of the component.
The values
are any JavaScript object you want to add to the model.

---

### `phet.paperLand.addModelComponent( componentName, componentObject )`

Adds a component to the `boardModel`. For programs that create model components, this should almost always
be used in the `onProgramAdded` function.

NOTE! You almost always want to remove the model component in teh `onProgramRemoved` function.
See {{LINK_TO_onProgramRemoved}}.

#### Arguments

- `{string}` `componentName` - The name of the component to add.
- `{Object}` `componentObject` - The JavaScript Object to add to the `boardModel` map.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

  // Add a number to the model with the name 'x'
  phet.paperLand.addModelComponent( 'x', 5 );
  
  // add a PhET Axon Property to the model with the name 'gravityProperty'
  phet.paperLand.addModelComponent( 'gravityProperty', new phet.axon.Property( -9.8 ) );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString()
    }
  }
} );
```

---

### `phet.paperLand.removeModelComponent( componentName )`

#### Arguments

- `{string}` `componentName` - The name of the component to remove.

#### Example

```js
const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {

  // Add a model component with the name 'x'.
  phet.paperLand.removeModelComponent( 'x' );
  
  // Remove a model component with the name 'gravityProperty'
  phet.paperLand.removeModelComponent( 'gravityProperty' );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

---

### `phet.paperLand.getModelComponent( componentName )`

Returns a reference to the model component with the provided name, if it exists.

#### Arguments

- `{string}` `componentName` - Name of the component in the model to get.

#### Returns

- `{Object | undefined}` - The model component, or undefined if it does not exist.

#### Example

```js
const onProgramChangedPosition = ( paperProgramNumber, paperPoints, scratchpad, sharedData ) => {
  const gravityProperty = phet.paperLand.getModelComponent( 'gravityProperty' );
  const maxGravity = 20;

  // If gravity exists in the model...
  if ( gravityProperty ) {
  
    // Use a utility function to get the program rotation from its four points - normalized from zero to one.
    const rotation = phet.paperLand.utils.getNormalizedProgramRotation( paperPoints );
    const newGravity =  maxGravity * rotation;
    gravityProperty.set( newGravity ); 
  }
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramChangedPosition: onProgramChangedPosition.toString()
    }
  }
} );
```

---

### `phet.paperLand.addModelPropertyLink( componentName, listener )`

Adds a listener to a PhET Axon Property in the model. The listener will be called whenever the value of the Property
changes. If the Property is not in the model yet, paper-land will add the listener as soon as the Property is added
with `addModelComponent`.
When the Property is removed with `removeModelComponent`, the listener will be removed. You almost always want to use
this in the `onProgramAdded` function.

NOTE! You almost always want to remove the listener in the `onProgramRemoved` function. See
{{LINK_TO_removeModelPropertyLink}}.

#### Arguments

- `{string}` `componentName` - Name of the PhET Axon Property you will add with `addModelComponent`.
- `{function}` `listener` - A JavaScript function that will be called when the Axon Property changes. Takes two
  arguments, the current Property value and the old Property value, in that order.

#### Returns

- `{number}` - A unique ID for the listener. Assign this to the scratchpad to remove the listener when the program is
  removed.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

  // Add a listener that logs the new gravity value whenever it changes. The return value of addModelPropertyLink
  // is saved to the scratchpad so that the listener can be removed later in onProgramRemoved.
  scratchpad.gravityLinkId =  phet.paperLand.addModelPropertyLink( 'gravityProperty', ( newGravity, oldGravity ) => {
    phet.paperLand.console.log( `Gravity changed value! New value: ${newGravity}, Old value: ${oldGravity}` );
  } );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString()
    }
  }
} );
```

---

### `phet.paperLand.removeModelPropertyLink( componentName, linkId )`

Removes a listener from a PhET Axon Property in the `boardModel`. You almost always want to use this in
the `onProgramRemoved` function.

#### Arguments

- `{string}` `componentName` - Name of the PhET Axon Property you will add with `addModelComponent`.
- `{number}` `linkId` - The number that was returned from `addModelPropertyLink`. Typically, you will save this on
  the `scratchpad`.

#### Example

```js
const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  phet.paperLand.removeModelPropertyLink( 'gravityProperty', scratchpad.gravityLinkId );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

---

### `phet.paperLand.addModelObserver( componentName, handleAttach, handleDetach )`

Generally, you should use `addModelPropertyLink`/`removeModelPropertyLink`. Use this for more complicated cases that
cannot use an Axon Property.

This function lets you add observers to components in the model and components that are expected to be in the model.
This way,
you can gracefully add listeners to observable components even before they are added to the model.

This should almost always be used in `onProgramAdded`, and counterpart `removeModelObserver` should be used
in `onProgramRemoved`.

#### Arguments

- `{string}` `componentName` - Name of the observable component in the `boardModel``.
- `{function}` `handleAttach` - Function that attaches the observer to the observable as soon as the component is added
  with `addModelComponent`.
- `{function}` `handleDetach` - Function that removes the observer from the observable as soon as the observable
  component is removed with `removeModelComponent`.

#### Returns

- `{number}` - A unique ID to the observer so that listeners can be detached when the program is no longer detected.

#### Example

```js
const onProgramAdded = ( paperProgramNumber, scratchpad, sharedData ) => {

  // Add an observer to a model component called "buttonPressedEmitter". The "buttonPressedEmitter" notifies
  // listeners whenever a button is pressed. The Emitter implements `addListener` and `removeListener` which
  // are used in the second and third arguments.
  scratchpad.observerId =  phet.paperLand.addModelObserver.(
    'buttonPressedEmitter',
    ( addedComponent ) => {
      scratchpad.listener = () => {
        phet.paperLand.console.log( 'You just pressed a button!' );
      }
      addedComponent.addListener( scratchpad.listener );
    },
    ( removedComponent ) => {
      removedComponent.removeListener( scratchpad.listener );
    }
  )
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString()
    }
  }
} );
```

### `phet.paperLand.removeModelObserver( componentName, observerId )`

Generally, you should use `addModelPropertyLink`/`removeModelPropertyLink`. Use this for more complicated cases that
cannot use an Axon Property.

This function removes observers to components that are (or are expected to be) in the model.

This should almost always be used in `onProgramRemoved`, after an observer was added with `addModelObserver`.

#### Arguments

- `{string}` `componentName` - Name of the observable component in the `boardModel``.
- `{number}` `observerId` - Unique ID for the observer that was created by `addModelObserver`.

#### Example

```js
const onProgramRemoved = ( paperProgramNumber, scratchpad, sharedData ) => {
  phet.paperLand.removeModelObserver( 'buttonPressedEmitter', scratchpad.observerId );
};

await paper.set( 'data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramRemoved: onProgramRemoved.toString()
    }
  }
} );
```

## View

## Utils

## Console

The board page has a console that displays logging and error information. It will notify when something has gone wrong
in your program code. The following functions are also available to you to assist with writing programs.

### ```phet.paperLand.console.log( ...args )```

Prints a message to the console. Takes any number of arguments and prints them all as a string.

#### Example

```js
const myVariable = 5;
phet.paperLand.console.log( myVariable );
```

### ```phet.paperLand.console.warn( ...args )```

Prints a warning message to the console. Takes any number of arguments and prints them all as a string.

#### Example

```js
phet.paperLand.console.warn( 'Careful! Something is not right' );
```

### ```phet.paperLand.console.error( ...args )```

Prints an error message to the console. Takes any number of arguments and prints them all as a string.

#### Example

```js
phet.paperLand.console.error( 'Something has gone wrong!' );
```