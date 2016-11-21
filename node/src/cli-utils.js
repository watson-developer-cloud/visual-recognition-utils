var colors = require('colors');
var pad = require('pad');
var co = require('co');
var prompt = require('co-prompt');
var pc = require("path-complete");

module.exports = {


    log: function(...args) {
        //just wrap console.log, but this gives us the ability  to easily change behavior in the future
        console.log.apply(this, args);
    },

    error: function(...args) {
        //just wrap console.log, but this gives us the ability  to easily change behavior in the future
        console.error.apply(this, args);
    },

    listFormat: function(name, status, id) {
        this.log(pad(name, 25), pad(status, 15), id);
    },

    listSeparator: function() {
        this.log(pad("", 75, "-"));
    },

    lineBreak: function() {
        this.log("");
    },

    heading: function(text) {
        this.log(text.yellow)
    },

    result: function(text) {
        this.log(text.cyan)
    },

    info: function(text) {
        this.log(text.cyan)
    },

    warn: function(text) {
        this.log(text.red)
    },

    success: function(text) {
        this.log(text.green)
    },

    prompt: function(message, callback) {
        co(function*() {
            var input = yield prompt(message);
            callback(input);
        });
    },

    confirm: function(message, callback) {
        co(function*() {
            while (true) {
                var yn = yield prompt(message);
                if (yn.match(/y+$/i)) {
                    callback(true);
                    break;

                } else if (yn.match(/n+$/i)) {
                    callback(false);
                    break;
                }
            }
        });
    },

    promptForFilePath: function(message, callback) {
        process.stdout.write(message);
        pc.getPathFromStdin(callback);
    },

    abort: function() {
        this.log("Aborted by user".red);
        this.exit(-1);
    },

    exit: function(exitCode) {
        if (exitCode == undefined) {
            exitCode = 0;
        }
        this.lineBreak();
        process.exit(exitCode);
    }

}