var AuditoriaService = require('../services/auditoria.voto.service'),
    Logger = require(__dirname + '/../../app/log/Logger');

function saveRegistro(req, res) {
    AuditoriaService.save(req.body)
        .then(function () {
            return res.status(200).json({message: 'CONTAINER.VOTO.MESSAGE_RESPONSE_UPDATE_VOTO'});
        })
        .catch(function (err) {
            return res.status(400).send({message: err});
        });
}


module.exports.saveRegistro = saveRegistro;

