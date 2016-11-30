var program = require('commander');
var colors = require('colors');
var request = require('request');
var co = require('co');
var fs = require('fs');


var utils = require("./cli-utils.js");

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

function CLI(options) {
    this.vr = undefined;
    this.WATSON_KEY = options.key;
    this.WATSON_VERSION = options.version ? options.version : "2016-05-20"

    this.vr = new VisualRecognitionV3({
        api_key: this.WATSON_KEY,
        version_date: this.WATSON_VERSION
    });
}




CLI.prototype.listClassifiers = function(callback) {
    utils.heading("Fetching list of Watson Visual Recognition Custom Classifiers");

    this.vr.listClassifiers({ verbose: false }, function(error, response) {
        if (error) {
            console.error(error.toString().red);
        } else {
            utils.lineBreak();
            utils.listFormat("Name", "Status", "ID");
            utils.listSeparator();
            response.classifiers.forEach(function(c) {
                utils.listFormat(c.name, c.status, c.classifier_id);
            })
            utils.lineBreak();
        }

        if (callback) {
            callback(response.classifiers);
        }
    });
}


CLI.prototype.delete = function(classifierId) {

    var self = this;

    //if classifier id was passed in using cli args, then go ahead and delete it
    if (classifierId != undefined) {
        return this.performDeletion(classifierId)
    }

    //otherwise display the list of classifiers that can be deleted
    this.listClassifiers(function(classifiers) {

        if (classifiers.length <= 0) {
            utils.error("No custom classifiers exist for your account");
            utils.exit();
        }

        utils.heading("Please specify a classifier_id to delete: ");
        utils.prompt('classifier id: ', function(classifierId) {

            var found = false;
            classifiers.forEach(function(c) {
                if (c.classifier_id == classifierId) {
                    found = true;
                }
            })

            if (found) {
                utils.heading("This will remove classifier with id: " + classifierId)
                utils.confirm('Are you sure [Y/N]: ', function(proceed) {
                    if (proceed) {
                        //do the actual deletion
                        self.performDeletion(classifierId);
                    } else {
                        utils.abort();
                    }
                })

            } else {
                utils.error("Invalid classifier id: ".red + classifierId.bold.red)
                utils.exit(-1);
            }
        });

    });
}

CLI.prototype.performDeletion = function(id) {
    utils.warn("Deleting " + id);
    this.vr.deleteClassifier({ classifier_id: id }, function(error, response) {
        if (error) {
            utils.warn(error.toString())
        } else {
            utils.info("Classifier Deleted");
        }
        utils.exit();
    });
}


CLI.prototype.create = function(program, rawArgs) {

    var self = this;
    var name = undefined,
        negPath = undefined,
        posClasses = []

    //parse input parameters
    name = program.name;
    negPath = program.negativePath;
    posClasses = parsePositiveClassesFromRawArgs(rawArgs)

    //if params are passed into CLI, go ahead and create it
    if (name != undefined && posClasses.length > 0) {
        return this.performCreation(name, posClasses, negPath);
    }

    //otherwise prompt for user input
    utils.heading("Ready to create a new custom classifier: ");
    utils.prompt('Please specify a classifier name: ', function(classifierName) {

        if (classifierName.length <= 0) {
            utils.warn("Invalid classifier name");
            utils.exit(-1);
        } else {

            utils.heading(`Creating a classifier with the name '${classifierName}'.`);

            positiveClasses = [];

            utils.confirm('Are you sure [Y/N]: ', function(proceed) {
                if (proceed) {
                    utils.lineBreak();
                    self.capturePositiveClassifierInput(classifierName, positiveClasses)
                } else {
                    utils.abort();
                }
            })
        }
    })
}

//recursive function to capture multiple classes to create the custom classifier
CLI.prototype.capturePositiveClassifierInput = function(classifierName, positiveClasses) {

    var self = this;
    var msg = 'Enter class name' + (positiveClasses.length > 0 ? " (leave blank to skip to next step)" : "") + ': ';
    utils.prompt(msg, function(className) {

        if (className === "" && positiveClasses.length > 0) {

            utils.promptForFilePath('Negative zip file path (leave blank for none): ', function(negativePath) {

                utils.log(negativePath + "\n");
                self.performCreation(classifierName, positiveClasses, negativePath);
            })
        } else {
            utils.promptForFilePath('Positive zip file path: ', function(positivePath) {
                utils.log(positivePath + "\n");
                positiveFilePath = positivePath

                positiveClasses.push({
                    class: className,
                    path: positivePath
                });

                self.capturePositiveClassifierInput(classifierName, positiveClasses);
            })
        }
    })
}

