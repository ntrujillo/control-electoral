var winston = require('winston'),
    moment = require('moment'),
    path = require('path');

winston.emitErrs = true;
var directory = __dirname + '/../../logs';

var constants = {
    LEVEL_LOG: {
        ERROR: 'error',
        WARN: 'warn',
        INFO: 'info',
        VERBOSE: 'verbose',
        DEBUG: 'debug',
        SILLY: 'silly'
    },
    FILE: {
        FILE_NAME: 'app-log.log',
        FILE_EXCEPTION: 'exceptions.log'
    }
};

var fileNameLog = path.join(directory, constants.FILE.FILE_NAME);
var fileNameExceptionLog = path.join(directory, constants.FILE.FILE_EXCEPTION);

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: constants.LEVEL_LOG.INFO,
            filename: fileNameLog,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true,
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
            }
        }),
        new winston.transports.Console({
            level: constants.LEVEL_LOG.DEBUG,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: fileNameExceptionLog})
    ],
    exitOnError: false
});

module.exports = constants;
module.exports.stream = {
    write: function (message) {
        logger.info(message);
    }
};
module.exports = logger;