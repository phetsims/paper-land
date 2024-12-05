# Welcome to Paper Playground: Your Interactive Design Space

[![GitHub](https://img.shields.io/badge/github-repo-yellow?logo=github&logoColor=white)](https://www.github.com/phetsims/paper-land/)
[![Matrix Chat](https://img.shields.io/badge/matrix-chat-green?logo=matrix&logoColor=green)](https://matrix.to/#/#interactive-paper-programming:matrix.org)
[![Youtube Channel](https://img.shields.io/badge/youtube-channel-red?logo=youtube&logoColor=red)](https://www.youtube.com/@PaperPlaygroundCommunity/)
[![License](https://img.shields.io/github/license/phetsims/paper-land?color=blue)](https://github.com/phetsims/paper-land/blob/main/LICENSE)

<figure markdown>
  ![Paper Playground interface](assets/card-full-interface.png)
</figure>

Paper Playground is an open-source project for collaboratively creating multimodal web experiences by means of mapping code to real pieces of paper and manipulating the code in your **physical space**. Everything runs on your machine and you can collaborate locally or using a hosting service to collaborate over projects with others in your shared space.

While Paper Playground can support many uses, our aim is to support a community interested in bringing physical interaction as a means to collaboratively solve problems in codesigning technology.

[Get Started](./setup/install.md){ .md-button .md-button--primary }
---

Paper Playground is based on the [Paper Programs](https://paperprograms.org) open-source project and has been extended to incorporate [SceneryStack](https://scenerystack.org/), the web development stack used by [PhET Interactive Simulations](https://phet.colorado.edu) as a robust 2D scene renderer and support for multimodal features.

Paper Playground is intended to enable quick prototyping of web projects based in JavaScript through physical, spatial movement of real pieces of paper. We are developing with a particular emphasis on simplifying adding multimodal display such as audio features (like sounds and sonifications), spoken description (via Text-To-Speech), and other non-visual features that are often difficult to design and develop alongside visual elements in complex web projects. Learn more on the [Multimodal Codesign page](./projects/codesign.md).

## Paper Playground Now Supports Micro:bit and Other Microcontrollers

<figure markdown>
  ![Paper Playground laundry machine using microcontroller and paper programs](assets/paperlandsudsoriginal.gif)
</figure>

Check out the [Microcontroller Integration](./projects/microcontroller.md) page to learn more about how you can communicate with microcontrollers over Bluetooth, expanding the already near infinite capabilities of Paper Playground to enhance the tangible possibilities. You can create a hybrid tangible interface using paper-based events (paper movement, paper size, markers, paper overlap, etc) from Paper Playground, while triggering actuators connected to your microcontroller. Or, vice versa... take in sensor signals from your microcontroller, pipe a message to Paper Playground, and trigger animations, sounds, speech, and anything else you can do on the web using Paper Playground!

---

Paper Playground is open to contribution of all forms, from code to documentation to design. We welcome you to join our community and help us build a tool that supports a wide range of users in creating interactive web experiences.

[🌍 Join the Community 🌍](community.md){ .md-button .md-button--primary }
---

---

## Overview of Paper Playground Components

Paper Playground is built around a few key components that work together seamlessly:

- **Program Creation**: Design and iterate on your programs with ease using abstracted program components in *Creator* with no or minimal JavaScript.
- **Computer Vision**: Our tool detects your dot-encoded paper programs using a webcam, merging the digital and physical realms.
- **Execution and Display**: See your code come to life on screen while you manipulate it with your hands, with outputs displayed in real-time.
- **Collaboration**: Shared databases enable synchronous and asynchronous collaboration, whether you’re working locally or online.

<figure markdown>
  ![(Left) Minimal configuration using Creator editor, detected wallet-sized papers, and displaying code output to an up-turned monitor. (Right) Same programs as above using letter-sized programs and visuals displayed using a mini-projector.](assets/configs-card.png)
  <figcaption>Flexible configurations! A. Second monitor and B. Projector configurations. Primary display at (a) and (f). Webcam positioned at (b) and (e). Second monitor at (c). Projector mounted at (d). A projection surface (a curtain in this case) at (g).</figcaption>
</figure>

You’ll interact with Paper Playground through three main interfaces:

1. ***Camera***: Detects your paper programs using an attached camera device.
2. ***Interactive Display***: Shows the results of your programs, which can be interacted with virtually or projected.
3. ***Creator***: A low-code interface where you design your programs, step by step.

---

### Setup and Interface Tutorial

[Get Started](./setup/install.md){ .md-button .md-button--primary }
---

<figure markdown>
  ![Paper Playground setup detecting paper programs that create a submarine and control vertical position](assets/lunar-lander-craft.gif)
  <figcaption>Papercraft submarine controlling a virtual submarine!</figcaption>
</figure>

## License

This software is covered under the [MIT License](https://github.com/phetsims/paper-land/blob/main/LICENSE).

!!! note
    This project retains the features of [Paper Programs](https://paperprograms.org). Refer to [Paper Programs documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/) regarding legacy features (*including writing code for output to Projector.html*).
