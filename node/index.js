#!/usr/bin/env node --harmony


if (require.main === module) {
    //setup as command line utility
    require("./src/cli-config.js");
} else {
    //setup as Node module
    //module.exports = require("./src/classifier-tools.js");
    console.log("WVRCC is intended to be invoked as a command line utility, not as a module include")
    console.log("If you'd like to programmatically integrate custom classifier creation into your app, you should leverage the Watson SDK at https://github.com/watson-developer-cloud/node-sdk/");
}