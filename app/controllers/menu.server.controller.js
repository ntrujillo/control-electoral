var mongoose = require('mongoose'),
    Menu = mongoose.model('Menu');

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

exports.saveMenu = function (req, res) {
    var menu = new Menu(req.body);
    menu.save(function (err) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(menu);
        }
    });
};

exports.getMenu = function (req, res) {
    Menu.find({}).sort({mn_title: 1}).exec(function (err, menus) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(menus);
        }
    });
};

exports.getMenuParents = function (req, res) {
    Menu.find({mn_parent: null}).sort({mn_title: 1}).exec(function (err, menus) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(menus);
        }
    });
};

exports.getMenuChilds = function (req, res) {
    var idParent = req.params.idParent;
    Menu.find({mn_parent: idParent}).sort({mn_title: 1}).exec(function (err, menus) {
        if (err) {
            return res.status(400).send({message: getErrorMessage(err)});
        } else {
            res.status(200).json(menus);
        }
    });
};