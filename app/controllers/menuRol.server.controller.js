var mongoose = require('mongoose'),
    MenuRol = mongoose.model('MenuRol');

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

exports.saveMenuRol = function (req, res) {
    var menuRol = new MenuRol(req.body);
    menuRol.save(function (err) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(menuRol);
        }
    });
};
