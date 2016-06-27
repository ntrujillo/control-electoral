var mongoose = require('mongoose'),
    Junta = mongoose.model('Junta');

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

exports.getJuntasByRecinto = function (req, res) {
    var codeRecinto = req.params.codeRecinto;
    Junta.find({"RECINTO.COD_RECINTO": codeRecinto}).sort({NUM_JUNTA: 1}).exec(function (err, juntas) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(juntas);
        }

    });
};

exports.getJuntasByRecintoByGenero = function (req, res) {
    var codeRecinto = req.params.codeRecinto;
    var genero = req.params.genero;
    Junta.find({
        "RECINTO.COD_RECINTO": codeRecinto,
        "GENERO": genero
    }).sort({NUM_JUNTA: 1}).exec(function (err, juntas) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(juntas);
        }

    });
};

exports.getJunta = function (req, res) {
    var codeJunta = req.params.id;
    Junta.findById(codeJunta).exec(function (err, junta) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(junta);
        }
    });
};