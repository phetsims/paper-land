# Paper Playground - Interactive Paper Programming 

> :warning: **This documentation is currently under construction - More details coming soon!** :warning:

## Interactive Play Meets Multimodal Web Design

Paper Playground is an open-source tool for collaboratively designing multimodal web interactions by mapping JavaScript code to real pieces of paper and manipulating them in your physical space. It extends the [Paper Programs](https://paperprograms.org) open-source project and has been extended to incorporate the API used by [PhET Interactive Simulations](https://www.github.com/phetsims/). The tool focuses on enabling quick prototyping of web projects using JavaScript, with a particular emphasis on easy addition of audio features (like sounds and sonifications), speech description (both TTS engines and screen reader descriptions), and other non-visual features that are often difficult to design and develop alongside visual elements in these projects.

The primary purpose of Paper Playground is to enable expert developers and designers to rapidly iterate on stakeholder's ideas, especially when co-designing with non-technical stakeholders who have valuable feedback but no expertise to implement their ideas in real-time. By using Paper Playground, developers and designers can create inclusive and joyful web experiences by seamlessly weaving visuals, sounds, spoken descriptions, and other inputs and displays.

## What can you do with it?
- Create {virtual experiences} that are responsive to the changes you make to real sheets of paper!
- Create brand new interactive experiences that map real life movements to virtual displays and controls.
- Take an existing idea and rapidly prototype enhancements by layering dynamic multimodal output inside of Paper Playground
- Harness the features of the [PhET Library Stack](https://www.github.com/phetsims/community) including accessible interface components and streamlined multimodal integration.

Your goal is your own - Paper Playground extends paperprograms.org, which enables you to 
write JavaScript code for any number of Programs that is linked to a physical piece of paper through detectable color dot sequences

An API supports data and event sharing across papers and makes spatial information about each physical paper (position, size, overlap, and more) available to use in your code 

Interactively play with your programs in real physical spaces, harnessing the spatial mapping between papers and code to change how your programs behave.

Paper Playground scaffolds the addition and mapping of browser-friendly multimodal inputs and outputs (think sounds, text-to-speech, vibration, connection to other devices, and potentially more!) to the code you create.

1. Design your interactive experience (game, simulation, virtual art piece, etc.)
2. Create the data objects for your design (what parts of it change when someone interacts with it?)
3. Share that data between different paper programs and set up events that trigger changes in your code when you make changes to the real papers in front of you.
4. Easily add additional programs to control the data objects or multimodal display for your data objects (sounds, sonifications, music, speech) that is as dynamic as the code you create!

For complete information on how to set up Paper Playground and begin creating and prototyping multimodal, interactive web experiences, please refer to the [Paper Playground Docs](https://phetsims.github.io/paper-land/).

This repository is dedicated to retaining the features of [Paper Programs](https://paperprograms.org). For the most accurate documentation regarding legacy features, refer to the [wonderful Paper Programs documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/).

## Installation

The Paper Playground client runs locally, but can utilize a remote database for collaboration over sets of paper programs. You may also use a local PostgreSQL database. To run the client, you need a command-line interface and a few other software components:

1. Install [Node.js/npm](https://nodejs.org/en/), [Git](https://git-scm.com/), and a command-line interface (e.g., Bash, Terminal, Command Prompt, etc.).
   > :red_circle: **Note:** Some users have reported issues installing newer versions of Node.js/npm on older macOS versions. Verify the last supported Node.js/npm version for your operating system.
2. Clone the repository using the following command: `git clone https://github.com/phetsims/paper-land.git`
3. Install the dependencies: `npm install`
4. Set up the database (see instructions below for Remote or Local database).
5. Start the tool: `npm start`
6. Open [localhost:3000](http://localhost:3000/) in your browser and follow the links on the landing page.

### Remote Database

- If you are using a remote program database, create a `.env` file in the root of paper-land and provide the database address under `DATABASE_URL`.
  - Example: `DATABASE_URL=postgres://someDatabaseAddressFromSomeHostingService`
- Are you working with us? Send an email to `brett dot fiedler at colorado dot edu` to request access to our database of programs!

### Local Database

- You need to install [PostgreSQL](https://www.postgresql.org/download/) and set up a local database.
- Refer to the [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally) for detailed instructions and commands.
- Once you have set up a local database, you can find a copy of all paper programs, including functional examples like **altitude-demo**, **lunar-lander**, **density-demo**, **simple-demos**, and more, in the maintainer's remote database located at `root/paper-programs-backup`. Please note that some spaces contain individual test programs or works-in-progress and may not have functional paper programs.

### Recommended Start Up

Currently, Paper Playground must be run from the command line. If you're following the development of Paper Playground, it is recommended to regularly execute the following commands:

1. `git pull`
2. `npm update`
3. `npm start`

### What do I do now? How do I create programs, detect programs, set up my camera and space, and make things happen?

For detailed answers to these questions and more helpful information on creating papers and delightful multimodal web experiences, please refer to our [Paper Playground Docs](https://phetsims.github.io/paper-land).

## Join our Community! 

- Make a post in the [Discussions tab](https://github.com/phetsims/paper-land/discussions/)
<!-- - Join us on our [Matrix Space](https://matrix.to/#/#interactive-paper-programming:matrix.org) -->
- [Contribute to the project](https://phetsims.github.io/paper-land/CONTRIBUTING/) (code, ideas, documentation, paper program examples, anything!)
<!-- - Join our open design meetings (Tuesdays from 12:00-13:00 Eastern Time). Find the zoom link in our Matrix Design channel. -->
- Have a great idea for how you or your community might connect to Paper Playground? Reach out to brett dot fiedler at colorado dot edu to discuss opportunities!

## Coming soon

### Docs
:books: Updated setup and tutorial!

:camera: Pictures and demos of Paper Playground in action!

:construction: A better Roadmap than this!

### Tool
:page_with_curl: More examples in the hosted database highlighting the power of multimodal design!

:computer: An interface for creating basic Papers without deep JavaScript knowledge!

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