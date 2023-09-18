!!! warning "Under Construction" 
      
      We are working on updating our documentation - more details coming soon!


The Creator interface is where you can create working paper programs and visualize the components of your paper programs while writing little to no code!

Creator is currently organized around the [Model-View-Component framework](mvc.md).

You create **Model components**, pieces of your idea that other components will need to use or change to make your project work, to be controlled by **Controller components** and display the information dynamically as a visual (e.g., text, image, shape), sound, and more using **View components**

??? example "INCOMPLETE"
        
        Let's say you wanted to make a frog jump around your screen. Let's add some interactivity and make it jump to wherever a piece of paper. Say, a lily pad paper? 

        At a high level, we know we'll need components for
        1. where the frog is and be able to change where it is (model component > position > "frogPosition")
        2. control the value of `frogPosition` with a "lilypad" paper (controller components > paper > paper movement)
        3. Draw a picture of the frog (view component > image > "frogPicture")
        4. Since we want to update the image position separately from the frog's new position (so the image doesn't instantly travel when you move the paper), we'll need to make components for each part (X and Y) of the image position too. We'll create a model component > Number > imageYPosition and imageXPosition.
        5. Edit the frogPicture view component and use the Custom Function to set the Center X and Center Y to frogXPosition and
        6. Animate that frog when the "lilypad" paper moves (controller component > animation)
        
        Well, your frog would need a position somewhere on the screen. We'll need to know where it starts and we'll need to change that position value. So, we Create Component, select the Model tab, and select Position. We can name our component frogPosition, set the initial X and Y screen coordinates to 0 and create our component!

        Now, we'll want to add an image of the frog

Watch the videos for two simple examples below for creating an "Audio Pendulum" or "Paper Organ".

<iframe width="560" height="315" src="https://www.youtube.com/embed/5-GzrdAAva8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  <figcaption></figcaption>
</figure>

<iframe width="560" height="315" src="https://www.youtube.com/embed/5-GzrdAAva8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  <figcaption></figcaption>
</figure>