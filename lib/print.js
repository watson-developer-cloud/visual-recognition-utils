const columnify = require('columnify');

const printClassifiers = function(params) {
  const table = columnify(params.classifiers, {
    columns: ['name', 'status', 'classifier_id'],
    columnSplitter: '    '
  });

  if (params.classifiers.length > 0) {
    console.log(("\n"+table+"\n").yellow);
  } else {
    console.log('No words found');
  }
};


const printJSONObject = function(params) {
    console.log(("\n"+JSON.stringify(params, null, 2)+"\n").yellow);
};


const printString = function(params) {
    console.log(("\n"+params+"\n").yellow);
};


const printCompletionConfirmation = function(params) {
    console.log("\nOperation completed\n".yellow);
}


const printErrorMessage = function(message) {
    console.log(`${message}\n`.red)
}



module.exports = {
  printClassifiers,
  printJSONObject,
  printString,
  printCompletionConfirmation,
  printErrorMessage
};