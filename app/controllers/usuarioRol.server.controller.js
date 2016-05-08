var mongoose = require('mongoose'),
    Logger = require(__dirname + '/../../app/log/Logger'),
    UsuarioRol = mongoose.model('UsuarioRol');

var getErrorMessage = function (err) {
    if (err) {
        for (var errName in err.errors) {
            if (err.errors.hasOwnProperty(errName)) {
                return err.errors[errName].message;
            }
        }
    } else {
        return 'Unknow server error';
    }
};

exports.saveUsuarioRol = function (req, res) {
    var rolUsuario = new UsuarioRol(req.body);
    rolUsuario.save(function (err) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(rolUsuario);
        }
    });
};

exports.getRolByUsuario = function (req, res) {
    var idUsuario = req.params.idUsuario;
    UsuarioRol.find().where('ur_user').equals(idUsuario).populate('ur_rol', 'ro_rol ro_description ro_creator ro_status').exec(function (err, roles) {
        if (err) {
            Logger.logError('[UsuarioRol] Error al obtener lor roles para el usuario' + idUsuario, getErrorMessage(err));
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[UsuarioRol] Roles para el usuario ' + idUsuario, roles);
            res.status(200).json(roles);
        }
    });
};