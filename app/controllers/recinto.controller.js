var RecintoService = require('../../app/services/recinto.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryRecinto(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    RecintoService.query(q, fields, sort, page, perPage)
        .then(function (response) {
            if (response.recintos) {
                Logger.logInfo('[RecintoCtrl] Se obtuvo los recintos correctamente');
                res.header('X-Total-Count', response.count);
                res.send(response.recintos);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[RecintoCtrl] Error al obtener los recintos');
            res.status(400).send(err);
        });
}

function getRecintoById(req, res) {
    RecintoService.getById(req.params._id)
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

module.exports.queryRecinto = queryRecinto;
module.exports.getRecintoById = getRecintoById;
