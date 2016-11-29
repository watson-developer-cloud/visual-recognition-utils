var fs = require('fs');
var program = require('commander');
var colors = require('colors');

var CLI = require("./cli-impl.js");
var utils = require("./cli-utils.js");
var Preferences = require("preferences");

//initialize cli preferences to store watson key (encrypted)
var prefs = new Preferences('wvrcc.preferences', {
    watson_key: ""
});



program
    .command("list")
    .description('List all custom classifiers')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action(function(command) {

        var cli = getCLI()
        cli.listClassifiers();
    })


program
    .command("detail [id]")
    .description('Fetch custom classifier verbose details')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action(function(classifier_id) {

        var cli = getCLI()
        cli.detail(classifier_id);
    })


program
    .command("classify [image]")
    .description('Classify an image')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .option('--classifier_ids [ids]', 'Comma delimited list of classifier ids. (default="default")')
    .action(function(imagePath) {

        var cli = getCLI()
        cli.classify(imagePath, this.classifier_ids);
    })


program
    .command("create")
    .description('Create a new custom classifier')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .option('--name [name]', 'Name of the classifier to create.  (optional)')
    .option('--positive-class [class]', 'Class name for positive classifier data.  (optional, can be multiple, must be in pair with positivepath)')
    .option('--positive-path [path]', 'File path to positive classifier data. (optional, can be multiple, must be in pair with class)')
    .option('--negative-path [path]', 'File path to negative classifier data.  (optional)')
    .action(function() {

        var cli = getCLI()
        cli.create(this, program.rawArgs);
    })


program
    .command("delete [id]")
    .description('Delete a custom classifier')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action(function(classifier_id) {

        var cli = getCLI()
        cli.delete(classifier_id);
    })


program
    .command("set-key [key]")
    .description('Save your Watson Visual Recognition key in CLI preferences')
    .action(function(key) {

        prefs.watson_key = key;
        utils.info("Saving Preferences\n")
    })

program
    .command("unset-key")
    .description('Remove your Watson Visual Recognition key in CLI preferences')
    .action(function(key) {

        prefs.watson_key = "";
        utils.info("Saving Preferences\n")
    })


program
    .command('*')
    .action(function() {
        defaultFeedback();
    });


//if no arguments, display default help
if (!process.argv.slice(2).length) {
    defaultFeedback()
} else {
    program.parse(process.argv);
}

function defaultFeedback() {
    utils.heading('Watson Visual Recognition - Custom Classifier Tools');
    program.outputHelp(function(text) {
        return text.cyan;
    });
}

function getKey(program) {

    if (program.key) {
        return program.key;
    } else if (prefs.watson_key != "" && prefs.watson_key != undefined) {
        return prefs.watson_key;
    } else {
        utils.warn("No Watson Visual Recognition key has been specified.  Please set one using 'wvrcc set-key'");
        utils.exit();
    }
}

function getCLI() {
    return new CLI({ key: getKey(this) });
}