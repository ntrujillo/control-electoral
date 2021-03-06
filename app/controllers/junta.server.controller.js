var mongoose = require('mongoose'),
    Junta = mongoose.model('Junta');

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

exports.getJuntasByRecintoWithStatus = function (req, res) {
    var codeRecinto = req.params.codeRecinto,
        status = req.params.status;
    Junta.find({"recinto": codeRecinto, "status": status}).populate({
        path: 'recinto',
        select: 'zona name',
        model: 'Recinto',
        populate: {
            path: 'zona', select: 'parroquia name', model: 'Zona',
            populate: {
                path: 'parroquia', select: 'canton name code', model: 'Parroquia',
                populate: {
                    path: 'canton',
                    select: 'provincia name code',
                    model: 'Canton',
                    populate: {path: 'provincia', select: 'name code region', model: 'Provincia'}
                }
            }
        }
    })
        .sort({junta: 1}).exec(function (err, juntas) {
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

exports.getNumeroDeVotantes = function (req, res) {
    Junta.aggregate([
        {
            $group: {
                _id: null,
                totalVotantes: {$sum: "$empadronados"}
            }
        }], function (err, totalVotantes) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            //simpre va a retornar un elemento
            return res.status(200).send(totalVotantes[0]);
        }
    });
};

exports.getNumeroJuntas = function (req, res) {
    Junta.find({}).count(function (err, count) {
        if (err) {
            return res.status(400).json({message: getErrorMessage(err)});
        } else {
            return res.status(200).json({juntas: count});
        }

    });
};