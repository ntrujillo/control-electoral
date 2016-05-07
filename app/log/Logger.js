var log4js = require('log4js');
log4js.configure(__dirname + '/../../log4js.json', {});
log4js.loadAppender('dateFile');
var logger = log4js.getLogger('Control Electoral');

module.exports.logInfo = function (message, object) {
    if (object !== undefined) {
        logger.info(message, object);
    } else {
        logger.info(message);
    }

};

module.exports.logError = function (message, object) {
    if (object !== undefined) {
        logger.error(message, object);
    } else {
        logger.error(message);
    }
};
