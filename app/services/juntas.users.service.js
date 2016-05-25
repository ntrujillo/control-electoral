var JuntaUser = require('mongoose').model('JuntaUser'),
    Junta = require('mongoose').model('Junta'),
    Q = require('q');

var service = {};
service.create = create;

module.exports = service;

function create(id_user, body) {
    var deferred = Q.defer();
    // validation
    JuntaUser.findOne({id_user: id_user}, function (err, response) {
        if (err) deferred.reject(err);
        if (response) {
            response.junta.push(body.junta);

        } else {
            response.id_user = id_user;
            response.junta = body.junta;
        }
        response.save(function (err) {
            if (err)deferred.reject(err);
            Junta.findOne({_id: body.junta}, function (err, jun) {
                if (err) deferred.reject(err);
                jun.junta = body.junta;
                jun.gender = body.gender;
                jun.empadronados = body.empadronados;
                jun.status = body.status;
                jun.save(function (err) {
                    if (err)deferred.reject(err);
                    deferred.resolve();
                });
            });
        });
    });
    return deferred.promise;
}
