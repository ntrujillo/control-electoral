var logger = require('./Logger');

var apiLog = logger;

var LEVEL_LOG = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
    SILLY: 'silly'
};

function ILogger(name) {
    this.name = name;
}
ILogger.prototype.info = function (message, data) {
    apiLog.log(LEVEL_LOG.INFO, message, data);
};
ILogger.prototype.warn = function (message, data) {
    apiLog.log(LEVEL_LOG.WARN, message, data);
};
ILogger.prototype.error = function (message, data) {
    apiLog.log(LEVEL_LOG.ERROR, message, data);
};
ILogger.prototype.verbose = function (message, data) {
    apiLog.log(LEVEL_LOG.VERBOSE, message, data);
};
ILogger.prototype.debug = function (message, data) {
    apiLog.log(LEVEL_LOG.DEBUG, message, data);
};
ILogger.prototype.silly = function (message, data) {
    apiLog.log(LEVEL_LOG.SILLY, message, data);
};

module.exports = ILogger;