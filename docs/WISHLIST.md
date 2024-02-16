# Features Wishlist

Below are a few general ideas or features that have been identified to improve Paper Playground. Also, see the [GitHub repo issue list](https://github.com/phetsims/paper-land/issues?q=is%3Aopen+is%3Aissue+label%3Awishlist) with the `wishlist` label (as well as other issues) for possible places for contribution.

## Documentation

- Thorough API documentation for PhET libraries
- More examples, both written and in video format, of paper programs and complete projects.

## Code Abstraction into Creator

- Additional abstraction for components in Creator, e.g.,
  - Physics system
  - More animation features
  - Vibration
  - Bluetooth devices
  - ...

## Program Detection (OpenCV)

- Additional dot colors (increase max program number per database)
- Custom dot colors
- Marker colors and shapes independent of dot colors
- Improve base performance
- Automatic calibration
- Optional Alternatives for detection:
  - Aruco Markers \[beholder\](  <ins>https://github.com/project-beholder/beholder-detection</ins>)

## Virtual "Preview" Program Features

- Reference marks on virtual papers in Camera overlay that make it easier to line them up relative to each other
- Whiskers drawn on Camera overlay
- Making the virtual paper manipulation embodied by harnessing computer vision hand tracking/gesture support (e.g., MediaPipe).

## Camera Control

- Some efforts have been made in <https://github.com/phetsims/paper-land/issues/56>, but have not been stabilized.
- Exposure control (Automatic Exposure Adjustment)
- White Balance control (Automatic White Balance Adjustment)
- Focus control (automatic focus adjustment)

## Interface and Database Interaction

- Local storage option to replace PostGreSQL database for program storage and execution. 
