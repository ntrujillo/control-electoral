var mongoose = require('mongoose'),
    Canton = mongoose.model('Canton');

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

exports.getCantonesByProvince = function (req, res) {
    var codeProvince = req.params.codeProvince;
    Canton.find({"PROVINCE._id": codeProvince}).sort({NOM_CANTON: 1}).exec(function (err, cantones) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).send(cantones);
        }

    });
};
