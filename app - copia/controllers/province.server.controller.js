var mongoose = require('mongoose'),
    Province = mongoose.model('Province');

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

exports.getProvinces = function (req, res) {
    Province.find().sort({NOM_PROVINCIA: 1}).exec(function (err, provinces) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(provinces);
        }

    });
};