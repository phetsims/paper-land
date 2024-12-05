
# Paper Playground Installation Guide

<figure markdown>
  ![Configuration Possibilities](../assets/card-full-interface.PNG)
</figure>

This guide will walk you through setting up Paper Playground, including hardware recommendations, installation, and troubleshooting. Follow each section to ensure proper configuration.

---

## Required Hardware for Paper Detection and Control

1. **Desktop or Laptop Computer**
    - Performance will increase with better computer specifications (CPU, GPU, RAM, etc.).
    - All major operating systems and browsers should also work, though most testing has been done with Windows/MacOS and Chrome/Firefox.
2. **Secondary display** (e.g., monitor, projector, TV, etc.)
3. **Webcam**
    - 720p is adequate, but be cautious with cameras having low-quality sensors, as they might not perform well under all lighting conditions.
    - 1080p cameras are ideal for use when the camera cannot be close to the play area or paper dots are very small.
4. **Paper** & ==**A Way to Make Program Dots**==
    - You can print the programs on colored paper or use colored markers to draw them.
    - Alternatively, a black and white printer with coloring markers will do. Check [Resources](../use/resources.md) for templates.
    - A simple piece of paper and a steady hand can also be effective!
    - Try colored stickers too!

## (Optional) Required Hardware for Projector Use

- **Projector** & **Projector Suspension Mount**
      - Ideally, at least 2000 lumens. A 1000 lumens projector might suffice in certain conditions, but the dim light required for projections might be too dark for your camera to detect programs.
      - If your projector is large, ensure the projector is secured to a load-bearing structure like a beam or stud. Command Strips or screws in drywall may not suffice. Note: You can project onto a wall and tape your programs there for a vertical setup. It is also possible to use a mirror at 45 degrees near the projector output to redirect the image!
- {++_Note 1_++}: Depending on your setup, you might need extension cables for your video (VGA, HDMI, DisplayPort, etc) and USB cables to connect the camera and projector to the computer.
- {++_Note 2_++}: A solid black rug or mat for projection. Note: a projector's brightness is limited by its bulb, and its darkness is determined by the surface it projects onto.

<figure markdown>
  ![Configuration Possibilities](../assets/configs-card.png)
  <figcaption>A. Second monitor and B. Projector configurations. Primary display at (a) and (f). Webcam positioned at (b) and (e). Second monitor at (c). Projector mounted at (d). A projection surface (a curtain in this case) at (g).</figcaption>
</figure>

---

## Package Installation Intructions (Preferred)

{==

Coming soon!

==}

