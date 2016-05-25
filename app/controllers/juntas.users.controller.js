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
module.exports.createJuntaUser = createJuntaUser;