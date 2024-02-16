
# Installation

!!! warning "Under Construction" 
      
      We are working on updating our documentation - more details coming soon!

The Paper Playground client runs locally and can utilize a remote, hosted database for collaboration over sets of paper programs. You may also use a local PostgreSQL database. To run the client, you need a command-line interface and a few other software components:

1. Install [Node.js/npm](https://nodejs.org/en/), [Git](https://git-scm.com/), and a command-line interface (e.g., Bash, Terminal, Command Prompt, etc.).
   > :red_circle: **Note:** Some users have reported issues installing newer versions of Node.js/npm on older macOS versions. Verify the last supported Node.js/npm version for your operating system.
2. Clone the repository using the following command: `git clone https://github.com/phetsims/paper-land.git`
3. Install the dependencies: `npm install`
4. Set up the database (see instructions below for Remote or Local database).
5. Start the tool: `npm start`
6. Open [localhost:3000](http://localhost:3000/) in your browser and follow the links on the landing page.


You should be good to go! Move on to [setting up your devices](../setup/device-setup.md) or straight to the [interface overview](../setup/interface-overview.md).

### Recommended Start Up

Currently, Paper Playground must be run from the command line. If you're following the development of Paper Playground, it is recommended to regularly execute the following commands:

1. `git pull`
2. `npm install`
3. `npm start`

### Remote Database

If you are using a remote program database: 

1. create a `.env` file in the root of paper-land and 
2. Write a key:value pair on a new line to provide Paper Playground with a remote database address under `DATABASE_URL`.
  - Example: `DATABASE_URL=postgres://someDatabaseAddressFromSomeHostingService`

!!! note

      Are you working with us? Send an email to `brett dot fiedler at colorado dot edu` to request access to our database of programs!

### Local Database

If you do not have access to a remote database, you'll need to host a local database on your computer.

- You will need to install [PostgreSQL](https://www.postgresql.org/download/).

!!! warning
      The following instructions have not been verified in the latest version of Paper Playground, but may prove informative for troubleshooting. Also see [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally)

#### Setting up PostgreSQL database permissions:
- Edit pg_hba.conf file (found in PostgreSQL installation directory) by changing auth method “scram-sha-256” for local to “trust”  
    - :red_circle: you can be risky and set everything to “trust” if you’re having trouble, just make sure to change that if you ever do anything else with SQL).
    - Example paths: 
        - (WINDOWS) C:\Program Files\PostgreSQL\15\data\pg_hba.conf 
        - (MacOS) Library\PostgreSQL\15\data\pg_hba.conf
- In terminal (make sure PSQL is in your PATH for Windows):
  - Add a new user that matches your OS username. Be careful to match the case of the OS user and include semicolon. Following commands:
      - `psql -U postgres`
      - `create role "Username";` // replace Username with name matching your OS username (include quotes though)
      - `alter role "Username" superuser createrole createdb login;`
      - `\du` to see the role
      - `exit` to leave the psql in the terminal

#### Initial Run
- [FIRST TIME - INITIAL SETUP ONLY] Use following command to create the database the first time in terminal
  - `npm run dev`

#### Example Programs
- Once you have set up a local database, you can find a copy of all paper programs, including functional examples like **altitude-demo**, **lunar-lander**, **density-demo**, **simple-demos**, and more, in the maintainer's remote database located at `root/paper-programs-backup`. Please note that some spaces contain individual test programs or works-in-progress and may not have functional paper programs.

