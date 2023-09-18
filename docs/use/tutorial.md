# Using Paper Playground

!!! warning "Under Construction" 
      
      We are working on updating our documentation - more details coming soon!

<!-- https://facelessuser.github.io/pymdown-extensions/extensions/keys/#key-map-index -->

Before we begin, make sure you have [installed Paper Playground](../setup/install.md) and [set up your camera](../setup/camera-tips.md).

## Step 1: Open up all pages of the interface

Navigate to localhost:3000 in your browser and either click the links or open in your browser:

1. Camera.html
2. Projector.html
3. Board.html
4. Creator.html

## What is the Camera page?

The Camera page is where all the action happens for turning your paper programs interactive!

On this page you will find the preview of your webcam, a preview of the full JavaScript for your currently selected paper program, and a plethora of options in the sidebar. Explore the headings in the sidebar to create and navigate between [spaces](#what-is-a-space), [calibrate your webcam](../setup/device-setup.md#color-calibrating-your-webcam-for-program-detection) to detect paper programs, print and [virtually preview programs and markers](#what-are-preview-papers-eye), and [fine-tune your detection](../setup/device-setup.md#fine-tuning-program-detection).

You'll use this page to match up where your papers are in space with visuals on a projector. Think of it as your play space.

### What are Preview Papers? :eye:

If you are quickly iterating or just not in a position to print physical papers, you can still see how your code runs! Preview paper programs can be placed into the camera view at any time and the code will run as through you put a physical paper in view.

While a lot more can be done to help the preview papers mimic how you can move a physical piece of paper, there are a few features currently in place to help.

- Move the papers by dragging inside boundaries of the preview.
- Resize the papers by dragging an edge.
- Drag the green square to rotate the paper.
- Select the scissors to break the paper into four independently moveable corners.
- Preview papers can be removed at any time by selecting the red square.

## Organizing your code: Spaces and Projects
### What is a Space?
A space is way of organizing your programs. All of the programs in a space can be for one project or you can create a series of simpler programs that all exist in the same Space. This is completely up to you and we use them for both purposes. There is no limit to the number of Spaces you can have, so focusing each Space on one idea works well.

#### What is a Project?


## What is the Board page?

The display! This page is where your visuals and sounds will be displayed.

There are a few helpful additions to this page to help with your creation and play.

### Controls

You can adjust the sensitivity of your programs to paper movement (in the event of detection jitter)

### Console

If you use the `phet.paperland.console.log/warn` functionality in any custom code section of your programs, that code will display here. See the [Board API](board-api.md) for more information.

Regular JavaScript usage of `console.log` will display in your browser's developer console as usual, but will not display in the Board Console.

## What is the Projector page?

Given the current structure of the client, all of the code detected in the Camera is run through the Projector. However, in the latest iteration, we have focused all development on paper code outputting to the Board. The Projector page must be opened to run the code, but the tab or window does not need to be visible. 

If you would like to use vanilla Web Canvas or make use of the projection overlay feature of the legacy Paper Programs project, then this is the page where the code will output. See [https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md) for more on this.


## Printing your first program

Select the "Create New Program" button. Create a new program from the "Hello World" template. From your  Once it has finished printing, click "done" next to its name. Place that program somewhere in the projector's space. If you have all the overlay checkboxes checked, you should see a blue rectangle in the camera view indicating that the program has been detected. If you don't see this, it may mean some of the dots aren't being recognized and you need to try calibrating again (you may also want to adjust the lighting in the room).

![The camera recognizing a program]()

The projector.html page should have the words "Hello World" and a blue dot somewhere on it.

![The projector's page when Hello World is in view](img/projector-hello-world.png)

In the real world, you should see "Hello World" and the blue dot superimposed on the paper:

![The projected program in the real world](img/)

You should be able to move the page and have the superimposed image move with it.

## Creating and Editing Programs

### Creator: Building programs visually

See [the Creator tutorial](creator.md).

### Editor: If you're comfortable with JavaScript and reading API documents

On the camera page you'll find a link to the program editor for your space (this is a good link to share with other people who are collaborating on your space).

Open that link (make sure you keep the camera page open at all times) and select Hello World from the drop down menu. If that page is in the projector's view, it will now have a rectangular border around it that matches the "Editor color" you see on your editor page. This is a useful indicator in situations where many people have editors open simultaneously.

![The program editor](../assets/camera-view.png)

Make some changes in the editor (try changing what text gets drawn on the canvas for starters) and click the "save" button. The changes should now be reflected in the output of the projector.

If you want to make a new program, click "print as new paper" and place the newly printed paper in the projector's view. Also note that Paper Programs looks for a comment on the first line of the file and uses that as the program's name.

At this point you should have everything you need to build a collborative Paper Programs workspace. Look at the API reference (available on the editor page) for more information about the APIs available to your programs.