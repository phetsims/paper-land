# Webcam Optimization Tips

If you have control over the software of your webcam, you can optimize some parameters to help with dot/program detection. Your camera may not feature every parameter mentioned or may use different language for the same parameter.

You are looking for dots to be stably detected and might need to iteratively switch between adjusting parameters and [color calibration](device-setup.md#color-calibrating-your-webcam-for-program-detection).

We have found the following parameters to be most influential:

- TURN OFF any Auto setting for: Zoom, Exposure, White Balance
- Adjust Exposure to see papers clearly (not too dark or bright)
- Adjust: Zoom (clearest text)
- Adjust White Balance (make sure blacks look black, and not blue or green, vice versa)
- (optional) Adjust contrast
- (optional) Raise Sharpness if edges look fuzzy

## Calibrate dots 
1. In the [Camera view](http://localhost:3000/camera.html), open the sidebar section labeled Calibrate. 
2. Select a dot color. The circle should show a white outline when in calibration mode for that color. 
3. Select the corresponding color in the Camera Viewport to calibrate that color. 
4. Repeat for all colors.
5. Decide if you need to make anymore webcam parameter changes.

!!! note "Calibrating for Markers"

        Note about Markers: This sets the average size in addition to the color of the dot. If using Markers, they will be recognized based on dots three times (3x) the size of the calibrated dot. Markers also use the same color calibration as the corresponding dot color.


