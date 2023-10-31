# Creator Tutorial

!!! warning "Under Construction"

      We are working on updating our documentation - more details coming soon!

The Creator interface is where you can create working paper programs and visualize the components of your paper programs while writing little to no code!

Creator is currently organized around the [Model-View-Component framework](mvc.md).

You create **Model components**, pieces of your idea that other components will need to use or change to make your project work, to be controlled by **Controller components** and display the information dynamically as a visual (e.g., text, image, shape), sound, and more using **View components**

??? example "Example project (!! text in progress !!)"

        Let's say you wanted to make a frog jump around your screen. Let's add some interactivity and make it jump to wherever a piece of paper. Say, a lily pad paper? 

        Let's think about the design at a high level and connect it to the needed components:
        
        We want to know...

        1. Where the frog is and be able to change where it is (model component > position > "frogPosition")
        2. Controlling the value of `frogPosition` with a "lilypad" paper (controller components > paper > paper movement)
        3. Drawing a picture of the frog (view component > image > "frogPicture")
        
        Since we want to update the image position separately from the frog's new position (so the image doesn't instantly travel when you move the paper), we'll need to make components for each part (X and Y) of the image position too. 

        4. We'll create a model component > Number > imageYPosition and imageXPosition.
        
        Edit the frogPicture view component and use the Custom Function to set the Center X and Center Y to frogXPosition and lastly we could add a component for
        
        5. Animating that frog when the "lilypad" paper moves (controller component > animation)

Watch the videos for two simple examples below for creating an "Audio Pendulum" or "Paper Organ".

## Using Templates

## Copying Programs

## Adding Images and Sounds

Adding your own images (.jpg, .png, .gif, etc.) and sounds (.wav, .mp3, etc.) can be done right in Creator! Add a View Component, 

## Audio Pendulum Walkthrough
<figure>
<iframe width="877" height="493" src="https://www.youtube.com/embed/9oRPWbRxbNk" title="Paper Playground - Audio Pendulum - Creator Walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>

<figure>
<iframe width="371" height="659" src="https://www.youtube.com/embed/18B9Z4Ch_08" title="Paper Playground - Audio Pendulum project with pieces of paper" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>

## Paper Organ Walkthrough
<figure>
<iframe width="877" height="493" src="https://www.youtube.com/embed/DnZdQ917vW8" title="Paper Playground - Paper Organ - Creator Walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>


## MVC Draft

Alright kiddo, imagine you're playing a simple card game on your computer or tablet. In this card game, you can see cards, click on them to play, and the computer tells you if you won or lost. The Model-View-Controller, or MVC for short, is a way for programmers to organize this game. Let's break it down:

**1. Model (The Brain)**
Imagine this is the rulebook for the card game. It keeps track of which cards are in play, whose turn it is, and checks if someone has won or lost. It doesn't care about how the game looks or how you play the cards, just the rules and the current state of the game.
*Example*: If you have a pair of cards that match, the Model knows and will remember it.

**2. View (The Looks)**
This is like the game board or the table where you see the cards. It's all about the visuals! It shows you the cards, the score, and any messages like "You Win!" The View takes information from the Model and displays it in a way that's easy for you to understand and enjoy.
*Example*: The fancy designs on the cards and the animations when you get a match.

**3. Controller (The Doer)**
Imagine the Controller as your hands in the game. When you want to flip a card, the Controller is the one that does it for you. It listens to your actions, like tapping on the screen, and tells the Model and View what to do next. So, it's the middleman between the rulebook and the game board.
*Example*: You tap on a card, the Controller decides what should happen (like flipping the card), checks with the Model if it's a match, and then tells the View to show the result.

So, in our card game:
- **Model** is the rulebook and memory.
- **View** is the game board and the designs.
- **Controller** is how you play and interact.

By dividing the game into these three parts, programmers can make sure the game runs smoothly and looks great!

Alright, let's imagine you have a cool computer simulation where you can play with virtual magnets and see how they attract or repel each other. The Model-View-Controller, or MVC for short, helps programmers organize this simulation. Let's dive in!

**1. Model (The Brain)**
Think of the Model as the unseen science teacher. It knows all the rules about how magnets work. If two opposite poles (like North and South) come close, they'll attract. If two similar poles (like North and North) come close, they'll repel. The Model knows and remembers all these rules and facts.
*Example*: If you bring two opposite poles of the magnets close in the simulation, the Model will recognize that they should attract each other.

**2. View (The Looks)**
The View is the visual part of the simulation – what you actually see on the screen. It shows you the magnets, the forces between them (maybe as arrows or glowing lines), and any other helpful visuals like labels saying "North" or "South".
*Example*: The detailed design of the magnet, the glow when two magnets are about to attract or repel, and maybe even animations showing magnetic fields.

**3. Controller (The Doer)**
Think of the Controller as your virtual hand inside the simulation. When you drag a magnet around on the screen or decide to flip its poles, the Controller makes that happen. It listens to your actions, like clicking or dragging, and tells the Model and View what should happen next.
*Example*: You decide to move a North pole close to a South pole. As you drag it, the Controller communicates with the Model to check how the magnets should behave and then tells the View to show the attracting force.

