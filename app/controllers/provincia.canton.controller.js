var cantonService = require('../../app/services/provincia.canton.service'),
    Logger = require(__dirname + '/../../app/log/Logger');


function queryCanton(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    cantonService.query(req.params.id_provincia, q, fields, sort, page, perPage)
        .then(function (response) {
            if (response.cantons) {
                Logger.logInfo('[ProvinciaCantonCtrl] Se recuperó los cantones correctamente de la provincia', req.params.id_provincia);
                res.header('X-Total-Count', response.count);
                res.send(response.cantons);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCantonCtrl] Error al obtener los cantones de la provincia', req.params.id_provincia);
            res.status(400).send(err);
        });
}

function getCantonById(req, res) {
    cantonService.getById(req.params.id_provincia, req.params._id)
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

function createCanton(req, res) {
    cantonService.create(req.params.id_provincia, req.body)
        .then(function () {
            Logger.logInfo('[ProvinciaCantonCtrl] Se creo el cantón', req.body);
            return res.status(200).json({message: 'CONTAINER.CANTON.MESSAGE_CANTON'});
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCantonCtrl] Error al crear el cantón', req.body);
            return res.status(400).send({message: err});
        });
}


function updateCanton(req, res) {

    cantonService.update(req.params.id_provincia, req.params._id, req.body)
        .then(function () {
            Logger.logInfo('[ProvinciaCantonCtrl] Se actualizó el cantón', req.params._id);
            return res.status(200).json({message: 'CONTAINER.CANTON.MESSAGE_UPDATE'});
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCantonCtrl] Error al actualizar el cantón', req.params._id);
            return res.status(400).send({message: err});
        });
}

function deleteCanton(req, res) {
    cantonService.delete(req.params.id_provincia, req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.queryCanton = queryCanton;
module.exports.getCantonById = getCantonById;
module.exports.createCanton = createCanton;
module.exports.updateCanton = updateCanton;
module.exports.deleteCanton = deleteCanton;