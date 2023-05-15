# Model-View Separation

Paper Land code encourages a software design pattern called "model-view separation". This pattern
is often used to develop user interfaces, games, and is heavily used by PhET libraries. It separates internal
data from the way it is presented to the user.

Benefits of model-view separation include:

- You can create multiple output modalities/representations from a single model.
- Changes to the view do not impact application behavior.

## Model

The "model" is the internal data that represents application state and logic.

## View

The view is everything that can be observed by the user. Graphics, sounds, descriptions, vibrations, tangibles -
anything!

## More info

For more info about this pattern and how it can be used for more than just user interface development, please
see https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md#model-view-controller-mvc
and https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller.

## Example Paper Land model

Let's pretend we want to represent a cupcake 🧁 in the Paper Land Board. On the Board, we want to display a visual cupcake
and write strings that describe its properties.

First, lets consider the important things to draw and describe about the cupcake. That will determine the components we
need in the model.

- Type of cake (carrot, chocolate, lemon, ...)
- Type of icing (buttercream, royal, whipped cream, ...)
- Type of sprinkles (confetti, jimmies, pearls, ...)

Let's create a Paper Land model that represents these attributes! As of 4/28/23, Paper Land Program code looks like this:

```js
  const onProgramAdded = ( paperProgramNumber, scratchPad, sharedData ) => {

    // (1)
    phet.paperLand.addModelComponent( 'cakeTypeProperty', new phet.axon.Property( "Chocolate" ) );
    phet.paperLand.addModelComponent( 'icingTypeProperty', new phet.axon.Property( "Buttercream" ) );
    phet.paperLand.addModelComponent( 'sprinklesProperty', new phet.axon.Property( "Confetti" ) ); 
  };

  // (2)
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString()
      }
    }
  } );
```

Quickly breaking down the numbered sections of the above Program code:

1) `addModelComponent` is used to add new components to the Board model. We provide the name for the component so that 
   it can be looked up later, and the actual model component. The model component can be any data type. In this example,
   we are using a PhET library component called `axon.Property`. `axon.Property` has support for sending events
   whenever the value changes.
2) Boilerplate that tells Paper Land to create these model components when this Program is detected.

NOTE: In a real example, it would be important to remove the model components when the program is removed. See
program templates and paper land documentation for examples of this.

## Example Paper Land view

Let's use the model we just created in some Paper Land Program view code. This view could add dynamic graphics and
descriptions that will change with the model.

```js
  const onProgramAdded = ( paperProgramNumber, scratchPad, sharedData ) => {

    // (1)
    const cupcakeNode = new CupcakeNode(); 
    sharedData.scene.addChild( cupcakeNode );
    
    // (2)
    phet.paperLand.addModelPropertyLink( 'cakeTypeProperty', cakeType => {
    
      // (3)
      if ( cakeType === "Chocolate" ) {
        cupcakeNode.drawChocolate();
        cupcakeNode.descriptionContent = "The richest chocolate you have ever tasted."
      }
      else if ( cakeType === "Carrot" ) {
        cupcakeNode.drawCarrot();
        cupcakeNode.descriptionContent = "Spiced to perfection."
      }
      else if ( cakeType === "Lemon" ) {
        cupcakeNode.drawLemon();
        cupcakeNode.descriptionContent = "As refreshing as it is sweet."
      }
    } );
  };

  // (4)
  await paper.set('data', {
    paperPlaygroundData: {
      updateTime: Date.now(),
      eventHandlers: {
        onProgramAdded: onProgramAdded.toString(),
      }
    }
  } );
```

Quickly breaking down the numbered sections of the above Program code:

1) We create a `CupcakeNode` and add it to the scene. The `CupcakeNode` could use scenery to draw the cake, icing, and
   sprinkles and other structure for a screen reader but that is beyond the scope of these notes. The `cupcakeNode` is
   added as a child to the scene so that it is drawn to the Board.
2) We add a link to the `cakeTypeProperty` with `addModelPropertyLink`. The first argument is the name of the Property
   to observe. The second argument is the work you want to do when the Property value changes. `addModelPropertyLink`
   will handle listener registration for you so that it works no matter what order the model and view code is introduced
   to the Board.
3) This is the logic called whenever the model `cakeTypeProperty` changes. I introduced
   imaginary `drawChocolate`, `drawCarrot` and `drawLemon` functions. Implementing these is beyond the scope of these
   notes, but you could imagine they change images or colors representing the cupcake. They are followed by code
   that changes how the cupcake is described for a screen reader.
4) Boilerplate that tells Paper Land to run this view code whenever the Program is detected.

From a single `cakeTypeProperty`, we support several output modalities. You can imagine many other view
Programs that could play sounds, trigger vibrations, and many other things from this single model component.

NOTE: In a real example, it would be important to remove the model components when the program is removed. See
program templates and paper land documentation for examples of this.