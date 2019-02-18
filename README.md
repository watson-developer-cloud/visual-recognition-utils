# Visual Recognition CLI [![Build Status](https://travis-ci.org/watson-developer-cloud/visual-recognition-utils.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/visual-recognition-utils) [![Greenkeeper badge](https://badges.greenkeeper.io/watson-developer-cloud/visual-recognition-utils.svg)](https://greenkeeper.io/)

Command Line Interface for quickly and easily interacting with the Watson Visual Recognition service & custom classifiers.  

## Getting Started

Make sure you read the documentation for [Visual Recognition][docs] before using this library.

You must have a valid Visual Recognition key to use this tool.  If you do not have one, you can get a free trial [here](https://console.ng.bluemix.net/registration/?target=/catalog/services/watson_vision_combined/).


```bash
npm install watson-visual-recognition-utils -g
```

## Usage

Run either the command `watson-visual-recognition-utils` or `wvru` in the terminal (both are aliases to the same code), you should see something like this:

```none
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
    key-unset                       Remove your Watson Visual Recognition key in CLI preference

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

You can either pass the Visual Recognition key as a CLI parameter, or save it in encrypted preferences so it does not need to be passed with every invocation.

### Specify the API key as CLI parameter

This will call the `list` command, using the API key as a CLI argument:

```
watson-visual-recognition-utils classifier-list --key YOUR_WATSON_KEY_HERE
```

-OR-

First, set the key in preferences
```
watson-visual-recognition-utils key-set YOUR_WATSON_KEY_HERE
```

Next, call the list command (key is saved for all subsequent actions)

```
watson-visual-recognition-utils classifier-list
```

## Create a new classifier

Invoke the `classifier-create` command.  You can specify **multiple** positive classes, and optionally a negative collection of images, per service specs at: https://www.ibm.com/watson/developercloud/doc/visual-recognition/classifiers-tutorials.shtml

```
watson-visual-recognition-utils classifier-create
```


* You can specify multiple positive classes
  * requires pairs of `--positive-class` (string for class name) and `--positive-path` (path to zip file for positive images).  
  * pairs are processed in order specified
* You can optionally specify a negative zip file
  * contains negative images for the classifier

One positive and one negative:
```
watson-visual-recognition-utils classifier-create --name classifier_name --positive-class rust --positive-path ./positive.zip --negative-path ./negative.zip
```

Multiple positive classes and a negative:
```
watson-visual-recognition-utils classifier-create --name train_parts --positive-class wheels --positive-path ./positive-wheels.zip --positive-class rails --positive-path ./positive-rails.zip --positive-class springs --positive-path ./positive-springs.zip --negative-path ./negative-other.zip
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


## License

This sample code is licensed under Apache 2.0.

## Contributing

See [CONTRIBUTING](.github/CONTRIBUTING.md).

## Open Source @ IBM
Find more open source projects on the [IBM Github Page](http://ibm.github.io/)


[docs]: https://www.ibm.com/watson/developercloud/visual-recognition.html
