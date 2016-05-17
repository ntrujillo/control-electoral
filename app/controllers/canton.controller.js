var CantonService = require('../services/canton.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryCanton(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    CantonService.query(q, fields, sort, page, perPage)
        .then(function (response) {
            if (response.cantones) {
                Logger.logInfo('[CantonCtrl] Se obtuvo los cantones correctamente');
                res.header('X-Total-Count', response.count);
                res.send(response.cantones);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[CantonCtrl] Error al obtener los cantones');
            res.status(400).send(err);
        });
}

function getCantonById(req, res) {
    CantonService.getById(req.params._id)
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


module.exports.queryCanton = queryCanton;
module.exports.getCantonById = getCantonById;
