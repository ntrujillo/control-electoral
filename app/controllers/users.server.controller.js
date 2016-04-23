var User = require('mongoose').model('User'),
    passport = require('passport');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
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

exports.renderPrueba = function (req, res) {

    res.render('container', {title: 'Hola mundo', user: JSON.stringify(req.user)});

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

exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
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