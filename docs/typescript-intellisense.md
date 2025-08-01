# Paper Land TypeScript IntelliSense Support

This enhancement adds TypeScript definitions for Paper Land's core API objects to Monaco Editor, providing better autocomplete, parameter hints, and documentation when writing Paper Land programs.

## What's Included

The TypeScript definitions provide IntelliSense support for the following Paper Land objects:

### Core Objects

- **`sharedData`** - Global data shared between all programs
  - `sharedData.model` - The display model containing all model components
  - `sharedData.scene` - The root scene node for adding visual elements
  - `sharedData.displaySize` - Display dimensions
  - `sharedData.allMarkers` - All markers detected by the camera

- **`scratchpad`** - Program-specific data storage object
  - Can store any data specific to your program
  - Shared between all event listeners in the same program

- **`points`** - Array of four corner points of the paper
  - `points[0]` - Left top corner
  - `points[1]` - Right top corner  
  - `points[2]` - Right bottom corner
  - `points[3]` - Left bottom corner
  - Each point has `.x` and `.y` properties

### Global Variables

- `paperNumber` - The number of the current paper program
- `otherPaperNumber` - The number of another paper (in adjacency events)
- `direction` - Direction of adjacency ('left', 'right', 'up', 'down')
- `markersOnProgram` - Array of markers currently on this program

### phet.paperLand Namespace

The full `phet.paperLand` API is available with autocomplete:

#### Console Functions
- `phet.paperLand.console.log()` - Log messages (appear in sidebar)
- `phet.paperLand.console.error()` - Log error messages
- `phet.paperLand.console.warn()` - Log warning messages

#### Model Component Functions
- `phet.paperLand.addModelComponent(name, component)` - Add a model component
- `phet.paperLand.removeModelComponent(name)` - Remove a model component

#### Program Data Functions
- `phet.paperLand.setProgramData(paperNumber, dataName, data)` - Set program-specific data
- `phet.paperLand.getProgramData(paperNumber, dataName)` - Get program-specific data
- `phet.paperLand.removeProgramData(paperNumber, dataName)` - Remove program-specific data

#### Event Emitters
- `phet.paperLand.markersAddedEmitter` - Emits when markers are added
- `phet.paperLand.markersRemovedEmitter` - Emits when markers are removed
- `phet.paperLand.markersChangedPositionEmitter` - Emits when markers move

#### Utility Functions
- `phet.paperLand.utils.getProgramRotation(points)` - Get program rotation in radians
- `phet.paperLand.utils.getNormalizedProgramRotation(points)` - Get normalized rotation (0-1)
- `phet.paperLand.utils.getProgramCenter(points)` - Get center point of program
- `phet.paperLand.utils.getMarkerPositionNormalized(markers, colorName)` - Get normalized marker position

## How It Works

The TypeScript definitions are automatically loaded when Monaco Editor mounts in:

1. **Editor page** (`/workspaces/paper-land/client/editor/EditorMain.js`)
2. **Creator page** (`/workspaces/paper-land/client/creator/react/CreatorMonacoEditor.js`)
3. **Camera page** (`/workspaces/paper-land/client/camera/CameraMain.js`)

The definitions are added using Monaco's `addExtraLib` API, which provides IntelliSense without requiring actual TypeScript compilation.

## Example Usage

When you start typing in the Monaco editor, you'll get autocomplete suggestions:

```javascript
// Typing "sharedData." will show:
// - model
// - scene  
// - displaySize
// - allMarkers

const onProgramAdded = (paperNumber, scratchpad, sharedData) => {
  // Autocomplete available for sharedData properties
  sharedData.model.get('myComponent');
  sharedData.scene.addChild(someNode);
  
  // Autocomplete available for scratchpad (any property)
  scratchpad.myData = { value: 42 };
  
  // Autocomplete available for points array
  const rotation = phet.paperLand.utils.getProgramRotation(points);
  const center = phet.paperLand.utils.getProgramCenter(points);
  
  // Autocomplete available for phet.paperLand functions
  phet.paperLand.console.log('Program added!');
  phet.paperLand.addModelComponent('myProperty', new phet.axon.Property(0));
};
```

## Benefits

1. **Better Discoverability** - See all available properties and methods as you type
2. **Parameter Hints** - Get information about function parameters and their types
3. **Documentation** - See JSDoc comments explaining what each property/method does
4. **Error Prevention** - Catch typos and incorrect API usage before runtime
5. **Faster Development** - No need to constantly reference documentation

## Implementation Details

The TypeScript definitions are embedded directly in the Monaco Editor configuration to avoid external dependencies. The definitions include:

- Comprehensive interfaces for all Paper Land objects
- JSDoc comments for documentation
- Proper typing for arrays, functions, and objects
- Support for both required and optional properties

The configuration also sets appropriate compiler options to provide helpful suggestions while avoiding TypeScript errors in JavaScript code.

## Files Modified

1. `/workspaces/paper-land/client/common/paper-land-types.d.ts` - Core TypeScript definitions
2. `/workspaces/paper-land/client/common/monacoConfig.js` - Utility functions for Monaco configuration
3. `/workspaces/paper-land/client/editor/EditorMain.js` - Main editor TypeScript integration
4. `/workspaces/paper-land/client/creator/react/CreatorMonacoEditor.js` - Creator editor TypeScript integration
5. `/workspaces/paper-land/client/camera/CameraMain.js` - Camera view TypeScript integration

## Future Enhancements

Possible future improvements:

- Add specific property definitions for common PhET library objects (axon.Property, scenery.Node, etc.)
- Include definitions for common Paper Land patterns and templates
- Add type checking for user-defined model components
- Integrate with the existing AI helper for smarter code suggestions
