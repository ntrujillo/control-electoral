var mongoose = require('mongoose'),
    Logger = require(__dirname + '/../../app/log/Logger'),
    Rol = mongoose.model('Rol');

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

var STATUS = 'V';
LOCKED = 'B';
exports.saveRol = function (req, res) {
    var rol = new Rol(req.body);
    rol.save(function (err) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(rol);
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