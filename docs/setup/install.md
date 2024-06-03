
# Installation

The Paper Playground client runs locally. For program storage, Paper Playground uses your device's local storage by default. If you would like to support multiple users editing or accessing paper programs, you can configure a remote, hosted database OR a local PostgreSQL database. 

To run the client, you need a command-line interface and a few other software components.

## Install the Client
1. Install [Node.js/npm](https://nodejs.org/en/), [Git](https://git-scm.com/), and a command-line interface, CLI (e.g., Bash, Terminal, Command Prompt, etc.).
   > :red_circle: **Note:** Some users have reported issues installing newer versions of Node.js/npm on older macOS versions. Verify the last supported Node.js/npm version for your operating system.
2. In your CLI, navigate to the directory your wish to install Paper Playground: e.g., `cd {insert directory}` 
3. Clone the repository using the following command: `git clone https://github.com/phetsims/paper-land.git`
4. Install the dependencies: `npm install`
5. (OPTIONAL) Set up the database (see instructions below for Remote or Local database).
6. Start the tool: `npm start`
7. Open [localhost:3000](http://localhost:3000/) in your browser and follow the links on the landing page.

## Start up Paper Playground

You should be good to go! Move on to [setting up your devices](../setup/device-setup.md) or straight to the [interface overview](../setup/interface-overview.md) to get started creating and testing your paper programs!

Paper Playground comes with a host of `spaces` and `projects` that will be installed by default in your local storage found in `root/server/default-data`. Check them out!

The programs you create are stored in `root/server/data`.

### Recommended start up if following development

Currently, Paper Playground must be run from the command line. If you're following the development of Paper Playground, it is recommended to regularly execute the following commands:

1. `git pull`
2. `npm install`
3. `npm start`

## (OPTIONAL) Installing Database for Collaborative Editing

1. create a `.env` file (no prefix, usually creates a hidden file in your OS) in the root of paper-land and 
2. Write a key:value pair on a new line to provide Paper Playground with: `STORAGE_TYPE=postgresql`


### Remote Database

If you are using a remote program database, which you can find online by searching "PostgreSQL database hosting" (paid), or by setting up your own (advanced): 

1. create a `.env` file in the root of paper-land and 
2. Write a key:value pair on a new line to provide Paper Playground with a remote database address under `DATABASE_URL`.
  - Example: `DATABASE_URL=postgres://someDatabaseAddressFromSomeHostingService`

!!! note

      Are you working with us? Send an email to `brett dot fiedler at colorado dot edu` to request access to our database of programs!

### Local Database

If you do not have access to a remote database, you can host a local database on your computer using PostgreSQL.

- You will need to install [PostgreSQL](https://www.postgresql.org/download/).

!!! warning
      The following instructions have not been verified in the latest version of Paper Playground, but may prove informative for troubleshooting. Also see [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally)

#### Setting up PostgreSQL database permissions:
- Edit pg_hba.conf file (found in PostgreSQL installation directory) by changing auth method “scram-sha-256” for local to “trust”  
    - :red_circle: you can be risky and set everything to “trust” if you’re having trouble, just make sure to change that if you ever do anything else with SQL.
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