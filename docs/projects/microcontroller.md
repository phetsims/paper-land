# Microcontroller Integration with Paper Playground over Bluetooth

## Paper meets circuits

You can now communicate with microcontrollers over bluetooth! This expands the already near infinite capabilities of Paper Playground to enhance the tangible possibilities.

You can create a hybrid tangible interface using paper-based events (paper movement, paper size, markers, paper overlap, etc) from Paper Playground, while triggering actuators connected to your microcontroller. Or, vice versa... take in sensor signals from your microcontroller, pipe a message to Paper Plaground, and trigger animations, sounds, speech, and anything else you can do on the web using Paper Playground!

We currently have the most support for the [BBC micro:bit](https://makecode.microbit.org/), but there are bluetooth service UUIDs available for more generic microcontrollers with bluetooth capabilities.

## Getting Started

To get started, create a `controller` component in *Creator* and select the "Bluetooth" tab. Select the bluetooth service you want to use, and then the characteristic of that service. For example, if you want to write a string to the micro:bit, select the UART service, and the RX characteristic (which is the "read" service on the micro:bit).

You will find demo projects using the micro:bit installed by default in Paper Playground in the *Creator* interface (or look in the directory `root/server/data/default-data`).

!!! warning
    You will need a good understanding of the code editor, specifications, and constraints of the microcontroller you are using! For example, when using micro:bit and MakeCode, you will find that you cannot sent rapid messages over UART if you are asking the micro:bit to change its LED Matrix every time new data is received.

## Walkthroughs

1. For a complete walkthrough using the micro:bit microcontroller, see the published [Instructable](<https://www.instructables.com/Microbit-and-Paper-Playground-Integration-for-Enha/>) or [Hackster.io project](https://www.hackster.io/brfi7385/micro-bit-and-paper-playground-tangible-virtual-interfaces-184685).

2. This [Instructable](https://www.instructables.com/Random-Servo-Position-With-Microbit-and-Paper-Play/) will show you how to create a random spinner dial using a 180-servo, micro:bit, and a Paper Playground program. Paper Playground is an open-source system that enables you to design tangible, multimodal experiences using your computer's web browser, a webcam, and printed pieces of paper. [This particular example does not require a webcam and printer].

## Implementation Notes and Tips

- If you're using a BBC micro:bit, then make sure to look at its [Bluetooth Specifications](https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html) to understand the structure of the data you are trying to send from or to Paper Playground.