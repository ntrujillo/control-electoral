var mongoose = require('mongoose'),
    Recinto = mongoose.model('Recinto');


var CODE_MASCULINO = 'M';
var CODE_FEMENINO = 'F';

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


exports.getRecintosByZonas = function (req, res) {

    var codeZona = req.params.codeZona;
    var codeParroquia = req.params.codeParroquia;
    Recinto.find({
        "ZONA._id": codeZona,
        "ZONA.PARROQUIA._id": codeParroquia
    }).sort({NOM_RECINTO: 1}).exec(function (err, recintos) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(recintos);
        }

    });
};

exports.getJuntas = function (req, res) {
    var codeRecinto = req.params.codeRecinto;
    var genero = req.params.genero;
    var listJuntas = [];
    Recinto.getById(codeRecinto, function (err, recinto) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            if (CODE_FEMENINO === genero) {

            } else {
                //masculino
            }
        }
    });

};