<!-- 1. **Install Node.js Dependency**: Paper Playground requires Node.js to run. You can download the latest version of Node.js from the [official website](https://nodejs.org/en/). 
2. **Download the Package**: Download the latest Paper Playground package from the [Releases page](https://github.com/phetsims/paper-land/releases) on GitHub. Choose the package that matches your operating system (Windows, MacOS, Linux).
3. **Extract the Package**: Extract the contents of the package to a directory of your choice.
4. **Change Configuration (optional)**: Check the `config.json` file in the root directory of the project. 
   1. By default, the server will run on port 3000. If you need to change the port, change the key:value pair in `config.json`. 
   2. You can also add an [OpenAI API key](https://platform.openai.com/docs/quickstart) to the `config.json` file if you want to use the AI Code Assistant in *Creator*. 
   3. You may also add a remote database URL to the config.json file if you want to create a remotely collaborative program space. See instructions below for [Remote or Local database](#optional-installing-database-for-collaborative-editing). -->
<!-- 5. **Run the Setup Executable**: Run the setup executable to install and start the program. -->
<!-- 6. **Access Paper Playground**:
    - Open [http://localhost:3000](http://localhost:3000/) in a web browser to access the main interface.
    - To access the camera page, go to [http://localhost:3000/camera](http://localhost:3000/camera.html) and ensure it’s working as expected. -->

## Command Line Installation Instructions (Advanced)

1. **Check & Install Dependencies**: Ensure you have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) (includes npm) installed by running the following commands in your preferred command line interface (e.g., Terminal, Command Prompt, etc.):

    ```bash
    git -v  # Verify Git installation
    node -v # Recommended LTS version of Node.js
    npm -v  # Verify npm installation
    ```

2. **Install Paper Playground**: Run these commands to clone the repository and install dependencies:

    ```bash
    cd ~ # Navigate to your preferred directory
    git clone https://github.com/phetsims/paper-land.git # Clone the repository
    cd paper-land # Navigate to the project directory
    npm install # Install dependencies
    ```

3. **Change Configuration (optional)**: Check the `config.json` file in the root directory of the project.
   1. By default, the server will run on port 3000. If you need to change the port, change the key:value pair in `config.json`.
   2. You can also add an [OpenAI API key](https://platform.openai.com/docs/quickstart) to the `config.json` file if you want to use the AI Code Assistant in _Creator_.
   3. You may also add a remote database URL to the config.json file if you want to create a remotely collaborative program space. See instructions below for [Remote or Local database](#optional-installing-database-for-collaborative-editing).

4. **Start Paper Playground**: Run the following command to start the program:

    ```bash
    npm start # Start the program
    ```

5. **Access Paper Playground**:
    - Open [http://localhost:3000](http://localhost:3000/) in a web browser to access the main interface.
    - To access the camera page, go to [http://localhost:3000/camera](http://localhost:3000/camera.html) and ensure it’s working as expected.

![Localhost Setup](https://github.com/user-attachments/assets/d17bf002-81dd-43a3-9a07-3ab1f2b6a0ac)

You should be good to go! Move on to [setting up your devices](../setup/device-setup.md) or straight to the [interface overview](../setup/interface-overview.md) to get started creating and testing your paper programs!

Paper Playground comes with a host of `spaces` and `projects` that will be installed by default in your local storage found in `root/server/default-data`. Check them out!

The programs you create are stored in `root/server/data`.

---

## Updating Paper Playground

### Package Update Instructions

{==

Coming soon!

==}

<!-- 1. Back up your programs by copying the `root/server/data` directory to a safe location.
2. Delete the `paper-land` directory from your computer.
3. See the [GitHub Releases page](https://github.com/phetsims/paper-land/releases) for the latest version of Paper Playground. You can download the latest package and follow the installation instructions above to update your version of Paper Playground.
4. Replace the `root/server/data` directory with your backed-up programs. -->

### CLI Update Instructions

If you'd like the latest changes to the Paper Playground, you can update the project by running the following commands:
    ```bash
    git pull # Pull the latest changes
    npm install # Install any new dependencies
    npm start # Start the program
    ```

## (OPTIONAL) Installing Database for Collaborative Editing

### Remote Database

If you are using a remote program database, which you can find online by searching "PostgreSQL database hosting" (paid), or by setting up your own (advanced):

1. Open the `config.json` file in the root directory of the project.
2. Write a key:value pair on a new line to provide Paper Playground with a remote database address under `DATABASE_URL`.

- Example: `DATABASE_URL=postgres://someDatabaseAddressFromSomeHostingService`

!!! note

      Are you working with us? Send an email to `brett dot fiedler at colorado dot edu` to request access to our database of programs!

### Local Database

If you do not have access to a remote database, you can host a local database on your computer using PostgreSQL.

- You will need to install [PostgreSQL](https://www.postgresql.org/download/).

!!! warning
      The following instructions have not been verified in the latest version of Paper Playground, but may prove informative for troubleshooting. Also see [Paper Programs tutorial documentation](https://github.com/janpaul123/paperprograms/blob/master/docs/tutorial.md#optional-setting-up-the-server-locally)

1. Open the `config.json` file in the root directory of the project.
2. Replace the `STORAGE_TYPE=local` key:value pair with: `STORAGE_TYPE=postgresql`

#### Setting up PostgreSQL database permissions

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

Run the following command to set up the database:
        ```bash
        npm run dev
        ```

{==
You only need to run this command the first time you set up your database.
==}

---

## Developer Details for Paper Playground Contribution

The Paper Playground client runs locally. For program storage, Paper Playground uses your device's local storage by default. If you would like to support multiple users editing or accessing paper programs, you can configure a remote, hosted database OR a local PostgreSQL database.

### Additional recommended start up commands if following development

Install Paper Playground according to the [CLI Installation Instructions](#command-line-installation-instructions-advanced).

If you're following the development of Paper Playground, it is recommended to regularly execute the following commands:
    ```bash
    git pull
    npm install
    npm start
    ```

### Packaging Paper Playground

To package the project so that it is sharable, we have custom build scripts that include necessary files and make it easy to install dependencies.
While a standalone executable may be possible in the future, it is not currently available. For additional details and history on the packaging process, see <https://github.com/phetsims/paper-land/issues/259>.

We require that you have Node.js installed on your system to run these scripts. Once you have Node.js you can run paper-playground by clicking on the setup executables.

#### Building your own package

{==
These steps need to be followed for Windows and MacOS separately on a device with the OS of choice. The resulting build scripts are platform-specific and will not work across platforms. Likewise, you cannot create a MacOS build on a Windows machine or vice versa.
==}

If you are interested in packaging the project yourself, you can use the following steps:

1. Install pkg globally: `npm install -g pkg`. pkg is used to package setup scripts into an executable.
2. Run `npm run build` to build the project. This will create a `build` directory in the root of the project.
3. Within the build directory are platform specific executables that a user can run to install node modules and run the project.
4. It also includes a `config.json` file where you can configure variables for the project ([see installation instructions above](#package-installation-intructions-preferred).)

    - Note that there are other build scripts to build individual parts of the project (front end, server, etc.). See `package.json` for more details.
    - Note that this process requires the user to have Node.js installed on their system. A fully standalone build is not supported at this time.
