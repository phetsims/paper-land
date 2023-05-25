# Paper Playground - Augmented JavaScript Interaction Design 

:warning: This documentation is currently under construction - More details coming soon! :warning:

## Description

Paper Playground is a tool for collaboratively designing multimodal web interactions by mapping JavaScript code to real pieces of paper and manipulating them in your physical space! It is based on the [Paper Programs](https://paperprograms.org) open source project. It has been extended to incorporate the API used by [PhET Interactive Simulations](https://www.github.com/phetsims/), which provides libraries to explore the rich, multimodal web interactions you can create when weaving visuals, sounds, spoken description and other inputs and displays. 

*Our goal is to make it easy and fun to create (and co-create) inclusive and joyful web experiences!*

## What can you do with it?

:star: We are in heavy development and documentation is still being updated :star:

See [Paper Playground Docs](https://phetsims.github.io/paper-land/) for complete information on how to set up Paper Playground and begin creating and prototyping multimodal, interactive web experiences!

<!-- (also available in the [docs directory of paper-land](https://github.com/phetsims/paper-land/blob/master/docs/)). -->

This repository is dedicated to retaining the features of [Paper Programs](https://paperprograms.org). For the most accurate documentation for legacy features, see the [wonderful Paper Programs documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/)

## Installation

Paper Playground client is run locally, though it can use a remote database to collaborate over sets of paper programs. You may also use a local PostgreSQL database. At this time, running the client requires a command line interface and a few other pieces of software:

1. Install [Node.js/npm](https://nodejs.org/en/) and [Git](https://git-scm.com/) and a command line interface (e.g., Bash, Terminal, Command Prompt, etc). 
   :red_circle: *Note:* Some users have reported issues installing newer Node.js/npm versions on older MacOS versions. Verify the last supported Node.js/npm version for your OS.
2. Clone the repository: e.g., `git clone https://github.com/phetsims/paper-land.git`
3. Install dependencies: `npm install`
4. Set up database (see below for Remote or Local database)
5. Start the tool: `npm start`
6. Open [localhost:3000](http://localhost:3000/) in your browser and follow the links on the landing page.

### Remote Database

-  If you are using a remote program database, create a `.env` file in the root of paper-land and provide the address for the database under `DATABASE_URL`
   - e.g., `DATABASE_URL=postgres://someDatabaseAddressFromSomeHostingService`
 - Working with us? Send brett dot fiedler at colorado dot edu an e-mail for access to our database of programs!

### Local Database

-  You will need to install [PostgreSQL](https://www.postgresql.org/download/) and set up a local database. 
-  See the [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally) for more details and commands
-  When you have a local database set up, you can find a copy of all paper programs in the maintainer's remote database in root/paper-programs-backup, complete with several fully functional examples such as **altitude-demo**, **lunar-lander**, **density-demo**, **simple-demos**, and more! 
:warn: Some spaces represent individual's test programs or works-in-progress and may not have functional paper programs.

### Recommended Start Up
At this time, Paper Playground must be run from the command line. If you're following along with the development of Paper Playground, you should run the following regularly:

1. `git pull`
2. `npm update`
3. `npm start`

### How do I make Programs, detect Programs, set up my camera and space, and make things happen?

See our [documentation site](https://phetsims.github.io/paper-land) for more details on these questions and more helpful information on creating your papers and creating delightful multimodal web experiences!

## Coming soon
- Updated tutorial!

## Want to chat?
- Make a post in the [Discussions tab](https://github.com/phetsims/paper-land/discussions/) of the paper-land repository!

## License
This software is licensed under the MIT license. See the [LICENSE here](https://github.com/phetsims/paper-land/blob/master/LICENSE).