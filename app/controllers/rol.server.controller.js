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