CLI.prototype.performCreation = function(classifierName, positiveClasses, negativePath) {

    var params = {
        name: classifierName
    }

    positiveClasses.forEach(function(c) {
        params[c.class + "_positive_examples"] = fs.createReadStream(c.path);
    });

    if (negativePath) {
        params.negative_examples = fs.createReadStream(negativePath);
    }
    this.vr.createClassifier(params, function(error, response) {
        if (error) {
            utils.error(error.toString().red)
        } else {
            utils.info(JSON.stringify(response, null, 4))
        }
        utils.exit();
    })
}


//display verbose classifier details
CLI.prototype.detail = function(classifierId) {
    var self = this;

    //if classifier id was passed in using cli args, then go ahead and requet details
    if (classifierId != undefined) {
        return this.performFetchDetail(classifierId)
    }

    //otherwise display the list of classifiers that can be deleted
    this.listClassifiers(function(classifiers) {

        if (classifiers.length <= 0) {
            utils.error("No custom classifiers exist for your account");
            utils.exit();
        }

        utils.heading("Please specify a classifier_id to fetch in detail: ");
        utils.prompt('classifier id: ', function(classifierId) {

            var found = false;
            classifiers.forEach(function(c) {
                if (c.classifier_id == classifierId) {
                    found = true;
                }
            })

            if (found) {
                self.performFetchDetail(classifierId);

            } else {
                utils.error("Invalid classifier id: ".red + classifierId.bold.red)
                utils.exit(-1);
            }
        });

    });
}


CLI.prototype.performFetchDetail = function(id) {
    utils.log("Fetching details for: " + id);
    this.vr.getClassifier({ classifier_id: id }, function(error, response) {
        if (error) {
            utils.warn(error.toString())
        } else {
            utils.info(JSON.stringify(response, null, 4));
        }
        utils.exit();
    });
}


//classify an image
CLI.prototype.classify = function(imagePath, classifier_ids) {

    var self = this;

    if (classifier_ids == undefined || classifier_ids == "") {
        classifier_ids = "default"
    }
    console.log(imagePath)
        //if params are passed into CLI, go ahead and create it
    if (imagePath != undefined && imagePath != "") {
        return this.performClassification(imagePath, classifier_ids);
    }

    //otherwise prompt for user input
    utils.heading("Ready to create a new custom classifier: ");
    utils.prompt('Please specify classifier id(s) as a comma delimited list, or leave blank for default: ', function(classifier_ids) {

        if (classifier_ids.length <= 0) {
            classifier_ids = "default";
        }

        utils.promptForFilePath('File path: ', function(imagePath) {
            utils.log(imagePath + "\n");
            self.performClassification(imagePath, classifier_ids);
        })

    })
}

CLI.prototype.performClassification = function(imagePath, classifier_ids) {

    utils.log("Classifying image...");

    var params = {
        images_file: fs.createReadStream(imagePath),
        classifier_ids: classifier_ids.toString().split(",")
    };


    this.vr.classify(params, function(error, response) {
        if (error) {
            utils.error(error.toString().red)
        } else {
            utils.info(JSON.stringify(response, null, 4))
        }
        utils.exit();
    })
}





function parsePositiveClassesFromRawArgs(rawArgs) {
    var classes = [];
    var paths = [];
    var result = [];

    var next = undefined;
    for (var x = 0; x < rawArgs.length; x++) {

        var arg = rawArgs[x];
        if (next) {
            next.push(arg);
            next = undefined;
        } else if (arg == "--positive-class") {
            next = classes;
        } else if (arg == "--positive-path") {
            next = paths;
        } else {
            next = undefined;
        }
    }

    if (classes.length != paths.length) {
        utils.warn("Must have matching pairs for '--positive-class' and '--positive-path' command line parameters listed in order of match.");
        utils.exit(-1);
    } else {
        for (var x = 0; x < classes.length; x++) {
            var className = classes[x];
            var path = paths[x];

            result.push({
                class: className,
                path: path
            });;
        }
    }

    return result;
}




CLI.prototype.showUsage = function(callback) {
    utils.heading("Fetching API Key usage information...");

    var url = "http://access.alchemyapi.com/calls/info/GetAPIKeyInfo?apikey=" + this.WATSON_KEY + "&random=" + Math.random().toString()
    request(url, function(error, response, body) {
        if (error) {
            utils.error(error.toString().red)
        }
        utils.info(body.toString())
        utils.lineBreak();
    })
}


module.exports = CLI;