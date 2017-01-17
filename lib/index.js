const fs = require('fs');
const program = require('commander');
const colors = require('colors');
const pick = require('object.pick');
const Preferences = require("preferences");
const CommandManager = require('./commands');
const print = require('./print');
const pkg = require('../package.json');

//initialize cli preferences to store watson key (encrypted)
var prefs = new Preferences(`${pkg.name}.preferences`, {
    watson_key: ""
});

program.version(pkg.version)
  .usage('<command> [options]');


program
    .command("api-usage")
    .description('View IBM Watson Visual Recognition API Key usage and limits')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action((cmd) => getCommands(cmd)
        .getAPIUsage(cmd)
        .then(print.printString)
        .catch(processError)
    );


program
    .command("classifier-list")
    .description('List all custom classifiers')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action((cmd) => getCommands(cmd)
        .listClassifiers()
        .then(print.printClassifiers)
        .catch(processError)
    );


program
    .command("classifier-detail")
    .description('Fetch custom classifier verbose details')
    .option('--classifier_id <classifier_id>', 'ID of classifier to fetch.')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action((cmd) => getCommands(cmd)
        .getClassifier(cmd)
        .then(print.printJSONObject)
        .catch(processError)
    );


program
    .command("classifier-classify")
    .description('Classify an image')
    .option('--image <image>', 'Path of image to classify.')
    .option('--classifier_ids [ids]', 'Comma delimited list of classifier ids. (default="default")')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action((cmd) => getCommands(cmd)
        .classify(cmd)
        .then(print.printJSONObject)
        .catch(processError)
    );


program
    .command("classifier-create")
    .description('Create a new custom classifier')
    .option('--name <name>', 'Name of the classifier to create.')
    .option('--positive-class [class]', 'Class name for positive classifier data.  (optional, can be multiple, must be in pair with positivepath)')
    .option('--positive-path [path]', 'File path to positive classifier data. (optional, can be multiple, must be in pair with class)')
    .option('--negative-path [path]', 'File path to negative classifier data.  (optional)')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action((cmd) => getCommands(cmd)
        .createClassifier(cmd, program.rawArgs)
        .then(print.printJSONObject)
        .catch(processError)
    );


program
    .command("classifier-delete")
    .description('Delete a custom classifier')
    .option('--classifier_id <classifier_id>', 'ID of classifier to delete.')
    .option('--key [key]', 'Watson Visual Recognition key.  (optional)')
    .action((cmd) => getCommands(cmd)
        .deleteClassifier(cmd)
        .then(print.printCompletionConfirmation)
        .catch(processError)
    );




program
    .command("key-set <key>")
    .description('Save your Watson Visual Recognition key in CLI preferences')
    .action(function(key) {

        prefs.key = key;
        utils.info("Saving Preferences\n")
    })

program
    .command("key-unset")
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
    console.log('Watson Visual Recognition - Custom Classifier Utilities'.yellow);
    program.outputHelp(function(text) {
        return text.cyan;
    });
}



/**
 * Creates a command manager using the credentials provided by the user
 * or stored in preferences.
 *
 * @param  {Object} userCredentials The username and password provided in the command.
 */
function getCommands(userCredentials) {
  return new CommandManager(getCredentials(userCredentials));
}

function getCredentials(opts) {
  const creds = ['key'];
  if (opts && opts.key) {
    return pick(opts, creds);
  } else if (program.key) {
    return pick(program, creds);
  } else if (prefs.key && prefs.key) {
    return pick(prefs, creds);
  } else {
    console.log('No Watson Visual Recognition key has been specified.'.yellow);
    console.log(`Please set one using: $ ${pkg.name} set-key\n`);
    process.exit(1);
  }
}

/**
 * Prints the Error and exit the program.
 */
function processError(error) {
  let message = 'There was an error processing the request, please try again.';
  if (error) {
    if (error.error) {
      message = error.code ? `${error.code} - ` : '';
      message = message + error.error;
    } else {
      message = error.toString();
    }
  }
  print.printErrorMessage(message);
  process.exit(1);
}