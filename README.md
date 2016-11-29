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

## Usage

The CLI actions can be invoked as pure command line functions, with parameters passed as CLI arguments, or function as an interactive "waizard" that prompts for input.

### Set your Watson Visual Recognition key

You must have a valid Watson Visual Recognition key to use this tool.  If you do not have one, you can get a free trial here: https://www.ibm.com/watson/developercloud/visual-recognition.html

You can either pass the Watson Visual Recognition key as a CLI parameter, or save it in encrypted preferences so it does not need to be passed with every invocation.

> ##### Specify Watson Key as CLI parameter
> This will call the `list` command, using the Watson Visual Recognition key as a CLI argument:
> 
> ```
> wvrcc list --key YOUR_WATSON_KEY_HERE
> ```

> ##### Set Watson Key in encrypted preferences
> This will call the `list` command, using the Watson Visual Recognition key in preferences:
> 
> ```
> //first, set the key in preferences
> wvrcc set-key YOUR_WATSON_KEY_HERE
> 
> //next, call the list command (key is saved for all subsequent actions) 
> wvrcc list
> ```


### List existing custom classifiers

Invoke the `list` command:

```
wvrcc list
```

Or, with Watson key key argument:

```
wvrcc list --key YOUR_WATSON_KEY_HERE
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

