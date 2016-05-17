var parroquiaService = require('../services/canton.parroquia.service');

function queryParroquia(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    parroquiaService.query(req.params.id_canton, q, fields, sort, page, perPage)
        .then(function (response) {
            if (response.parroquias) {
                res.header('X-Total-Count', response.count);
                res.send(response.parroquias);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getParroquiaById(req, res) {
    parroquiaService.getById(req.params.id_canton, req.params._id)
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

function createParroquia(req, res) {
    parroquiaService.create(req.params.id_canton, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function updateParroquia(req, res) {
    parroquiaService.update(req.params.id_canton, req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteParroquia(req, res) {
    parroquiaService.delete(req.params.id_canton, req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.queryParroquia = queryParroquia;
module.exports.getParroquiaById = getParroquiaById;
module.exports.createParroquia = createParroquia;
module.exports.updateParroquia = updateParroquia;
module.exports.deleteParroquia = deleteParroquia;