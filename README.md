# Paper Playground Docs branch

This is a branch of Paper Playground dedicated to the MkDocs documentation website.

## MkDocs

Our documentation uses Mkdocs and is statically deployed with a pre-configured plugin (mkdocs-gh-deploy) for Mkdocs to GitHub Pages.

The built website is created on the `gh-pages` branch.

mkdocs.yml is a required file and sets up the navigation tree and theme for the website.

## MkDocs Theme
This build makes heavy use of the MkDocs theme, [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/setup/). Use the Setup and Reference pages to add customized content.

## How to Make Changes

**Commiting to the docs branch will kick off GitHub Pages to run a deploy Action, automatically build, and push to the gh-pages branch. (see [workflow](./.github/workflows/page-deploy.yml))**

### GitHub Website

Make changes directly through GitHub with direct edits or pull requests.

(See [Contributing Guidelines](./docs/CONTRIBUTING.md))

### Local Machine
To edit (and optionally deploy) to the documentation website from a local machine (same steps GitHub Actions does):
- Install Python (3.11 last supported at deploy)
- Install module requirements using `pip install`. Install using the requirements.txt file in this directory.
  - Bare minimum as of 2/21/2024:
    - `pip install mkdocs-material=="9.5" mkdocs-minify-extension`
- run `mkdocs serve` to locally host the directory and preview changes in real-time in your browser.
- Commit and push changes to `docs` branch
  - `git add .`
  - `git commit -m "your commit message"`
  - `git push origin docs`
- If deploying from your local machine: run `mkdocs gh-deploy` and it will automatically build and push to the gh-pages branch and kick off GitHub Pages to run a deploy Action.



