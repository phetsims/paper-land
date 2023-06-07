# Scenery Documentation

## Scene Graph

Scenery is a JavaScript library for creating interactive graphics and multimodal content in HTML5. It is a scene graph
implementation. A scene graph is a tree data structure that represents the hierarchy of objects in a scene. The
fundamental graph element is called a `Node`. The following are snippets of code that show how to
use Nodes to create a scene graph.

### addChild

```js
  const scene = new phet.scenery.Node();
  const childNode = new phet.scenery.Node();
  scene.addChild( childNode );
```

### removeChild

```js
  scene.removeChild( circle );
```

## Drawing Content

Scenery supports drawing fundamental shapes and text. The following snippets of code show how to create these
components. Each shape is a subclass of `Node` and can be added to the scene graph.

### Circle

```js
  const circle = new phet.scenery.Circle( 50, { fill: 'red', stroke: 'blue' } );
```

### Rectangle

```js
  const rectangle = new phet.scenery.Rectangle( 0, 0, 50, 100, { fill: 'red', stroke: 'blue' } );
```

### Text

```js
  const text = new phet.scenery.Text( 'I am some text!', { font: new phet.scenery.Font( { size: 16} ) } );
```

### Path
Path lets you draw custom shapes.
```js
const shape = new phet.kite.Shape()
  .moveTo( 0, 0 )
  .lineTo( 100, 0 )
  .lineTo( 100, 100 )
  .lineTo( 0, 100 )
  .close();
const path = new phet.scenery.Path( shape, { fill: 'orange', stroke: 'black' } );
```

