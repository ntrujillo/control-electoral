var User = require('mongoose').model('User'),
    Logger = require(__dirname + '/../../app/log/Logger'),
    requestIp = require('request-ip'),
    passport = require('passport');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'CONTAINER.MESSAGES.MESSAGE_REQUIRED_DOCUMENT';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors.hasOwnProperty(errName)) {
                message = err.errors[errName];
            }
        }
    }
    return message;
};

exports.renderSignin = function (req, res) {
    if (!req.user) {
        res.render('index', {
            title: 'sign-in Form',
            messages: req.flash('error') || req.flash('info'),
            user: JSON.stringify(req.user)
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignup = function (req, res) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};

exports.signup = function (req, res) {
    if (!req.user) {
        var user = new User(req.body);
        user.provider = 'local';
        user.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function () {
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

exports.saveUser = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
        if (err) {
            var message = getErrorMessage(err);
            Logger.logError('Error al guardar el usuario', user);
            return res.status(400).json(message);
        } else {
            Logger.logInfo('Usuario guardado con éxito');
            return res.status(200).json({message: 'CONTAINER.USER_MODEL.MESSAGE_USER'});
        }
    });
};

exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.getUsers = function (req, res) {
    var pagina, registros;
    pagina = req.query.page;
    registros = req.query.numRegistros;
    User.find({}).count(function (err, count) {
        if (err) {
            Logger.logError('[UserCtrl] Error al obtnet el número de usuarios', err);
            res.status(500);
        }

        res.header('X-Total-Count', count);
        User.find({}, '-password -salt -provider').sort({lastName: 1}).limit(parseInt(registros)).skip(parseInt(registros) * (parseInt(pagina) - 1)).exec(function (err, users) {
            if (err) {
                var message = getErrorMessage(err);
                Logger.logError('[UserCtrl] Falla de infraestructura', message);
                return res.status(400).json(message);
            } else {
                Logger.logInfo('[UserCtrl] Usuarios obtenidos', JSON.stringify(users));
                return res.status(200).json(users);
            }
        });
    });
};
exports.getUserById = function (req, res) {
    var idUser = req.params.idUser;
    User.findById({_id: idUser}, '-password -salt -provider', function (err, user) {
        if (err) {
            var message = getErrorMessage(err);
            Logger.logError('[UserCtrl] No se pudo encontrar el usuario');
            return res.status(400).json(message);
        } else {
            Logger.logInfo('Usuario encontrado', idUser);
            return res.status(200).json(user);
        }
    });
};

exports.getUserByCedula = function (req, res) {
    var cedula = req.params.cedula;
    User.find({document: cedula}, '-password -salt -provider', function (err, user) {
        if (err) {
            var message = getErrorMessage(err);
            Logger.logError('[UserCtrl] No se pudo encontrar el usuario');
            return res.status(400).json(message);
        } else {
            Logger.logInfo('Usuario encontrado', cedula);
            return res.status(200).json(user);
        }
    });
};


exports.updateUser = function (req, res) {
    User.update({_id: req.params.idUser}, {
        $set: {
            email: req.body.email,
            status: req.body.status
        }
    }, function (err) {
        if (err) {
            Logger.logError('[UserCtrl] No se pudo actualizar el usuario', req.params.idUser);
            return res.status(400).json({message: getErrorMessage(err)});
        } else {
            Logger.logInfo('[UserCtrl] Usuario actualizado', req.params.idUser);
            return res.status(200).json({message: 'CONTAINER.USER_MODEL.MESSAGE_UPDATE'});
        }
    });
};

exports.saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function (err, user) {
        if (err) {
            return done(err);
        } else {
            if (!user) {
                var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
                User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                    profile.username = availableUsername;

                    user = new User(profile);

                    user.save(function (err) {
                        if (err) {
                            var message = _this.getErrorMessage(err);

                            req.flash('error', message);
                            return res.redirect('/signup');
                        }
                        return done(err, user);
                    });
                });
            } else {
                return done(err, user);
            }
        }
    });
};

exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({message: 'CONTAINER.SECURITY.LBL_USER_LOGGED'});
    }
    next();
};