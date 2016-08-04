var AuditoriaVoto = require('mongoose').model('AuditoriaVoto'),
    Logger = require(__dirname + '/../../app/log/Logger');
var service = {};
var Q = require('q');
service.save = saveVotoAuditoria;

module.exports = service;

function saveVotoAuditoria(body) {
    var deferred = Q.defer();
    AuditoriaVoto.create(body,
        function (err) {
            if (err) {
                Logger.logError('[Auditoria Service] error al guardar el registro de auditoria');
                deferred.reject(err);
            } else {
                Logger.logInfo('[Auditoria Service] se guardo el registro de auditoria correctamente');
                deferred.resolve();
            }
        });

    return deferred.promise;
}


