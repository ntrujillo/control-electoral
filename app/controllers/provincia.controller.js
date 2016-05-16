var provinciaService = require('../services/provincia.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryProvincia(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    provinciaService.query(q, fields, sort, page, perPage)
        .then(function (response) {
            if (response.provincias) {
                Logger.logInfo('[ProvinciaCtrl] Se obtuvo las provincias correctas');
                res.header('X-Total-Count', response.count);
                res.status(200).send(response.provincias);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCtrl] Error al obtener las provincias');
            res.status(400).send(err);
        });
}

function getProvinciaById(req, res) {
    provinciaService.getById(req.params._id)
        .then(function (obj) {
            if (obj) {
                Logger.logInfo('[ProvinciaCtrl] Se obtuvo la provincia', obj);
                res.send(obj);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCtrl] Error al obtener la provincia', req.params._id);
            res.status(400).send(err);
        });
}

function createProvincia(req, res) {
    provinciaService.create(req.body)
        .then(function () {
            Logger.logInfo('[ProvinciaCtrl] Se creo la provincia', req.body);
            return res.status(200).json({message: 'CONTAINER.PROVINCIA.MESSAGE_PROVINCIA'});
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCtrl] Error al crear la provincia', req.body);
            return res.status(400).send({message: err});
        });
}


function updateProvincia(req, res) {
    provinciaService.update(req.params._id, req.body)
        .then(function () {
            Logger.logInfo('[ProvinciaCtrl] Se actualizó la provincia', req.params._id);
            return res.status(200).json({message: 'CONTAINER.PROVINCIA.MESSAGE_UPDATE'});
        })
        .catch(function (err) {
            Logger.logError('[ProvinciaCtrl] Error al actualizar la provincia', req.params._id);
            res.status(400).send(err);
        });
}

function deleteProvincia(req, res) {
    provinciaService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.queryProvincia = queryProvincia;
module.exports.getProvinciaById = getProvinciaById;
module.exports.createProvincia = createProvincia;
module.exports.updateProvincia = updateProvincia;
module.exports.deleteProvincia = deleteProvincia;