# watson-visual-recognition-cli

## Prerequisites:

1. [Node.js](https://nodejs.org/en/download/) - Download and install Node.js 4.0 or later from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

## Installation:

Option 1: To install the CLI from npm, open a terminal window and run:

```
npm install -g watson-custom-classifier-tools
```


Option 2: To install the CLI from local source code, open a terminal window and cd into the source code directory that contains `package.json` and `index.js`.  Then run:

```
npm -g install .
```

*Note: You may need to run this with elevated priveleges using `sudo`.

### Test Installation

Run the command `wvrcc` in the terminal, you should see something like this:

```
$ wvrcc
Watson Visual Recognition - Custom Classifier Tools

  Usage:  [options] [command]


  Commands:

    list [options]             List all custom classifiers
    detail [options] [id]      Fetch custom classifier verbose details
    classify [options] [image]  Classify an image
    create [options]           Create a new custom classifier
    delete [options] [id]      Delete a custom classifier
    set-key [key]              Save your Watson Visual Recognition key in CLI preferences
    unset-key                  Remove your Watson Visual Recognition key in CLI preferences
    *

  Options:

    -h, --help  output usage information

```
-----------------

## Local Changes to the CLI

If you would like to make changes in the local source code folder, you need to link back to the local source folder.   You can link the executable to local source code by cd'ing into the local source code folder and running:

```
npm link
```
-----------------

## Uninstall

If installed was installed via npm, use this command at the terminal:

```
npm install watson-custom-classifier-tools
```

If CLI was installed from local source, cd into the local source directory, and run:

```
npm uninstall .
```

