
# Installation
![](https://phetsims.github.io/paper-land/assets/configs-efh-horizontal.png)
# Hardware Checklist

### minimum
- [ ] Second monitor/TV
- [ ] Web Cam 720p (minimum)
- [ ] Color Printer
### Full
- [ ] Projector ( 2000 lumens min)
## For more information see: [Hardware Recommendations](https://phetsims.github.io/paper-land/setup/reqs/#required-hardware-for-paper-detection-and-control)

# Quick Setup
```bash
git -v 
node -v # make sure you have node installed (we recomend LTS versions)
npm -v # if not installed see instructions bellow
cd ~
git clone https://github.com/phetsims/paper-land.git
cd paper-land
npm install
npm start
```
### Open a webbrowser and type [localhost:3000](http://localhost:3000/) 

![{30569D99-85BD-4CC2-BB39-F8BF4508CF9F}](https://github.com/user-attachments/assets/d17bf002-81dd-43a3-9a07-3ab1f2b6a0ac)
### Open Camera [localhost:3000/camera](http://localhost:3000/camera.html)
![image](https://github.com/user-attachments/assets/df1e3a28-0d62-4e42-8b65-8ff671fdd3b3)

# Camera not popuping up?
###  This means your browser doesnt have access to the camera
 ![{1B3505BE-7B4C-4711-ACB4-970C5F810E25}](https://github.com/user-attachments/assets/5612ea76-2cb7-47c4-9ad6-662ee8540886)
# Fix: give the browser access to the camera  
```bash
chrome://settings/content/siteDetails?site=http%3A%2F%2Flocalhost%3A3000
```
![image](https://github.com/user-attachments/assets/e9179068-12a0-408f-8a54-78949421c039)
# Then reload the page and select the camera from the drop down
![{A23FD141-B8F8-42A6-979B-E9D49366B6A4}](https://github.com/user-attachments/assets/adfbb5ed-6665-4728-9adf-50d2db4cd1cb)
# Camera works successfully
![image](https://github.com/user-attachments/assets/7ad333c3-5b04-4bf6-8808-4bd405d8390a)

# adjust the viewport size to match your playspace
Drag from the corners the red circles to fit your projector's actual area
![{9011A406-C480-4D5A-802D-0AECD23D0BBA}](https://github.com/user-attachments/assets/1dc0ace0-6aee-40f2-b505-d035f03c270c)
## Heres a bad example
![{A5FA11DC-3C01-4D58-ACD9-38709669E7E6}](https://github.com/user-attachments/assets/c39f49ca-6b19-47fa-af37-da54b0f0fd25)


# To run a Example Program open [localhost:3000/creator](http://localhost:3000/creator.html)
![{6F01414A-9BCD-4382-8E49-74FFEE567245}](https://github.com/user-attachments/assets/1359cc5b-9b78-4d7e-adf1-399a3cb68d0f)

![{8D194EE5-5854-44AC-811B-FF9D84D8C469}](https://github.com/user-attachments/assets/d494171f-a883-4155-9b8c-3c1c299059b3)
 # We recommend starting with "cat-fetch"
 ![image](https://github.com/user-attachments/assets/aff92520-0ee1-4954-a152-5849ab434f3a)
 # To run, 'send to playground'
 ![image](https://github.com/user-attachments/assets/fd83746b-8263-4a27-86d7-390645cb58ce)
# open camera window [localhost:3000](http://localhost:3000/camera.html)
![{953E18D4-2620-4785-8B23-531A1FB32CDD}](https://github.com/user-attachments/assets/2e9766ca-e04e-4d89-ad6a-7d610a92c2fd)

# Enable: "Cat", "Ball", "Items"  with the icon
![image](https://github.com/user-attachments/assets/08aafe9b-2382-4cc5-8d7c-17299f1976d9)

# Click print on the 3 programs
![image](https://github.com/user-attachments/assets/8b2e2551-ce1f-46cb-a10e-6bd1c93466d2)


# Finally open a new tab and drag to you second screen
[http://localhost:3000/display.html](http://localhost:3000/display.html)
# You should be good to go!
![image](https://github.com/user-attachments/assets/f1b6023f-cbd7-4a69-949d-2cd654ab2588)

# Next Steps
# [Device Setup - Paper Playground](https://phetsims.github.io/paper-land/setup/device-setup/) if you run into hardware setup issues
# [Interface Overview - Paper Playground](https://phetsims.github.io/paper-land/setup/interface-overview/#what-is-the-camera-page)
# code to your paper programs [Creator Tutorial - Paper Playground](https://phetsims.github.io/paper-land/setup/creator/#what-is-mvc)

# Developer Details
The Paper Playground client runs locally. For program storage, Paper Playground uses your device's local storage by default. If you would like to support multiple users editing or accessing paper programs, you can configure a remote, hosted database OR a local PostgreSQL database. 

To run the client, you need a command-line interface and a few other software components.
## Install the Client
1. Install [Node.js/npm](https://nodejs.org/en/), [Git](https://git-scm.com/), and a command-line interface, CLI (e.g., Bash, Terminal, Command Prompt, etc.).
   > :red_circle: **Note:** Some users have reported issues installing newer versions of Node.js/npm on older macOS versions. Verify the last supported Node.js/npm version for your operating system.
2. In your CLI, navigate to the directory your wish to install Paper Playground: e.g., `cd {insert directory}` 
3. Clone the repository using the following command: 
`git clone https://github.com/phetsims/paper-land.git`
4. Install the dependencies:
 `npm install`
5. (OPTIONAL) Set up the database (see instructions below for Remote or Local database).
6. Start the tool: 
`npm start`
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

#### Packaging the project

To package the project so that it is sharable, we have custom build scripts that include necessary files and make it easy to install dependencies.
While a standalone executable may be possible in the future, it is not currently available. For additional details and history on the packaging process, see #259

- We require that you have Node.js installed on your system to run these scripts.
- Once you have Node.js you can run paper-playground by clicking on the setup executables.

##### Building your own package
- If you are interested in packaging the project yourself, you can use the following steps:
1) Install pkg globally: `npm install -g pkg`. pkg is used to package setup scripts into an executable.
2) Run `npm run build` to build the project. This will create a `build` directory in the root of the project.
3) Within the build directory are platform specific executables that a user can run to install node modules and run the project.
4) It also includes a .env file where you can configure variables for the project.

- Note that there are other build scripts to build individual parts of the project (front end, server, etc.). See package.json for more details.
- Note that this process requires the user to have Node.js installed on their system. A fully standalone build is not supported at this time.
