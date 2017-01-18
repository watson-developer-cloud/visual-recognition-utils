
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../.env')
});

//const pkg = require('../package.json');
const Commands = require('../lib/commands');

require('should');

if (process.env.WATSON_VR_KEY) {
  const cmd = new Commands({
    key: process.env.WATSON_VR_KEY
  });

  describe('commands()', function() {
    this.timeout(60000);
    this.slow(1000);

    it('listClassifiers()', () => cmd.listClassifiers());

    it('classify()', () => cmd.classify({
      image:path.join(__dirname, '/resources/BlueMarble.jpg'),
      classifier_ids:'default'
    }));

    it('createClassifier()', () => {
      return cmd.createClassifier({
        name:'testClassifier',
        negativePath:path.join(__dirname, '/resources/training-negative.zip')
      }, ['--positive-class', 'class1', '--positive-path', path.join(__dirname, '/resources/training-positive.zip')]);
    });

    //requires an id of existing classifier
    /*it('getClassifier()', () => cmd.getClassifier({
      classifier_id:'default'
    }));*/

    it('deleteClassifier()', () => cmd.deleteClassifier({
      classifier_id:'nonexistant'
    }));


    it('getAPIUsage()', () => cmd.getAPIUsage());

  });
}
else {
  console.log('Skipping integration test. WATSON_VR_KEY is null or empty');
}