So, for our magnetic simulation:
- **Model** is the science teacher in the background.
- **View** is the cool graphics and designs you see.
- **Controller** is the way you interact with the simulation.

By splitting the simulation into these three parts, programmers can create an educational tool that's both accurate in its science and fun to play with!


Sure, let's list out some typical JavaScript components you might encounter in these scenarios:

**Card Game:**

*Model:*
1. **Arrays**: To store the deck of cards, player's hand, and computer's hand.
   ```javascript
   let deck = ["Ace", "Two", ...];
   let playerHand = [];
   let computerHand = [];
   ```
2. **Numbers**: To keep score or count matches.
   ```javascript
   let playerScore = 0;
   let computerScore = 0;
   ```
3. **Booleans**: To determine game states, like whether it's a player's turn or if the game is over.
   ```javascript
   let isPlayerTurn = true;
   let gameFinished = false;
   ```

*View:*
1. **Strings**: Text messages displayed, e.g., "Player's Turn", "You Win!", "It's a tie!".
2. **Images**: Visuals for each card, backgrounds, etc.
   ```javascript
   let cardBackImage = "path/to/card_back.png";
   ```
3. **Sounds**: Sound effects for card flipping, winning, etc.
   ```javascript
   let flipSound = new Audio('path/to/flip_sound.mp3');
   ```

*Controller:*
1. **Event Listeners**: To detect when a card is clicked.
   ```javascript
   cardElement.addEventListener("click", flipCard);
   ```


**Science Simulation (Magnets):**

*Model:*
1. **Objects**: Represent each magnet with properties like pole and position.
   ```javascript
   let magnet1 = { pole: "North", x: 100, y: 200 };
   let magnet2 = { pole: "South", x: 300, y: 400 };
   ```
2. **Booleans**: To determine if two magnets are attracting or repelling.
   ```javascript
   let areAttracting = true;
   ```

*View:*
1. **Strings**: Labels or descriptions displayed, e.g., "North", "South", "Attracting", "Repelling".
2. **Images**: Visuals for each magnet, animations, and possibly the magnetic field visualization.
   ```javascript
   let northPoleImage = "path/to/north_pole.png";
   ```
3. **Sounds**: Sound effects for when magnets come together or push away.
   ```javascript
   let attractSound = new Audio('path/to/attract_sound.mp3');
   ```

*Controller:*
1. **Event Listeners**: To detect when a magnet is dragged or clicked.
   ```javascript
   magnetElement.addEventListener("drag", moveMagnet);

   Absolutely! Introducing the magnetic field and the relationship between distance and force adds another layer of complexity. Here's how you might adapt the components:

**Science Simulation (Magnets with Magnetic Fields):**

*Model:*
1. **Objects**: Represent each magnet with additional properties like magnetic field strength and perhaps a method to compute the force based on distance.
   ```javascript
   let magnet1 = { pole: "North", x: 100, y: 200, fieldStrength: 50 };
   let magnet2 = { pole: "South", x: 300, y: 400, fieldStrength: 50 };
   ```

2. **Function**: To calculate the attraction or repulsion force between two magnets based on distance.
   ```javascript
   function computeForce(magnet1, magnet2) {
       let distance = Math.sqrt(Math.pow(magnet2.x - magnet1.x, 2) + Math.pow(magnet2.y - magnet1.y, 2));
       // Force could be inversely proportional to the square of the distance (like real magnets)
       return (magnet1.fieldStrength * magnet2.fieldStrength) / (distance * distance);
   }
   ```

*View:*
1. **Strings**: Additional descriptions, e.g., "Force: 10 Newtons", "Distance: 50 pixels".
2. **Images**: Updated visuals to show magnetic field around each magnet.
   ```javascript
   let magneticFieldImage = "path/to/magnetic_field.png";
   ```

3. **Graphics**: Drawing methods to visually represent the magnetic field's range and intensity. This could involve changing the opacity or size of the field visualization based on the field strength.
   ```javascript
   function drawMagneticField(magnet) {
       // Code to draw the field, might change color or size based on fieldStrength
   }
   ```

4. **Sounds**: Updated or additional sounds for when magnets are very close (strong force) vs. far away (weak force).

*Controller:*
1. **Event Listeners**: As before, but now might update more frequently to show changing force as you drag magnets closer or farther away.
   ```javascript
   magnetElement.addEventListener("drag", function(event) {
       moveMagnet(event);
       updateForceDisplay(); // Newly added to reflect changing force in real-time
   });
   ```

2. **Function**: A new function to update the display (part of the View) based on changing force.
   ```javascript
   function updateForceDisplay() {
       let force = computeForce(magnet1, magnet2);
       // Update the visuals, e.g., changing colors, text, or animations based on the force magnitude
   }
   ```

In both scenarios, the **Model** holds the main data and logic, the **View** manages the presentation (what users see and hear), and the **Controller** deals with user inputs and communicates between the Model and View.