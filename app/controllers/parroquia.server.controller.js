var mongoose = require('mongoose'),
    Parroquia = mongoose.model('Parroquia');

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

exports.getParroquiasByCanton = function (req, res) {
    var codeCanton = req.params.codeCanton;
    Parroquia.find({"CANTON._id": codeCanton}).sort({NOM_PARROQUIA: 1}).exec(function (err, parroquias) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(parroquias);
        }

    });
};
