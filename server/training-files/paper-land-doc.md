# Paper Land Documentation

## Scene Graph

Paper Land is a framework that lets you create 

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