var service = require('../../app/services/juntas.users.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function createJuntaUser(req, res) {
    service.create(req.params.id_user, req.body)
        .then(function () {
            Logger.logInfo('[JuntaUserCtrl] Se agreg\u00f3 la junta ' + req.body.junta + ' al usuario ' + req.params.id_user);
            return res.status(200).json({message: 'CONTAINER.JUNTA.ADD_JUNTA'});
        })
        .catch(function (err) {
            Logger.logError('[JuntaUserCtrl] Error al agregar la junta', req.body.junta + ' al usuario ' + req.params.id_user);
            return res.status(400).send({message: err});
        });
}
function getJuntaUser(req, res) {
    var fields = req.query.fields;
    var sort = req.query.sort;
    var page = req.query.page;
    var perPage = req.query.per_page;

    service.query(req.params.id_user, fields, sort, page, perPage)
        .then(function (response) {
            if (response.juntasUser) {
                Logger.logInfo('[JuntaUserCtrl] Se recuper\u00f3 las juntas asignadas al usuario', req.params.id_user);
                res.header('X-Total-Count', response.count);
                res.send(response.juntasUser);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            Logger.logError('[JuntaUserCtrl] Error al obtener las juntas asignadas al usuario', req.params.id_user);
            res.status(400).send(err);
        });
}
module.exports.createJuntaUser = createJuntaUser;
module.exports.getJuntaUser = getJuntaUser;