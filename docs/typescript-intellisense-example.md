# TypeScript IntelliSense Example

This example demonstrates the new TypeScript IntelliSense features available in Paper Land Monaco Editor.

## Example Program with IntelliSense

When you type this code in any Paper Land Monaco Editor (Editor, Creator, or Camera), you'll get full autocomplete and documentation:

```javascript
const onProgramAdded = (paperNumber, scratchpad, sharedData) => {
  // ✨ Autocomplete available for sharedData properties
  // Type "sharedData." to see: model, scene, displaySize, allMarkers
  
  // Access the display model
  const gravityProperty = sharedData.model.get('gravity');
  if (gravityProperty) {
    phet.paperLand.console.log(`Gravity is: ${gravityProperty.value}`);
  }
  
  // Add visual elements to the scene
  // Type "sharedData.scene." to see: addChild, removeChild, children, etc.
  const circle = new phet.scenery.Circle(25, { fill: 'red' });
  sharedData.scene.addChild(circle);
  
  // Work with display size
  // Type "sharedData.displaySize." to see: width, height
  circle.centerX = sharedData.displaySize.width / 2;
  circle.centerY = sharedData.displaySize.height / 2;
  
  // Store data in scratchpad
  // Type "scratchpad." - you can add any property
  scratchpad.myCircle = circle;
  scratchpad.rotationSpeed = 0.1;
  scratchpad.counter = 0;
  
  // Work with markers
  // Type "sharedData.allMarkers" to see array methods and each marker's properties
  const redMarkers = sharedData.allMarkers.filter(marker => marker.colorName === 'red');
  phet.paperLand.console.log(`Found ${redMarkers.length} red markers`);
  
  // Access utility functions
  // Type "phet.paperLand.utils." to see all available utility functions
  const rotation = phet.paperLand.utils.getProgramRotation(points);
  const center = phet.paperLand.utils.getProgramCenter(points);
  
  phet.paperLand.console.log(`Program rotation: ${rotation}`);
  phet.paperLand.console.log(`Program center: (${center.x}, ${center.y})`);
};

const onProgramChangedPosition = (paperNumber, points, scratchpad, sharedData) => {
  // ✨ Autocomplete available for points array
  // Type "points[0]." to see: x, y properties
  const topLeft = points[0];
  const topRight = points[1];
  const bottomRight = points[2];
  const bottomLeft = points[3];
  
  // Use the stored circle from scratchpad
  // Type "scratchpad." to see stored properties
  if (scratchpad.myCircle) {
    const newRotation = phet.paperLand.utils.getProgramRotation(points);
    scratchpad.myCircle.rotation = newRotation;
    
    // Update position based on paper center
    const center = phet.paperLand.utils.getProgramCenter(points);
    scratchpad.myCircle.center = center;
  }
  
  // Increment counter
  scratchpad.counter = (scratchpad.counter || 0) + 1;
  
  if (scratchpad.counter % 10 === 0) {
    phet.paperLand.console.log(`Position changed ${scratchpad.counter} times`);
  }
};

const onProgramMarkersAdded = (paperNumber, points, scratchpad, sharedData, markersOnProgram) => {
  // ✨ Autocomplete available for markersOnProgram array
  // Type "markersOnProgram[0]." to see: id, colorName, position, positionOnPaper, paperNumber
  
  markersOnProgram.forEach(marker => {
    phet.paperLand.console.log(`Marker ${marker.id} (${marker.colorName}) added at (${marker.position.x}, ${marker.position.y})`);
    
    if (marker.positionOnPaper) {
      phet.paperLand.console.log(`Position on paper: (${marker.positionOnPaper.x}, ${marker.positionOnPaper.y})`);
    }
  });
  
  // Store program data
  // Type "phet.paperLand." to see all available functions
  phet.paperLand.setProgramData(paperNumber, 'markerCount', markersOnProgram.length);
};

const onProgramAdjacent = (paperNumber, otherPaperNumber, direction, scratchpad, sharedData) => {
  // ✨ Autocomplete shows direction is one of: 'left', 'right', 'up', 'down'
  phet.paperLand.console.log(`Program ${otherPaperNumber} is ${direction} of program ${paperNumber}`);
  
  // Get data from the other program
  const otherProgramData = phet.paperLand.getProgramData(otherPaperNumber, 'markerCount');
  if (otherProgramData !== undefined) {
    phet.paperLand.console.log(`Other program has ${otherProgramData} markers`);
  }
  
  // Listen to marker events
  // Type "phet.paperLand.markersAddedEmitter." to see: addListener, removeListener
  if (!scratchpad.markerListener) {
    scratchpad.markerListener = (addedMarkers) => {
      phet.paperLand.console.log(`${addedMarkers.length} markers added globally`);
    };
    phet.paperLand.markersAddedEmitter.addListener(scratchpad.markerListener);
  }
};

const onProgramRemoved = (paperNumber, scratchpad, sharedData) => {
  // Clean up visual elements
  if (scratchpad.myCircle) {
    sharedData.scene.removeChild(scratchpad.myCircle);
  }
  
  // Remove event listeners
  if (scratchpad.markerListener) {
    phet.paperLand.markersAddedEmitter.removeListener(scratchpad.markerListener);
  }
  
  // Clean up program data
  phet.paperLand.removeProgramData(paperNumber, 'markerCount');
  
  phet.paperLand.console.log('Program cleaned up');
};

// Set up the paper program
await paper.set('data', {
  paperPlaygroundData: {
    updateTime: Date.now(),
    eventHandlers: {
      onProgramAdded: onProgramAdded.toString(),
      onProgramRemoved: onProgramRemoved.toString(),
      onProgramChangedPosition: onProgramChangedPosition.toString(),
      onProgramMarkersAdded: onProgramMarkersAdded.toString(),
      onProgramAdjacent: onProgramAdjacent.toString()
    }
  }
});
```

## What You'll See

When typing this code in Monaco Editor, you'll experience:

### 1. Object Property Autocomplete
- Type `sharedData.` → see `model`, `scene`, `displaySize`, `allMarkers`
- Type `points[0].` → see `x`, `y`
- Type `scratchpad.` → add any custom properties

### 2. Function Parameter Hints
- Type `phet.paperLand.addModelComponent(` → see parameter hints for `name` and `component`
- Type `sharedData.model.get(` → see parameter hint for `componentName`

### 3. Method Autocomplete
- Type `phet.paperLand.` → see all available functions like `console`, `addModelComponent`, `utils`, etc.
- Type `phet.paperLand.utils.` → see utility functions like `getProgramRotation`, `getProgramCenter`

### 4. Array and Object Navigation
- Type `markersOnProgram[0].` → see marker properties like `id`, `colorName`, `position`
- Type `sharedData.allMarkers.` → see array methods like `filter`, `map`, `forEach`

### 5. Documentation on Hover
- Hover over any property or function to see JSDoc documentation explaining what it does

## Benefits

1. **Faster coding** - No need to remember exact property names
2. **Fewer errors** - Catch typos before runtime
3. **Better exploration** - Discover available APIs as you type
4. **Self-documenting** - See parameter types and descriptions inline
5. **Consistent naming** - Autocomplete ensures you use the correct API names
