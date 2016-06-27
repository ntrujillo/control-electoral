var mongoose = require('mongoose'),
    Lista = mongoose.model('Lista');

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

exports.saveLista = function (req, res) {
    var lista = new Lista(req.body);
    lista.save(function (err) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.json(lista);
        }
    });
};

exports.getListas = function (req, res) {
    Lista.find({}).sort({CODE_LISTA: 1}).exec(function (err, listas) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(listas);
        }

    });
};
