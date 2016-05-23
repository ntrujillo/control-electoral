var listaService = require('../services/lista.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function queryLista(req, res) {
    var q = req.query.q;
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    listaService.query(req.params.id_lista, q, fields, sort, page, perPage)
        .then(function (response) {
            if (response.listas) {
                Logger.logInfo('[ListaCtrl] Se recuper\u00f3 las lista correctamente');
                res.header('X-Total-Count', response.count);
                res.send(response.listas);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[ListaCtrl] Error al obtener las listas');
            res.status(400).send(err);
        });
}

function getListaById(req, res) {
    listaService.getById(req.params.id_lista)
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

function createLista(req, res) {
    listaService.create(req.body)
        .then(function () {
            Logger.logInfo('[ListaCtrl] Se creo la lista', req.body);
            return res.status(200).json({message: 'CONTAINER.LISTA.MESSAGE_LISTA'});
        })
        .catch(function (err) {
            Logger.logError('[ListaCtrl] Error al crear la lista', req.body);
            return res.status(400).send({message: err});
        });
}


function updateLista(req, res) {
    listaService.update(req.params.id_lista, req.body)
        .then(function () {
            Logger.logInfo('[ListaCtrl] Se actualiz\u00f3 la lista', req.params._id);
            return res.status(200).json({message: 'CONTAINER.LISTA.MESSAGE_UPDATE'});
        })
        .catch(function (err) {
            Logger.logError('[ListaCtrl] Error al actualizar la lista', req.params._id);
            return res.status(400).send({message: err});
        });
}

function deleteLista(req, res) {
    listaService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports.getListas = queryLista;
module.exports.getListaById = getListaById;
module.exports.saveLista = createLista;
module.exports.updateLista = updateLista;
module.exports.deleteLista = deleteLista;