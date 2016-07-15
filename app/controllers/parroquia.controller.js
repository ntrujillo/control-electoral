var ParroquiaService = require('../../app/services/parroquia.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryParroquia(req, res) {
    var q = req.query.q,
        filterName = req.query.filterName,
        isFilterOr = req.query.isFilterOr,
        fields = req.query.fields,
        sort = req.query.sort,
        page = req.query.page,
        perPage = req.query.per_page;

    ParroquiaService.query(q, fields, sort, page, perPage, filterName, isFilterOr)
        .then(function (response) {
            if (response.parroquias) {
                Logger.logInfo('[ParroquiaCtrl] Se obtuvo las parroquias correctamente');
                res.header('X-Total-Count', response.count);
                res.send(response.parroquias);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ParroquiaCtrl] Error al obtener las parroquias');
            res.status(400).send(err);
        });
}

function getParroquiaById(req, res) {
    ParroquiaService.getById(req.params._id)
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

module.exports.queryParroquia = queryParroquia;
module.exports.getParroquiaById = getParroquiaById;
