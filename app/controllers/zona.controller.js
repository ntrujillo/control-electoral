var ZonaService = require('../../app/services/zona.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryZona(req, res) {
    var q = req.query.q,
        filterName = req.query.filterName,
        isFilterOr = req.query.isFilterOr,
        fields = req.query.fields,
        sort = req.query.sort,
        page = req.query.page,
        perPage = req.query.per_page;

    ZonaService.query(q, fields, sort, page, perPage, filterName, isFilterOr)
        .then(function (response) {
            if (response.zonas) {
                Logger.logInfo('[ZonaCtrl] Se obtuvo las zonas correctamente');
                res.header('X-Total-Count', response.count);
                res.send(response.zonas);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ZonaCtrl] Error al obtener las zonas');
            res.status(400).send(err);
        });
}

function getZonaById(req, res) {
    ZonaService.getById(req.params._id)
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

module.exports.queryZona = queryZona;
module.exports.getZonaById = getZonaById;
