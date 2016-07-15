var service = require('../../app/services/zona.recinto.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryRecinto(req, res) {
    var q = req.query.q,
        filterName = req.query.filterName,
        fields = req.query.fields,
        sort = req.query.sort,
        page = req.query.page,
        perPage = req.query.per_page;

    service.query(req.params.id_zona, q, fields, sort, page, perPage, filterName)
        .then(function (response) {
            if (response.recintos) {
                Logger.logInfo('[ZonaRecintoCtrl] Se recuper\u00f3 los recintos correctamente de la zona', req.params.id_zona);
                res.header('X-Total-Count', response.count);
                res.send(response.recintos);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ZonaRecintoCtrl] Error al obtener los recintos de la zona', req.params.id_zona);
            res.status(400).send(err);
        });
}

function getRecintoById(req, res) {
    service.getById(req.params.id_zona, req.params._id)
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

function createRecinto(req, res) {
    service.create(req.params.id_zona, req.body)
        .then(function () {
            Logger.logInfo('[ZonaRecintoCtrl] Se creo el recinto', req.body);
            return res.status(200).json({message: 'CONTAINER.RECINTO.MESSAGE_RECINTO'});
        })
        .catch(function (err) {
            Logger.logError('[ZonaRecintoCtrl] Error al crear el recinto', req.body);
            return res.status(400).send({message: err});
        });
}


function updateRecinto(req, res) {
    service.update(req.params.id_zona, req.params._id, req.body)
        .then(function () {
            Logger.logInfo('[ZonaRecintoCtrl] Se actualiz\u00f3 el recinto', req.params._id);
            return res.status(200).json({message: 'CONTAINER.RECINTO.MESSAGE_UPDATE'});
        })
        .catch(function (err) {
            Logger.logError('[ZonaRecintoCtrl] Error al actualizar el cantón', req.params._id);
            return res.status(400).send({message: err});
        });
}

function deleteRecinto(req, res) {
    service.delete(req.params.id_zona, req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.queryRecinto = queryRecinto;
module.exports.getRecintoById = getRecintoById;
module.exports.createRecinto = createRecinto;
module.exports.updateRecinto = updateRecinto;
module.exports.deleteRecinto = deleteRecinto;