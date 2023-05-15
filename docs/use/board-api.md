# Board API

## Introduction

This API allows you to create PhET library components from paper program code. These components and functions are used
to add and modify elements on the Board page.

The functions and components described here provide a layer on top of PhET's libraries and the original paperprograms
API. For more detailed information about the most heavily used PhET libraries, see
- https://github.com/phetsims/scenery
- https://github.com/phetsims/axon
- https://github.com/phetsims/sun

Please see https://github.com/janpaul123/paperprograms/blob/master/docs/api.md for the paper programs API.

Paper Land functions encourage the MVC software design pattern. Please see [mvc.md](https://github.com/phetsims/paper-land/blob/master/docs/use/mvc.md) for more information.

---

## Paper Event Functions

This section shows fundamental programs you add to program code. These functions are event listeners for the events (
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

- {number} paperProgramNumber - The number of the paper program.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign
  variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.

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

### onProgramRemoved( paperProgramNumber, scratchpad, sharedData )

The function called when your program is no longer detected by the camera.

#### Arguments

- {number} paperProgramNumber - The number of the paper program.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign
  variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.

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

### onProgramChangedPosition( paperProgramNumber, paperPoints, scratchpad, sharedData )

The function called when your program changes position (move or rotate).

#### Arguments

- {number} paperProgramNumber - The number of the paper program.
- {{x: number, y: number}[]} paperPoints - Array of points, one for each corner of the paper. Order is left top, right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign
  variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.

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

### onProgramMarkersAdded( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram )

The function called when one or more markers are placed inside a program.

#### Arguments

- {number} paperProgramNumber - The number of the paper program.
- {{x: number, y: number}[]} paperPoints - Array of points, one for each corner of the paper. Order is left top, right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign
  variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.
- {Object[]} markersOnProgram - A list of all the markers on the program.
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

### onProgramMarkersRemoved( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram )

The function called when one or more markers are removed from a program.

#### Arguments

- {number} paperProgramNumber - The number of the paper program.
- {{x: number, y: number}[]} paperPoints - Array of points, one for each corner of the paper. Order is left top, right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign
  variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.
- {Object[]} markersOnProgram - A list of all the markers on the program.
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

### onProgramMarkersChangedPosition( paperProgramNumber, paperPoints, scratchpad, sharedData, markersOnProgram )

The function called when one or more markers are removed from a program.

#### Arguments

- {number} paperProgramNumber - The number of the paper program.
- {{x: number, y: number}[]} paperPoints - Array of points, one for each corner of the paper. Order is left top, right
  top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign
  variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.
- {Object[]} markersOnProgram - A list of all the markers on the program.
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

---

## Model

## View

## Utils

## Console

The board page has a console that displays logging and error information. It will notify when something has gone wrong
in your program code. The following functions are also available to you to assist with writing programs.

### phet.paperLand.console.log( ...args )

Prints a message to the console. Takes any number of arguments and prints them all as a string.

#### Example

```js
const myVariable = 5;
phet.paperLand.console.log( myVariable );
```

### phet.paperLand.console.warn( ...args )

Prints a warning message to the console. Takes any number of arguments and prints them all as a string.

#### Example

```js
phet.paperLand.console.warn( 'Careful! Something is not right' );
```

### phet.paperLand.console.error( ...args )

Prints an error message to the console. Takes any number of arguments and prints them all as a string.

#### Example

```js
phet.paperLand.console.error( 'Something has gone wrong!' );
```