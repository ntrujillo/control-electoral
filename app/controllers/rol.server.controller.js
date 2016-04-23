var mongoose = require('mongoose'),
    Rol = mongoose.model('Rol');

var getErrorMessage = function (err) {
    if (err) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
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