# Paper Playground - Augmented JavaScript Interaction Design 

``` 
! This documentation is currently under construction and is incomplete - More details coming soon !
```
## Description

Paper Playground is a tool for collaboratively designing multimodal web interactions by mapping JavaScript code to real pieces of paper and manipulating them in your physical space! It is based on the [Paper Programs](https://paperprograms.org) open source project. It has been extended to incorporate the API used by [PhET Interactive Simulations](https://www.github.com/phetsims/), which provides libraries to explore the rich, multimodal web interactions you can create when weaving visuals, sounds, spoken description and other inputs and displays. 

*Our goal is to make it easy and fun to create (and co-create) inclusive and joyful web experiences!*

## What can you do with it?

**We are in heavy development and documentation is currently lacking for the updates we have made to the tool.** 

We have made sure to retain the features from Paper Programs, so for the best documentation currently available, see the [wonderful Paper Programs documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/)

## Installation
1. Install [Node.js/npm](https://nodejs.org/en/) and [Git](https://git-scm.com/) and a command line interface (e.g., Bash, Terminal, Command Prompt, etc). *Note:* Some users have reported issues installing newer Node.js/npm versions on older MacOS versions. Verify the last supported Node.js/npm version for your OS.
1. Clone the repository: `git clone https://github.com/phetsims/paper-land.git`
2. Install dependencies: `npm install`
3. Set up database (see below for Remote or Local database)
4. Start the tool: `npm start`
5. Open [localhost:3000](http://localhost:3000/) in your browser and follow the links on the landing page.

### Remote Database
-  If you are using a remote program database, create a `.env` file in the root of paper-land and provide the address for the database under `DATABASE_URL`
   - e.g., `DATABASE_URL=postgres://someDatabaseAddressFromSomeHostingService`
 - Working with us? Send brett dot fiedler at colorado dot edu an e-mail for access to our database of programs!

### Local Database
-  You will need to install [PostgreSQL](https://www.postgresql.org/download/) and set up a local database. See the [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally)) for more details and commands

### Recommended Start Up
At this time, Paper Playground must be run from the command line. If you're following along with the development of Paper Playground, you should run the following regularly:
1. `git pull`
2. `npm update`
3. `npm start`

## Coming soon
- Description and project goals!
- Updated tutorial!
- CONTRIBUTING.md and how to help out!

## Want to chat?
- Make a post in the [Discussions tab](https://github.com/phetsims/paper-land/discussions/) of the paper-land repository!

## License
This software is licensed under the MIT license. See the [LICENSE here](https://github.com/phetsims/paper-land/blob/master/LICENSE).
