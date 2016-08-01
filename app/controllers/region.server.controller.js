var RegionService = require('../services/region.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryRegion(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    RegionService.query(fields, sort, page, perPage)
        .then(function (response) {
            if (response.regiones) {
                Logger.logInfo('[RegionCtrl] Se recuper\u00f3 las regiones correctamente');
                res.header('X-Total-Count', response.count);
                res.send(response.regiones);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[RegionCtrl] Error al obtener las regiones');
            res.status(400).send(err);
        });
}

module.exports.getRegiones = queryRegion;