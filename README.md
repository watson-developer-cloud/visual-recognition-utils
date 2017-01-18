# watson-visual-recognition-utils

Command Line Interface for quickly and easily interacting with the Watson Visual Recognition service & custom classifiers.  

[![Build Status](https://travis-ci.org/IBM-Bluemix/visual-recognition-utils.svg?branch=master)](https://travis-ci.org/IBM-Bluemix/visual-recognition-utils)


## Prerequisites:

1. [Node.js](https://nodejs.org/en/download/) - Download and install Node.js from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

## Installation:

Make sure you read the documentation for [Visual Recognition](https://www.ibm.com/watson/developercloud/doc/visual-recognition/index.shtml) before using this library.

To install the CLI from npm, open a terminal window and run:

```
npm install -g watson-visual-recognition-utils
```


### Test Installation

Run either the command `watson-visual-recognition-utils` or `wvru` in the terminal (both are aliases to the same code), you should see something like this:

```
$ watson-visual-recognition-utils
Watson Visual Recognition - Custom Classifier Utilities

  Usage:  <command> [options]


  Commands:

    api-usage [options]             View IBM Watson Visual Recognition API Key usage and limits
    classifier-list [options]       List all custom classifiers
    classifier-detail [options]     Fetch custom classifier verbose details
    classifier-classify [options]   Classify an image
    classifier-create [options]     Create a new custom classifier
    classifier-delete [options]     Delete a custom classifier
    key-set <key>                   Save your Watson Visual Recognition key in CLI preferences
    key-unset                       Remove your Watson Visual Recognition key in CLI preferences
    *

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```


## Set your Watson Visual Recognition key

You must have a valid Watson Visual Recognition key to use this tool.  If you do not have one, you can get a free trial here: https://www.ibm.com/watson/developercloud/visual-recognition.html

You can either pass the Watson Visual Recognition key as a CLI parameter, or save it in encrypted preferences so it does not need to be passed with every invocation.

#### Specify Watson Key as CLI parameter
This will call the `list` command, using the Watson Visual Recognition key as a CLI argument:

```
watson-visual-recognition-utils classifier-list --key YOUR_WATSON_KEY_HERE
```

-OR-

#### Set Watson Key in encrypted preferences
This will call the `list` command, using the Watson Visual Recognition key in preferences:

```
//first, set the key in preferences
watson-visual-recognition-utils key-set YOUR_WATSON_KEY_HERE

//next, call the list command (key is saved for all subsequent actions) 
watson-visual-recognition-utils classifier-list
```


## View API Key daily usage and limit
Invoke the `api-usage` command:

```
watson-visual-recognition-utils api-usage
```

Or, with Watson key key argument:

```
watson-visual-recognition-utils api-usage --key YOUR_WATSON_KEY_HERE
```

Output will show status and daily usage information.  For example:

```
$ watson-visual-recognition-utils api-usage
Fetching API Key usage information...
<?xml version="1.0" encoding="UTF-8"?>
<results>
    <status>OK</status>
    <consumedDailyTransactions>1234</consumedDailyTransactions>
    <dailyTransactionLimit>25000</dailyTransactionLimit>
</results>
```


## List existing custom classifiers

Invoke the `classifier-list` command:

```
watson-visual-recognition-utils classifier-list
```


## Create a new classifier

Invoke the `classifier-create` command.  You can specify **multiple** postitive classes, and optionally a negative collection of images, per service specs at: https://www.ibm.com/watson/developercloud/doc/visual-recognition/classifiers-tutorials.shtml

```
watson-visual-recognition-utils classifier-create
```


* You can specify multiple postive classes
  * requires pairs of `--positive-class` (string for class name) and `--positive-path` (path to zip file for positive images).  
  * pairs are processed in order specified
* You can optionally specify a negative zip file 
  * contains negative images for the classifier

One positive and one negative:
```
watson-visual-recognition-utils classifier-create --name classifier_name --positive-class rust --positive-path ./positive.zip --negative-path ./negative.zip
```

Multiple postive classes and a negative:
```
watson-visual-recognition-utils classifier-create --name train_parts --positive-class wheels --positive-path ./positive-wheels.zip --positive-class rails --positive-path ./positive-rails.zip --positive-class springs --positive-path ./positive-springs.zip --negative-path ./negative-other.zip
```


## Show details for an existing classifier

Invoke the `classifier-detail` command (You will be prompted for classifier id):

```
watson-visual-recognition-utils classifier-detail
```


## Delete a classifier

Invoke the `delete` command (You will be prompted for classifier id):

```
watson-visual-recognition-utils classifier-delete
```


## Classify (invoke a classifier)
Invoke the `classify` command:

```
watson-visual-recognition-utils classifier-classify
```

With CLI arguments:

* default classifier is system "default"
* can specify multiple classifiers as comma delimited list (no spaces)

```
watson-visual-recognition-utils classifier-classify --image ./path/to/image.jpg --classifier_ids default,rust,cracks  
```

Output from the classify service will be displayed as a JSON object.


## Local Development

###To install the CLI from local source code: 

* Clone this git repo to your local machine.
* Open a terminal window and cd into the source code directory that contains `package.json` and `index.js`  
* Then run:
  ```
  npm -g install .
  ```

> *Note: You may need to run this with elevated priveleges using `sudo`.*

### Local Changes to the CLI

If you would like to make changes in the local source code folder, you need to link back to the local source folder.   You can link the executable to local source code by cd'ing into the local source code folder and running: `npm link`


## License

This sample code is licensed under Apache 2.0.

## Contributing

See [CONTRIBUTING](.github/CONTRIBUTING.md).

## Open Source @ IBM
Find more open source projects on the [IBM Github Page](http://ibm.github.io/)
