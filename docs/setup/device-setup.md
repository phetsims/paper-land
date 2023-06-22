!!! warning "Under Construction" 
      
      We are working on updating our documentation - more details coming soon!

!!! Danger "Legacy Documentation" 
      
      This documentation reflects the setup for the original [Paper Programs](https://paperprograms.org/) project and may not be accurate for the current version of the tool.

## Hardware Required

- A computer
- A projector - ideally 2000 lumens and 1080p. A 1000 lumens projector can work under some conditions, but the low light needed to see the projections may be too dark for your camera to detect the programs in the space.
- A webcam - 720p works, but be wary that cameras with poor quality sensors may not work well in all lighting conditions.
- A color printer - Any color printer will do.
- A way to mount the projector - This is a tough one, whatever you do, bear in mind that projectors are heavy enough that they need to be connected to something load-bearing like a beam or a stud. Command Strips or screws in drywall will not be enough. (Note that you can project onto a wall and tape your programs to the wall if you just want to try this out, but it's not quite the same).
- Optional: Depending on how you set up your space, you may need unusually long HDMI and USB cables to connect the camera/projector to the computer.
- Optional: A solid black rug or mat to project onto. Bear in mind: a projector's whites can only be as bright as the projector's bulb, and its blacks can only be as black as the surface it is projecting onto.

## Setting up the camera

The projector page uses the experimental OffscreenCanvas API, so you'll need to enable `chrome://flags/#enable-experimental-web-platform-features` (this will require you to restart chrome).

Once you have all the hardware in place, go to [https://paperprograms.org/camera.html](https://paperprograms.org/camera.html) to start calibrating the camera. Make sure to hit "Allow" when the browser asks for camera access.

![The camera screen when first launched](img/camera-screen.png)

Turn on your projector and have it project something that is screen-filling and vibrant. In the corners of the camera view you should see 4 red circles. Drag those circles to the corners of where the projection is in the camera image. These boundaries will be used by the camera and the projector to figure out how to transform the coordinates of the programs from the camera's view to the projector's "view". If your camera or projector moves, you'll need to adjust these boundaries.

![The camera screen with boundaries](img/camera-boundaries.png)

Next we'll need to print a calibration page to calibrate the camera's color detection. Click "print calibration page", and place the printed page roughly in the center of the projector's space. To make calibration easier, you may want to turn off the projector or have it project a totally black screen.

On the camera view you should see a bunch of circles appearing on top of the circles on the piece of paper. You'll need to calibrate each color (R, O, G, B, P) one at a time. Click the color's button in the sidebar, then click on the circle corresponding to that color in the camera view.

![The camera while calibrating](img/camera-calibrating.png)

When you're done the colors in the sidebar may be slightly different than they were before. This is because the camera now knows what each of the colors we printed looks like in the lighting conditions of your space. If the lighting conditions change you'll need to perform this calibration again.

## Setting up the projector

Turn the projector back on. In Google Chrome, visit [https://paperprograms.org/projector.html](https://paperprograms.org/projector.html). Drag that window over to the projector's screen and make it fullscreen (Ctrl/Cmd+Shift+F). If you run into issues with the projector screen (e.g. if it isn't showing a program you recently created) refreshing the page will usually solve the problem.
