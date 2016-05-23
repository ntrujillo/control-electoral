var service = require('../../app/services/recinto.junta.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryJunta(req, res) {
    var q = req.query.q;
    var status = req.query.status;
    var gender = req.query.gender;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    service.query(req.params.id_recinto, q, status, gender, fields, sort, page, perPage)
        .then(function (response) {
            if (response.juntas) {
                Logger.logInfo('[RecintoJuntaCtrl] Se recuper\u00f3 las juntas correctamente del recinto', req.params.id_recinto);
                res.header('X-Total-Count', response.count);
                res.send(response.juntas);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[RecintoJuntaCtrl] Error al obtener las juntas del recinto', req.params.id_recinto);
            res.status(400).send(err);
        });
}

function getJuntaById(req, res) {
    service.getById(req.params.id_recinto, req.params._id)
        .then(function (obj) {
            if (obj) {
                res.send(obj);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createJunta(req, res) {
    service.create(req.params.id_recinto, req.body)
        .then(function () {
            Logger.logInfo('[RecintoJuntaCtrl] Se creo la junta', req.body);
            return res.status(200).json({message: 'CONTAINER.JUNTA.MESSAGE_JUNTA'});
        })
        .catch(function (err) {
            Logger.logError('[RecintoJuntaCtrl] Error al crear la junta', req.body);
            return res.status(400).send({message: err});
        });
}

function updateJunta(req, res) {
    service.update(req.params.id_recinto, req.params._id, req.body)
        .then(function () {
            Logger.logInfo('[RecintoJuntaCtrl] Se actualiz\u00f3 la junta', req.params._id);
            return res.status(200).json({message: 'CONTAINER.JUNTA.MESSAGE_UPDATE'});
        })
        .catch(function (err) {
            Logger.logError('[RecintoJuntaCtrl] Error al actualizar la junta', req.params._id);
            return res.status(400).send({message: err});
        });
}

function deleteJunta(req, res) {
    service.delete(req.params.id_recinto, req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.queryJunta = queryJunta;
module.exports.getJuntaById = getJuntaById;
module.exports.createJunta = createJunta;
module.exports.updateJunta = updateJunta;
module.exports.deleteJunta = deleteJunta;