# Paper Playground 

<!-- https://squidfunk.github.io/mkdocs-material/reference/admonitions/#supported-types -->
!!! warning "Under Construction" 
      
    We are working on updating our documentation - more details coming soon!

## Interactive Play Meets Multimodal Web Development

Paper Playground is an open-source tool for collaboratively designing multimodal web interactions by mapping JavaScript code to real pieces of paper and manipulating the code in your **physical space**. It is based on the [Paper Programs](https://paperprograms.org) open-source project and has been extended to incorporate the library stack used by [PhET Interactive Simulations](https://www.github.com/phetsims/). The tool focuses on enabling quick prototyping of web projects using JavaScript, with a particular emphasis on easy addition of audio features (like sounds and sonifications), speech description (both TTS engines and screen reader descriptions), and other non-visual features that are often difficult to design and develop alongside visual elements in these projects.

The primary purpose of Paper Playground is to enable expert developers and designers to rapidly iterate on stakeholder's ideas, especially when co-designing with non-technical stakeholders who have valuable feedback but no expertise to implement their ideas, all while engaging in your physical space in real-time. By using Paper Playground, developers and designers can create inclusive and joyful web experiences by seamlessly weaving visuals, sounds, spoken descriptions, and other inputs and displays.

<figure markdown>
  ![Paper Playground setup detecting paper programs that create a moon lander and control vertical thrust](assets/full-interface.png){ width=900 }
  <figcaption></figcaption>
</figure>

## What can you do with it?

<figure markdown>
  ![Paper Playground setup detecting paper programs that create a moon lander and control vertical thrust](assets/paper-features.png){ width=600 }
  <figcaption></figcaption>
</figure>

You'll create JavaScript programs to populate a page (Board) with interactive, multimodal components to envision anything you want!

Want to create a simple game? Maybe an interactive art experience? Or maybe you want to prototype auditory displays (speech and sounds) for a project or idea that you have? It's all possible with Paper Playground.

Every program you write is associated with a sequence of colored (black, red, green, and blue) dots that you will put (or print) on the corners of a piece of paper. We'll refer to the linked papers and code as paper programs from here on out!

!!! note
    This repository is dedicated to retaining the features of [Paper Programs](https://paperprograms.org). Refer to [Paper Programs documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/) regarding legacy features (*including writing code for output to Projector*).

### What do I do now? How do I create programs, detect programs, set up my camera and space, and make things happen?

See Setup section for installation and device setup instruction. See Documentation section for information on creating and using paper programs.

| Setup      | Documentation |
| ----------- | ----------- |
| [Installation](./setup/install.md)          | [Tutorial](./use/tutorial.md)                      |
| [Device Setup](./setup/device-setup.md)     | [Board API Documentation](./use/board-api.md)      |
| [Device Recommendations](./setup/reqs.md)   | [Example Paper Programs](./use/example-program.md) |
| [Camera Setup Tips](./setup/camera-tips.md) | [Model-View-Controller Framework](./use/mvc.md)    |
|                                             | [Resources and Downloads](./use/resources.md)      |

## Join our Community! 

- Make a post in the [Discussions tab](https://github.com/phetsims/paper-land/discussions/)
- Join us on our [Matrix Space](https://matrix.to/#/#interactive-paper-programming:matrix.org)
- [Contribute to the project](https://phetsims.github.io/paper-land/CONTRIBUTING/) (code, ideas, documentation, paper program examples, anything!)
- Join our open design meetings (Tuesdays from 12:00-13:00 Eastern Time). Find the zoom link in our Matrix Design channel.
- Have a great idea for how you or your community might connect to Paper Playground? Reach out to brett dot fiedler at colorado dot edu to discuss opportunities!

## Coming soon

### Docs
:books:  Updated setup and tutorial!

:camera:  Pictures and demos of Paper Playground in action!

:construction:  A better Roadmap than this!

### Tool
:page_with_curl:  More examples in the hosted database highlighting the power of multimodal design!

:computer:  A GUI for creating basic Papers without deep JavaScript knowledge!

## License

This software is licensed under the MIT license. For more information, see the [LICENSE](https://github.com/phetsims/paper-land/blob/master/LICENSE) file.

<!-- Features
If Paper Playground has specific features that set it apart or provide unique functionality, you can include a section that highlights these features. For example, if it supports real-time collaboration or has a comprehensive library of pre-built components, you can describe those features in this section.

Demo or Screenshots
Including a section with a demo or screenshots can provide visual context and help users understand the capabilities of Paper Playground. You can showcase examples of paper prototypes created using the tool or provide screenshots of the user interface.

Roadmap
If you have a roadmap for the future development of Paper Playground, it can be useful to share it with users and contributors. This section can outline upcoming features, improvements, or bug fixes that you plan to work on.

Dependencies
If there are specific dependencies or external libraries that Paper Playground relies on, it can be helpful to list them in a dedicated section. Provide instructions on how to install or set up these dependencies if necessary.

API Documentation
If Paper Playground has an API that developers can utilize, you may consider providing API documentation. This can include details about available endpoints, request/response examples, and authentication mechanisms.

Troubleshooting or FAQs
Including a section with common troubleshooting tips or frequently asked questions can assist users in resolving common issues. Provide solutions to known problems or direct users to relevant resources such as forums or support channels. -->