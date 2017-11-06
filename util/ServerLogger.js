/**
 * Created by ling xue on 14-4-29.
 */

var assert = require('assert-plus');
var bunyan = require('bunyan');
var sysConfig = require('../config/SystemConfig.js');

var HttpError = require('restify-errors').HttpError;;



function createLogger(name){
    var log4js = require('log4js');
    log4js.configure(sysConfig.loggerConfig);
    var logger = log4js.getLogger(name);
    //logger.setLevel(sysConfig.logLevel);
    return logger;
}

///-- Exports

module.exports = {
    createLogger : createLogger
};

