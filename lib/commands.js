
const bluebird = require('bluebird');
const inquirer = require('inquirer');
const rp = require('request-promise');
const fs = require('fs');
const print = require('./print');

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');


class Commands {

  constructor(options) {
    const version = options.version ? options.version : '2016-05-20';

    this.api_key = options.key;
    this.version_date = version;

    const vrAsync = new VisualRecognitionV3({
      api_key: this.api_key,
      version_date: this.version_date
    });
    this.vrService = bluebird.promisifyAll(vrAsync);
  }

  listClassifiers() {
    return this.vrService.listClassifiersAsync({ verbose: false });
  }

  getClassifier(params) {
    return promptForInput('classifier_id')(params)
        .then((cls) => {  
            //sanitize whatever is passed in
          let param = {
            'classifier_id':cls['classifier_id']
          };
          return this.vrService.getClassifierAsync(param);
        });
  }

  classify(params) {
    return promptForInput('image')(params)
        .then(image => 
            promptForInput('classifier_ids')(params)
            .then((classifier_ids) => {  
              let param = {
                'images_file':fs.createReadStream(image['image']),
                'classifier_ids':classifier_ids['classifier_ids'].toString().split(',')
              };
              return this.vrService.classifyAsync(param);
            })
        );
  }

  createClassifier(params, rawArgs) {
    const name=params['name'];
    const negativePath=params['negativePath'];
    const positiveClasses = parsePositiveClassesFromRawArgs(rawArgs);

    if ( name == undefined || (
        (positiveClasses.length<= 0 && negativePath != undefined) || 
        (positiveClasses.length<= 1 && negativePath == undefined)
    )) {
      print.printErrorMessage('"create-classifier" command requires arguments for name and either 1) both a positive and negative training set, or 2) multiple positive training sets.');
      process.exit(-1);
    }  

    let serviceParams = {};
    serviceParams.name = name;
    positiveClasses.forEach(function(c) {
      serviceParams[c.class + '_positive_examples'] = fs.createReadStream(c.path);
    });
    if (negativePath != undefined) {
      serviceParams.negative_examples = fs.createReadStream(negativePath);
    }

    return this.vrService.createClassifierAsync(serviceParams);
  }

  deleteClassifier(params) {
    return promptForInput('classifier_id')(params)
        .then((cls) => {  
            //sanitize whatever is passed in
          let param = {
            'classifier_id':cls['classifier_id']
          };
          return this.vrService.deleteClassifier(param);
        });
  }


  getAPIUsage() {
    let url = `http://access.alchemyapi.com/calls/info/GetAPIKeyInfo?apikey=${this.api_key}&random=${Math.random().toString()}`;
    return rp(url);
  }
}


/**
 * Prompt for a user input using key as parameter name
 * @param {String} key The parameter name
 * @param {String} def the default value
 */
function promptForInput(key, def) {
  return function(params) {
    if (params && params[key]) {
      return Promise.resolve(params);
    } else {
      return inquirer.prompt([{
        name: key,
        type: 'input',
        default: def ? def : undefined,
        message: `Enter the ${key}:`,
        validate: (value) => (value.length ? true : `Please enter the ${key}`),
      }]);
    }
  };
}


/**
 * Extract positive classes from raw arguments passed into cli request
 * @param {rawArgs} the array of raw arguments passed into program
 */
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
    } else if (arg == '--positive-class') {
      next = classes;
    } else if (arg == '--positive-path') {
      next = paths;
    } else {
      next = undefined;
    }
  }

  if (classes.length != paths.length) {
    print.printErrorMessage('Must have matching pairs for \'--positive-class\' and \'--positive-path\' command line parameters listed in order of match.');
    process.exit(-1);
  } else {
    for (let x = 0; x < classes.length; x++) {
      let className = classes[x];
      let path = paths[x];

      result.push({
        class: className,
        path: path
      });
    }
  }

  return result;
}


module.exports = Commands;