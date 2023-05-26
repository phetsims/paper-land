
# Installation

!!! warning "Under Construction" 
      
      We are working on updating our documentation - more details coming soon!

The Paper Playground client runs locally and can utilize a remote database for collaboration over sets of paper programs. You may also use a local PostgreSQL database. To run the client, you need a command-line interface and a few other software components:

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
- Refer to the [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms

/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally) for detailed instructions and commands.
- Once you have set up a local database, you can find a copy of all paper programs, including functional examples like **altitude-demo**, **lunar-lander**, **density-demo**, **simple-demos**, and more, in the maintainer's remote database located at `root/paper-programs-backup`. Please note that some spaces contain individual test programs or works-in-progress and may not have functional paper programs.

### Recommended Start Up

Currently, Paper Playground must be run from the command line. If you're following the development of Paper Playground, it is recommended to regularly execute the following commands:

1. `git pull`
2. `npm update`
3. `npm start`