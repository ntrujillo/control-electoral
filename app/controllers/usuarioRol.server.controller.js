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
    Logger.logError('[UsuarioRolCtrl]Rolll', rolUsuario);
    rolUsuario.save(function (err) {
        if (err) {
            Logger.logError('[UsuarioRolCtrl] Error al guardar el rol', getErrorMessage(err));
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[UsuarioRolCtrl] Rol guardado');
            res.status(200).json(rolUsuario);
        }
    });
};

exports.getRolByUsuario = function (req, res) {
    var idUsuario = req.params.idUsuario;
    UsuarioRol.find().where('ur_user').equals(idUsuario).populate('ur_rol', 'ro_rol ro_description ro_creator ro_status').exec(function (err, roles) {
        if (err) {
            Logger.logError('[UsuarioRolCtrl] Error al obtener lor roles para el usuario' + idUsuario, getErrorMessage(err));
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            var rolesArray = [];
            if (roles instanceof Array) {
                roles.forEach(function (element) {
                    if (element.ur_rol.ro_status === 'V') {
                        rolesArray.push(element);
                    }
                });
            }
            Logger.logInfo('[UsuarioRolCtrl] Roles para el usuario ' + idUsuario, rolesArray);
            res.status(200).json(rolesArray);
        }
    });
};

exports.deleteRolUser = function (req, res) {
    UsuarioRol.remove({ur_rol: req.params.idRol, ur_user: req.params.idUsuario}, function (err) {
        if (err) {
            Logger.logError('[UsuarioRolCtrl] Error al eliminar el rol del usuario', getErrorMessage(err));
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[UsuarioRolCtrl] Rol ' + req.params.idRol + ' del usuario ' + req.params.idUsuario + ' eliminado');
            return res.status(200).json({message: "UsuarioRol Eliminado"});
        }
    });
};