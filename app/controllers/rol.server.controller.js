var mongoose = require('mongoose'),
    Logger = require(__dirname + '/../../app/log/Logger'),
    Rol = mongoose.model('Rol');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'CONTAINER.ROL_MODEL.MESSAGE_ALREADY_ROL';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors.hasOwnProperty(errName)) {
                message = err.errors[errName];
            }
        }
    }
    return message;
};
var STATUS = 'V';
LOCKED = 'B';
exports.saveRol = function (req, res) {
    var rol = new Rol(req.body);
    rol.save(function (err) {
        if (err) {
            Logger.logError('[RolCtrl] Error al guardar el rol', getErrorMessage(err));
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[RolCtrl] Rol guardado', rol);
            res.status(200).json({message: 'CONTAINER.ROL_MODEL.MESSAGE_ROL'});
        }
    });
};

exports.getStatusRol = function (req, res) {
    var rol = req.params.rol;
    Rol.findOne({ro_rol: rol}, function (err, response) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            if (response.ro_status === STATUS) {
                res.status(200).json({'status': true, 'message': 'CONTAINER.SECURITY.LBL_ROL_VALID'});
            } else if (response.ro_status === LOCKED) {
                res.status(200).json({'status': false, 'message': 'CONTAINER.SECURITY.LBL_ROL_INVALID'});
            }
        }
    });
};

exports.getRolById = function (req, res) {
    var idRol = req.params._idRol;
    Rol.findById({_id: idRol}, function (err, rol) {
        if (err) {
            Logger.logError('[RolCtrl] Error al obtener el rol', getErrorMessage(err));
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[RolCtrl] Rol obtenido', idRol);
            return res.status(200).json(rol);
        }
    });
};


exports.updateRol = function (req, res) {
    Rol.update({_id: req.params._idRol}, {
        $set: {
            ro_description: req.body.ro_description,
            ro_status: req.body.ro_status
        }
    }, function (err) {
        if (err) {
            Logger.logError('[RolCtrl] No se pudo actualizar el rol', req.params._idRol);
            return res.status(400).json({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[RolCtrl] Rol actualizado', req.params._idRol);
            return res.status(200).json({message: 'CONTAINER.ROL_MODEL.MESSAGE_UPDATE'});
        }
    });
};

exports.getRoles = function (req, res) {
    var pagina, registros;
    pagina = req.query.page;
    registros = req.query.numRegistros;

    Rol.find({}).count(function (err, count) {
        if (err) {
            Logger.logError('[RolCtrl] Error al obtener el número de roles', err);
            res.status(500);
        }
        res.header('X-Total-Count', count);
        Rol.find({}, '-ro_creator').sort({ro_description: 1}).limit(parseInt(registros)).skip(parseInt(registros) * (parseInt(pagina) - 1)).exec(function (err, roles) {
            if (err) {
                Logger.logError('[RolCtrl] Falla de infraestructura', getErrorMessage(err));
                return res.status(400).json(getErrorMessage(err));
            } else {
                Logger.logInfo('[RolCtrl] Roles obtenidos', JSON.stringify(roles));
                return res.status(200).json(roles);
            }
        });
    });
};

exports.getRolesByStatus = function (req, res) {
    Rol.find({ro_status: STATUS}, '-ro_creator').sort({ro_description: 1}).exec(function (err, roles) {
        if (err) {
            Logger.logError('[RolCtrl] Error al obtener los roles por estado', getErrorMessage(err));
            return res.status(400).json(getErrorMessage(err));
        } else {
            Logger.logInfo('[RolCtrl] Roles vigentes', JSON.stringify(roles));
            return res.status(200).json(roles);
        }
    });
};