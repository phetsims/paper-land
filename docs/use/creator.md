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
