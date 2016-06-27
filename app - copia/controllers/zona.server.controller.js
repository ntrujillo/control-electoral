var mongoose = require('mongoose'),
    Zona = mongoose.model('Zona');

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

exports.getZonasByParroquia = function (req, res) {
    var codeParroquia = req.params.codeParroquia;
    Zona.find({"PARROQUIA._id": codeParroquia}).sort({NOM_ZONA: 1}).exec(function (err, zonas) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(zonas);
        }

    });
};
