# Board API

## Introduction
This API allows you to create PhET library components from paper program code. These
components and functions are used to add and modify elements on the Board page.

The functions and components described here provide a layer on top of PhET's 
libraries and the original paperprograms API. For more detailed information about
the most heavily used PhET libraries, see
https://github.com/phetsims/scenery
https://github.com/phetsims/axon
https://github.com/phetsims/sun

Please see https://github.com/janpaul123/paperprograms/blob/master/docs/api.md for
a description of the paper programs API and components.

Paper Land functions encourage the MVC software design pattern. Please see
{{LINK_TO_MVC_SUMMARY}} for more information.

## Paper Event Functions
The following functions can be added to your program code. They are event listeners
for events that can happen to a paper. Add and write code inside these functions
to do work when an event occurs. The following describes the events.
- paper added
- paper removed
- paper moved
- paper gained markers
- paper lost markers
- paper markers moved

To add a listener to one of these events, a function is created and assigned to a variable.
Then it is passed as a string to the paper data. See examples below.

### onProgramAdded( paperProgramNumber, scratchpad, sharedData )
The function called when your program is detected by the camera.

#### Arguments
- {number} paperProgramNumber - The number of the paper program.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign variables to this object to use the same variable in more than one function.
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

### onProgramRemoved( paperProgramNumber, scratchpad, sharedData )
The function called when your program is no longer detected by the camera.

#### Arguments
- {number} paperProgramNumber - The number of the paper program.
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign variables to this object to use the same variable in more than one function.
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

### onProgramChangedPosition( paperProgramNumber, paperPoints, scratchpad, sharedData )
The function called when your program changes position (move or rotate).

#### Arguments
- {number} paperProgramNumber - The number of the paper program.
- {{x: number, y: number}[]} paperPoints - Array of points, one for each corner of the paper. Order is left top, right top, right bottom, left bottom. X,Y values are normalized relative to camera view dimensions. 
- {Object} scratchpad - A JavaScript object that is unique to the program but shared between all event listeners. Assign variables to this object to use the same variable in more than one function.
- {Object} sharedData - A JavaScript object with global variables of paper-land. See {{Link to sharedData description}}.

#### Example
```js
const onProgramChangedPosition = ( paperProgramNumber, scratchpad, sharedData ) => {
  phet.paperLand.console.log( 'Program was removed.' );
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

## Model

## View

## Utils

## Console
The board page has a console that displays logging and error information. It will
notify when something has gone wrong in your program code. The following functions
are also available to you to assist with writing programs.

### phet.paperLand.console.log( ...args )
Prints a message to the console. Takes any number of arguments and prints them all.

#### Example
```js
const myVariable = 5;
phet.paperLand.console.log( myVariable );
```

### phet.paperLand.console.warn( ...args )
Prints a warning message to the console. Takes any number of arguments and prints them all.

#### Example
```js
phet.paperLand.console.warn( 'Careful! Something is not right' );
```

### phet.paperLand.console.error( ...args )
Prints an error message to the console. Takes any number of arguments and prints them all.

#### Example
```js
phet.paperLand.console.error( 'Something has gone wrong!' );
```