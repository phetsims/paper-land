# Setting up camera and projector for paper detection

!!! warning "Under Construction"

      We're currently updating our documentation. Stay tuned for more details!


This page will guide you through setting up your devices so your computer can detect your printed paper programs and you can (optionally) project visuals onto them!

If you're already setup, then head over the [Tutorial](../use/tutorial.md) for a run-down of the interface and how to get started making programs!

## Board Projector Setup

If you are only using the paper program detection capabilities of Paper Playground and planning to use Preview papers (eye icon next to programs in the Camera interface), skip to [Camera Setup](#camera-setup).

If you are using a projector to display visual elements in your playspace or on your paper programs, then, read on.

### Placing the projector

Find a place to place your projector that will let you move your paper programs easily in the projection space. Ideally, you are able to mount the projector above you, pointed toward the floor for the most natural interaction between the papers and anyone working with you. Webcam/projector configurations parallel to the floor (e.g., pointing at a wall) are possible, especially using tape, sticky tack, or magnets (in the case of e.g., a whiteboard).

You may later find that you need to adjust the relative positions of your projector and webcam in order to get the best program detection and most space to move papers around. See [Fine-tuning program detection](#fine-tuning-program-detection) and [Webcam tips](camera-tips.md) for more advice on improving program detection.

After powering on your projector and connecting it to your computer, open the Board interface (board.html) in a separate window and move it into the projector window.

Now it's time to setup your webcam.

### Camera Setup

### Camera Configuration

An external USB webcam (at least 720p) is the best to use for flexibility in your paper-moving play space. Try pointing the webcam down so you can naturally move papers around without worrying about working against gravity. Webcam/projector configurations parallel to the floor (e.g., pointing at a wall) are possible, especially using tape, sticky tack, or magnets (in the case of e.g., a whiteboard).

Many configurations are possible! The farther away the webcam from the surface you'll be moving the papers, the larger you will want your papers/dots to be. You may also notice a difference in detection accuracy with higher resolution cameras (1080p and above).

### Opening the Camera interface

After setting up the hardware, navigate to [http://localhost:3000/camera.html](http://localhost:3000/camera.html) for camera calibration. Grant the browser permission when prompted for camera access.

!!! failure "Camera not detected"

      If your camera is not detected or not presented as an option under the Devices header on the Camera page sidebar (only viewable if more than one camera device is detected), then try checking your USB connection. If you're still having problems, it may be a permissions issue from your browser. You will need to access the site settings for localhost. This varies per browser. In Chrome, you can select the icon to the left of the URL and select "Site Settings". From there, you can navigate to Camera permissions and change it from Ask (Default) to Allowed.

### Aligning your projector to the Camera view

![Initial camera screen view](img/camera-screen.png)

Project any vibrant, full-screen image. The Board interface can work, but you will have an easier time with a bright white screen (assuming a black background).

![Camera screen with set boundaries](img/camera-boundaries.png)

In the camera view, you'll notice **4 red circles** at the corners: **TL, TR, BR, BL**. Drag these circles to align with the projection's corners. If done accurately, this synchronizes the camera and projector views so that any visuals projected on the paper will properly align based on the coordinates you define in your programs.

!!! warning

      If either the camera or projector is moved, you will need to recalibrate.

If you need to zoom in or drag the camera view to find the red circles or to help with alignment use the following key/mouse combinations:

**Zoom In/Out:** ++shift+"Wheel Up/Down"++

**Pan/Move window:** ++shift+"Mouse Drag"++

When you are ready to project, press the "Projector Mode" button on the Board interface to enlarge the display to the entire projector window. By default, the screen is black.

### Color calibrating your webcam for program detection

For color calibration, print one of your paper programs and position the printed page within the camera's view. (if using the projector, it might be easier to turn off the projector or project a black screen during this step.)

On the camera view, circles will overlay the printed ones if they are detected. Calibrate each color (R, G, B, D) individually by selecting the color from the sidebar and then clicking its corresponding circle in the camera view. When selecting the color on the sidebar, the circle will highlight. The highlight will disappear when it successfully calibrates. You may need to click a few times on the circle in the Camera view depending on page performance.

![Camera view during calibration](img/camera-calibrating.png)

Post-calibration, the dot colors in the sidebar might slightly differ, reflecting the camera's adaptation to your space's lighting. If lighting changes, recalibrate. It's important to maintain steady light conditions. Sunlight changes rapidly, especially with passing clouds! If you can, find a room with steady, uniform illumination or recalibrate frequently.

#### Calibrating for markers

Calibration also sets the average dot size. This will determine how large dots need to be to be considered "markers". If you wish to use markers in your programs, the dots will need to be 3 times larger by default.

!!! idea "Deciding on marker size"

      You can test how big your markers need to be in the camera view by bringing your paper closer to the camera which will "enlarge" your dots relative to the camera view.

#### Fine-tuning program detection

If your setup is not detecting all of the dots on your papers, you won't be able to calibrate them and your programs will not be detected (or will be detected intermittently).

You can fine-tune the requirements for detecting dots on the paper for your specific setup and lighting conditions.

??? note "Directly editing detection parameters"

        If your version does not have these controls, then you can edit the following parameters (defaultParam) in the software directory: `client > camera > simpleBlobDetector.js`

        `thresholdStep` - big impact on performance, but also resolution of detection markers. It operates over min to maxThreshold.

        `minThreshold` - Not as big of an impact, but you can theoretically gate on dark background with this.

        `maxThreshold` - ^^ Likewise for very bright pixels.

        `minDistBetweenBlobs` - The number of pixels needed to call two detected centers two distinct blobs. Definitely impactful. Noisier images will benefit from this not being too small.

        `minArea` - big impact and arguably the one that made it possible for me to raise the camera much higher for detecting full sized programs. This is a parameter in detectPrograms.js as well. We should make sure they are both updated.

        `maxArea` - good for filtering out anything that is being mistreated as a marker.

Look under the Detection header in the sidebar of Camera.html and adjust the parameters. Even with adjustments, you may need to improve the lighting of your room or find you need to print papers with larger dots to get reliable dot detection.

## Canvas Projector Setup

If you're using the legacy Projector page to send visual elements to the web canvas, rather than the Board, you'll follow these intructions instead:

Power on the projector and separate [http://localhost:3000/projector.html](http://localhost:3000/projector.html) to its own window. Move this window to the projector's display and enter fullscreen mode (Ctrl/Cmd+Shift+F). If you encounter issues (e.g., a recently created program not displaying), refreshing the page should help.